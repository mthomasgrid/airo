import { useState } from "react";
import { DeviceName } from "@/components/DeviceName/DeviceName";
import Image from "next/image";
import styles from "./EditDevicePanel.module.css";
import { RemoveDevice } from "@/components/RemoveDevice/RemoveDevice";
import { selectedDeviceSelector } from "@/redux/selectors/selectedDeviceSelector";
import { useDispatch, useSelector } from "react-redux";
import { deleteDeviceFromFb, updateDeviceDataToFb } from "@/firebase/firebase.utils";
import { AppDispatch } from "@/redux/store";
import { deleteDevice, updateDevice } from "@/redux/slice/deviceSlice";
import { Device } from "@/types/Types";
import {  showPanel } from "@/redux/slice/isPanelOpen";
import { showEditPanel } from "@/redux/slice/EditDevice";
import { selectDevice } from "@/redux/slice/selectedDevice";




export default function EditDevicePanel() {
  const [openDropdown, setOpenDropdown] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showRemoveDevice, setShowRemoveDevice] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const currentSelectedDevice = useSelector(selectedDeviceSelector);

  //Device Edit state
  const [deviceName, setDeviceName] = useState(currentSelectedDevice!.name);
  const [deviceAddress, setDeviceAddress] = useState(currentSelectedDevice!.address);
  const [deviceDescription, setDeviceDescription] = useState(currentSelectedDevice!.description);

  const noDeleteDevice = () => {
    setShowRemoveDevice(false);
  };

  const yesDeleteDevice = () => {
    deleteDeviceFromFb(currentSelectedDevice!.id);
    dispatch(deleteDevice(currentSelectedDevice!.id))
    setShowRemoveDevice(false);
    dispatch(showPanel(false));
    dispatch(showEditPanel(false));
    dispatch(selectDevice(null));
  }
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown);
  };


  const handleEditToggle = async () => {
    if (isEditing) {

      const updatedDevice:Device = {
        name: deviceName,
        address: deviceAddress,
        description: deviceDescription,
        location:currentSelectedDevice!.location,
        id: currentSelectedDevice!.id,
        aqi:currentSelectedDevice!.aqi,
        uid:currentSelectedDevice!.uid,

      };
      updateDeviceDataToFb(updatedDevice);

      dispatch(updateDevice(updatedDevice));
    
     
    }
    setIsEditing(!isEditing);
  };

  // const handleEditToggle = () => {
  //   setIsEditing(!isEditing);
  // };
const handleCancel = () => {
  setIsEditing(false);
}
  return (
    <section className={styles.metrics}>
      <DeviceName
        deviceName={deviceName}
        setDeviceName={setDeviceName}
        deviceAddress={deviceAddress}
        setDeviceAddress={setDeviceAddress}
        deviceDescription={deviceDescription}
        setDeviceDescription={setDeviceDescription}
        isEditing={isEditing}
      />

      <section className={styles.deviceAdd}>
        <div>
          <p className={styles.data}>Data Format</p>
          <div className={styles.valuetwoButtons}>
            <button className={`${styles.Value} ${styles.active}`}>JSON Value</button>
            <button className={styles.Value}>Single Value</button>
          </div>

          <p className={styles.metrices}>Metrics</p>

          {[1, 2, 3].map((metric) => (
            <div key={metric} className={styles.dropdown}>
              <div
                className={styles.select}
                onClick={() => toggleDropdown(`metric${metric}`)}
              >
                <span className={styles.selected}>{`Metric #${metric}`}</span>
                <div
                  className={`${styles.caret} ${
                    openDropdown === `metric${metric}` ? styles.caretOpen : ""
                  }`}
                ></div>
              </div>
              {openDropdown === `metric${metric}` && (
                <ul className={styles.menu}>
                  <li className={styles.deviceInput}>
                    <p className={styles.deviceNames}>Device’s name</p>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Your name..."
                    />
                  </li>
                  <li className={styles.deviceToggle}>
                    <p className={styles.deviceNames}>Public</p>
                    <label className={styles.toggleSwitch}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className={styles.buttons}>
            <button className={styles.delete} onClick={handleCancel}>Cancel</button>
            <div className={styles.valuetwoButtons}>
              <button className={styles.delete} onClick={handleEditToggle}>
                {isEditing ? "Save" : "Edit Device"}
              </button>
            </div>
          </div>

          {showRemoveDevice && <RemoveDevice no={noDeleteDevice} yes={yesDeleteDevice}/>}
          <div
            className={styles.deviceRemove}
            onClick={() => setShowRemoveDevice(true)}
          >
            <Image
              src="/icons/Remove.svg"
              width={23}
              height={23}
              alt="Remove-icon"
            />
            <p className={styles.deviceRemoveName}>Remove Device</p>
          </div>
        </div>
      </section>
    </section>
  );
}
