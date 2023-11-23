'use client'

type test = {
    testLabel: string, 
    test: [
        {
            question: string,
            choices?: string[],
            answer: string,
        }
    ]
    _id: string
}

import TestList from './_components/TestList';
import Cookies from 'js-cookie'
import {useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const getLibraryData = async () => {
    const token = Cookies.get('QUIZZIP-AUTH')

    let res
    if (process.env.NODE_ENV === 'development') {
        res = await fetch(`http://localhost:9000/api/users/lib/${token}`)
    } else {
        res = await fetch(`/api/users/lib/${token}`)
    }

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

const Library = () => {

    const [tests, setTests] = useState<test[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getData = async () => {
        const data = await getLibraryData()
        setTests(data.testLibrary.testsLibrary)
        setLoading(false);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="container mx-4">
                <div className="w-full">
                    {
                        loading ? 
                        <Skeleton count={10} className="w-1/3" baseColor="#0f172a" highlightColor="#334155"/>
                        :
                        tests.length ?
                        <TestList tests={tests}/> :
                        <div>You have no saved assessments.</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Library;