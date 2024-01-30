import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertRecord, setAlert] = useState(null);
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (!show) {
            setAlert(null);
        }
    }, [show]);

    const onAlert = ({ message, options }) => {
        const newAlertRecord = { message, options };
        setAlert(newAlertRecord);
        setShow(true);
    };

    const clearAlert = () => {
        setShow(false);
    };

    return <AlertContext.Provider value={{ alertRecord, show, onAlert, clearAlert }}>{children}</AlertContext.Provider>;
};
AlertProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useAlert = () => {
    return useContext(AlertContext);
};
