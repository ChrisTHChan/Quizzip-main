//TODO EVENTUALLY
//add mp3 file upload

type transcriptPiece = {
    text: string,
    duration: number,
    offset: number
}

type question = {
        question: string,
        answer: string,
        choices?: string[]
}

type contentFormatState = 'youtubeURL' | 'text' | 'pdf' | 'doc' | 'ppt'

//server dependencies
import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';
require('dotenv').config()
import http from 'http';
import {Server} from 'socket.io'
import cors from 'cors'

//server libraries required to do actual stuff
import openAI from 'openai'
import { splitString } from './helpers/helper-functions';
import officeParser from 'officeparser'
import pdfParse from 'pdf-parse'
import { YoutubeTranscript } from 'youtube-transcript'

//importing routes
import router from './router'

//server setup
const app = express();
const server = http.createServer(app)
const io =  new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})
app.use(fileUpload());
app.use(cors());
app.use(express.json({limit: '1mb'}));
server.listen(9000, () => {
    console.log('server is running')
})

// app.io = io; //do we really need this for req.app.io.emit in routes? we can just do io.emit from the io server.
// io.on('connection', (socket:any) => {
//     console.log('yay')
// })

//setup chatgpt connection
const openai = new openAI({
    apiKey: process.env.OPEN_AI_KEY,
});

//setup mongodb connection
let mongoUrl = process.env.MONGO_URL as string
mongoose.connect(mongoUrl);
mongoose.connection.on('error', (error:any) => {
    console.log(error);
})

//setup routes
app.use('/', router())

//main question getter
app.post('/api', (req: express.Request, res: express.Response) => {

    const inputType:contentFormatState = req.body.contentInputType;
    const contentInput:string | undefined = req.body.contentInput;
    const difficultyLevel: string =  req.body.difficultyLevel;
    const mcNum:number = parseInt(req.body.mcNum);
    const saNum:number = parseInt(req.body.saNum);
    const tfNum:number = parseInt(req.body.tfNum);
    let fileUploadBuffer: Buffer;
    if (req.files) {
        const upload = req.files.fileUpload as UploadedFile;
        fileUploadBuffer = upload.data
    }

    const fetchTranscript = async (videoUrl: string) => {
        let transcriptString: string = '';
        const transcript = await YoutubeTranscript.fetchTranscript(videoUrl)
        
        transcript.forEach((transcriptPiece: transcriptPiece) => {
            transcriptString += ` ${transcriptPiece.text}`;
        })

        return transcriptString;
    }

    const generateQuestions = async (questionType: 'multiple choice' | 'short answer' | 'true or false', transcript: string) => {    

        const systemSetting = `
            You are assigned to write questions.

            You must use the following JSON format to create the question:
            [
                {
                    "question": "the question", 
                    "answer": "the answer to the question"
                }
            ]

            For multiple choice questions, use the following JSON format:
            [
                {
                    "question": "the first question", 
                    "choices": [
                        "first choice",
                        "second choice",
                        "third choice",
                        "fourth choice"
                    ],
                    "answer": "the correct choice"
                }
            ]
        `.trim()

        const completionString = `
            create one ${difficultyLevel} level question in ${questionType} format.
            The question should be thought provoking.
            The question should allow the person answering to apply their knowledge.
            Multiple choice questions should have multiple plausible answers.
            Provide detailed answers for short answer questions.
        `.trim();
        
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemSetting },
                { role: "user", content: `Use the following information: ${transcript}.` },
                { role: "user", content: completionString }
            ],
            model: "gpt-3.5-turbo",
        });

        let questions: string = completion.choices[0].message.content as string;
        
        return questions;
    }

    const runGeneration = async () => {

        console.log('starting generation ###################################')

        const questionsList:question[] = [];

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
                        io.emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
                        const questions = await generateQuestions('multiple choice', listOfTranscriptSlices[i]);
                        setupQuestionsReturn(questions)
                    }

                    lastGeneratedType += mcNum
                }

                if (saNum > 0) {
                    for (let i = lastGeneratedType; i < lastGeneratedType + saNum; i++) {
                        io.emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
                        const questions = await generateQuestions('short answer', listOfTranscriptSlices[i]);
                        setupQuestionsReturn(questions)
                    }

                    lastGeneratedType += saNum
                }

                if (tfNum > 0) {
                    for (let i = lastGeneratedType; i < lastGeneratedType + tfNum; i++) {
                        io.emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
                        const questions = await generateQuestions('true or false', listOfTranscriptSlices[i]);
                        setupQuestionsReturn(questions)
                    }

                    lastGeneratedType += tfNum
                }
            }

            res.json({
                requestStatus: 'success!',
                questions: questionsList,
            });

        } catch (error: any) {
            console.log(error)

            let errorString = ''

            if (error.message.includes('Unexpected token')) {
                errorString = 'Something went wrong on our side... please try again.' 
            } else {
                errorString = error.message
            }

            res.json({
                requestStatus: `Request failed: ${errorString}`,
                questions: []
            });
        }
    }

    runGeneration();
})