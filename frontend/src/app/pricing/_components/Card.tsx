'use client'

type props = {
    header: string,
    price: number,
    includeButton: boolean,
    listItems: string[],
    headerClasses?: string,
    buttonFunction?: any
}

import PrimaryButton from "../../../components/primaryButton"

const Card = ({header, price, includeButton, listItems, headerClasses, buttonFunction}: props) => {

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
                {includeButton ? <a href="#paymentForm"><PrimaryButton onClick={buttonFunction} extra_classes="mt-4">Choose this plan</PrimaryButton></a>: null}
            </div>
        </>
    )
}

export default Card