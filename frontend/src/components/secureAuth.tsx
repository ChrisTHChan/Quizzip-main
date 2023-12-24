'use-client'

import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import {useAuthStore} from "@/store/store";

const SecureNotAuth = (Component: any) => {
    return function IsNotAuth(props: any) {
        const { auth } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (auth === 'not-auth') {
                return
            }
        }, [auth])

        if (auth === 'not-auth') {
            router.push('/sign-in')
            return
        } else {
            return <Component {...props} />
        }
    }
}

export default SecureNotAuth