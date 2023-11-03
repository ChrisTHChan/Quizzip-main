import express from 'express';
import questionGeneration from '../controllers/question-generator';

export default (router: express.Router) => {
    router.post('/question-generator', questionGeneration)
}