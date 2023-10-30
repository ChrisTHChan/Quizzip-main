import express from 'express';
import { saveTestToLib, getTestLibraryData, deleteTestFromLibrary, ExportTestFromLibrary } from '../controllers/libary';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/users/lib/save/:sessionId', isAuthenticated, isOwner, saveTestToLib);
    router.get('/users/lib/:sessionId', isAuthenticated, isOwner, getTestLibraryData);
    router.delete('/users/lib/:sessionId', isAuthenticated, isOwner, deleteTestFromLibrary)
    router.post('/users/lib/export/:sessionId', isAuthenticated, isOwner, ExportTestFromLibrary)
}