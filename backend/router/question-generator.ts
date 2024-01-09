import express from 'express';
import questionGeneration from '../controllers/question-generator';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/api/question-generator/:sessionId', isAuthenticated, isOwner, questionGeneration)
}