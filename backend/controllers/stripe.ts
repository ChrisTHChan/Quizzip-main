import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)

export const handleStripeSubscription = async (req: express.Request, res: express.Response) => {
    try {

        const {username, email, paymentMethod} =  req.body

        console.log(username, email, paymentMethod)

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