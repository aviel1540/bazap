import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const be_URL = import.meta.env.VITE_BE_API_URL;

const divisionAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/division` });
divisionAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllDivisions = async () => {
    return await divisionAPI.get("");
};

export const getDivisionById = async (id) => {
    return await divisionAPI.get(`/get-division-by-id/${id}`);
};

export const addNewDivision = async (division) => {
    return await divisionAPI.post("/add-new-division", division);
};

export const updateDivisionName = async (id, newName) => {
    return await divisionAPI.patch(`/update-division-name/${id}`, { name: newName });
};

export const deleteDivision = async (id) => {
    return await divisionAPI.delete(`/delete-division/${id}`);
};
