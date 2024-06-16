import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const be_URL = import.meta.env.BE_API_URL;

const unitAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/units` });
unitAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllUnits = async () => {
    return await unitAPI.get("");
};

export const addUnit = async (unit) => {
    return await unitAPI.post("add-new-unit", unit);
};

export const deleteUnit = async (deleteUnit) => {
    return await unitAPI.delete(`delete/${deleteUnit}`);
};

export const updateUnit = async (unit) => {
    const { id } = unit;
    return await unitAPI.patch(`/update-unit/${id}`, unit);
};
