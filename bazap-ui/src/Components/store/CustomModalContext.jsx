import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { Modal } from "antd";

const CustomModalContext = createContext();

const defaultOptions = {
    title: "מודל חדש",
    body: <></>,
    // onCancelHandler: () => {},
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
        setOptions(modalOptions);
        setTimeout(() => {
            setShow(true);
        }, 100);
    };
    const onHide = () => {
        setShow(false);
    };
    return (
        <CustomModalContext.Provider value={{ show, onShow, onHide, options, setOptions }}>
            {children}
            <Modal open={show} title={options.title} onCancel={onHide} width="40%" centered footer={null}>
                {options.body}
            </Modal>
        </CustomModalContext.Provider>
    );
};
CustomModalProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useCustomModal = () => {
    return useContext(CustomModalContext);
};
