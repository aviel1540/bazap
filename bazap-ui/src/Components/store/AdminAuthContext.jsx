import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import { isAdminAuthenticated, login, logout } from "../../Utils/passwordAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const AdminAuthContext = createContext();
const ONE_MINUTE = 60000;
export const AdminAuthProvider = ({ children }) => {
    const { isLoading, data: isAuth } = useQuery({
        queryKey: ["isAdminAuth"],
        queryFn: isAdminAuthenticated,
        refetchInterval: ONE_MINUTE,
    });
    const queryClient = useQueryClient();

    const loginMutation = useMutation(login, {
        onSuccess: (isValid) => {
            if (isValid == true) {
                queryClient.invalidateQueries({ queryKey: ["isAdminAuth"] });
            }
        },
        onError: () => {},
    });
    const logoutMutation = useMutation(logout, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isAdminAuth"] });
        },
        onError: () => {},
    });

    const onLogin = (password) => {
        //open modal
        loginMutation.mutate(password);
    };
    const onLogout = () => {
        logoutMutation.mutate();
    };
    return (
        <AdminAuthContext.Provider value={{ isAuth: isLoading ? undefined : isAuth, onLogin, onLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

AdminAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useAdminAuth = () => {
    return useContext(AdminAuthContext);
};
