import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";
const be_URL = import.meta.env.VITE_BE_API_URL;

const deviceAPI = axios.create({ baseURL: `http://${be_URL}:5000/api/device` });
deviceAPI.interceptors.response.use(responseHandle, errorHandle);

export const addNewDevice = async (device) => {
    return await deviceAPI.post("add-new-device", device);
};

export const getDeviceBySerialNumber = async (serialnumber) => {
    return await deviceAPI.get(`find-by-serialNumber/${serialnumber}`);
};

export const addNewDevices = async (devices) => {
    return await deviceAPI.post("add-new-devices", devices);
};

export const getAllDevicesInLab = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey;
    return await deviceAPI.get(`get-all-devices-in-lab/${id}`);
};

export const getDevices = async () => {
    return await deviceAPI.get();
};

export const updateStatus = async (device) => {
    const { id } = device;
    return await deviceAPI.patch(`/update-status/${id}`, device);
};

export const updateNotes = async (device) => {
    const { id } = device;
    return await deviceAPI.patch(`/update-note/${id}`, device);
};
