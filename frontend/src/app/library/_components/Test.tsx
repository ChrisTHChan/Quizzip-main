//add search, show answers

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
import SimpleCheckbox from "@/components/simpleCheckbox"

const Test = ({test}: props) => {

    //state

    const [checkboxState, setCheckboxState] = useState({
        showAnswers: false,
    })

    //handlers

    const handleCheckboxChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).checked;
        setCheckboxState({
          ...checkboxState,
          [(e.target as HTMLInputElement).name]: value
        });
        console.log(checkboxState);
    }

    const {testLabel, _id} = test
    const questions = test.test

    const initialContent = (
        <div className='hover:underline'>
            <h2 className='text-xl font-semibold text-left'>{testLabel}</h2>
            <p className="text-left">Test ID: {_id}</p>
        </div>
    )

    return (
        <div className="mb-10 border-b-2 border-slate-700 pb-10 flex items-start justify-between gap-2">
            <Accordion initialContent={initialContent} extra_classes="grow">
            {
                questions.map((question, i: number) => {
                    return (
                        <div className="mt-4" key={i}>
                            <Question question={question} showAnswers={checkboxState.showAnswers}/>
                        </div>
                    )
                })
            }
            </Accordion>
            <div>
                <PrimaryButton extra_classes="mr-2">Export</PrimaryButton>
                <SecondaryButton>Delete</SecondaryButton>
                <SimpleCheckbox onChange={handleCheckboxChange} checkedState={checkboxState.showAnswers} name="showAnswers" label="Provide me answers as well." extra_classes="text-sm mb-4"/>
            </div>
        </div>
    )
}

export default Test