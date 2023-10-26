'use client'

import SecureNotAuth from "@/components/secureNotAuth"
import RegisterComponent from "./register"
import useAuthStore from "@/store/store"

const Register = () => {

  const { auth } = useAuthStore();

  if (auth === 'auth') {
    return
  } else if (auth === 'not-auth') {
    return <RegisterComponent/>
  }
}

export default SecureNotAuth(Register);