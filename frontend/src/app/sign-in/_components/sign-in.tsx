'use client'

import SimpleInput from "@/components/simpleInput"
import PrimaryButton from "@/components/primaryButton"
import {useState} from 'react'
import { validateEmail } from "@/util-functions/helper-functions"

export default function SignInComponent() {

  let fetchURL: string

    if (process.env.NODE_ENV === 'development') {
        fetchURL = 'localhost:9000/api'
    } else {
        fetchURL = 'quizzipio.com/api'
    }

  //state

  const [inputState, setInputState] = useState({
    email: '',
    password: '',
  })
  const [signInStatus, setSignInStatus] = useState('')

  //handlers

  const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
    setInputState({
      ...inputState,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    });
  }

  const submitSignIn = (e:React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const emailValid = validateEmail(inputState.email)

    if (emailValid && inputState.email && inputState.password) {
      const formData = new FormData();

      formData.append("email", inputState.email);
      formData.append("password", inputState.password);

      setSignInStatus('');

      fetch(`https://${fetchURL}/auth/login`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
      })
      .then((res) => {
          if (res.status === 200) {
            location.href = "/";
          }

          return res.json()
      })
      .then((res) => {
          setSignInStatus(res.signInStatus);
      })
      .catch((err) => {
          setSignInStatus('Something went wrong, please try signing in again.');
          console.log(err);
          return
      })

    } else {
      setSignInStatus('Please fill in all fields, and enter a proper email.')
      return
    }
  }

  return (
    <>
      <div className="py-10 flex justify-center items-center">
        <div className="container">
            <div className="mb-16 container w-11/12 md:w-4/5 xl:w-6/12 mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Sign in to start <span className="text-blue-500">making assessments.</span></h2>
                {/* <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">access to limited features</span>. Upgrade your account to a monthly subscription to get more features!</h3> */}
                <div className="flex w-full justify-center">
                    <div className="w-1/2">
                        <form onSubmit={submitSignIn}>
                          <SimpleInput type="email" extra_classes="w-full" name="email" onChange={handleInputChange} placeholder="Enter Email" label="E-mail" value={inputState.email}/>
                          <SimpleInput type="password" extra_classes="w-full" name="password" onChange={handleInputChange} placeholder="Enter Password" label="Password" value={inputState.password}/>
                          <PrimaryButton type="submit" extra_classes="mt-2 mb-2">Sign In</PrimaryButton>
                        </form>
                        <p className="text-xs mb-8">{signInStatus}</p> 
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}