import express from "express";
import { isAuthenticated, isOwner } from '../middlewares';
import { handleStripeSubscription, createAndSubtractBasicUserTierObjeect, createSubscriptionUserTierObject, createAndProvideFreeTrialGenerationsOnce, handleSubscriptionCancellation, webhook } from "../controllers/stripe";

export default (router: express.Router) => {
    router.post('/api/stripe/handleSubscription/:sessionId', isAuthenticated, isOwner, handleStripeSubscription)
    router.post('/api/stripe/createAndSubtractUserTierObject/:sessionId', isAuthenticated, isOwner, createAndSubtractBasicUserTierObjeect)
    router.post('/api/stripe/createSubscriptionUserTierObject/:sessionId', isAuthenticated, isOwner, createSubscriptionUserTierObject)
    router.put('/api/stripe/createAndProvideFreeTrialGenerationsOnce/:sessionId', isAuthenticated, isOwner, createAndProvideFreeTrialGenerationsOnce)
    router.put('/api/stripe/cancelSubscription/:sessionId', isAuthenticated, isOwner, handleSubscriptionCancellation)
    router.post('/api/stripe/webhook', express.raw({type: 'application/json'}), webhook)
}