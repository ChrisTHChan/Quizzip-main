import express from "express";
import { isAuthenticated, isOwner } from '../middlewares';
import { handleStripeSubscription } from "../controllers/stripe";

export default (router: express.Router) => {
    router.post('api/stripe/handleSubscription/:sessionId', isAuthenticated, isOwner, handleStripeSubscription)
}