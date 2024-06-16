import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const be_URL = import.meta.env.VITE_BE_API_URL;

const passwordAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/password` });
passwordAPI.interceptors.response.use(responseHandle, errorHandle);
export const validatePassword = async (password) => {
    return await passwordAPI.post("validate-password", { password: password });
};
