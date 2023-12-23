'use client'

import SecureAuth from "@/components/secureAuth"
import UserComponent from "./_components/user"
import {useAuthStore} from "@/store/store"

const UserPage = () => {

  const { auth } = useAuthStore();

  if (auth === 'not-auth') {
    return
  } else if (auth === 'auth') {
    return <UserComponent/>
  }
}

export default SecureAuth(UserPage);