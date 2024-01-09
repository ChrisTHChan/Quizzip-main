import { create } from 'zustand';

type authStore = {
    auth: null | 'auth' | 'not-auth',
    setAuthTrue: () => void,
    setAuthFalse: () => void,
}

type userStore = {
    username: string,
    email: string,
    tier: 'Basic' | 'Monthly Subscription' | 'Yearly Subscription',
    generationsLeft: number,
    expirationDate: number,
    customerId: string,
    subscriptionId: string
    setUsername: (user: string) => void,
    setEmail: (email: string) => void,
    setTier: (tier: 'Basic' | 'Monthly Subscription' | 'Yearly Subscription') => void,
    setGenerationsLeft: (number: number) => void,
    setExpirationDate: (date: number) => void,
    setCustomerId: (id: string) => void,
    setSubscriptionId: (id: string) => void
}

export const useAuthStore = create<authStore>((set) => ({
    auth: null,
    setAuthTrue: () => set({auth: 'auth'}),
    setAuthFalse: () => set({auth: 'not-auth'}),
}))

export const useUserStore = create<userStore>((set) => ({
    username: '',
    email: '',
    tier: 'Basic',
    generationsLeft: 0,
    expirationDate: Date.now(),
    customerId: '',
    subscriptionId: '',
    setUsername: (user) => set({username: user}),
    setEmail: (email) => set({email: email}),
    setTier: (tier) => set({tier: tier}),
    setGenerationsLeft: (no) => set({generationsLeft: no}),
    setExpirationDate: (date) => set({expirationDate: date}),
    setCustomerId: (id) => set({customerId: id}),
    setSubscriptionId: (id) =>  set({subscriptionId: id}),
}))