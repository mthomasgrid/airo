"use client";

import { MapComponent } from "@/components/Map/MapComponent";
import styles from "./page.module.css";
import Header from "@/components/Header/HeaderComponent";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Panel } from "@/components/Panel/Panel";
import { isPanelShowSelector } from "@/redux/selectors/isPanelShowSelector";
import { useSelector } from "react-redux";
import Toast from "@/components/Toasts/Toast";
import { isAddDevicePanelSelector } from "@/redux/selectors/isAddDevicePanelSelector";
import AddNew from "@/components/AddNew/AddComponent";
import OnBoardingComponent from "@/components/OnBoarding/OnBoardingComponent";

import { isOnboardingSelector } from "@/redux/selectors/isOnboardingSelector";



function MainContent() {
  const isPanelShow = useSelector(isPanelShowSelector);
  const isAddDeviceShow = useSelector(isAddDevicePanelSelector);
const onBoardSelector = useSelector(isOnboardingSelector);

  return (
    <div className={styles.main}>

      <div className={styles.mapContainer}>
        <MapComponent isPanelOpen={isPanelShow} />
      </div>
      
      {
         onBoardSelector &&  (<div className={styles.onBoard}>
           <OnBoardingComponent/>
           </div>)
        }
      

      {isPanelShow && (
        <div className={styles.panel}>
          <Panel />
        </div>
      )}


      {isAddDeviceShow && (<AddNew/>)}
    </div>
  );
}

export default function Home() {





  return (
    <Provider store={store}>
      <div className={styles.container}>
        <Header/>  
        <MainContent />
       
       
        <div className={styles.toastContainer}>
        <Toast/>
        </div>
      </div>
    </Provider>
  );
}
