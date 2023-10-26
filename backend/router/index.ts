import express from 'express';
import authentication from './authentication';
import questionGenerationRoute from './question-generator'
import getAllUsers from './users'
import libraryRoutes from './library'

const router = express.Router();

export default ():express.Router => {
    authentication(router);
    questionGenerationRoute(router);
    getAllUsers(router);
    libraryRoutes(router);
    return router;
}