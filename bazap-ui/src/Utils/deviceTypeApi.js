import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const deviceTypeApi = axios.create({ baseURL: "http://localhost:5000/api/deviceType" });
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
