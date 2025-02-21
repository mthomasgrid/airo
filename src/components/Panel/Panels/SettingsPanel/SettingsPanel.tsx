"use client";
import { login } from "@/redux/slice/authSlice";
import styles from "./SettingsPanel.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import { showPanel } from "@/redux/slice/isPanelOpen";
import { toggleOnboardPopup } from "@/redux/slice/isOnBoarding";

export default function SettingsPanel() {
 

  const dispatch = useDispatch<AppDispatch>();
  const handleSignIn = () => {
    dispatch(login());
    dispatch(showPanel(false));
  };

  return (
    <>
      <div className={styles.settingspanelnav}>
        <p className={styles.settingstitle}>Settings</p>
        <Image
          src="/icons/Xline.svg"
          width={28}
          height={28}
          className={styles.Xicon}
          alt="x-icon"
          onClick={() => dispatch(showPanel(false))}
        />
      </div>

      <div className={styles.logouticonimg}>
        <Image
          src="/icons/Logout.svg"
          width={216}
          height={216}
          alt="logout-icon"
          className={styles.logouticon}
        />
      </div>

      <p className={styles.logouticoncontent}>
        Please Log In via Gmail SSO account <br />
        to have possibility to manage personal <br />
        devices and recieve notifications.
      </p>

      <div className={styles.signbtn}>
        <button className={styles.signInbtn} onClick={handleSignIn}>
          Sign In
        </button>
      </div>

      {/* {showOnBoarding && (
        <OnBoardingComponent closeOnBoarding={closeOnBoarding} />
      )} */}

      <p className={styles.aboutapp} onClick={() => {dispatch(toggleOnboardPopup(true)); dispatch(showPanel(false))}}>
        About this Application &rarr;
      </p>
    </>
  );
}
