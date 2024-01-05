'use client'

import { Elements } from "@stripe/react-stripe-js"
import Card from "./_components/Card"
import Footer from "@/components/Footer"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./_components/PaymentForm"
import { useState } from "react"
import Cookies from 'js-cookie';
import { getServerURL } from "@/util-functions/helper-functions"
import { useUserStore } from "@/store/store"

const stripePublishableKey:string = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`

const stripePromise = loadStripe(stripePublishableKey)

export default function Pricing() {

  const sessionId = Cookies.get('QUIZZIP-AUTH')
  let fetchURL = getServerURL()
  const {email, username, setGenerationsLeft, generationsLeft} = useUserStore()

  const [formOpen, setFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [productId, setProductId] = useState('')
  const [duration, setDuration] = useState('')

  const setFormToOpenMonthly = () => {
    setFormOpen(true)
    setFormTitle('Sign up for QuizzipIO Monthly Subscription:')
    setProductId('price_1OR887BlbVm0HEusenlz9iIL')
    setDuration('monthly')
  }

  const setFormToOpenYearly = () => {
    setFormOpen(true)
    setFormTitle('Sign up for QuizzipIO Yearly Subscription:')
    setProductId('price_1OR89hBlbVm0HEusveRZwr34')
    setDuration('yearly')
  }

  const getFreeGenerationsOnce = async () => {

    try {
      const getGenerations = await fetch(`${fetchURL}/stripe/createAndProvideFreeTrialGenerationsOnce/${sessionId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
        })
      })

      if (!getGenerations.ok) {
        throw new Error('something went wrong')
      }

      setGenerationsLeft(generationsLeft + 20)

      return alert('You\'ve successfully received the offer!')

    } catch (err){
      return alert("Something went wrong. Are you sure you haven't already used the offer?")
    }
  }

    return (
      <>
        <div className="py-10 flex justify-center items-center">
          <div className="container">
            <div className="mb-24 container w-11/12 xl:w-8/12 mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Upgrade your account and get <span className="text-blue-500">unlimited access.</span></h2>
              <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">5 free generations a month</span>. Upgrade your account to a monthly subscription to get more generations and more features!</h3>
              <div className="flex gap-4 flex-col md:flex-row mb-8">
                <Card
                    header="Basic Plan"
                    price={'0'}
                    includeButton={false}
                    listItems={['Access to all sources of generation.', 'Up to 15 questions per question type.', 'Up to 5 assessment generations per month.', 'Medium sized content sources and file uploads.', 'Quick and responsive customer support.']}
                />
                <Card
                    header="Premium Yearly Subscription"
                    headerClasses="text-blue-500"
                    price={'84/year'}
                    includeButton={true}
                    listItems={['Access to all sources of generation.', 'Up to 15 questions per question type.', 'Up to 1800 assessment generations per year.', 'Large sized content sources and file uploads.', 'Quick and responsive customer support.', 'Billed per year, 70% off per month!', 'Virtual hugs from the Quizzip Team!']}
                    buttonFunction={setFormToOpenYearly}
                />
                <Card
                    header="Premium Monthly Subscription"
                    headerClasses="text-blue-500"
                    price={'10/month'}
                    includeButton={true}
                    listItems={['Access to all sources of generation.', 'Up to 15 questions per question type.', 'Up to 150 assessment generations per month.', 'Large sized content sources and file uploads.', 'Quick and responsive customer support.', 'Billed per month.', 'Virtual hugs from the Quizzip Team!']}
                    buttonFunction={setFormToOpenMonthly}
                />
              </div>
              <div className="w-3/4 mx-auto">
                <p className="w-full text-neutral-300 font-semibold text-sm text-center">
                  Enjoying QuizzipIO? Get 20 additional free generations on us, only once for your account. No credit card commitment required. <button onClick={getFreeGenerationsOnce} className="underline underline-offset-2">Click Here!</button>
                </p>
              </div>
            </div>
            <div className="mb-16 container w-11/12 md:w-4/5 xl:w-5/12 mx-auto">
              <Elements stripe={stripePromise}>
                <PaymentForm formOpen={formOpen} formTitle={formTitle} productId={productId} duration={duration}/>
              </Elements>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    )
  }