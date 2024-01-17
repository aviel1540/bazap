import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";

const CustomModalContext = createContext();

const defaultOptions = {
    title: "מודל חדש",
    maxWidth: "md",
    body: <></>,
};
export const CustomModalProvider = ({ children }) => {
    const [show, setShow] = useState(false);
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        if (show == false) {
            setOptions(defaultOptions);
        }
    }, [show]);
    const onShow = (modalOptions) => {
        setShow(true);
        setOptions(modalOptions);
    };
    const onHide = () => {
        setShow(false);
    };
    return <CustomModalContext.Provider value={{ show, onShow, onHide, options, setOptions }}>{children}</CustomModalContext.Provider>;
};
CustomModalProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useCustomModal = () => {
    return useContext(CustomModalContext);
};
