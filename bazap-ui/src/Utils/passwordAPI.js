import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const be_URL = import.meta.env.VITE_BE_API_URL;

const passwordAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/password` });
passwordAPI.interceptors.response.use(responseHandle, errorHandle);

export const validatePassword = async (password) => {
    return await passwordAPI.post("validate-password", { password: password });
};

export const login = async (password) => {
    return await passwordAPI.post("login", { password: password });
};

export const logout = async () => {
    return await passwordAPI.post("logout", {});
};
export const isAdminAuthenticated = async () => {
    return await passwordAPI.get("is-admin-authenticated");
};
