'use client'

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import SimpleInput from "@/components/simpleInput";
import PrimaryButton from "@/components/primaryButton";


const PaymentForm = () => {
    
    const stripe = useStripe();
    const elements = useElements();
    const [inputState, setInputState] = useState({
        name: '',
        email: '',
    })

    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
    }

    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(inputState);
    }
    
    return (
        <>
            <h3 className='text-xl font-semibold text-center mb-8'>Subscribe to QuizzipIO Premium 1 month:</h3>
            <form onSubmit={handleFormSubmit}>
                <SimpleInput extra_classes="w-full" name="name" onChange={handleInputChange} placeholder="Enter Name" label="Name" value={inputState.name}/>
                <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter E-mail" label="E-mail" value={inputState.email}/>
                <PrimaryButton extra_classes="mt-2" type="submit">Subscribe</PrimaryButton>
            </form>
        </>
    )
}

export default PaymentForm