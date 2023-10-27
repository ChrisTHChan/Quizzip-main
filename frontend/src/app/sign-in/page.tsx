'use client'

import SecureNotAuth from "@/components/secureNotAuth"
import SignInComponent from "./_components/sign-in"
import useAuthStore from "@/store/store"

const SignIn = () => {

  const { auth } = useAuthStore();

  if (auth === 'auth') {
    return
  } else if (auth === 'not-auth') {
    return <SignInComponent/>
  }
}

export default SecureNotAuth(SignIn);