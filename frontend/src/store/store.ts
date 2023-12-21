import { create } from 'zustand';

type authStore = {
    auth: null | 'auth' | 'not-auth',
    setAuthTrue: () => void,
    setAuthFalse: () => void,
}

type userStore = {
    username: string,
    email: string,
    setUsername: (user: string) => void,
    setEmail: (email: string) => void
}

export const useAuthStore = create<authStore>((set) => ({
    auth: null,
    setAuthTrue: () => set({auth: 'auth'}),
    setAuthFalse: () => set({auth: 'not-auth'}),
}))

export const useEmailStore = create<userStore>((set) => ({
    username: '',
    email: '',
    setUsername: (user) => set({username: user}),
    setEmail: (email) => set({email: email})
}))