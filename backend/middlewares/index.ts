import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { sessionId } = req.params;

        const currentSessionToken = get(req, 'identity.authentication.sessionToken') as unknown as string

        if (!currentSessionToken) {
            return res.sendStatus(403)
        }

        if (currentSessionToken.toString() !== sessionId) {
            return res.sendStatus(403);
        }

        next()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken =  req.params.sessionId;

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken).select('+authentication.sessionToken')

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser })

        return next();
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}