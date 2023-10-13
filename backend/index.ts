//hide essential api keys
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
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } =  require('socket.io');
const server = http.createServer(app)
const cors = require('cors');
const io =  new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})

// app.io = io; //do we really need this for req.app.io.emit in routes? we can just do io.emit from the io server.


app.use(fileUpload());
app.use(cors());
app.use(express.json({limit: '1mb'}));

server.listen(9000, () => {
    console.log('server is running')
})

//server libraries required to do actual stuff
const fs = require('fs');
const openAI = require('openai');
const pdfParse = require('pdf-parse');
const officeParser = require('officeparser');
const helperFunctions = require('./helper-functions')
const { YoutubeTranscript } = require('youtube-transcript')
const openai = new openAI({
    apiKey: process.env.OPEN_AI_KEY,
});

// io.on('connection', (socket:any) => {
//     console.log('yay')
// })

//setup mongodb connection

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error:any) => {
    console.log(error);
})

//fix req, res type any
app.post('/api', (req: any, res: any) => {

    const inputType:contentFormatState = req.body.contentInputType;
    const contentInput:string | undefined = req.body.contentInput;
    const difficultyLevel: string =  req.body.difficultyLevel;
    const mcNum:number = parseInt(req.body.mcNum);
    const saNum:number = parseInt(req.body.saNum);
    const tfNum:number = parseInt(req.body.tfNum);
    let fileUploadBuffer: string;
    if (req.files) {
        fileUploadBuffer = req.files.fileUpload.data;
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

        let questions: string = completion.choices[0].message.content;
        
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
            let transcript
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
            const listOfTranscriptSlices:string[] = helperFunctions.splitString(transcript, totalNumQuestions)
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