'use-client'

import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import useAuthStore from "@/store/store";

const SecureNotAuth = (Component: any) => {
    return function isNotAuth(props: any) {
        const { auth } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (auth === 'auth') {
                return
            }
        }, [])

        if (auth === 'auth') {
            router.push('/')
            return
        } else {
            return <Component {...props} />
        }
    }
}

export default SecureNotAuth