import Swal from 'sweetalert2/dist/sweetalert2.js';
import withReactContent from 'sweetalert2-react-content'

export const swalFire = ({ title, html, icon, showCancelButton, confirmButtonText = "Ok", cancelButtonText = "Cancel", onConfirmHandler, onCancelHandler }) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: title,
        html: html,
        icon: icon,
        showCancelButton,
        confirmButtonText,
        cancelButtonText
    })
        .then((result) => {
            if (result.isConfirmed) {
                onConfirmHandler && onConfirmHandler();
            } else if (result.isDismissed) {
                onCancelHandler && onCancelHandler();
            }
        })
}