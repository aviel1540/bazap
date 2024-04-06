import axios from "axios";

const deviceAPI = axios.create({ baseURL: "http://localhost:5000/api/device" });

export const addNewDevice = async (device) => {
    try {
        return await deviceAPI.post("add-new-device", device);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const getDeviceBySerialNumber = async (serialnumber) => {
    try {
        const response = await deviceAPI.get(`find-by-serialNumber/${serialnumber}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const addNewDevices = async (devices) => {
    try {
        return await deviceAPI.post("add-new-devices", devices);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
``;
export const getAllDevicesInProject = async ({ queryKey }) => {
    try {
        const [_, id] = queryKey;
        const response = await deviceAPI.get(`get-all-devices-in-project/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const getAllDevicesInLab = async ({ queryKey }) => {
    try {
        const [_, id] = queryKey;
        const response = await deviceAPI.get(`get-all-devices-in-lab/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const getDevices = async () => {
    try {
        const response = await deviceAPI.get();
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const updateStatus = async (device) => {
    try {
        const { id } = device;
        return await deviceAPI.patch(`/update-status/${id}`, device);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
