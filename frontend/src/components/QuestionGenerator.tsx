type contentFormatState = 'youtubeURL' | 'text' | 'pdf' | 'doc' | 'ppt'

type question = {
    question: string,
    answer: string,
    choices?: string[]
}


'use client'

import {useState, useEffect, useRef} from 'react';
import SimpleCheckbox from './simpleCheckbox';
import SimpleInput from './simpleInput';
import Question from './questionComponent'
import io from 'socket.io-client'
import PrimaryButton from './primaryButton';
import SecondaryButton from './secondaryButton';
import useAuthStore from '@/store/store';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Cookies from 'js-cookie';

const QuestionGenerator = () => {

    let fetchURL: string

    if (process.env.NODE_ENV === 'development') {
        fetchURL = 'localhost:9000/api'
    } else {
        fetchURL = 'www.quizzipio.com/api'
    }

    //zustand global state references ###########################################################################################################################################
    const { auth } = useAuthStore();

    //refs ###########################################################################################################################################
    const tabBar = useRef<any>(null)

    //state ###############################################################################################################################################
    const [clientSocketId, setClientSocketId] = useState('')
    const [requestStatus, setRequestStatus] = useState('');
    const [questions, setQuestions] = useState<question[]>([]);
    const [getQuestionsButtonState, setGetQuestionsButtonState] = useState({
        buttonText: 'Get Questions',
        buttonDisabled: false,
    });
    const [saveButtonStatus, setSaveButtonStatus] = useState({
        status: false,
        text: '',
    })
    const [tabBarState, setTabBarState] = useState<'right' | 'left'>('left')
    const [contentFormatState, setContentFormatState] = useState<contentFormatState>('youtubeURL')
    const [fileUpload, setFileUpload] = useState<null | File>(null)
    const [inputState, setInputState] = useState({
        youtubeUrl: '',
        difficultyLevel: 'easy',
        multipleChoiceNumber: '0',
        shortAnswerNumber: '0',
        trueOrFalseNumber: '0',
        plainTextInput: '',
        questionsLabel: '',
    });
    const [checkboxState, setCheckboxState] = useState({
        multipleChoiceCheckbox: false,
        shortAnswerCheckbox: false,
        trueOrFalseCheckbox: false,
        provideAnswers: false,
    });

    //side effect handlers ##############################################################################################################################################
    useEffect(() => {
        const socket = io(`https://${fetchURL}`)

        socket.on('connect', () => {
            setClientSocketId(socket.id);
        })

        socket.on('questionGenerated', (msg) => {
            setRequestStatus(msg);
        })

        return () => {
            socket.removeAllListeners()
        }
    }, [])

    //functions and handlers ##############################################################################################################################################

    const handleContentFormatState = (e:React.MouseEvent<HTMLButtonElement>) => {
        const value = (e.target as HTMLButtonElement).value as contentFormatState
        setContentFormatState(value)
    };

    const handleFileUploadChange = (e: any) => {
        setFileUpload(e.target.files[0]);
    }

    const handleInputChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLTextAreaElement>) => {
        let value: string | number = (e.target as HTMLInputElement).value
        if ((e.target as HTMLInputElement).type === 'number') {
            value = parseInt(value);
            const { min, max } = (e.target as HTMLInputElement)
            value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        }
        setInputState({
            ...inputState,
            [(e.target as HTMLInputElement).name]: value,
        });
    };

    const handleCheckboxChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).checked;
        setCheckboxState({
          ...checkboxState,
          [(e.target as HTMLInputElement).name]: value
        });
    };

    const scrollTabBar = (e:React.MouseEvent<HTMLButtonElement>) => {
        if ((e.target as HTMLInputElement).id === 'scrollRight') {
            tabBar.current.scrollLeft += 1000;
            if (tabBar.current.scrollLeft > 0) {
                setTabBarState('right');
            } 
        } else {
            tabBar.current.scrollLeft -= 1000;
            if (tabBar.current.scrollLeft === 0) {
                setTabBarState('left');
            } 
        }
    }

    const clearInputState = () => {
        setInputState({
            ...inputState,
            youtubeUrl: '',
            difficultyLevel: 'easy',
            multipleChoiceNumber: '0',
            shortAnswerNumber: '0',
            trueOrFalseNumber: '0',
            questionsLabel: '',
        });
    }

    const clearCheckboxState = () => {
        setCheckboxState({
            multipleChoiceCheckbox: false,
            shortAnswerCheckbox: false,
            trueOrFalseCheckbox: false,
            provideAnswers: false,
        });
    }

    const clearFormInput = () => {
        clearCheckboxState();
        clearInputState();
        setContentFormatState('youtubeURL')
    }

    const getData = () => {
        const formData = new FormData();
        formData.append("contentInputType", contentFormatState);
        formData.append("difficultyLevel", inputState.difficultyLevel);
        formData.append("mcNum", inputState.multipleChoiceNumber);
        formData.append("saNum", inputState.shortAnswerNumber);
        formData.append("tfNum", inputState.trueOrFalseNumber);
        formData.append("clientSocketId", clientSocketId);
        if (contentFormatState === 'youtubeURL') {
            formData.append("contentInput", inputState.youtubeUrl)
        } else if (contentFormatState === 'text') {
            formData.append("contentInput", inputState.plainTextInput);
        } else if (contentFormatState === 'pdf' || contentFormatState === 'doc' || contentFormatState === 'ppt') {
            formData.append('fileUpload', fileUpload as File)
        }
        setGetQuestionsButtonState({
            buttonDisabled: true,
            buttonText: 'Loading your questions... Please wait...',
        })
        setSaveButtonStatus({
            status: false,
            text: ''
        })
        setRequestStatus('');
        setQuestions([]);
        
        fetch(`https://${fetchURL}/question-generator`, {
            method: 'POST',
            body: formData,
        })
        .then((res) => {
            clearFormInput();
            return res.json();
        })
        .then((res) => {
            setRequestStatus(res.requestStatus);
            setQuestions(res.questions);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setGetQuestionsButtonState({
                buttonDisabled: false,
                buttonText: 'Get Questions',
            })
        })
    }

    const saveTest = () => {

        const test = {
            testLabel: inputState.questionsLabel,
            test: questions
        }

        fetch(`https://${fetchURL}/users/lib/save/${Cookies.get('QUIZZIP-AUTH')}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(test),
        })
        .then((res) => {
            if (res.ok) {
                setSaveButtonStatus({
                    status: true,
                    text: 'Save success!'
                });
            } else {
                setSaveButtonStatus({
                    status: false,
                    text: 'Save didn\'t work, please try again.'
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
    } 

    let contentInput
    let submitSection

    if (contentFormatState === 'youtubeURL') {
        contentInput = (
            <>
                <p className="mb-2">Please enter the youtube video URL you wish to use:</p>
                <SimpleInput name="youtubeUrl" onChange={handleInputChange} label="Youtube Url" placeholder="Enter Youtube url here" value={inputState.youtubeUrl}/>
            </>
        ) 
    } else if (contentFormatState === 'text') {
        contentInput = (
            <>
                <p className="mb-2">Please enter the text you would like to use:</p>
                <label htmlFor="plainTextInput" className="text-xs">Text Content:</label>
                <textarea onChange={handleInputChange} value={inputState.plainTextInput} placeholder="Enter Text Content Here" name="plainTextInput" className="w-full pr-2 border-slate-500 p-2 border-2 rounded block mb-4 bg-slate-900" />
            </>
        )
    } else if (contentFormatState === 'pdf') {
        contentInput = (
            <>
                <p className="mb-2">Please upload the PDF document file you would like to use:</p>
                <label htmlFor="pdfFile" className="text-xs">PDF Document:</label>
                <input key={'pdf-input'} accept=".pdf" onChange={handleFileUploadChange} type="file" name="pdfFile" className="pr-2 border-slate-500 p-2 border-2 rounded block mb-4 w-full lg:w-auto" />
            </>
        )
    } else if (contentFormatState === 'doc') {
        contentInput = (
            <>
                <p className="mb-2">Please upload the .docx Word document file you would like to use:</p>
                <label htmlFor="wordFile" className="text-xs">.docx Word Document:</label>
                <input key={'doc-input'} accept=".doc, .docx" onChange={handleFileUploadChange} type="file" name="wordFile" className="pr-2 border-slate-500 p-2 border-2 rounded block mb-4 w-full lg:w-auto" />
            </>
        )
    } else if (contentFormatState === 'ppt') {
        contentInput = (
            <>
                <p className="mb-2">Please upload the .pptx Powerpoint document file you would like to use:</p>
                <label htmlFor="pptFile" className="text-xs">.pptx Powerpoint Document:</label>
                <input key={'ppt-input'} accept=".ppt, .pptx" onChange={handleFileUploadChange} type="file" name="pptFile" className="pr-2 border-slate-500 p-2 border-2 rounded block mb-4 w-full lg:w-auto" />
            </>
        )
    }

    if (auth === 'auth') {
        submitSection = (
            <div className="flex flex-wrap mt-5">
                <PrimaryButton extra_classes="mr-4 mb-2" onClick={getData} disabled={getQuestionsButtonState.buttonDisabled}>{getQuestionsButtonState.buttonText}</PrimaryButton>
                <SecondaryButton extra_classes="mb-2" onClick={clearFormInput}>Clear All Parameters</SecondaryButton>
            </div>
        )
    } else if (auth === 'not-auth') {
        submitSection = (
            <div className="flex flex-wrap mt-5">
                <PrimaryButton extra_classes="mr-4 mb-2" onClick={getData} disabled={true}>Please sign in first to start!</PrimaryButton>
                <SecondaryButton extra_classes="mb-2" onClick={clearFormInput}>Clear All Parameters</SecondaryButton>
            </div>
        )
    } else {
        <Skeleton className="!w-20" baseColor="#0f172a" highlightColor="#334155"/>
    }

    return (
        <div className="w-full px-4 flex flex-col lg:flex-row justify-between">

            <div className="w-full lg:w-1/2 lg:pr-4 border-0 lg:border-r border-slate-800">

                <div className="relative w-full top-1.5">
                    {tabBarState === 'right' ? <button id="scrollLeft" onClick={scrollTabBar} className="absolute left-0 pl-2 pr-8 bg-gradient-to-r from-slate-900 via-slate-900 to-100%"> - </button> : null}
                    {tabBarState === 'left' ? <button id="scrollRight" onClick={scrollTabBar} className="absolute right-0 pr-2 pl-8 bg-gradient-to-r from-transparent via-slate-900 to-slate-900"> + </button> : null}
                </div>

                <div className="flex mb-4 overflow-x-scroll no-scrollbar" ref={tabBar}>
                    <button value="youtubeURL" onClick={handleContentFormatState} className={`whitespace-nowrap border-b ${contentFormatState === 'youtubeURL' ? 'font-bold' : ''} border-slate-500 p-2 block text-sm hover:font-bold`}>Use Youtube URL</button>
                    <button value="text" onClick={handleContentFormatState} className={`whitespace-nowrap border-b ${contentFormatState === 'text' ? 'font-bold' : ''} border-slate-500 p-2 block text-sm hover:font-bold`}>Use Text Content</button>
                    <button value="pdf" onClick={handleContentFormatState} className={`whitespace-nowrap border-b ${contentFormatState === 'pdf' ? 'font-bold' : ''} border-slate-500 p-2 block text-sm hover:font-bold`}>Upload PDF File</button>
                    <button value="doc" onClick={handleContentFormatState} className={`whitespace-nowrap border-b ${contentFormatState === 'doc' ? 'font-bold' : ''} border-slate-500 p-2 block text-sm hover:font-bold`}>Upload Word Document File</button>
                    <button value="ppt" onClick={handleContentFormatState} className={`whitespace-nowrap border-b ${contentFormatState === 'ppt' ? 'font-bold' : ''} border-slate-500 p-2 block text-sm hover:font-bold`}>Upload Powerpoint Document File</button>
                </div>

                {contentInput}

                <p className="mb-2">Please set the difficulty level:</p>
                <label htmlFor="difficultyLevel" className="text-xs">Difficulty Level</label>
                <select onChange={handleInputChange} name="difficultyLevel" className="mr-5 border-slate-500 p-2 border-2 rounded block mb-4 bg-slate-900">
                    <option value="easy">Easy</option>
                    <option value="advanced">Advanced</option>
                </select>

                <p className="mb-2">Please choose the types of questions you would like to use: </p>
                <SimpleCheckbox onChange={handleCheckboxChange} checkedState={checkboxState.multipleChoiceCheckbox} name="multipleChoiceCheckbox" label="Multiple Choice" extra_classes="mb-2"/>
                <SimpleCheckbox onChange={handleCheckboxChange} checkedState={checkboxState.shortAnswerCheckbox} name="shortAnswerCheckbox" label="Short Answer" extra_classes="mb-2"/>
                <SimpleCheckbox onChange={handleCheckboxChange} checkedState={checkboxState.trueOrFalseCheckbox} name="trueOrFalseCheckbox" label="True or False" extra_classes="mb-2"/>
                
                {checkboxState.multipleChoiceCheckbox ? <SimpleInput type="number" name="multipleChoiceNumber" onChange={handleInputChange} label="Please enter the # of Multiple Choice Questions you want (max 15):" placeholder="Enter # here" value={inputState.multipleChoiceNumber}/> : null}
                {checkboxState.shortAnswerCheckbox ? <SimpleInput type="number" name="shortAnswerNumber" onChange={handleInputChange} label="Please enter the # of Short Answer Questions you want (max 15):" placeholder="Enter # here" value={inputState.shortAnswerNumber}/> : null}
                {checkboxState.trueOrFalseCheckbox ? <SimpleInput type="number" name="trueOrFalseNumber" onChange={handleInputChange} label="Please enter the # of True or False Questions you want (max 15):" placeholder="Enter # here" value={inputState.trueOrFalseNumber}/> : null}
                
                {submitSection}
                <p className="text-xs mb-8">{requestStatus}</p> 

            </div>
            
            <div className="w-full lg:w-1/2 lg:pl-4"> 
                {questions.length
                ? <> 
                <SimpleCheckbox onChange={handleCheckboxChange} checkedState={checkboxState.provideAnswers} name="provideAnswers" label="Provide me answers as well." extra_classes="py-2 border-b text-sm mb-4 border-slate-500"/>
                {
                    saveButtonStatus.status ?
                    null :
                    <div className="flex gap-0 sm:gap-3 flex-col sm:flex-row mb-2">
                        <SimpleInput extra_classes="mr-0 w-full sm:w-80 !mb-0" name="questionsLabel" onChange={handleInputChange} placeholder="Enter a name for this assessment" value={inputState.questionsLabel}></SimpleInput>
                        <PrimaryButton onClick={saveTest} disabled={inputState.questionsLabel.length ? false : true}>Save to Library</PrimaryButton>
                    </div>
                }
                <p className="text-xs mb-4">{saveButtonStatus.text}</p> 
                <div className="overflow-y-hidden mb-6">
                    {questions.map((question, i) => <Question key={i} question={question} showAnswers={checkboxState.provideAnswers}/>)}
                </div>
                </> :
                <div className="h-80 lg:h-full w-full flex items-center rounded-lg justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-slate-900 to-slate-900">
                    <p className="italic text-sm font-semibold">Your questions will show up here</p>
                </div>
                }

            </div>

        </div>
    )
}

export default QuestionGenerator