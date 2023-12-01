'use client'

import SimpleInput from "@/components/simpleInput"
import PrimaryButton from "@/components/primaryButton"
import {useState} from 'react'
import { validateEmail } from "@/util-functions/helper-functions"

const ResetPassword = ({ params }: { params: { hashedEmail: string } }) => {

    let fetchURL: string

    if (process.env.NODE_ENV === 'development') {
        fetchURL = 'http://localhost:9000/api'
    } else {
        fetchURL = '/api'
    }

    const [inputState, setInputState] = useState({
        email: '',
        passcodeNumber: '',
        password: '',
        confirmPassword: '',
    })
    const [callStatus, setCallStatus] = useState('')

    const submitChangePassword = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const hashedEmail = params.hashedEmail

        const emailValid = validateEmail(inputState.email)

        const passwordsMatch = () => {
            return inputState.password === inputState.confirmPassword
        }

        if (emailValid && passwordsMatch() && inputState.passcodeNumber && inputState.password) {
            const formData = new FormData();

            setCallStatus('')

            formData.append("email", inputState.email);
            formData.append("hashedEmail", hashedEmail);
            formData.append("password", inputState.password);
            formData.append("passcodeNumber", inputState.passcodeNumber);

            fetch(`${fetchURL}/auth/validateAndResetPassword`, {
                method: 'POST',
                body: formData,
            })
            .then((res) => {
                if (res.status === 200) {
                    location.href = "/sign-in";
                }

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
            setCallStatus('Please make sure all fields are filled in, that your passwords match, and that your email is a proper email.')
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
                    <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Change your <span className="text-blue-500">password here.</span></h2>
                        <h3 className="text-center mb-4 text-slate-400">Use the one time passcode from your email to validate your password request change.</h3>
                        <div className="flex w-full justify-center">
                            <div className="w-1/2">
                                <form onSubmit={submitChangePassword}>
                                    <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter Email" label="E-mail" value={inputState.email}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="passcodeNumber" onChange={handleInputChange} placeholder="Enter Passcode Number" label="Passcode Number" value={inputState.passcodeNumber}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="password" onChange={handleInputChange} placeholder="Enter Password" label="Password" value={inputState.password}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="confirmPassword" onChange={handleInputChange} placeholder="Confirm Password" label="Confirm Password" value={inputState.confirmPassword}/>
                                    <PrimaryButton type="submit" extra_classes="mt-2 mb-2 mr-2">Change Password</PrimaryButton>
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

export default ResetPassword