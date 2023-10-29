//add search

'use client'

type props = {
    test: {
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
}

import Question from "@/components/questionComponent"
import Accordion from "@/components/Accordion"
import PrimaryButton from "@/components/primaryButton"
import SecondaryButton from "@/components/secondaryButton"
import {useState} from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export const revalidate = 0
export const dynamic = 'auto'

const Test = ({test}: props) => {

    const router = useRouter();

    //state

    const [showAnswers, setShowAnswers] = useState(false);

    //handlers

    const toggleAnswers = () => {
        setShowAnswers(!showAnswers);
    }

    const {testLabel, _id} = test
    const questions = test.test

    const initialContent = (
        <div className='hover:underline'>
            <h2 className='text-xl font-semibold text-left'>{testLabel}</h2>
            <p className="text-left text-sm">Assessment ID: {_id}</p>
        </div>
    )

    const deleteTest = () => {
        fetch(`http://localhost:9000/users/lib/${Cookies.get('QUIZZIP-AUTH')}`, {
            cache: 'no-cache',
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                testId: _id
            })
        })
        .then(res => res.json())
        .then((res) => {
            router.refresh()
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className="mb-10 border-b-2 border-slate-700 pb-10 flex items-start justify-between gap-2">
            <Accordion initialContent={initialContent} extra_classes="grow">
            {
                questions.map((question, i: number) => {
                    return <div className="mt-4" key={i}><Question question={question} showAnswers={showAnswers}/></div>
                })
            }
            </Accordion>
            <div>
                <button onClick={toggleAnswers} className="px-4 hover:underline text-sm font-semibold">Toggle Answers</button>
                <PrimaryButton extra_classes="mr-2 py-3">Export</PrimaryButton>
                <SecondaryButton onClick={deleteTest} extra_classes="py-3">Delete</SecondaryButton>
            </div>
        </div>
    )
}

export default Test