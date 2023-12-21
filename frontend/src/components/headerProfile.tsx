'use client'

import Link from 'next/link';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';
import Cookies from 'js-cookie';
import {useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useAuthStore from '@/store/store';
import { useRouter } from 'next/navigation'
import { getServerURL } from '@/util-functions/helper-functions';

const HeaderProfile = () => {

    let fetchURL = getServerURL()

    const router = useRouter();

    const {auth, setAuthTrue, setAuthFalse} = useAuthStore();
    
    //state 
    const [sessionId] = useState(Cookies.get('QUIZZIP-AUTH'))

    useEffect(() => {
        if (!sessionId) {
            setAuthFalse()
        } else {
            checkUserSession();
        }
    }, [])

    //handlers

    const goToLib = () => {
        router.replace("/library")
        router.refresh();
    }

    const logout = () => {

        fetch(`${fetchURL}/auth/logout/${sessionId}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(() => {
            location.href = "/sign-in";
            return
        })
        .catch((err) => {
            console.log(err);
            return
        })
    }

    const checkUserSession = () => {

        fetch(`${fetchURL}/auth/checkUserSession/${sessionId}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then((res) => {
            if (res.status === 200) {
                setAuthTrue()
            } else {
                setAuthFalse()
            }
        })
        .catch((err) => {
            console.log(err);
            return
        })
    }

    let authComponent

    if (auth === 'auth') {
        authComponent = (
            <>
                <button onClick={logout} className="mr-4 text-sm font-semibold hover:underline underline-offset-8">Sign Out</button>
                <SecondaryButton onClick={goToLib} extra_classes="mt-2 mb-2 mr-4 px-4">Library</SecondaryButton>
                <Link href='/create'><PrimaryButton extra_classes='px-4'>Create</PrimaryButton></Link>
            </>
        )
    } else if (auth === 'not-auth') {
        authComponent = (
            <>
                <Link href='/register'><SecondaryButton extra_classes="px-4 mr-4 ">Register</SecondaryButton></Link>
                <Link href='/sign-in'><PrimaryButton extra_classes="px-4">Sign In</PrimaryButton></Link>
            </>
        )
    } else {
        authComponent = null
    }

    return authComponent || <Skeleton className="!w-20" baseColor="#0f172a" highlightColor="#334155"/>
}

export default HeaderProfile