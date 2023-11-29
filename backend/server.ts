//TODO EVENTUALLY
//add mp3 file upload

//server dependencies
import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
require('dotenv').config()
import http from 'http';
import {Server} from 'socket.io'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

//importing routes
import router from './router'

//server setup
const app = express();
const server = http.createServer(app)
app.use(fileUpload());
app.use(compression());
app.use(cookieParser());

let io:Server
if (process.env.NODE_ENV === 'development') {

    console.log('in development mode');

    app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

    io =  new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
        path: '/socket.io'
    })
} else {

    console.log('in production mode')

    io = new Server(server, {
        path: '/socket.io/',
    });
}

app.use(express.json({limit: '1mb'}));
server.listen(9000, () => {
    console.log('server is running')
})

//setup mongodb connection
let mongoUrl = process.env.MONGO_URL as string
mongoose.connect(mongoUrl).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
})

//setup nodemailer configuration and methods
let secure

if (process.env.NODE_ENV === 'development') { 
    secure = false
} else {
    secure = true
}

const nodemailerConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: secure,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    }
}

export const sendEmail = (data: any) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);
    transporter.sendMail(data, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            return info.response;
        }
    })
}

//io websocket methods
// app.io = io; //do we really need this for req.app.io.emit in routes? we can just do io.emit from the io server.
export const emitQuestionGenState = (i: number, totalNumQuestions: number, socketId: string) => {
    io.to(socketId).emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
}

//setup routes
app.use('/', router())