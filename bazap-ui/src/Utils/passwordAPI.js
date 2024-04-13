import axios from "axios";

const passwordAPI = axios.create({ baseURL: "http://localhost:5000/api/password" });

export const validatePassword = async (password) => {
    try {
        const response = await passwordAPI.post("validate-password", { password: password });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
