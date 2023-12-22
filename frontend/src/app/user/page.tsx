'use client'

import { useUserStore } from "@/store/store"
import Accordion from "@/components/Accordion"
import SimpleInput from "@/components/simpleInput"
import PrimaryButton from "@/components/primaryButton"
import { useState } from "react"
import { validateEmail } from "@/util-functions/helper-functions"
import { getServerURL } from "@/util-functions/helper-functions"

const User = () => {

    const {email, username} = useUserStore()
    let fetchURL = getServerURL()

    const [inputState, setInputState] = useState({
        email: '',
        password: ''
    })
    const [callStatus, setCallStatus] = useState('')

    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
    }

    const submitChangeEmail = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const emailValid = validateEmail(inputState.email)

        if (emailValid) {
            setCallStatus('')

            const formData = new FormData();

            formData.append("email", inputState.email);
            formData.append("password", inputState.password)
        } else {
            setCallStatus('Please enter a proper email.')
        }
    }

    return (
        <>
            <div className="py-10 flex justify-center items-center">
                <div className="container">
                    <div className="mb-16 container w-11/12 md:w-3/5 xl:w-2/5 mx-auto text-lg">
                        <h3 className="text-6xl font-extrabold mb-16 text-center">User Account <span className="text-blue-500">Settings</span></h3>
                        <div className="w-full">
                            <p className="mb-4"><span className="font-bold">Logged In As:</span> {username}</p>
                            <p className="mb-4"><span className="font-bold">User Email:</span> {email}</p>
                            <Accordion 
                                initialContent={<span className="mb-4 hover:underline underline-offset-2">Change Email &#11167;</span>}>
                                <form className="mb-4" onSubmit={submitChangeEmail}>
                                    <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter your new email" label="New E-mail" value={inputState.email}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="password" onChange={handleInputChange} placeholder="Enter your password" label="Password" value={inputState.password}/>
                                    <PrimaryButton type="submit">Change Email</PrimaryButton>
                                </form>
                                <p className="text-xs mb-8">{callStatus}</p>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User