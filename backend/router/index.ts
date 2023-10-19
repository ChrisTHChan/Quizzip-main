import express from 'express';
import authRegisterRoute from './authentication';
import questionGenerationRoute from './question-generator'

const router = express.Router();

export default ():express.Router => {
    authRegisterRoute(router);
    questionGenerationRoute(router);
    return router;
}