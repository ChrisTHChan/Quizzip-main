'use client'

import SimpleInput from "../../components/simpleInput"
import { useState } from "react";

export default function Register() {

    //state
    const [inputState, setInputState] = useState({
        email: '',
        username: '',
        password: '',
    })

    //handlers
    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
        });
        console.log(inputState);
    }

    return (
      <>
        <div className="py-10 flex justify-center items-center">
            <div className="container">
                    <div className="mb-16 container w-11/12 md:w-4/5 xl:w-6/12 mx-auto">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Register your account to start <span className="text-blue-500">making assessments.</span></h2>
                        {/* <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">access to limited features</span>. Upgrade your account to a monthly subscription to get more features!</h3> */}
                        <SimpleInput name="email" onChange={handleInputChange} placeholder="Enter Email" label="E-mail" value={inputState.email} isNumber={false}/>
                        <SimpleInput name="username" onChange={handleInputChange} placeholder="Enter Username" label="Username" value={inputState.username} isNumber={false}/>
                        <SimpleInput name="password" onChange={handleInputChange} placeholder="Enter Password" label="Password" value={inputState.password} isNumber={false}/>
                    </div>
            </div>
        </div>
      </>
    )
}