import PropTypes from "prop-types";
import { createContext, useContext } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    return <AdminAuthContext.Provider value={{}}>{children}</AdminAuthContext.Provider>;
};

AdminAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useAdminAuth = () => {
    return useContext(AdminAuthContext);
};
