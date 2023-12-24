'use client'

type props = {
    header: string,
    price: number,
    includeButton: boolean,
    listItems: string[],
    headerClasses?: string
}

import PrimaryButton from "../../../components/primaryButton"
import Cookies from 'js-cookie'
import { getServerURL } from "@/util-functions/helper-functions"

const handleStripeSubmit = async () => {

    let fetchURL = getServerURL()

    const res = await fetch(`${fetchURL}/stripe/handleSubscription/${Cookies.get('QUIZZIP-AUTH')}`, {
        method: 'POST'
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    const response = await res.json()

    return response
}

const Card = ({header, price, includeButton, listItems, headerClasses}: props) => {

    return (
        <>
            <div className="rounded-lg w-full sm:w-1/2 border-2 border-slate-600 p-6">
                <h4 className={`${headerClasses} text-2xl font-semibold mb-4`}>{header}</h4>
                <h5 className="mb-4 text-lg font-semibold">${price}/month</h5>
                <ul className="text-sm">
                    {listItems.map((item, i) => {
                        return <li className="mb-1 list-disc ml-4" key={i}>{item}</li>
                    })}
                </ul>
                {includeButton ? <PrimaryButton onClick={handleStripeSubmit} extra_classes="mt-4">Choose this plan</PrimaryButton>: null}
            </div>
        </>
    )
}

export default Card