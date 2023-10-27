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

    return (
        <div className="flex justify-center items-center">
            <div className="container">
                <div className="w-full">
                    {
                        tests.length ?
                        tests.map((test: test, i: number) => {
                            return <h2 key={i} className="text-xl font-semibold">testName: {test.testLabel}, id: {test._id}</h2>
                        })
                        :
                        <div>you have no tests.</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Library;