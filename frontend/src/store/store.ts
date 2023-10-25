import { create } from 'zustand';

type useAuthStore = {
    auth: null | 'auth' | 'not-auth',
    setAuthTrue: () => void,
    setAuthFalse: () => void,
}

const useAuthStore = create<useAuthStore>((set) => ({
    auth: null,
    setAuthTrue: () => set({auth: 'auth'}),
    setAuthFalse: () => set({auth: 'not-auth'}),
  }))

  export default useAuthStore;