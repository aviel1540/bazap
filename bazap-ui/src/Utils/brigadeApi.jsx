import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const be_URL = import.meta.env.VITE_BE_API_URL;

const brigadeAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/brigade` });
brigadeAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllBrigades = async () => {
    return await brigadeAPI.get("");
};

export const getBrigadeById = async (brigadeId) => {
    return await brigadeAPI.get(`/get-brigade-by-id/${brigadeId}`);
};

export const addNewBrigade = async (brigade) => {
    const { divisionId } = brigade;
    return await brigadeAPI.post(`/add-new-brigade/${divisionId}`, brigade);
};

export const deleteBrigade = async (brigadeId) => {
    return await brigadeAPI.delete(`/delete-brigade/${brigadeId}`);
};

// Note: The update brigade name route is commented out in the router,
// but if it's implemented in the future, you can uncomment and use this function:
/*
export const updateBrigadeName = async (brigadeId, newName) => {
    return await brigadeAPI.patch(`/update-brigade-name/${brigadeId}`, { name: newName });
};
*/
