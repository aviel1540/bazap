import { createContext, useContext, useState } from "react";
import propTypes from "prop-types";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projectId, setProjectId] = useState(null);
    return <ProjectContext.Provider value={{ projectId, setProjectId }}>{children}</ProjectContext.Provider>;
};
ProjectProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useProject = () => {
    return useContext(ProjectContext);
};
