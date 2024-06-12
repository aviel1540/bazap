import axios from "axios";
import { errorHandle, responseHandle } from "./axiosUtils";

const projectAPI = axios.create({ baseURL: "http://localhost:5000/api/project" });
projectAPI.interceptors.response.use(responseHandle, errorHandle);

export const getAllProjects = async () => {
    return await projectAPI.get("");
};

export const getProjectData = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey;
    return await projectAPI.get(`/${id}`);
};

export const addProject = async (project) => {
    return await projectAPI.post("add-new-project", project);
};

export const deleteProject = async (deleteProject) => {
    return await projectAPI.delete(`delete-project/${deleteProject}`);
};

export const updateProject = async (project) => {
    const { id } = project;
    return await projectAPI.patch(`/update-project/${id}`, project);
};

export const closeProject = async (id) => {
    return await projectAPI.patch(`/close-project/${id}`);
};
