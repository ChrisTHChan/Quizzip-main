import express from 'express';

export const handleStripeSubscription = (req: express.Request, res: express.Response) => {
    try {

        const { sessionId } = req.params
        console.log('handling stripe sub')

        res.status(200).json({
            requestStatus: 'all good!'
        })

    } catch {
        res.status(400).json({
            requestStatus: 'Something went wrong, please try again'
        })
    }
}