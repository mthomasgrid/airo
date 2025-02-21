import { ToastType } from "@/types/Types";
import styles from "./Toast.module.css";
import Image from "next/image";
import successIcon from "@/assets/images/successIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { hideToast } from "@/redux/slice/toastSlice";

const Toast: React.FC<ToastType> = ({
  isBtn = false,
  btnText = "Try again",
 
}) => {

  const dispatch = useDispatch();
  const { isVisible,message,type } = useSelector(
    (state: RootState) => state.toast
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;
  

  const ToastHeader = () => {
    switch (type) {
      case "success":
        return (
          <div className={styles.header}>
            <Image className={styles.icon} src={successIcon} alt="Success" />
            <span className={styles.ttl}>Success!</span>
          </div>
        );

      case "error":
        return (
          <div className={styles.header}>
            <Image className={styles.icon} src={errorIcon} alt="error" />
            <span className={styles.ttl}>Oops!</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={clsx(styles.toast, styles[type])}>
      <ToastHeader />
      <div className={styles.msg}>{message}</div>
      {isBtn && (
        <button className={clsx(styles.toastButton , styles.customButton) }>{btnText}</button>
      )}
    </div>
  );
};

export default Toast;
