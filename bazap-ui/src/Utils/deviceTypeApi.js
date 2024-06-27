import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const be_URL = import.meta.env.VITE_BE_API_URL;

const deviceTypeApi = axios.create({ baseURL: `http://${be_URL}:5000/api/deviceType` });
deviceTypeApi.interceptors.response.use(responseHandle, errorHandle);

export const getAllDeviceTypes = async () => {
    return await deviceTypeApi.get("");
};

export const addDeviceType = async (deviceType) => {
    return await deviceTypeApi.post("add-new-deviceType", deviceType);
};

export const deleteDeviceType = async (deviceTypeId) => {
    return await deviceTypeApi.delete("delete-deviceType", { data: { deviceTypeId: deviceTypeId } });
};

export const updateDeviceType = async (deviceType) => {
    try {
        const { id } = deviceType;
        return await deviceTypeApi.patch(`/update-deviceType/${id}`, deviceType);
    } catch (error) {
        console.log(error);
    }
};
