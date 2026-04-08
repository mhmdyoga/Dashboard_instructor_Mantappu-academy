import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// automatic masukin token

api.interceptors.request.use((config: InternalAxiosRequestConfig)  => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})