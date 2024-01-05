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
    setUsername: (user: string) => void,
    setEmail: (email: string) => void,
    setTier: (tier: 'Basic' | 'Monthly Subscription' | 'Yearly Subscription') => void,
    setGenerationsLeft: (number: number) => void,
    setExpirationDate: (date: number) => void,
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
    setUsername: (user) => set({username: user}),
    setEmail: (email) => set({email: email}),
    setTier: (tier) => set({tier: tier}),
    setGenerationsLeft: (no) => set({generationsLeft: no}),
    setExpirationDate: (date) => set({expirationDate: date}),
}))