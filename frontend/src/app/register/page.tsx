'use client'

import SimpleInput from "../components/simpleInput"
import { useState } from "react";

export default function Register() {

    //state
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')

    //handlers
    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {
        console.log((e.target as HTMLInputElement).value);
    }

    return (
      <>
        <div className="py-10 flex justify-center items-center">
            <div className="container">
                    <div className="mb-16 container w-11/12 md:w-4/5 xl:w-6/12 mx-auto">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-4">Register your account to start <span className="text-blue-500">making assessments.</span></h2>
                        {/* <h3 className="text-center mb-4 text-slate-500">Free users get <span className="font-extrabold">access to limited features</span>. Upgrade your account to a monthly subscription to get more features!</h3> */}
                        <SimpleInput name="email" onChange={handleInputChange} placeholder="email" label="email" value={email} isNumber={false}/>
                    </div>
            </div>
        </div>
      </>
    )
}