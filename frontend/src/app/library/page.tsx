//not refreshing all the time when i hit this route????

import { cookies } from 'next/headers';
import TestList from './_components/TestList';

export const revalidate = 0
export const dynamic = 'auto'
export const fetchCache = 'force-no-store';

const getLibraryData = async () => {

    const nextCookies = cookies();
    const token = nextCookies.get('QUIZZIP-AUTH')!.value;

    //in docker environment, needs to be: `http://back-end:9000/users/lib/${token}`
    //in localhost environment, needs to be: `http://localhost:9000/users/lib/${token}`
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
            <div className="container mx-4">
                <div className="w-full">
                    {
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