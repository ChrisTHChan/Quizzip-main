import express from 'express';
import { getUserBySessionToken } from '../db/users';
import PDFDocument from 'pdfkit';
import fs from 'fs'

const returnTestLibrary = async (sessionId: string, res: express.Response) => {
    const testLibrary = await getUserBySessionToken(sessionId).select('testsLibrary')

    res.status(200).json({
        testLibrary: testLibrary
    })
} 

export const ExportTestFromLibrary = async (req: express.Request, res: express.Response) => {
    const body = req.body
    console.log(body.testLabel.split(' ').join('_'), body._id);
}

export const deleteTestFromLibrary = async (req: express.Request, res: express.Response) => {
    try {
        const sessionId = req.params.sessionId;
        const testId = req.body.testId;

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("No such user.") 
        }

        const index = user.testsLibrary.findIndex((element) => {
            return element.id === testId
        })

        user.testsLibrary.splice(index, 1)  

        await user.save()

        returnTestLibrary(sessionId, res)

    } catch (error: any) {
        console.log(error)
        return res.status(400).end()
    }
}

export const getTestLibraryData = async (req: express.Request, res: express.Response) => {
    try {

        const sessionId = req.params.sessionId;

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("No such user.") 
        }

        returnTestLibrary(sessionId, res)

    } catch (error: any) {
        console.log(error)
        return res.status(400).end()
    }
}

export const saveTestToLib = async (req: express.Request, res: express.Response) => {
    try {

        const sessionId = req.params.sessionId
        const body = req.body

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("No such user.") 
        }

        user.testsLibrary.push({
            testLabel: body.testLabel, 
            test: body.test,
        })

        await user.save()

        return res.status(200).end();

    } catch (error: any) {
        console.log(error)
        return res.status(400).end();
    }
}