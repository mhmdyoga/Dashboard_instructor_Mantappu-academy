import { Interface } from "readline"


export interface User {
    id: string,
    email: string,
    name: string,
    avatar: string | null,
    role: "USER" | "INSTRUCTOR" | "ADMIN"
}

export interface RegisterPayload {
    name: string,
    email: string,
    passwordHash: string
}

export interface AuthResponse {
    success: boolean,
    data: {
        accessToken: string,
        user: User
    }
}

export interface LoginPayload {
    email: string,
    passwordHash: string
}