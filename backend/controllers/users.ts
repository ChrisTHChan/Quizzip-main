import express from 'express';
import { getUsers, deleteUserById, getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.sendStatus(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser)
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}