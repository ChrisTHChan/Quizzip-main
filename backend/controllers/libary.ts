import express from 'express';
import { getUserBySessionToken } from '../db/users';
import PDFDocument from 'pdfkit';
import fs from 'fs'
import { question } from '../types'

const returnTestLibrary = async (sessionId: string, res: express.Response) => {
    const testLibrary = await getUserBySessionToken(sessionId).select('testsLibrary')

    res.status(200).json({
        testLibrary: testLibrary
    })
} 

export const exportTestPDF = async (req: express.Request, res: express.Response) => {
    try {
        const testId = req.params.testId
        const path = `./_temp-assessment-folder/assessment-${testId}.pdf`

        console.log('exporting test')

        res.status(200).download(path, () => {
            fs.unlinkSync(path)
            console.log('');
        });
    } catch (error: any) {
        console.log(error)
        return res.status(400).end();
    }
}

export const generateTestPDF = async (req: express.Request, res: express.Response) => {
    try {
        const body = req.body

        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(`./_temp-assessment-folder/assessment-${body._id}.pdf`));

        doc.fontSize(28).text(body.testLabel)
        doc.moveDown()
        body.test.forEach((question: question) => {
            doc.fontSize(14).text(question.question)
            doc.moveDown()
            if (question.choices!.length > 0) {
                question.choices?.forEach((choice, i) => {
                    doc.fontSize(12).text(`${i}) ${choice}`)
                })
            } else {
                doc.moveDown(4)
            }
            doc.moveDown();
        })

        doc.end()

        console.log('generating test')

        res.status(200).end();

    } catch (error: any) {
        console.log(error)
        return res.status(400).end()
    }
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