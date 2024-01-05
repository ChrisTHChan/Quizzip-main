import express from 'express';
import Stripe from 'stripe';
import { createUserTierObject, getUserTierObject, deleteUserTierObject, getUserByEmail } from '../db/users';
import { returnFreeMonthlyGenerations, returnSubscriptionTierMonthlyGenerations, returnSubscriptionTierYearlyGenerations } from '../helpers/helper-functions';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)

export const createAndProvideFreeTrialGenerationsOnce = async (req: express.Request, res: express.Response) => {
    try {

        const {email, username} = req.body

        const user = await getUserByEmail(email);

        const existingUserTierObject = await getUserTierObject(email, username)

        if (!user) {
            throw new Error('No such user.')
        }

        if (user?.freeTrialUsed) {
            throw new Error('you have already used this offer.')
        }

        if (user) {
            user.freeTrialUsed = true;
        }

        await user?.save()

        if (!existingUserTierObject) {
            await createUserTierObject({
                email: email,
                username: username,
                tier: 'Basic',
                generationsLeft: returnFreeMonthlyGenerations() + 20,
                expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000) //~30d, fix this to be accurate with stripes determination of duration
            })
        } else {
            existingUserTierObject.generationsLeft = existingUserTierObject.generationsLeft + 20
            await existingUserTierObject.save();
        }

        res.status(200).end()
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            requestStatus: `Failed to get free generations: ${error.message}`
        });
    }
}

export const createSubscriptionUserTierObject = async (req: express.Request, res: express.Response) => {
    try {

        const {email, username, duration} = req.body

        const existingUserTierObject = await getUserTierObject(email, username)

        if (existingUserTierObject) {
            await deleteUserTierObject(email, username)
        }

        let generationsLeft
        let expirationDate
        let tier
        const existingGenerationsLeft = existingUserTierObject ? existingUserTierObject.generationsLeft : 5

        console.log('step 1')

        if (duration === 'monthly') {
            generationsLeft = returnSubscriptionTierMonthlyGenerations() + existingGenerationsLeft
            expirationDate = Date.now() + (30 * 24 * 60 * 60 * 1000) //~30d, fix this to be accurate with stripes determination of duration
            tier = 'Monthly Subscription'

            console.log('monthly fjdklajfdlafjdl;a')
        } else if (duration === 'yearly') {
            generationsLeft = returnSubscriptionTierYearlyGenerations() + existingGenerationsLeft
            expirationDate = Date.now() + (12 * 30 * 24 * 60 * 60 * 1000) //~1y, fix this to be accurate with stripes determination of duration
            tier = "Yearly Subscription"
        } else {
            throw new Error('something went wrong')
        }

        await createUserTierObject({
            email: email,
            username: username,
            tier: tier,
            generationsLeft: generationsLeft,
            expirationDate: expirationDate
        })

        const newUserTierObject = await getUserTierObject(email, username)

        res.status(200).json(newUserTierObject);

    } catch (err) {

        console.log(err)

        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}

export const createAndSubtractBasicUserTierObjeect = async (req: express.Request, res: express.Response) => {
    try {

        const {email, username} = req.body

        const existingUserTierObject = await getUserTierObject(email, username)

        if (!existingUserTierObject) {
            await createUserTierObject({
                email: email,
                username: username,
                tier: 'Basic',
                generationsLeft: returnFreeMonthlyGenerations() - 1,
                expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000) //~30d, fix this to be accurate with stripes determination of duration
            })
        } else {
            existingUserTierObject.generationsLeft = existingUserTierObject.generationsLeft - 1
            await existingUserTierObject.save();
        }

        res.status(200).end()
    } catch (err) {
        console.log(err)

        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}

export const handleStripeSubscription = async (req: express.Request, res: express.Response) => {
    try {

        const {username, email, paymentMethod, productId} =  req.body

        const existingUserTierObject = await getUserTierObject(email, username)

        console.log('handling subscription');

        if (existingUserTierObject && existingUserTierObject?.tier !== 'Basic') {
            throw new Error('You are already subscribed.')
        }

        const customer = await stripe.customers.create({
            email, 
            name: username, 
            payment_method: paymentMethod,
            invoice_settings: { default_payment_method: paymentMethod },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: productId
            }],
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription'
            },
            expand: ['latest_invoice.payment_intent'],
        });

        const invoice = subscription.latest_invoice as Stripe.Invoice
        const payment_intent = invoice.payment_intent as Stripe.PaymentIntent

        res.status(200).json({
            message: "Subscription Successful",
            subscriptionId: subscription.id,
            clientSecret: payment_intent.client_secret,
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}