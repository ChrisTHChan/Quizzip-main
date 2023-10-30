import express from 'express';
import { saveTestToLib, getTestLibraryData, deleteTestFromLibrary, generateTestPDF, exportTestPDF, generateTestAnswersPDF, exportTestAnswersPDF } from '../controllers/libary';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.post('/users/lib/save/:sessionId', isAuthenticated, isOwner, saveTestToLib);
    router.get('/users/lib/:sessionId', isAuthenticated, isOwner, getTestLibraryData);
    router.delete('/users/lib/:sessionId', isAuthenticated, isOwner, deleteTestFromLibrary);
    router.post('/users/lib/create-test-pdf/:sessionId', isAuthenticated, isOwner, generateTestPDF);
    router.get('/users/lib/export-test-pdf/:sessionId/:testId', isAuthenticated, isOwner, exportTestPDF);
    router.post('/users/lib/create-answers-pdf/:sessionId', isAuthenticated, isOwner, generateTestAnswersPDF);
    router.get('/users/lib/export-answers-pdf/:sessionId/:testId', isAuthenticated, isOwner, exportTestAnswersPDF);
}