import axios from "axios";

const technicianAPI = axios.create({ baseURL: "http://localhost:5000/api/technician" });

export const getAllTechnicians = async () => {
    const response = await technicianAPI.get("");
    return response.data;
};

export const addTechnician = async (technician) => {
    try {
        return await technicianAPI.post("add-new-technician", technician);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteTechnician = async (deleteTechnician) => {
    try {
        return await technicianAPI.delete(`delete/${deleteTechnician}`);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const updateTechnician = async (technician) => {
    try {
        const { id } = technician;
        return await technicianAPI.patch(`/update-technician/${id}`, technician);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
