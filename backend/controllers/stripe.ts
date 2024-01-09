import express from 'express';
import Stripe from 'stripe';
import { createUserTierObject, getUserTierObject, deleteUserTierObject, getUserByEmail } from '../db/users';
import { returnFreeMonthlyGenerations, returnSubscriptionTierMonthlyGenerations, returnSubscriptionTierYearlyGenerations, returnMonthlySubscriptionPriceId, returnYearlySubscriptionPriceId } from '../helpers/helper-functions';

let stripe: Stripe
let endpointSecret:string | undefined

if (process.env.NODE_ENV === 'development') {
    stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)
    endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
} else {
    stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY_LIVE}`)
    endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET_LIVE
}

export const webhook = async (req: express.Request, res: express.Response) => {

    try {

        let event = req.body;

        if (endpointSecret) {
            const signature = req.headers['stripe-signature'] as string;

            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        }

        if (event?.type === 'invoice.paid') {

            console.log('handling invoice paid with method here')
            
            const session = event.data.object

            const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(session.subscription)
            const customerId = subscription.customer
            const priceId = subscription.items.data[0].price.id
            const subscriptionId = subscription.id
            const currentPeriodEnd = subscription.current_period_end
            const email = session.customer_email
            const name = session.customer_name
            let generationsLeft
            let tier

            console.log(subscription.collection_method);

            const existingUserTierObject = await getUserTierObject(email, name)
            const existingGenerationsLeft:number = existingUserTierObject ? existingUserTierObject.generationsLeft : 5

            if (existingUserTierObject) {
                await deleteUserTierObject(email, name)
            }

            if (priceId === returnMonthlySubscriptionPriceId()) {
                tier = 'Monthly Subscription';
                generationsLeft = returnSubscriptionTierMonthlyGenerations() + existingGenerationsLeft;
            } else if (priceId === returnYearlySubscriptionPriceId()) {
                tier = 'Yearly Subscription';
                generationsLeft = returnSubscriptionTierYearlyGenerations() + existingGenerationsLeft;
            } else {
                throw new Error('something went wrong')
            }

            await createUserTierObject({
                email: email,
                username: name,
                tier: tier,
                subscriptionId: subscriptionId,
                customerId: customerId,
                generationsLeft: generationsLeft,
                expirationDate: currentPeriodEnd * 1000
            })

            const newUserTierObject = await getUserTierObject(email, name)

            console.log(newUserTierObject)

            res.sendStatus(200).end();

        } else {
            console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).end()

    } catch (err) {

        console.log(err)

        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}

export const handleSubscriptionCancellation = async (req: express.Request, res: express.Response) => {

    try {
        console.log('handling subscription cancellation')

        const { email, username } = req.body

        const userTierObject = await getUserTierObject(email, username);

        if (!userTierObject) {
            throw new Error('no user exists.')
        }

        const subscriptionId = userTierObject.subscriptionId as string

        await stripe.subscriptions.cancel(subscriptionId);

        await deleteUserTierObject(email, username)

        res.status(200).json({
            subscriptionId: subscriptionId
        })
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

        if (existingUserTierObject && existingUserTierObject.subscriptionId && existingUserTierObject.customerId) {
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
            currentPeriodEnd: subscription.current_period_end,
            clientSecret: payment_intent.client_secret,
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}

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
                generationsLeft: returnFreeMonthlyGenerations() + 45,
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