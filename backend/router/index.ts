import express from 'express';
import authRegister from './authentication';

const router = express.Router();

export default ():express.Router => {
    authRegister(router);
    return router;
}