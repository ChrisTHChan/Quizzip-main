import express from 'express';
import { saveTestToLib, getTestLibraryData, deleteTestFromLibrary } from '../controllers/libary';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/users/lib/save/:sessionId', isAuthenticated, isOwner, saveTestToLib);
    router.get('/users/lib/:sessionId', isAuthenticated, isOwner, getTestLibraryData);
    router.delete('/users/lib/:sessionId', isAuthenticated, isOwner, deleteTestFromLibrary)
}