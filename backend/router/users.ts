import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('api/allUsers', isAuthenticated, getAllUsers)
    router.delete('api/users/:id', isAuthenticated, isOwner, deleteUser);
}