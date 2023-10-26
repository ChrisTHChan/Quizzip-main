import express from 'express';
import { getUserBySessionToken } from '../db/users';

export const saveTestToLib = async (req: express.Request, res: express.Response) => {
    try {

        const sessionId = req.params.sessionId
        const body = req.body.test

        console.log(body);

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("No such user.") 
        }

        user.testsLibrary.push({
            testLabel: req.body.testLabel, 
            test: req.body.test,
        })

        await user.save()

        return res.status(200).json({
            saveRequestStatus: 'Test saved successfully!',
        });

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            saveRequestStatus: "Test failed to save. Please try again."
        })
    }
}