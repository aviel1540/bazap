import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { getAllProductsInProject, getProjectData } from "../../Utils/projectAPI";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const { id } = useParams();
    const [projectId, setProjectId] = useState(null);

    useEffect(() => {
        if (projectId != id) {
            setProjectId(id);
        }
    }, [id, setProjectId]);

    const {
        isLoading: isProjectLoading,
        data: project,
        refetch: refetchProject,
    } = useQuery({
        queryKey: ["project", projectId],
        queryFn: getProjectData,
        enabled: projectId !== null && projectId !== undefined,
    });
    const {
        isLoading: isLoadingDevices,
        data: devices,
        refetch: refetchDevices,
    } = useQuery({
        queryKey: ["devicesInProject", projectId],
        queryFn: getAllProductsInProject,
        enabled: projectId !== null && projectId !== undefined,
    });
    const refetchAll = () => {
        refetchDevices();
        refetchProject();
    };

    const isLoading = isProjectLoading || isLoadingDevices;
    return (
        <ProjectContext.Provider value={{ projectId, setProjectId, isLoading, project, devices, refetchAll }}>
            {children}
        </ProjectContext.Provider>
    );
};
ProjectProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useProject = () => {
    return useContext(ProjectContext);
};
