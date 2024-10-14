import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import { isAdminAuthenticated, login, logout, validatePassword } from "../../Utils/passwordAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GenericForm from "../UI/Form/GenericForm/GenericForm";
import { useUserAlert } from "./UserAlertContext";

// Create Admin Authentication Context
const AdminAuthContext = createContext();
const ONE_MINUTE = 60000;

export const AdminAuthProvider = ({ children }) => {
    const [open, setOpen] = useState(false); // Controls modal visibility
    const [authOption, setAuthOption] = useState("admin"); // Controls the auth option (either "admin" or "validate")
    const [resolveLoginPromise, setResolveLoginPromise] = useState(null); // Used to resolve the login promise
    const queryClient = useQueryClient();
    const { onAlert, error } = useUserAlert();
    // Query to check admin authentication status
    const { isLoading, data: isAuth } = useQuery({
        queryKey: ["isAdminAuth"],
        queryFn: isAdminAuthenticated,
        refetchInterval: ONE_MINUTE,
    });

    // Handlers for closing modal and resetting form
    const handleCancel = () => {
        setOpen(false);
        if (resolveLoginPromise) {
            resolveLoginPromise(false); // Reject the login attempt if canceled
        }
    };

    // Admin login mutation
    const loginMutation = useMutation(login, {
        onSuccess: (isValid) => {
            if (isValid) {
                queryClient.invalidateQueries({ queryKey: ["isAdminAuth"] });
            }
        },
        onError: () => {
            /* Handle login error */
        },
    });
    // Admin logout mutation
    const logoutMutation = useMutation(logout, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["isAdminAuth"] });
        },
    });

    // Admin login handler (option 1)
    const loginHandler = (password) => {
        return new Promise((resolve, reject) => {
            loginMutation.mutateAsync(password, {
                onSuccess: (isValid) => {
                    if (isValid) {
                        queryClient.invalidateQueries({ queryKey: ["isAdminAuth"] });
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    // Password validation handler (option 2)
    const validatePasswordHandler = (password) => {
        return new Promise((resolve, reject) => {
            validatePassword(password)
                .then((isValid) => resolve(isValid))
                .catch((error) => reject(error));
        });
    };

    // Handle "OK" on modal
    const handleOk = async (values) => {
        const { password } = values;

        // Check the auth option and call the appropriate handler
        let result;

        if (authOption === "admin") {
            result = await loginHandler(password);
        } else if (authOption === "validate") {
            result = await validatePasswordHandler(password);
        }
        if (result) {
            setOpen(false);
        } else {
            onAlert("סיסמת מנהל שגויה!", error, true);
        }
        return result;
    };

    // Open login modal with admin authentication
    const onLogin = (option = "validate") => {
        return new Promise((resolve) => {
            setAuthOption(option);
            setOpen(true);
            setResolveLoginPromise(() => resolve); // Store the resolve function for the login promise
        });
    };

    // Execute logout
    const onLogout = () => {
        logoutMutation.mutateAsync();
    };
    const fields = [
        {
            label: "סיסמא",
            name: "password",
            type: "password",
            rules: [
                { required: true, message: "יש למלא שדה זה." },
                { min: 2, message: "שדה זה חייב לפחות 2 תווים" },
            ],
        },
    ];
    return (
        <AdminAuthContext.Provider value={{ isAuth: isLoading ? undefined : isAuth, onLogin, onLogout }}>
            {children}
            <GenericForm
                zIndex={2000}
                title="התחבר כמנהל"
                onSubmit={handleOk}
                onCancel={handleCancel}
                visible={open}
                fields={fields}
                isLoading={isLoading}
            />
            {/* <Modal
                zIndex={2000}
                title="התחבר כמנהל"
                open={isModalVisible}
                okText="אישור"
                cancelText="בטל"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="password" label="סיסמא" rules={[{ required: true, message: "יש להזין סיסמא." }]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal> */}
        </AdminAuthContext.Provider>
    );
};

// PropTypes for the provider component
AdminAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Hook to use admin authentication context
export const useAdminAuth = () => {
    return useContext(AdminAuthContext);
};
