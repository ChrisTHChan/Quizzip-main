'use-client'

import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import {useAuthStore} from "@/store/store";

const SecureNotAuth = (Component: any) => {
    return function IsNotAuth(props: any) {
        const { auth } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (auth === 'auth') {
                return
            }
        }, [auth])

        if (auth === 'auth') {
            router.push('/create')
            return
        } else {
            return <Component {...props} />
        }
    }
}

export default SecureNotAuth