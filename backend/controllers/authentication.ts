import express from 'express';
import { createUser, getUserByEmail, getUserBySessionToken, createForgotPasswordPasscode, getForgotPasswordObjectByEmail, deleteForgotPasswordObjectByEmail } from '../db/users';
import { random, authentication } from '../helpers/auth-helpers';
import { validateEmail } from '../helpers/helper-functions';
import { sendEmail } from '../server';

export const checkUserSessionToken = async (req: express.Request, res: express.Response) => {
    try {
        
        const { sessionId } =  req.params;

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("No such user.") 
        }

        return res.status(200).end();

    } catch (error: any) {
        console.log(error)
        return res.status(403).end()
    }
}

export const validateAndResetPassword = async (req: express.Request, res: express.Response) => {
    try {

        const {email, hashedEmail, password, passcodeNumber} = req.body

        const forgotPasswordObject = await getForgotPasswordObjectByEmail(email)

        if (!forgotPasswordObject) {
            throw new Error('This user doesn\'t exist.')
        }

        const expectedHashedEmail = authentication(forgotPasswordObject.salt, email)

        if (expectedHashedEmail !== hashedEmail) {
            throw new Error('The email is incorrect.')
        }

        if (parseInt(passcodeNumber) !== forgotPasswordObject.passcode) {
            throw new Error('The passcode is incorrect.')
        }

        const user = await getUserByEmail(email);
        const salt = random();
        const newPasswordHash = authentication(salt, password)

        user!.authentication!.salt = salt
        user!.authentication!.password = newPasswordHash

        await user!.save()

        await deleteForgotPasswordObjectByEmail(email);

        res.status(200).json({
            callStatus: 'Password was reset successfully!'
        })

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            callStatus: `Password reset failed: ${error.message}`
        });
    }
}

export const sendForgotPasswordEmail = async (req: express.Request, res: express.Response) => {
    try {

        let resetLink

        if (process.env.NODE_ENV === 'development') {
            resetLink = 'localhost:3000'
        } else {
            resetLink = 'quizzipio.com'
        }

        const { email } = req.body;

        if (!email) {
            throw new Error('You did not provide an email.')
        }

        const user = await getUserByEmail(email)

        if (!user) {
            throw new Error("This user doesn't exist, please check your email again.") 
        }

        const oneTimePasscode = Math.floor(100000 + Math.random() * 900000)

        const salt = random();
        const hashedEmail = authentication(salt, email)

        await createForgotPasswordPasscode({
            email: email,
            salt: salt,
            passcode: oneTimePasscode,
            expirationDate: Date.now() + (15 * 60 * 1000) //15 min
        })

        await sendEmail({
            "from": "quizzipio@gmail.com",
            "to": email,
            "subject": "Password Reset Request",
            "html": `
                <p>Hello there ${user.username}!</p>
                <p>we got a message saying you forgot your password.</p>
                <p>Please go to the following link and use the following temporary 6 digit passcode number to reset your password. The passcode will last 15 minutes.</p>
                <ul>
                    <li><i><strong>Passcode:</strong></i> ${oneTimePasscode}</li>
                    <li><i><strong>Link:</strong></i> ${resetLink}/reset-password/${hashedEmail}</li>
                </ul>
                <p>The QuizzipIO Team</p>
                <i><strong>This is an automatated message sent in response to a password reset request.</strong></i>
            `
        })

        res.status(200).json({
            callStatus: 'Email sent successfully! Please check your email.'
        })

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            callStatus: `Email Failed to Send: ${error.message}`
        });
    }
}

export const logout = async (req: express.Request, res: express.Response) => {
    try {

        const { sessionId } =  req.params;

        const user = await getUserBySessionToken(sessionId);

        if (!user) {
            throw new Error("You are not logged in.") 
        }

        user.authentication!.sessionToken = ''

        await user.save()

        res.clearCookie("QUIZZIP-AUTH");

        return res.status(200).end();

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            signInStatus: `Logout failed: ${error.message}`
        });
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password } = req.body;

        const currentCookie = req.cookies['QUIZZIP-AUTH'];

        if (!email || !password) {
            throw new Error("Please make sure all fields are filled in.") 
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password +authentication.sessionToken')

        if (!user) {
            throw new Error("This user doesn't exist, please check your email or password.") 
        }

        if (user.authentication!.sessionToken && user.authentication!.sessionToken === currentCookie) {
            throw new Error("You are already logged in.")
        }

        const expectedHash = authentication(user.authentication!.salt as string, password)

        if (user.authentication!.password !== expectedHash) {
            throw new Error("This user doesn't exist, please check your email or password.") 
        } 

        const salt = random()

        user.authentication!.sessionToken = authentication(salt, user._id.toString())

        await user.save()

        res.cookie('QUIZZIP-AUTH', user.authentication!.sessionToken);

        return res.status(200).json({
            signInStatus: `Sign in successful.`
        });

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            signInStatus: `Sign in failed: ${error.message}`
        });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body

        if (!email || !password || !username) {
            throw new Error("Please make sure all fields are filled in.") 
        }

        if (!validateEmail(email)) {
            throw new Error("Please use a valid email.") 
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw new Error("This user already exists.") 
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

        return res.status(200).json({
            registrationStatus: `Registration successful. Please login through the login page now.`
        });

    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            registrationStatus: `Registration failed: ${error.message}`
        });
    }
}