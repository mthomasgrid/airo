import { SerializedError } from "@reduxjs/toolkit";

export interface ToastType {
  type?: string;
  msg?: string;
  isBtn?: boolean;
  btnText?: string;
  handleClick?: () => void;
}

export interface Device {
  id: string;
  name: string;
  address: string;
  uid: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  aqi?: number;
}

export interface MapPopoverProps {
  device?: Device;
  x?: number;
  y?: number;
  isTriggered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  isMouseOver: boolean;
}

export interface CurrentUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthUser {
  user?: undefined | CurrentUser;
  error?: null | SerializedError | string;
}

export interface WeatherData {
  aqi: number;
  co: number;
  datetime: string;
  no2: number;
  o3: number;
  pm10: number;
  pm25: number;
  so2: number;
  timestamp_local: string;
  timestamp_utc: string;
  ts: number;
}

export interface TemperatureData {
  app_temp: number;
  clouds: number;
  clouds_hi: number;
  clouds_low: number;
  clouds_mid: number;
  datetime: string;
  dewpt: number;
  dhi: number;
  dni: number;
  ghi: number;
  ozone: number;
  pod: string;
  pop: number;
  precip: number;
  pres: number;
  rh: number;
  slp: number;
  snow: number;
  snow_depth: number;
  solar_rad: number;
  temp: number;
  timestamp_local: string;
  timestamp_utc:string;
  ts: number;
  uv: number;
  vis: number;
}


//Edit Device Panel
export interface EditUser {
  id: string;
}