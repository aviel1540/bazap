import axios from "axios";

const projectAPI = axios.create({ baseURL: "http://localhost:5000/api/project" });

export const getAllProjects = async () => {
    const response = await projectAPI.get("");
    return response.data;
};

export const getProjectData = async ({queryKey}) => {
    const [_,id] = queryKey;
    const response = await projectAPI.get(`/${id}`);
    return response.data;
};

export const addUnit = async (unit) => {
    try {
        return await projectAPI.post("add-new-unit", unit);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteUnit = async (deleteUnit) => {
    try {
        return await projectAPI.delete("delete-unit", { data: { unitId: deleteUnit } });
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const updateUnit = async (unit) => {
    try {
        const { id } = unit;
        return await projectAPI.patch(`/update-unit/${id}`, unit);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
