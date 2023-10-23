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
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(express.json({limit: '1mb'}));
server.listen(9000, () => {
    console.log('server is running')
})

//setup mongodb connection
let mongoUrl = process.env.MONGO_URL as string
mongoose.connect(mongoUrl);
mongoose.connection.on('error', (error:any) => {
    console.log(error);
})

//io websocket methods

// app.io = io; //do we really need this for req.app.io.emit in routes? we can just do io.emit from the io server.
// io.on('connection', (socket:any) => {
//     console.log('yay')
// })
export const emitQuestionGenState = (i: number, totalNumQuestions: number) => {
    io.emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
}

//setup routes
app.use('/', router())