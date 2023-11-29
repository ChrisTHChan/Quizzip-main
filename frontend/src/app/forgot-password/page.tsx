'use client'

import SecureNotAuth from "@/components/secureNotAuth"
import ForgotPasswordComponent from "./_components/ForgotPassword"
import useAuthStore from "@/store/store"

const Register = () => {

  const { auth } = useAuthStore();

  if (auth === 'auth') {
    return
  } else if (auth === 'not-auth') {
    return <ForgotPasswordComponent/>
  }
}

export default SecureNotAuth(Register);