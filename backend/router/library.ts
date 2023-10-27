import express from 'express';
import { saveTestToLib, getTestLibraryData } from '../controllers/libary';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/users/lib/save/:sessionId', isAuthenticated, isOwner, saveTestToLib);
    router.get('/users/lib/:sessionId', isAuthenticated, isOwner, getTestLibraryData);
}