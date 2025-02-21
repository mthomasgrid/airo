import styles from "./RemoveDevice.module.css";

interface RemoveDeviceProps {
  no: () => void; // Type for no function
  yes: () => void; // Type for yes function
}

export function RemoveDevice({no,yes}: RemoveDeviceProps) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>Remove Device</h2>
        <p className={styles.popupChoice}>
          Are you sure you want to remove this device?
        </p>
        <div className={styles.popupActions}>
          <button className={styles.cancel} onClick={no}>
            No
          </button>
          <button className={styles.confirm} onClick={yes}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
