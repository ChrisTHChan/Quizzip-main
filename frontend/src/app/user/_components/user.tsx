'use client'

import { useUserStore } from "@/store/store"
import Accordion from "@/components/Accordion"
import SimpleInput from "@/components/simpleInput"
import PrimaryButton from "@/components/primaryButton"
import { useState } from "react"
import { validateEmail } from "@/util-functions/helper-functions"
import { getServerURL } from "@/util-functions/helper-functions"
import Cookies from 'js-cookie';

const User = () => {

    const {email, username, tier, generationsLeft, expirationDate} = useUserStore()
    let fetchURL = getServerURL()
    const sessionId = Cookies.get('QUIZZIP-AUTH')

    const [inputState, setInputState] = useState({
        email: '',
        password: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })
    const [emailCallStatus, setEmailCallStatus] = useState('');
    const [passwordCallStatus, setPasswordCallStatus] = useState('');

    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
    }

    const logout = () => {

        fetch(`${fetchURL}/auth/logout/${sessionId}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(() => {
            location.href = "/sign-in";
            return
        })
        .catch((err) => {
            console.log(err);
            return
        })
    }

    const submitChangePassword = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setPasswordCallStatus('');

        if (inputState.newPassword.length > 0 && inputState.oldPassword.length > 0 && inputState.newPassword === inputState.confirmNewPassword) {
            const formData = new FormData();
            
            formData.append("email", email);
            formData.append("oldPassword", inputState.oldPassword);
            formData.append("newPassword", inputState.newPassword);

            fetch(`${fetchURL}/auth/loggedInChangePassword/${sessionId}`, {
                method: 'PUT',
                body: formData,
            })
            .then((res) => {
                if (res.status === 200) {
                    window.location.reload()
                }
                return res.json()
            })
            .then((res) => {
                setPasswordCallStatus(res.callStatus);
            })
            .catch((err) => {
                setPasswordCallStatus('Something went wrong, please try submitting again.');
                console.log(err);
                return
            })
        } else {
            setPasswordCallStatus('Your new passwords do not match, or you have not entered anything.');
            return
        }
    }

    const submitChangeEmail = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const emailValid = validateEmail(inputState.email)

        if (email === inputState.email) {
            setEmailCallStatus('Please enter an email to one other than your original email.')
            return
        }

        if (emailValid) {
            setEmailCallStatus('')

            const formData = new FormData();
            
            formData.append("oldEmail", email);
            formData.append("newEmail", inputState.email);
            formData.append("password", inputState.password)

            fetch(`${fetchURL}/auth/loggedInChangeEmail/${sessionId}`, {
                method: 'PUT',
                body: formData,
            })
            .then((res) => {
                if (res.status === 200) { 
                    window.location.reload()
                }
                return res.json()
            })
            .then((res) => {
                setEmailCallStatus(res.callStatus);
            })
            .catch((err) => {
                setEmailCallStatus('Something went wrong, please try submitting again.');
                console.log(err);
                return
            })
        } else {
            setEmailCallStatus('Please enter a proper email.')
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
                            <p className="mb-4"><span className="font-bold">User Tier:</span> {tier ? tier : 'Basic'}</p>
                            <p className="mb-4"><span className="font-bold">Generations Left This Month:</span> {generationsLeft ? generationsLeft : 5}</p>
                            <p className="mb-4"><span className="font-bold">Generations Reset on:</span> {expirationDate ? expirationDate : 'Create or subscribe to start your month!'}</p>
                            <Accordion 
                                initialContent={<div className="mb-4 hover:underline underline-offset-2">Change Email &#11167;</div>}>
                                <form className="mb-4" onSubmit={submitChangeEmail}>
                                    <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter your new email" label="New E-mail" value={inputState.email}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="password" onChange={handleInputChange} placeholder="Enter your password" label="Password" value={inputState.password}/>
                                    <PrimaryButton type="submit">Change Email</PrimaryButton>
                                </form>
                                <p className="text-xs mb-8">{emailCallStatus}</p>
                            </Accordion>
                            <Accordion 
                                initialContent={<div className="mb-4 hover:underline underline-offset-2">Change Password &#11167;</div>}>
                                <form className="mb-4" onSubmit={submitChangePassword}>
                                    <SimpleInput type="password" extra_classes="w-full" name="oldPassword" onChange={handleInputChange} placeholder="Enter your old password" label="Old Password" value={inputState.oldPassword}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="newPassword" onChange={handleInputChange} placeholder="Enter new password" label="New Password" value={inputState.newPassword}/>
                                    <SimpleInput type="password" extra_classes="w-full" name="confirmNewPassword" onChange={handleInputChange} placeholder="Confirm new password" label="Confirm New Password" value={inputState.confirmNewPassword}/>
                                    <PrimaryButton type="submit">Change Password</PrimaryButton>
                                </form>
                                <p className="text-xs mb-8">{passwordCallStatus}</p>
                            </Accordion>
                            <button onClick={logout} className="font-bold hover:underline underline-offset-8">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User