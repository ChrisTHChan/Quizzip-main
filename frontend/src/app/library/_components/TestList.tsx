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

type props = {
    tests: test[]
}

import Test from './Test'
import SimpleInput from '@/components/simpleInput'
import {useState} from 'react'

const TestList = ({tests}: props) => {

    const [filteredList, setFilteredList] = useState(tests)

    const handleInputChange = (e:React.FormEvent<HTMLInputElement>) => {

        const searchValue = (e.target as HTMLInputElement).value;
        const newArray:test[] = []

        tests.map((test) => {
            if (test.testLabel.includes(searchValue)) {
                newArray.push(test);
            }

            setFilteredList(newArray);
        })
      }

    return (
        <>  
            <SimpleInput name="searchText" onChange={handleInputChange} label='' placeholder="Search by Assessment Name" extra_classes='!mb-10 lg:w-1/3 w-full sm:w-1/2'/>
            {
                filteredList.map((test: test, i: number) => {
                    return <Test key={i} test={test}/>
                })
            }
        </>
    )
}

export default TestList