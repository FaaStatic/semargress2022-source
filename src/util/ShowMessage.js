import { showMessage } from "react-native-flash-message";

export const ShowError = (title, message) => {
    showMessage({
      message: 'Terjadi kesalahan data',
      description: message ? message : "Something bad error, please check your action",
      type: "default",
      backgroundColor: "#9F9F9F",
      color: "#FFFFFF",
      icon: "danger"
    });
  }
  
  export const ShowSuccess = (message) => {
    showMessage({
      message: 'Berhasil',
      description: message,
      type: 'success',
      icon: "success"
    });
  }
  
  export const ShowWarning = (title, message) => {
    showMessage({
      message: 'Peringatan',
      description: message ? message : "Harap teliti lagi masukan anda",
      type: "default",
      backgroundColor: "#FBFBFB",
      color: "#FFFFFF",
      icon: "warning"
    });
  }