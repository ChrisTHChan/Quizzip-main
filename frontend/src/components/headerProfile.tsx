'use client'

import Link from 'next/link';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';
import Cookies from 'js-cookie';
import {useEffect} from 'react'
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

    const sessionId = Cookies.get('QUIZZIP-AUTH')

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
                <div className="mb-2 sm:mb-0">
                    <button onClick={goToLib} className='sm:hidden block font-semibold hover:underline underline-offset-4'>Assessments Library</button>
                    <SecondaryButton onClick={goToLib} extra_classes="mt-2 mb-2 mr-4 px-4 hidden sm:block">Library</SecondaryButton>
                </div>
                <Link className="mb-2 sm:mb-0" href='/create'>
                    <span className='sm:hidden block font-semibold hover:underline underline-offset-4'>Create Assessment</span>
                    <PrimaryButton extra_classes='px-4 mr-4 hidden sm:block'>Create</PrimaryButton>
                </Link>
                <Link className="font-semibold rounded-full sm:bg-slate-700 sm:w-[40px] sm:h-[40px] sm:flex sm:justify-center sm:items-center sm:font-bold hover:underline underline-offset-4 sm:hover:no-underline sm:hover:bg-slate-600 mb-2 sm:mb-0" href="/user">
                    <span className="hidden sm:block">{username[0]}</span>
                    <span className="block sm:hidden">User Account</span>
                </Link>
            </>
        )
    } else if (auth === 'not-auth') {
        authComponent = (
            <>
                <Link href='/register'>
                    <SecondaryButton extra_classes="px-4 mr-4 hidden sm:block">Register</SecondaryButton>
                    <div className="sm:hidden block font-semibold mb-2 hover:underline underline-offset-4">Register</div>
                </Link>
                <Link href='/sign-in'>
                    <PrimaryButton extra_classes="px-4 hidden sm:block">Login</PrimaryButton>
                    <div className="sm:hidden block font-semibold mb-2 hover:underline underline-offset-4">Login</div>
                </Link>
            </>
        )
    } else {
        authComponent = null
    }

    return authComponent || <Skeleton className="!w-20" baseColor="#0f172a" highlightColor="#334155"/>
}

export default HeaderProfile