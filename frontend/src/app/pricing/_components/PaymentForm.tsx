

'use client'

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PrimaryButton from "@/components/primaryButton";
import {useUserStore, useAuthStore} from '@/store/store';
import { StripeCardElement } from "@stripe/stripe-js";
import Cookies from 'js-cookie';
import { getServerURL } from "@/util-functions/helper-functions"

const PaymentForm = () => {

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

    const { email, username } = useUserStore();
    const { auth } = useAuthStore()
    
    const stripe = useStripe();
    const elements = useElements();

    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements || !auth || !email || !username) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            console.log('returning');
            return;
        }

        try {
            const paymentMethod = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement('card') as StripeCardElement,
            })

            const response = await fetch(`${fetchURL}/stripe/handleSubscription/${sessionId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    paymentMethod: paymentMethod.paymentMethod?.id
                })
            });

            if (!response.ok) return alert('payment unsuccessful')

            const data = await response.json()

            console.log(data)

            const confirmation = await stripe.confirmCardPayment(data.clientSecret)

            console.log(confirmation)

            if (confirmation.error) return alert('payment unsuccessful')

            alert('payment successful')
        } catch (err:any) {
            console.log(err);
        }
    }
    
    return (
        <>
            <h3 className='text-xl font-semibold text-center mb-8'>Subscribe to QuizzipIO Premium 1 month:</h3>
            <form onSubmit={handleFormSubmit}>
                <CardElement className="mb-4 border-slate-500 border-2 rounded text-slate-200 p-2" options={options}/>
                <PrimaryButton extra_classes="mt-2" type="submit">Subscribe</PrimaryButton>
            </form>
        </>
    )
}

export default PaymentForm