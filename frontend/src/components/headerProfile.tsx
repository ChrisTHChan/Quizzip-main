'use client'

import Link from 'next/link';
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';
import Cookies from 'js-cookie';
import {useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const HeaderProfile = () => {

    //state 

    const [userAuthenticated, setUserAuthenticated] = useState<'auth' | 'not-auth' | null>(null)
    const [sessionId] = useState(Cookies.get('QUIZZIP-AUTH'))

    //effect

    useEffect(() => {

        if (!sessionId) {
            setUserAuthenticated('not-auth');
            return
        }
        
        checkUserSession();
    }, [])

    //handlers

    const logout = () => {

        fetch(`http://localhost:9000/auth/logout/${sessionId}`, {
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

        fetch(`http://localhost:9000/auth/checkUserSession/${sessionId}`, {
            method: 'POST',
            credentials: 'include',
        })
        .then((res) => {
            if (res.status === 200) {
                setUserAuthenticated('auth');
            } else {
                setUserAuthenticated('not-auth');
            }
        })
        .catch((err) => {
            console.log(err);
            return
        })
    }

    let authComponent

    if (userAuthenticated === 'auth') {
        authComponent = (
            <>
                <SecondaryButton onClick={logout} extra_classes="mt-2 mb-2 mr-4">Sign Out</SecondaryButton>
                <PrimaryButton>Profile</PrimaryButton>
            </>
        )
    } else if (userAuthenticated === 'not-auth') {
        authComponent = (
            <>
                <Link href='register'><SecondaryButton extra_classes="px-4 mr-4 ">Register</SecondaryButton></Link>
                <Link href='sign-in'><PrimaryButton extra_classes="px-4">Sign In</PrimaryButton></Link>
            </>
        )
    } else {
        authComponent = null
    }

    return authComponent || <Skeleton className="!w-20" baseColor="#0f172a" highlightColor="#334155"/>
}

export default HeaderProfile