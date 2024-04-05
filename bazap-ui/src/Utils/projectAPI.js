import axios from "axios";

const projectAPI = axios.create({ baseURL: "http://localhost:5000/api/project" });

export const getAllProjects = async () => {
    const response = await projectAPI.get("");
    return response.data;
};

export const getProjectData = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const response = await projectAPI.get(`/${id}`);
    return response.data;
};

export const addProject = async (project) => {
    try {
        return await projectAPI.post("add-new-project", project);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteProject = async (deleteProject) => {
    try {
        return await projectAPI.delete("delete-project", { data: { projectId: deleteProject } });
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const updateProject = async (project) => {
    try {
        const { id } = project;
        return await projectAPI.patch(`/update-project/${id}`, project);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const closeProject = async (id) => {
    try {
        return await projectAPI.patch(`/close-project/${id}`);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
