import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const technicianAPI = axios.create({ baseURL: "http://localhost:5000/api/technician" });
technicianAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllTechnicians = async () => {
    return await technicianAPI.get("");
};

export const addTechnician = async (technician) => {
    return await technicianAPI.post("add-new-technician", technician);
};

export const deleteTechnician = async (deleteTechnician) => {
    return await technicianAPI.delete("delete", { data: { technicianId: deleteTechnician } });
};

export const updateTechnician = async (technician) => {
    const { id } = technician;
    return await technicianAPI.patch(`/update-technician/${id}`, technician);
};
