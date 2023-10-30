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
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const revalidate = 0
export const dynamic = 'auto'

const Test = ({test}: props) => {

    const router = useRouter();

    //state

    const [showAnswers, setShowAnswers] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const closeModal = () => setIsDeleteModalOpen(false);
    const openModal = () => setIsDeleteModalOpen(true)

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
            window.location.reload()
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const exportTest = () => {
        fetch(`http://localhost:9000/users/lib/create-pdf/${Cookies.get('QUIZZIP-AUTH')}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(test)
        })
        .then(() => {
            window.location.href = `http://localhost:9000/users/lib/export-pdf/${Cookies.get('QUIZZIP-AUTH')}/${_id}`;
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const modalStyle = { borderRadius: '4px', backgroundColor: '#1F2937', border: "1px solid #1F2937" };

    return (
        <div className="mb-10 border-b-2 border-slate-700 pb-10 flex items-start justify-between gap-2 md:flex-row flex-col">
            <Accordion initialContent={initialContent} extra_classes="grow">
            {
                questions.map((question, i: number) => {
                    return <div className="mt-4" key={i}><Question question={question} showAnswers={showAnswers}/></div>
                })
            }
            </Accordion>
            <div className="min-w-[261px] flex flex-row-reverse md:flex-row mt-2 md:mt-0">
                <button onClick={toggleAnswers} className="px-4 hover:underline text-sm font-semibold block">Answers</button>
                <PrimaryButton onClick={exportTest} extra_classes="mr-2 py-3 block">Export</PrimaryButton>
                <SecondaryButton onClick={openModal} extra_classes="py-3 block mr-2 md:mr-0">Delete</SecondaryButton>
            </div>
            <Popup 
                open={isDeleteModalOpen} 
                closeOnDocumentClick 
                onClose={closeModal}
                contentStyle={modalStyle}
            >
                <p className="text-slate-200 text-center p-4 font-semibold">
                    Are you sure you want to delete the assessment "{testLabel}"?
                </p>
                <div className="flex justify-center w-full"> 
                    <PrimaryButton extra_classes="mb-4" onClick={deleteTest}>Delete Assessment</PrimaryButton>
                </div>
            </Popup>
        </div>
    )
}

export default Test