'use client'

import SimpleInput from "@/components/simpleInput"
import PrimaryButton from "@/components/primaryButton"
import {useState} from 'react'
import { validateEmail } from "@/util-functions/helper-functions"

const ForgotPassword = () => {

    let fetchURL: string

    if (process.env.NODE_ENV === 'development') {
        fetchURL = 'http://localhost:9000/api'
    } else {
        fetchURL = '/api'
    }

    const [inputState, setInputState] = useState({
        email: ''
    })
    const [callStatus, setCallStatus] = useState('')

    const submitEmail = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const emailValid = validateEmail(inputState.email)

        if (emailValid) {
            const formData = new FormData();

            setCallStatus('')

            formData.append("email", inputState.email);

            fetch(`${fetchURL}/auth/forgotPassword`, {
                method: 'POST',
                body: formData,
            })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setCallStatus(res.callStatus);
            })
            .catch((err) => {
                setCallStatus('Something went wrong, please try submitting again.');
                console.log(err);
                return
            })

        } else {
            setCallStatus('Please enter a proper email.')
            return
        }
    }

    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
    }

    return (
        <>
            <div className="py-10 flex justify-center items-center">
                <div className="container">
                    <div className="mb-16 container w-11/12 md:w-4/5 xl:w-6/12 mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Lost your password?<span className="text-blue-500">We are here to help.</span></h2>
                        <h3 className="text-center mb-4 text-slate-500">We will send you an e-mail with a secure link and one-time passcode to reset your password.</h3>
                        <div className="flex w-full justify-center">
                            <div className="w-1/2">
                                <form onSubmit={submitEmail}>
                                    <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter Email" label="E-mail" value={inputState.email}/>
                                    <PrimaryButton type="submit" extra_classes="mt-2 mb-2 mr-2">Submit</PrimaryButton>
                                </form>
                                <p className="text-xs mb-8">{callStatus}</p> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword