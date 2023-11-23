'use client'

import PrimaryButton from "@/components/primaryButton";
import SimpleInput from "@/components/simpleInput"
import { validateEmail } from "@/util-functions/helper-functions";
import { useState } from "react";

export default function Register() {

    let fetchURL: string

    if (process.env.NODE_ENV === 'development') {
        fetchURL = 'http://localhost:9000/api'
    } else {
        fetchURL = '/api'
    }

    //state
    const [inputState, setInputState] = useState({
        email: '',
        username: '',
        password: '',
    })
    const [registrationStatus, setRegistrationStatus] = useState('')

    //handlers
    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
    }

    const submitRegistration = (e:React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const emailValid = validateEmail(inputState.email)
        
        if (emailValid && inputState.email && inputState.username && inputState.password) {

            const formData = new FormData();

            formData.append("email", inputState.email);
            formData.append("username", inputState.username);
            formData.append("password", inputState.password);

            setRegistrationStatus('');

            console.log('checking registration on frontend')

            fetch(`${fetchURL}/auth/register`, {
                method: 'POST',
                body: formData,
            })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setRegistrationStatus(res.registrationStatus);
            })
            .catch((err) => {
                setRegistrationStatus('Something went wrong, please try registering again.');
                console.log(err);
                return
            })
        } else {
            setRegistrationStatus('Please fill in all fields, and enter a proper email.')
            return
        }
    }

    return (
      <>
        <div className="py-10 flex justify-center items-center">
            <div className="container">
                    <div className="mb-16 container w-11/12 md:w-4/5 xl:w-6/12 mx-auto">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Register your account to start <span className="text-blue-500">making assessments.</span></h2>
                        {/* <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">access to limited features</span>. Upgrade your account to a monthly subscription to get more features!</h3> */}
                        <div className="flex w-full justify-center">
                            <div className="w-1/2">
                                <form onSubmit={submitRegistration}>
                                    <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter Email" label="E-mail" value={inputState.email}/>
                                    <SimpleInput extra_classes="w-full" name="username" onChange={handleInputChange} placeholder="Enter Username" label="Username" value={inputState.username}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="password" onChange={handleInputChange} placeholder="Enter Password" label="Password" value={inputState.password}/>
                                    <PrimaryButton type="submit" extra_classes="mt-2 mb-2">Register</PrimaryButton>
                                </form>
                                <p className="text-xs mb-8">{registrationStatus}</p> 
                            </div>
                        </div>
                    </div>
            </div>
        </div>
      </>
    )
}