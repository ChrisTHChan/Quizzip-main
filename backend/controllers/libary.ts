import express from 'express';

export const saveTestToLib = (req: express.Request, res: express.Response) => {
    try {

        console.log(req.body);

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