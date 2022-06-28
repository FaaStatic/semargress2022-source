import { showMessage } from "react-native-flash-message";

export const ShowError = (message) => {
    showMessage({
      message: 'Terjadi Kesalahan',
      description: message ? message : "Something bad error, please check your action",
      type: "default",
      backgroundColor: "#EB5757",
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
  
  export const ShowWarning = (message) => {
    showMessage({
      message: 'Peringatan',
      description: message ? message : "Harap teliti lagi masukan anda",
      type: "default",
      backgroundColor: "#FFC800",
      color: "#FFFFFF",
      icon: "warning"
    });
  }