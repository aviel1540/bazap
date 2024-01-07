import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (!show) {
            setError(null);
        }
    }, [show]);

    const onError = (errorMessage) => {
        setError(errorMessage);
        setShow(true);
    };

    const clearError = () => {
        setShow(false);
    };

    return <ErrorContext.Provider value={{ error, show, onError, clearError }}>{children}</ErrorContext.Provider>;
};
ErrorProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useError = () => {
    return useContext(ErrorContext);
};
