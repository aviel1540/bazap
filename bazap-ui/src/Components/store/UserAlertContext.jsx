import { createContext, useContext } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

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
    const onConfirm = async (config) => {
        const { okHandler, okText, cancelText, ...configConfirm } = config;
        if (!okText) {
            configConfirm["okText"] = "אישור";
        }
        if (!cancelText) {
            configConfirm["cancelText"] = "בטל";
        }
        const confirmed = await modal.confirm(configConfirm);
        if (confirmed) {
            okHandler();
        }
    };
    return <UserAlertContext.Provider value={{ onAlert, contextHolder, error, onConfirm }}>{children}</UserAlertContext.Provider>;
};

UserAlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useUserAlert = () => {
    return useContext(UserAlertContext);
};
