'use client'

import SecureAuth from "@/components/secureAuth"
import CreateComponent from "./_components/create"
import useAuthStore from "@/store/store"

const Create = () => {

  const { auth } = useAuthStore();

  if (auth === 'not-auth') {
    return
  } else if (auth === 'auth') {
    return <CreateComponent/>
  }
}

export default SecureAuth(Create);