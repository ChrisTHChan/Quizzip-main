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
app.use(fileUpload());
app.use(compression());
app.use(cookieParser());

// console.log(app.get('env'))

// let io:Server
// if (app.get('env') === 'development') {

//     console.log('in development mode');

//     app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

//     io =  new Server(server, {
//         cors: {
//             origin: "http://localhost:3000",
//             methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         }
//     })
// } else {
    // io = new Server(server, {
    //     path: '/socket.io/',
    // });
// }

const io = new Server(server, {
    path: '/socket.io/',
});

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

//io websocket methods

io.on('connection', () => {
    console.log('connecting socket io server')
})

io.on("connect_error", (err) => {
    console.log('socketio connection failed');
    console.log(`connect_error due to ${err.message}`);
  });

// app.io = io; //do we really need this for req.app.io.emit in routes? we can just do io.emit from the io server.
export const emitQuestionGenState = (i: number, totalNumQuestions: number, socketId: string) => {
    io.to(socketId).emit('questionGenerated', `Generating question ${i + 1} of ${totalNumQuestions}...`);
}

//setup routes
app.use('/', router())