import { useDispatch } from "react-redux";
import styles from "./DeviceName.module.css";
import Image from "next/image";
import { AppDispatch } from "@/redux/store";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { selectDevice } from "@/redux/slice/selectedDevice";
import { showEditPanel } from "@/redux/slice/EditDevice";

type DeviceNameProps = {
  isEditing?: boolean;
  deviceName: string;
  setDeviceName?: React.Dispatch<React.SetStateAction<string>>;
  deviceAddress: string;
  setDeviceAddress?: React.Dispatch<React.SetStateAction<string>>;
  deviceDescription: string;
  setDeviceDescription?: React.Dispatch<React.SetStateAction<string>>;
};

export function DeviceName({
  isEditing,
  deviceName,
  setDeviceName,
  deviceAddress,
  setDeviceAddress,
  deviceDescription,
  setDeviceDescription,
}: DeviceNameProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className={styles.deviceCondition}>
        <div className={styles.deviceDetails}>
          {isEditing ? (
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName!(e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <p className={styles.deviceName}>{deviceName}</p>
          )}
        </div>

        <Image
          src="/icons/Xline.svg"
          width={28}
          height={28}
          className={styles.Xicon}
          alt="x-icon"
          onClick={() => {
            dispatch(showPanel(false));
            dispatch(showEditPanel(false));
            dispatch(selectDevice(null));
          }}
        />
      </div>

      <div className={styles.deviceLocation}>
        <div className={styles.devicePin}>
          <Image
            src="/icons/Location.svg"
            width={15}
            height={15}
            alt="logout-icon"
            className={styles.logouticon}
          />
          {isEditing ? (
            <input
              type="text"
              value={deviceAddress}
              onChange={(e) => setDeviceAddress!(e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <p className={styles.deviceAddress}>{deviceAddress}</p>
          )}
        </div>

        <div className={styles.devicePins}>
          <Image
            src="/icons/Pen.svg"
            width={15}
            height={15}
            alt="pen-icon"
            className={styles.logouticon}
          />
          {isEditing ? (
            <textarea
              value={deviceDescription}
              onChange={(e) => setDeviceDescription!(e.target.value)}
              className={styles.inputFieldDescription}
            />
          ) : (
            <p className={styles.deviceDescription}>{deviceDescription}</p>
          )}
        </div>
      </div>
    </>
  );
}
