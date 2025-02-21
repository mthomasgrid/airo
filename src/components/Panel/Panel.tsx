import { useSelector } from "react-redux";
import SettingsPanel from "./Panels/SettingsPanel/SettingsPanel";
import UserPanel from "./Panels/UserPanel/UserPanelComponent";
import { authUserSelector } from "@/redux/selectors/authSelector";
import styles from "./Panel.module.css";
import { DevicePanel } from "./Panels/DevicePanel/DevicePanel";
import { selectedDeviceSelector } from "@/redux/selectors/selectedDeviceSelector";




import EditDevicePanel from "./Panels/EditDevicePanel/EditDevicePanel";
import { isEditDevicePanelShowSelector } from "@/redux/selectors/isEditDevicePanelSelector";


export const Panel: React.FC = () => {
  const currentUser = useSelector(authUserSelector);
  const selectedDevice = useSelector(selectedDeviceSelector);
  const editDevice = useSelector(isEditDevicePanelShowSelector);

  const panelType = {
    SETTINGSPANEL: "SETTINGSPANEL",
    USERPANEL: "USERPANEL",
    DEVICEPANEL: "DEVICEPANEL",
    EDITPANEL:"EDITPANEL",
  };

  const PanelToShow = ({ type }: { type: string }) => {
    switch (type) {
      case panelType.SETTINGSPANEL:
        return (
          <>
            <SettingsPanel />
          </>
        );
      case panelType.USERPANEL:
        return (
          <>
            <UserPanel />
          </>
        );
      case panelType.EDITPANEL:
        return (
          <>
            <EditDevicePanel />
          </>
        );
      case panelType.DEVICEPANEL:
        return (
          <>
            <DevicePanel />
          </>
        );
      default:
        return null;
    }
  };

  const Panel = () => {
    if(selectedDevice && editDevice){
      return <PanelToShow type={panelType.EDITPANEL} />;
    }
    if (selectedDevice) {
      return <PanelToShow type={panelType.DEVICEPANEL} />;
    }
   
    if (currentUser) {
      return <PanelToShow type={panelType.USERPANEL} />;
    }

   

    return <PanelToShow type={panelType.SETTINGSPANEL} />;
  };

  return (
    <section className={styles.panel}>
      <Panel />
    </section>
  );
};
