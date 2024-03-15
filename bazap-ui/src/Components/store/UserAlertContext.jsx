import { createContext, useContext } from "react";
import { Modal } from "antd";

const UserAlertContext = createContext();

export const UserAlertProvider = ({ children }) => {
    const [modal, contextHolder] = Modal.useModal();
    const error = "error";
    const onAlert = (message, type) => {
        const config = {
            content: message,
        };
        switch (type) {
            case error:
                config.title = "שגיאה!";
                modal.error(config);
                break;
            default:
                config.title = "שם לב!";
                modal.info(config);
                break;
        }
    };
    return <UserAlertContext.Provider value={{ onAlert, contextHolder, error }}>{children}</UserAlertContext.Provider>;
};

export const useUserAlert = () => {
    return useContext(UserAlertContext);
};
