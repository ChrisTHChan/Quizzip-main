import express from 'express';
import { register, login, logout } from '../controllers/authentication';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login)
    router.post('/auth/logout/:id', isAuthenticated, isOwner, logout);
}