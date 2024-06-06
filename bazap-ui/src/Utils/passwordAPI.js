import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const passwordAPI = axios.create({ baseURL: "http://localhost:5000/api/password" });
passwordAPI.interceptors.response.use(responseHandle, errorHandle);
export const validatePassword = async (password) => {
    return await passwordAPI.post("validate-password", { password: password });
};
