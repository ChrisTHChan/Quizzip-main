import express from 'express';
import Stripe from 'stripe';
import { createUserTierObject, getUserTierObject, deleteUserTierObject } from '../db/users';
import { returnFreeMonthlyGenerations, returnSubscriptionTierMonthlyGenerations } from '../helpers/helper-functions';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)

export const createSubscriptionUserTierObject = async (req: express.Request, res: express.Response) => {
    try {

        const {email, username} = req.body

        const existingUserTierObject = await getUserTierObject(email, username)

        if (existingUserTierObject) {
            await deleteUserTierObject(email, username)
        }

        await createUserTierObject({
            email: email,
            username: username,
            tier: 'Monthly Subscription',
            generationsLeft: returnSubscriptionTierMonthlyGenerations(),
            expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000) //30d
        })

        const newUserTierObject = await getUserTierObject(email, username)

        res.status(200).json(newUserTierObject);

    } catch {
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
                expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000) //30d
            })
        } else {
            existingUserTierObject.generationsLeft = existingUserTierObject.generationsLeft - 1
            await existingUserTierObject.save();
        }

        res.status(200).end()
    } catch {
        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}

export const handleStripeSubscription = async (req: express.Request, res: express.Response) => {
    try {

        const {username, email, paymentMethod} =  req.body

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
                //for now hardcoded product/price id
                price: 'price_1OU306BlbVm0HEusaqXPp73Z'
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

    } catch {
        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}