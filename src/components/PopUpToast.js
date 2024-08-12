
import { ToastContainer, toast } from "react-toastify";

export const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
        position: "top-right",
        autoClose: timer || 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default function PopUpToast() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
}