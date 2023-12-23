'use client'

import Link from 'next/link';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';
import Cookies from 'js-cookie';
import {useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAuthStore, useUserStore } from '@/store/store';
import { useRouter } from 'next/navigation'
import { getServerURL } from '@/util-functions/helper-functions';

const HeaderProfile = () => {

    let fetchURL = getServerURL()

    const router = useRouter();

    const {auth, setAuthTrue, setAuthFalse} = useAuthStore();

    const {username, setUsername, setEmail} = useUserStore()
    
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

    const checkUserSession = () => {

        fetch(`${fetchURL}/auth/checkUserSession/${sessionId}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then((res) => {
            if (res.status === 200) {
                setAuthTrue()
                return res.json()
            } else {
                setAuthFalse()
            }
        })
        .then((res) => {
            setEmail(res.email)
            setUsername(res.username)
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
                <SecondaryButton onClick={goToLib} extra_classes="mt-2 mb-2 mr-4 px-4">Library</SecondaryButton>
                <Link href='/create'><PrimaryButton extra_classes='px-4 mr-4'>Create</PrimaryButton></Link>
                <Link className="rounded-full bg-slate-700 w-[40px] h-[40px] flex justify-center items-center font-bold" href="/user">{username[0]}</Link>
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