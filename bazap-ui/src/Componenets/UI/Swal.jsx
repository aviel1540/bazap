import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const swalFire = ({ title, html, icon, showCancelButton, confirmButtonText = "Ok", cancelButtonText = "Cancel", onConfirmHandler, onCancelHandler }) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: title,
        html: html,
        icon: icon,
        showCancelButton,
        confirmButtonText,
        confirmButtonColor:'#009ef7',
        cancelButtonText
    })
        .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                onConfirmHandler && onConfirmHandler();
            } else if (result.isDismissed) {
                onCancelHandler && onCancelHandler();
            }
        })
}