import { createContext, useContext } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { message } from "antd";

const UserAlertContext = createContext();

export const UserAlertProvider = ({ children }) => {
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, contextHolderMessage] = message.useMessage();
    const error = "error";
    const warning = "warning";
    const success = "success";
    const onAlert = (messageText, type, isMessage = false) => {
        if (!isMessage) {
            const config = {
                content: messageText,
                centered: true,
            };
            switch (type) {
                case error:
                    config.title = "שגיאה!";
                    modal.error(config);
                    break;
                case warning:
                    config.title = "שם לב!";
                    modal.warning(config);
                    break;
                case success:
                    modal.success(config);
                    break;
                default:
                    config.title = "שם לב!";
                    modal.info(config);
                    break;
            }
        } else {
            messageApi.open({
                type: type,
                content: messageText,
            });
        }
    };
    const onConfirm = async (config) => {
        const { okHandler, okText, cancelText, ...configConfirm } = config;
        configConfirm["centered"] = true;
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
    return (
        <UserAlertContext.Provider value={{ onAlert, error, warning, success, onConfirm }}>
            {children}
            {contextHolder}
            {contextHolderMessage}
        </UserAlertContext.Provider>
    );
};

UserAlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useUserAlert = () => {
    return useContext(UserAlertContext);
};
