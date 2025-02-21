import { useDispatch, useSelector } from "react-redux";
import styles from "./UserPanel.module.css";
import Image from "next/image";
import { authUserSelector } from "@/redux/selectors/authSelector";
import { CurrentUser, Device } from "@/types/Types";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/slice/authSlice";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { useCallback, useEffect, useState } from "react";
import { selectDevice } from "@/redux/slice/selectedDevice";
import ContextMenu from "@/components/ContextMenu/ContextMenu";

import { showEditPanel } from "@/redux/slice/EditDevice";
import { allDevicesSelector } from "@/redux/selectors/deviceSelector";
import { showAddDevicePanel } from "@/redux/slice/isAddDevicePanelSlice";
import { deleteDeviceFromFb } from "@/firebase/firebase.utils";
import { deleteDevice } from "@/redux/slice/deviceSlice";

export default function UserPanel() {
  const currentUser = useSelector(authUserSelector);
  const user: CurrentUser | undefined = currentUser;
  const dispatch = useDispatch<AppDispatch>();
  const [uDevices, setUDevices] = useState<Device[]>([]);

  interface Context{
    show:boolean,
    index:number|null,
    device:Device|null
  }
  const [contextMenu, setContextMenu] = useState<Context>({
    show: false,
    index:null,
    device:null , 
  });


  const handleSignout = () => {
    dispatch(logout());
    dispatch(showPanel(false));
  };

  const userDevices = useSelector(allDevicesSelector);

  // const getDevices = () => {
    
  //   if(userDevices){
  //     const devices = userDevices?.filter(
  //       (device) => device.uid === currentUser?.uid
  //     );
  
  //     setUDevices(devices);
  //   }
  //   else{
  //     return;
  //   }
   
  // };

  useEffect(() => {
    if (userDevices) {
      const devices = userDevices.filter(
        (device) => device.uid === currentUser?.uid
      );
      setUDevices(devices);
    }
  }, [userDevices, currentUser?.uid]);

  const handleContextMenu = useCallback((event:React.MouseEvent<HTMLDivElement>, index:number,device:Device) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      index:index,
      device
    });
  }, []);



  const closeMenu = useCallback(() => {
    setContextMenu({ show: false , index:-1,device: null });
  }, []);


  const handleUserDeviceClick = (device:Device) => {
    dispatch(selectDevice(device))
  }

  const handleAddNewDevice = () => {
    dispatch(showAddDevicePanel(true)); 
    dispatch(showPanel(false));
  }

  
 

  const handleEdit=()=>{
     dispatch(showEditPanel(true));
     dispatch(selectDevice(contextMenu.device))
  }

  const handleDelete = () => {

    if (contextMenu.device) {
      const isConfirmed = window.confirm("Are you sure you want to delete this device?");
      if (isConfirmed) {
        console.log(contextMenu.device.id);
        deleteDeviceFromFb(contextMenu.device.id);
        dispatch(deleteDevice(contextMenu.device.id));
        dispatch(showPanel(false));
        dispatch(selectDevice(null));
      } else {
        dispatch(selectDevice(null));
      }
    }
  };


  const menuActions = [
    {
      label: 'Edit',
      onClick: () => handleEdit(),
    },
    {
      label: 'Delete',
      onClick: () => handleDelete(),
    },
    {
      label: 'Cancel',
      onClick: closeMenu,
    },
  ];

  const userName = user?.email
    ? `@${user.email.slice(0, user.email.indexOf("@"))}`
    : "@gschchirska";


    
  return (
    <>
      <div className={styles.userprofile}>
        <Image
          src={user?.photoURL ? user.photoURL : "/assets/Ellipse 33.png"}
          width={60}
          height={60}
          className={styles.profileImg}
          alt="styles.user-profile"
        />
        <div className={styles.userdetails}>
          <p className={styles.username}>
            {user?.displayName ? user!.displayName : "Galina Schshirska"}
          </p>
          <p className={styles.useremail}>{userName}</p>
        </div>
      </div>

      <div className={styles.userDeviceContainer}>
        {
  uDevices.length === 0 ?(<div className={styles.message}> Add your Device</div>):

        uDevices.map((device,index) => (
          <div  
            className={styles.userdevices} 
            key={index} 
            onContextMenu={(e) => handleContextMenu(e,index ,device)}
            onClick={()=>handleUserDeviceClick(device)}
          > 
            <div className={styles.userdevicesimages}>
              <div className={styles.circle}></div>
              <Image
                src="/icons/Router.svg"
                width={28}
                height={32}
                className={styles.towericon}
                alt="Tower-icon"
              />
            </div>
            <div className={styles.userdevicesnames}>
              <p className={styles.userdevicename}>{device.name}</p>
              <p className={styles.userdeviceaddress}>
                {device.address}
              </p>
            </div>
            {contextMenu.show && contextMenu.index === index && (
        <ContextMenu menuActions={menuActions}/>
      )}
          </div>
        ))}

   

     
      </div>



      <p 
        className={styles.adddevices} 
        onClick={handleAddNewDevice}
      >
        &#43; Add New
      </p>

      <div className={styles.userbtn}>
        <a
          href="https://gdpr-info.eu/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.privacy}
        >
          <Image
            src="/icons/Privacy.svg"
            width={18}
            height={22}
            className={styles.privacyicon}
            alt="privacy-icon"
          />
          <p className={styles.userprivacy}>Privacy</p>
        </a>
        <div className={styles.signout}>
          <Image
            src="/icons/SignOut.svg"
            width={18}
            height={22}
            className={styles.SignOuticon}
            alt="SignOut-icon"
          />
          <p className={styles.usersignout} onClick={handleSignout}>
            Sign Out
          </p>
        </div>
      </div>
    </>
  );
}
