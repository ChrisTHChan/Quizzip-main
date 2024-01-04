import express from "express";
import { isAuthenticated, isOwner } from '../middlewares';
import { handleStripeSubscription, createAndSubtractBasicUserTierObjeect, createSubscriptionUserTierObject } from "../controllers/stripe";

export default (router: express.Router) => {
    router.post('/api/stripe/handleSubscription/:sessionId', isAuthenticated, isOwner, handleStripeSubscription)
    router.post('/api/stripe/createAndSubtractUserTierObject/:sessionId', isAuthenticated, isOwner, createAndSubtractBasicUserTierObjeect)
    router.post('/api/stripe/createSubscriptionUserTierObject/:sessionId', isAuthenticated, isOwner, createSubscriptionUserTierObject)
}