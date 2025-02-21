import { useState } from 'react';
import styles from './AddComponent.module.css';
import axios from 'axios'; 
import {location} from "@/assets/images/locationpin"
import { useDispatch, useSelector } from 'react-redux';
import { authUserSelector } from '@/redux/selectors/authSelector';
import { AppDispatch } from '@/redux/store';
import { Device } from '@/types/Types';
import { addDevicetofb } from '@/firebase/firebase.utils';
import { addDevice } from '@/redux/slice/deviceSlice';
import { showAddDevicePanel } from '@/redux/slice/isAddDevicePanelSlice';
import { showToast } from '@/redux/slice/toastSlice';

interface FormData {
  name: string;
  description: string;
  address: string;
 
}

interface Coords{
  latitude:number,
  longitude:number
}
export default function AddNew() {
  const [formType, setFormType] = useState<'device' | 'gateway'>('gateway');
  const [dataFormat, setDataFormat] = useState<'json' | 'single'>('json');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
  
   
  });
  const currentUser  = useSelector(authUserSelector);


  const [deviceCoords,setDeviceCoords] = useState<Coords>();

  const dispatch = useDispatch<AppDispatch>();
  const handleLocationClick = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setDeviceCoords(position.coords);
       
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );

       
        const address = response.data.features[0]?.place_name || `${latitude}, ${longitude}`;

        setFormData(prev => ({
          ...prev,
          address: address
        }));
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Could not retrieve location');
      }
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formType === 'device') {
      console.log(formData);
      try {
       const data:Device = {
          id:'',
          ...formData,
          uid:currentUser!.uid,
          location: {
            lat: deviceCoords!.latitude,
            lng: deviceCoords!.longitude
          },
         
        }

        const firebaseResponse = await addDevicetofb(data); 
        data.id = firebaseResponse!;
        dispatch(addDevice(data));
        dispatch(showToast({message:"Added Device Successfully",type:"success"}));

        closeForm();
      } catch (error) {
        console.error('Error adding device:', error);
        alert('Failed to add device');
      }
    }
  };

  const closeForm = () => {
    

    dispatch(showAddDevicePanel(false));
   
  };

  return (
    
      <div className={styles.addNew}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Add new</h1>
            <button className={styles.closeButton} onClick={closeForm}>X</button>
          </div>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${formType === 'gateway' ? styles.active : ''}`}
              onClick={() => setFormType('gateway')}
            >
              Gateway
            </button>
            <button
              className={`${styles.tabButton} ${formType === 'device' ? styles.active : ''}`}
              onClick={() => setFormType('device')}
            >
              Device
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {formType ==='gateway'?(
              <>
                <div className={styles.formGroup}>
                <label>Gateway&apos;s name</label>

                  <input
                    type="text"
                    placeholder="Type name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Key</label>
                  <textarea
                    placeholder="Type key"
                    // value={formData.key}
                    // onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className={styles.formColumns}>
                <div>
                  <div className={styles.formGroup}>
                  <label>Device&apos;s name</label>
                    <input
                      type="text"
                      placeholder="Type name..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      placeholder="Type description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Gateway</label>
                    <select disabled>
                      <option>Gateway 3</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <div className={styles.inputWithIcon}>
                      <input
                        type="text"
                        placeholder="Type location"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                      <span onClick={handleLocationClick}>{location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={styles.formGroup}>
                    <label>Data format</label>
                    <div className={styles.dataFormat}>
                      <button
                        type="button"
                        className={dataFormat === 'json' ? styles.active : ''}
                        onClick={() => setDataFormat('json')}
                      >
                        JSON Value
                      </button>
                      <button
                        type="button"
                        className={dataFormat === 'single' ? styles.active : ''}
                        onClick={() => setDataFormat('single')}
                      >
                        Single Value
                      </button>
                    </div>
                  </div>

                  {dataFormat === 'json' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Metrics to be tracked</label>
                        <select disabled>
                          <option>Select metrics</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Public metrics</label>
                        <select disabled>
                          <option>Select metrics</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Add {formType}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}