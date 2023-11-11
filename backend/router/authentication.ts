import express from 'express';
import { register, login, logout, checkUserSessionToken } from '../controllers/authentication';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/api/auth/register', register);
    router.post('/api/auth/login', login)
    router.post('/api/auth/logout/:sessionId', isAuthenticated, isOwner, logout);
    router.post('/api/auth/checkUserSession/:sessionId', isAuthenticated, isOwner, checkUserSessionToken);
}