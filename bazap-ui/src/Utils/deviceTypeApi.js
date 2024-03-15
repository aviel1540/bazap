import axios from "axios";
import { replaceApostropheInObject } from "./utils";

const deviceTypeApi = axios.create({ baseURL: "http://localhost:5000/api/deviceType" });

export const getAllDeviceTypes = async () => {
    const response = await deviceTypeApi.get("");
    return response.data;
};

export const addDeviceType = async (deviceType) => {
    try {
        deviceType = replaceApostropheInObject(deviceType, "deviceName");
        return await deviceTypeApi.post("add-new-deviceType", deviceType);
    } catch (error) {
        if (error.message) {
            throw new Error(error.message);
        }
        throw new Error(error.response.data.message);
    }
};

export const deleteDeviceType = async (deviceTypeId) => {
    try {
        return await deviceTypeApi.delete("delete-deviceType", { data: { deviceTypeId: deviceTypeId } });
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
