import Swal from "sweetalert2/dist/sweetalert2.js";
import withReactContent from "sweetalert2-react-content";

const OnSweetAlert = () => {
    const onSwal = ({
        title,
        html,
        text,
        icon = "error",
        showCancelButton = false,
        confirmButtonText = "אישור",
        cancelButtonText = "ביטול",
        onConfirmHandler,
        onCancelHandler,
    }) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: title,
            html: text ? text : html,
            icon: icon,
            showCancelButton,
            confirmButtonText,
            cancelButtonText,
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirmHandler && onConfirmHandler();
            } else if (result.isDismissed) {
                onCancelHandler && onCancelHandler();
            }
        });
    };

    return { onSwal };
};

export default OnSweetAlert;
