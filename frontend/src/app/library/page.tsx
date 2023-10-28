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

import { cookies } from 'next/headers';
import Test from './_components/Test'

const getLibraryData = async () => {

    const nextCookies = cookies();
    const token = nextCookies.get('QUIZZIP-AUTH')!.value;

    const res = await fetch(`http://localhost:9000/users/lib/${token}`)

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

const Library = async () => {

    const data = await getLibraryData();

    const tests = data.testLibrary.testsLibrary;
    console.log('hello')

    return (
        <div className="flex justify-center items-center">
            <div className="container">
                <div className="w-full">
                    {
                        tests.length ?
                        tests.map((test: test, i: number) => {
                            return <Test key={i} test={test}/>
                        })
                        :
                        <div>You have no saved assessments.</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Library;