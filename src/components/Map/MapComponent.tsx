"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./MapComponent.module.css";
import Spinner from "../Spinner/Spinner";
import { Plus } from "@/assets/images/plus";
import { Minus } from "@/assets/images/minus";
import { Center } from "@/assets/images/center";
import { GridLogo } from "@/assets/images/gridLogo";
import clsx from "clsx";
import { MapPopover } from "../MapPopOver/MapPopOver";
import { Device } from "@/types/Types";
import {  getDevicesfromfb } from "@/firebase/firebase.utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { selectDevice } from "@/redux/slice/selectedDevice";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { selectedDeviceSelector } from "@/redux/selectors/selectedDeviceSelector";
import { setDevices } from "@/redux/slice/deviceSlice";
import { allDevicesSelector } from "@/redux/selectors/deviceSelector";

export const MapComponent = ({ isPanelOpen }: { isPanelOpen: boolean }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();

  const devices = useSelector(allDevicesSelector);
 

  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const selectedDevice = useSelector(selectedDeviceSelector);

  const [popover, setPopover] = useState<{
    device: Device;
    x: number;
    y: number;
  } | null>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const geolocationOptions = useMemo(() => ({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }), []);


  const fetchDevicesWithBasicAQI = useCallback(async () => {
    const fetchedDevices: Device[] | undefined = await getDevicesfromfb();
  
    if (!fetchedDevices) return;
  
    const updatedDevices = await Promise.all(
      fetchedDevices.map(async (device) => {
        try {
          const response = await fetch(
            `https://api.weatherbit.io/v2.0/current/airquality?lat=${device.location.lat}&lon=${device.location.lng}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}`
          );
  
          if (response.status === 429) {
            console.warn(`Rate limit exceeded for device ${device.name}`);
            return { ...device, aqi: null };
          }
  
          if (!response.ok) throw new Error("Failed to fetch AQI");
  
          const data = await response.json();
          return { ...device, aqi: data?.data[0]?.aqi || null };
        } catch (error) {
          console.error(`Error fetching AQI for ${device.name}:`, error);
          return { ...device, aqi: null };
        }
      })
    );
  
    dispatch(setDevices(updatedDevices));
  }, [dispatch]);



  const removeMarkers = useCallback(() => {
    markers.forEach((marker) => marker.remove());
    setMarkers(() => []);
  }, [devices]);



  const createMarkers = useCallback(() => {
    removeMarkers();
  
    devices.forEach((device) => {
      const el = document.createElement("div");
      el.className = styles.marker;
  
      const aqi = device.aqi || 0;
      el.style.border =
        aqi <= 100
          ? "4px solid #ACF254"
          : aqi <= 150
          ? "4px solid #F2B354"
          : "4px solid #F27A54";
  
      el.addEventListener("mouseenter", (e) => {
        setPopover({ device, x: e.clientX, y: e.clientY });
        setIsPopoverVisible(true);
      });
  
      el.addEventListener("mouseleave", () => setIsPopoverVisible(false));
  
      el.addEventListener("click", () => {
        map.current?.flyTo({
          center: [device.location.lng, device.location.lat],
          zoom: 15,
        });
        dispatch(showPanel(true));
        dispatch(selectDevice(device));
      });
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat([device.location.lng, device.location.lat])
        .addTo(map.current!);
      setMarkers((prev) => [...prev, marker]);
    });
  }, [devices, removeMarkers, dispatch]);

  if (selectedDevice) {
    map.current?.flyTo({
      center: [selectedDevice.location.lng, selectedDevice.location.lat],
      zoom: 15,
    });
  }

  const initializeMap = useCallback((latitude: number, longitude: number) => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [longitude, latitude],
        zoom: 15,
      });
  
      map.current.on("load", () => {
        setIsSpinnerVisible(false);
        fetchDevicesWithBasicAQI();
      });
  
      map.current.on("move", () => setIsPopoverVisible(false));
    }
  }, [fetchDevicesWithBasicAQI]);

  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        initializeMap(latitude, longitude);
      },
      (err) => console.warn(`Geolocation error (${err.code}): ${err.message}`),
      geolocationOptions
    );
  }, [geolocationOptions, initializeMap]);

  useEffect(() => {


    if (map.current) {
      createMarkers();
    }
  }, [devices,createMarkers]);

  const centerUserLocation = () => {
    if (map.current && userLat && userLng) {
      map.current.flyTo({ center: [userLng, userLat], zoom: 15 });
    }
  };

  const zoomIn = () => map.current?.zoomIn({ duration: 1000 });
  const zoomOut = () => map.current?.zoomOut({ duration: 1000 });

  return (
    <>
      <MapPopover
        {...popover}
        isTriggered={isPopoverVisible}
        isMouseOver={isMouseOver}
        handleMouseEnter={() => setIsMouseOver(true)}
        handleMouseLeave={() => setIsMouseOver(false)}
      />

{isSpinnerVisible && (
        <div className={styles.demo}>
          <div className={styles.spinner} data-testid="spinner1">
            <Spinner size="lg" dark  />
          </div>
        </div>
      )}
      <div ref={mapContainer} className={styles.map} data-testid="map-container">
        <div
          className={clsx(styles.bottomSection, {
            [styles.moveSection]: isPanelOpen,
          })}
           data-testid="bottomSection"
        >
          <div className={styles.bottomSectionLeft} data-testid="bottomSectionLeft">
            <div className={styles.logoAndyear}>
              <div>{GridLogo}</div>
              <div className={styles.info}>2020 @ All rights reserved.</div>
            </div>
          </div>
          <div className={styles.bottomSectionRight} data-testid="bottomSectionRight">
            <div>
              <button onClick={zoomIn} className={styles.mapButton}  data-testid="mapButtonPlus">
                {Plus}
              </button>
            </div>
            <div>
              <button onClick={zoomOut} className={styles.mapButton} data-testid="mapButtonMinus">
                {Minus}
              </button>
            </div>
            <div className={styles.customMargin}>
              <button onClick={centerUserLocation} className={styles.mapButton} data-testid="mapButtonCenter">
                {Center}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
