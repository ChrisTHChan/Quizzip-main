'use client'

import SecureAuth from "@/components/secureAuth"
import LibraryComponent from "./_components/Library"
import {useAuthStore} from "@/store/store"

const Library = () => {

  const { auth } = useAuthStore();

  if (auth === 'not-auth') {
    return
  } else if (auth === 'auth') {
    return <LibraryComponent/>
  }
}

export default SecureAuth(Library);