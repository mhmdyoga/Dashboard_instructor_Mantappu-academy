import { api } from "../../axiosInstance/axiosInstance"
import { AuthResponse, LoginPayload, RegisterPayload } from "../../types/authTypes";
import Cookies from "js-cookie";

export const authServices = {
    register: async(payload: RegisterPayload): Promise<AuthResponse> => {
      const {data} = await api.post('/auth/register', payload);
      Cookies.set("accessToken", data.data.accessToken, {expires: 1 / 96})
      return data;
    },

    login: async(payload: LoginPayload): Promise<AuthResponse> => {
        const {data} = await api.post('/auth/login', payload);
        console.log(data.data.accessToken);
        
        Cookies.set("accessToken", data.data.accessToken, {expires: 1 / 96})
        return data;
    },

    me: async(): Promise<void> => {
        const {data} = await api.get('auth/me');
        return data;
    },

    logout: async() : Promise<void> => {
        Cookies.remove("accessToken")
       return await api.post('/auth/logout');
    }
}