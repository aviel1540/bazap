import { createContext, useContext, useState } from "react";
import propTypes from "prop-types";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useMediaQuery } from "@mui/material";

const CustomModalContext = createContext();

export const CustomModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState([]);
    const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const isSm = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const isMd = useMediaQuery((theme) => theme.breakpoints.down("lg"));
    const isLg = useMediaQuery((theme) => theme.breakpoints.down("xl"));

    const modalWidth = isXs ? "90%" : isSm ? "80%" : isMd ? "70%" : isLg ? "60%" : "50%";

    const onShow = (modalOptions) => {
        const { name } = modalOptions;
        const checkIfModalExist = modalState.find((item) => item.name === name);
        if (checkIfModalExist) {
            setModalState((prevState) => {
                const newState = [...prevState];
                const curModal = newState.find((mState) => mState.name === name);
                curModal.options = modalOptions;
                return newState;
            });
            setTimeout(() => {
                setModalState((prevState) => {
                    const newState = [...prevState];
                    const curModal = newState.find((mState) => mState.name === name);
                    curModal.show = true;
                    return newState;
                });
            }, 100);
        } else {
            setModalState((prevState) => [...prevState, { show: false, name: name, options: modalOptions, key: uuidv4() }]);
            setTimeout(() => {
                setModalState((prevState) => {
                    const newState = [...prevState];
                    const curModal = newState.find((item) => item.name === name);
                    curModal.show = true;
                    return newState;
                });
            }, 100);
        }
    };
    const onHide = (name) => {
        setModalState((prevState) => {
            const newState = [...prevState];
            const curModal = newState.find((item) => item.name === name);
            curModal.show = false;
            return newState;
        });
        setTimeout(() => {
            setModalState((prevState) => {
                const newState = [...prevState];
                const curModal = newState.find((item) => item.name === name);
                curModal.key = uuidv4();
                return newState;
            });
        }, 200);
    };
    return (
        <CustomModalContext.Provider value={{ onShow, onHide }}>
            {children}
            {modalState.map((mState) => (
                <Modal
                    style={{
                        top: 20,
                    }}
                    key={mState.key}
                    open={mState.show}
                    title={mState.options.title}
                    width={mState.options.width ? mState.options.width : modalWidth}
                    footer={null}
                    onCancel={() => onHide(mState.name)}
                    closable={true}
                    maskClosable={false}
                >
                    <div key={mState.key}>
                        <div className="scroll-y px-2 mh-85">{mState.options.body}</div>
                    </div>
                </Modal>
            ))}
        </CustomModalContext.Provider>
    );
};
CustomModalProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useCustomModal = () => {
    return useContext(CustomModalContext);
};
