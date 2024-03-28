import { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";

const CustomModalContext = createContext();

const defaultOptions = {
    title: "מודל חדש",
    body: <></>,
    // onCancelHandler: () => {},
};
export const CustomModalProvider = ({ children }) => {
    const [show, setShow] = useState(false);
    const [keyProp, setKeyProp] = useState(uuidv4());
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
        setKeyProp(uuidv4());
    };
    return (
        <CustomModalContext.Provider value={{ show, onShow, onHide, options, setOptions }}>
            {children}
            <Modal open={show} title={options.title} onCancel={onHide} width="40%" centered footer={null}>
                <div key={keyProp}>{options.body}</div>
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
