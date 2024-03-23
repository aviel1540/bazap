import { useCustomModal } from "../store/CustomModalContext";
import { Modal } from "antd";

const CustomModal = () => {
    const { show, onHide, options } = useCustomModal();

    return (
        <Modal open={show} title={options.title} onCancel={onHide} width="40%" centered footer={null}>
            {options.body}
        </Modal>
    );
};
export default CustomModal;
