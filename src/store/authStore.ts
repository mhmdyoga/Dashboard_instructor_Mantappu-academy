import { User } from "@/src/package/utilities/types/authTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    user?: User | null,
    isAuthenticated: boolean,
    setUser: (user: User) => void,
    clearUser: () => void
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => 
        ({
            user: null,
            isAuthenticated: false,
            setUser: (user: User) => set({user, isAuthenticated: true}),
            clearUser: () => set({user: null, isAuthenticated: false})
        }),
        {
            name: "auth-storage", // key- untuk di localStorage,
            partialize: (state) => ({user: state.user, isAuthenticated: state.isAuthenticated})
        }
    )
)