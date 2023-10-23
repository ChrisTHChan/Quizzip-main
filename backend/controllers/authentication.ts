import express from 'express';
import { createUser, getUserByEmail, getUserById } from '../db/users';
import { random, authentication } from '../helpers/auth-helpers';

export const logout = async (req: express.Request, res: express.Response) => {
    try {

        const { id } =  req.params;

        const user = await getUserById(id);

        if (!user) {
            return res.sendStatus(400);
        }

        user.authentication!.sessionToken = authentication(random(), user._id.toString())

        await user.save()

        res.cookie('QUIZZIP-AUTH', authentication(random(), user._id.toString()))

        res.json(user);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication!.salt as string, password)

        if (user.authentication!.password !== expectedHash) {
            return res.sendStatus(403);
        } 

        const salt = random()

        user.authentication!.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('QUIZZIP-AUTH', user.authentication!.sessionToken, { domain: 'localhost', path: '/'})

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body

        console.log(req.body);

        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },

        })

        return res.json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}