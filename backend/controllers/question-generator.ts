import express from 'express';
import { UploadedFile } from 'express-fileupload';
import { splitString, fetchTranscript, generateQuestions } from '../helpers/helper-functions';
import officeParser from 'officeparser'
import pdfParse from 'pdf-parse'
import { emitQuestionGenState } from '../server';
import { 
    contentFormatState, 
    question 
} from '../types';

export default async (req: express.Request, res: express.Response) => {
    console.log('starting generation ###################################')

    const questionsList:question[] = [];
    const inputType:contentFormatState = req.body.contentInputType;
    const contentInput:string | undefined = req.body.contentInput;
    const difficultyLevel: string =  req.body.difficultyLevel;
    const mcNum:number = parseInt(req.body.mcNum);
    const saNum:number = parseInt(req.body.saNum);
    const tfNum:number = parseInt(req.body.tfNum);
    const clientSocketId = req.body.clientSocketId;
    let fileUploadBuffer!: Buffer;
    if (req.files) {
        const upload = req.files.fileUpload as UploadedFile;
        fileUploadBuffer = upload.data
    }

    const setupQuestionsReturn = (questions: string) => {
        const dataObject = JSON.parse(questions);
        const question = dataObject[0]
        questionsList.push(question);
    }

    try {
        let transcript: string = '';
        if (inputType === 'youtubeURL') {
            transcript = await fetchTranscript(contentInput as string);
        } else if (inputType === 'text') {
            if (contentInput) {
                transcript = contentInput;
            } else {
                throw new Error("Please add some text content to use.")
            }
        } else if (inputType === 'pdf') {
            if (fileUploadBuffer) {
                const result = await pdfParse(fileUploadBuffer);
                transcript = result.text;
            } else {
                throw new Error("Please add a file.") 
            }
        } else if (inputType === 'doc' || inputType === 'ppt') {
            if (fileUploadBuffer) {
                const data = await officeParser.parseOfficeAsync(fileUploadBuffer);
                transcript = data
            } else {
                throw new Error("Please add a file.") 
            }
        }

        const totalNumQuestions:number = mcNum + saNum + tfNum;
        const listOfTranscriptSlices:string[] = splitString(transcript, totalNumQuestions)
        let lastGeneratedType:number = 0

        if (mcNum === 0 && saNum === 0 && tfNum === 0) {
            throw new Error("No question type selected.")
        } else {
            if (mcNum > 0) {
                for (let i = lastGeneratedType; i < lastGeneratedType + mcNum; i++) {
                    emitQuestionGenState(i, totalNumQuestions, clientSocketId);
                    const questions = await generateQuestions('multiple choice', listOfTranscriptSlices[i], difficultyLevel);
                    setupQuestionsReturn(questions)
                }

                lastGeneratedType += mcNum
            }

            if (saNum > 0) {
                for (let i = lastGeneratedType; i < lastGeneratedType + saNum; i++) {
                    emitQuestionGenState(i, totalNumQuestions, clientSocketId);
                    const questions = await generateQuestions('short answer', listOfTranscriptSlices[i], difficultyLevel);
                    setupQuestionsReturn(questions)
                }

                lastGeneratedType += saNum
            }

            if (tfNum > 0) {
                for (let i = lastGeneratedType; i < lastGeneratedType + tfNum; i++) {
                    emitQuestionGenState(i, totalNumQuestions, clientSocketId);
                    const questions = await generateQuestions('true or false', listOfTranscriptSlices[i], difficultyLevel);
                    setupQuestionsReturn(questions)
                }

                lastGeneratedType += tfNum
            }
        }

        res.status(200).json({
            requestStatus: 'success!',
            questions: questionsList,
        }).end();

    } catch (error: any) {
        console.log(error)

        let errorString = ''

        if (error.message.includes('Unexpected token')) {
            errorString = 'Something went wrong on our side... please try again.' 
        } else {
            errorString = error.message
        }

        res.status(400).json({
            requestStatus: `Request failed: ${errorString}`,
            questions: []
        }).end();
    }
}