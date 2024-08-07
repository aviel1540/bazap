import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const be_URL = import.meta.env.VITE_BE_API_URL;

const AccessoryAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/accessory` });
AccessoryAPI.interceptors.response.use(responseHandle, errorHandle);

export const updateStatus = async (accessory) => {
    const { id } = accessory;
    return await AccessoryAPI.patch(`/update-status/${id}`, accessory);
};

export const updateNotes = async (accessory) => {
    const { id } = accessory;
    return await AccessoryAPI.patch(`/update-notes/${id}`, accessory);
};

export const updateFixDefective = async (accessory) => {
    const { id } = accessory;
    return await AccessoryAPI.patch(`/update-fix-defective/${id}`, accessory);
};

export const deleteAccessory = async (accessoryId) => {
    return await AccessoryAPI.delete(`delete-accessory/${accessoryId}`);
};
