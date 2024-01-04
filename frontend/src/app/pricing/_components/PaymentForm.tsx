type props = {
    productId: string,
    formTitle: string,
    formOpen: boolean,
    duration: string,
}

'use client'

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PrimaryButton from "@/components/primaryButton";
import {useUserStore, useAuthStore} from '@/store/store';
import { StripeCardElement } from "@stripe/stripe-js";
import Cookies from 'js-cookie';
import { getServerURL } from "@/util-functions/helper-functions"
import { useState } from "react";

const PaymentForm = ({productId, formTitle, formOpen, duration}: props) => {

    const options = {
        style: {
            base: {
                color: 'rgb(148 163 184)',
                fontWeight: '400',
                fontFamily: 'arial',
                fontSize: '17px',
                ':-webkit-autofill': {
                    color: '#d4d4d4',
                },
                '::placeholder': {
                    color: 'rgb(148 163 184)',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: 'rgb(148 163 184)',
            },
        },
    }

    const sessionId = Cookies.get('QUIZZIP-AUTH')
    let fetchURL = getServerURL()

    const { email, username, setTier, setGenerationsLeft, setExpirationDate } = useUserStore();
    const { auth } = useAuthStore()
    
    const stripe = useStripe();
    const elements = useElements();

    const [requestStatus, setRequestStatus] = useState('')

    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements || !auth || !email || !username) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            console.log('returning');
            return;
        }

        try {

            setRequestStatus('Processing payment details... Please stay on the page, this will take a moment.')

            const paymentMethod = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement('card') as StripeCardElement,
            })

            const createStripePayment = await fetch(`${fetchURL}/stripe/handleSubscription/${sessionId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    paymentMethod: paymentMethod.paymentMethod?.id,
                    productId: productId,
                })
            });

            if (!createStripePayment.ok) {
                setRequestStatus('Payment is unsuccessful.')
                return
            }

            const data = await createStripePayment.json()

            setRequestStatus('Confirming payment details...')
            
            const confirmation = await stripe.confirmCardPayment(data.clientSecret)

            if (confirmation.error) {
                setRequestStatus('Payment is unsuccessful.')
                return
            }

            setRequestStatus('Creating your subscription data... Please stay on the page...')

            const createSubscription = await fetch(`${fetchURL}/stripe/createSubscriptionUserTierObject/${sessionId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    duration
                })
            })

            const createSubscriptionData = await createSubscription.json()

            setTier(createSubscriptionData.tier);
            setGenerationsLeft(createSubscriptionData.generationsLeft);
            setExpirationDate(createSubscriptionData.expirationDate);

            setRequestStatus('Subscription is successful! Please enjoy!')
        } catch (err:any) {
            console.log(err);
        }
    }
    
    return (
        <div className={formOpen ? '' : 'hidden'} id="paymentForm">
            <h3 className='text-xl font-semibold text-center mb-8'>{formTitle}</h3>
            <form onSubmit={handleFormSubmit}>
                <CardElement className="mb-4 border-slate-500 border-2 rounded text-slate-200 p-2" options={options}/>
                <PrimaryButton extra_classes="mt-2" type="submit">Subscribe</PrimaryButton>
                <p className="text-xs mb-8 mt-2">{requestStatus}</p> 
            </form>
        </div>
    )
}

export default PaymentForm