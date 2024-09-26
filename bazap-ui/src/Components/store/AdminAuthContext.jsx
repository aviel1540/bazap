import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import { isAdminAuthenticated, login, logout, validatePassword } from "../../Utils/passwordAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Modal } from "antd";

// Create Admin Authentication Context
const AdminAuthContext = createContext();
const ONE_MINUTE = 60000;

export const AdminAuthProvider = ({ children }) => {
    const [isModalVisible, setIsModalVisible] = useState(false); // Controls modal visibility
    const [authOption, setAuthOption] = useState("admin"); // Controls the auth option (either "admin" or "validate")
    const [resolveLoginPromise, setResolveLoginPromise] = useState(null); // Used to resolve the login promise
    const queryClient = useQueryClient();
    const [form] = Form.useForm(); // Ant Design form handler

    // Query to check admin authentication status
    const { isLoading, data: isAuth } = useQuery({
        queryKey: ["isAdminAuth"],
        queryFn: isAdminAuthenticated,
        refetchInterval: ONE_MINUTE,
    });

    // Handlers for closing modal and resetting form
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
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
        onError: () => {
            /* Handle logout error */
        },
    });

    // Admin login handler (option 1)
    const loginHandler = (password) => {
        return new Promise((resolve, reject) => {
            loginMutation.mutate(password, {
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
    const handleOk = () => {
        form.validateFields().then((values) => {
            const { password } = values;

            // Check the auth option and call the appropriate handler
            let resultPromise;

            if (authOption === "admin") {
                resultPromise = loginHandler(password);
            } else if (authOption === "validate") {
                resultPromise = validatePasswordHandler(password);
            }

            resultPromise
                .then((result) => {
                    if (result) {
                        setIsModalVisible(false);
                        form.resetFields();
                        if (resolveLoginPromise) {
                            resolveLoginPromise(true); // Resolve the login promise with true
                        }
                    } else {
                        form.setFields([
                            {
                                name: "password",
                                errors: ["אימות סיסמא נכשל!"],
                            },
                        ]);
                        if (resolveLoginPromise) {
                            resolveLoginPromise(false); // Resolve the login promise with false
                        }
                    }
                })
                .catch(() => {
                    form.setFields([
                        {
                            name: "password",
                            errors: ["אימות סיסמא נכשל!"],
                        },
                    ]);
                    if (resolveLoginPromise) {
                        resolveLoginPromise(false); // Resolve the login promise with false
                    }
                });
        });
    };

    // Open login modal with admin authentication
    const onLogin = (option = "validate") => {
        return new Promise((resolve) => {
            setAuthOption(option);
            setIsModalVisible(true);
            setResolveLoginPromise(() => resolve); // Store the resolve function for the login promise
        });
    };

    // Execute logout
    const onLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <AdminAuthContext.Provider value={{ isAuth: isLoading ? undefined : isAuth, onLogin, onLogout }}>
            {children}
            <Modal
                zIndex={1005}
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
            </Modal>
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
