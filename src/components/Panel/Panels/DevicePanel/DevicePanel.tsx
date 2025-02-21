import { DeviceMetrics } from "@/components/Chart/DeviceMetrics/DeviceMetrics";
import { DeviceName } from "@/components/DeviceName/DeviceName";
import { useEffect, useState } from "react";
import styles from "./DevicePanel.module.css";
import clsx from "clsx";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectedDeviceSelector } from "@/redux/selectors/selectedDeviceSelector";
import { TemperatureData, WeatherData } from "@/types/Types";
import { RemoveDevice } from "@/components/RemoveDevice/RemoveDevice";
import { deleteDeviceFromFb } from "@/firebase/firebase.utils";
import { deleteDevice } from "@/redux/slice/deviceSlice";

import { showPanel } from "@/redux/slice/isPanelOpen";
import { AppDispatch } from "@/redux/store";
import { showEditPanel } from "@/redux/slice/EditDevice";
import { selectDevice } from "@/redux/slice/selectedDevice";
import { authUserSelector } from "@/redux/selectors/authSelector";


const getNextThreeDaysArray = () => {
  const daysArray = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    daysArray.push(nextDate.getDate());
  }

  return daysArray;
};

export const DevicePanel = () => {
  const [activeChart, setActiveChart] = useState<string>("HOUR");

  const selectedDevice = useSelector(selectedDeviceSelector);
  const currentUser = useSelector(authUserSelector);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [temperature, setTemperature] = useState<number>();
  const [showRemoveDevice, setShowRemoveDevice] = useState(false);
  const [days, setDays] = useState<number[]>([]);
  const [coValue, setCoValue] = useState<number[]>([]);
  const [aqiValue, setAqiValue] = useState<number[]>([]);
  const [soValue, setSoValue] = useState<number[]>([]);
  const [temperatureArray, setTemperatureArray] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const handleTimeRangeClick = (range: string) => {
    setActiveChart(range);
  };

  const timeFrame = {
    HOUR: "1",
    TODAY: "12",
    WEEK: "72",
  };

  const noDeleteDevice = () => {
    setShowRemoveDevice(false);
  };

  const yesDeleteDevice = () => {
    deleteDeviceFromFb(selectedDevice!.id);
    dispatch(deleteDevice(selectedDevice!.id))
    setShowRemoveDevice(false);
    dispatch(showPanel(false));
    dispatch(showEditPanel(false));
    dispatch(selectDevice(null));
  }

  


  const filterData = (rawData: { data: (WeatherData | TemperatureData)[] }): (WeatherData | TemperatureData)[] => {
    return rawData.data.filter((item: WeatherData | TemperatureData) => {
      const [date, time] = item.datetime.split(":");
      const day = date.split("-")[2];
      return days.includes(Number(day)) && time === "23";
    });
  };

  const fetchWeatherData = async () => {
    if (activeChart === "HOUR") {
     try{
      const weatherData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/airquality?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}&hours=${timeFrame[activeChart]}`
      );
      const tempData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&hours=${timeFrame[activeChart]}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}`
      );

      const temperatureJson = await tempData?.json();

      const data = await weatherData?.json();
      setTemperature(temperatureJson.data[0].temp);
      setWeatherData(data.data[0]);
     }
     catch(e){
      console.log(e);
     }

    } else if (activeChart === "TODAY") {

      setTemperatureArray([]);
      setCoValue([]);
      setAqiValue([]);
      setSoValue([]);

    try{
      const weatherData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/airquality?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}&hours=${timeFrame[activeChart]}`
      );

      const tempData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&hours=${timeFrame[activeChart]}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}`
      );

      if (weatherData.status === 429) {
        console.warn(`Rate limit exceeded`);
        return null
      }

      if (!tempData.ok) throw new Error("Failed to fetch AQI");

      if (tempData.status === 429) {
        console.warn(`Rate limit exceeded`);
        return null
      }

      if (!tempData.ok) throw new Error("Failed to fetch AQI");

      const temperature = await tempData?.json();
      const rawData = await weatherData?.json();

      rawData?.data.forEach((item: WeatherData) => {
        setCoValue((prevCoArray) => [...prevCoArray, item.co]);
        setAqiValue((prevAqiArray) => [...prevAqiArray, item.aqi]);
        setSoValue((prevSoArray) => [...prevSoArray, item.so2]);
      });

      temperature?.data.forEach((item: TemperatureData) => {
        setTemperatureArray((preVal) => [...preVal, item.temp]);
      });
    }
    catch(e){
      console.log(e);
    }
    } else if (activeChart === "WEEK") {

      setTemperatureArray([]);
      setCoValue([]);
      setAqiValue([]);
      setSoValue([]);

    try{
      const weatherData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/airquality?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}&hours=${timeFrame[activeChart]}`
      );
      const tempData = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${selectedDevice?.location.lat}&lon=${selectedDevice?.location.lng}&hours=${timeFrame[activeChart]}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}`
      );

      if (weatherData.status === 429) {
        console.warn(`Rate limit exceeded`);
        return null
      }

      if (!tempData.ok) throw new Error("Failed to fetch AQI");

      if (tempData.status === 429) {
        console.warn(`Rate limit exceeded`);
        return null
      }

      if (!tempData.ok) throw new Error("Failed to fetch AQI");

      const temperature = await tempData?.json();
      const rawData = await weatherData.json();
      const filtered = filterData(rawData) as WeatherData[];
      const filteredTemp = filterData(temperature) as TemperatureData[];
      
      filtered.forEach((item: WeatherData) => {
        setCoValue((prevCoArray) => [...prevCoArray, item.co]);
        setAqiValue((prevAqiArray) => [...prevAqiArray, item.aqi]);
        setSoValue((prevSoArray) => [...prevSoArray, item.so2]);
      });

      filteredTemp.forEach((item: TemperatureData) => {
        setTemperatureArray((prev) => [...prev, item.temp]);
      });
    }
    catch(e){
      console.log(e);
    }
      
    }
  };

  useEffect(() => {
    fetchWeatherData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChart]);

  useEffect(() => {
    const daysArray = getNextThreeDaysArray();
    setDays(daysArray);
  }, []);

  return (
    <>
       <DeviceName
       deviceName={selectedDevice!.name}
      
       deviceAddress={selectedDevice!.address}
     
       deviceDescription={selectedDevice!.description}
      
      
      />

      <div className={styles.timeBasis}>
        <button
          className={clsx(
            styles.timeRange,
            activeChart === "HOUR" && styles.active
          )}
          onClick={() => handleTimeRangeClick("HOUR")}
        >
          Hour
        </button>
        <button
          className={clsx(
            styles.timeRange,
            activeChart === "TODAY" && styles.active
          )}
          onClick={() => handleTimeRangeClick("TODAY")}
        >
          Today
        </button>
        <button
          className={clsx(
            styles.timeRange,
            activeChart === "WEEK" && styles.active
          )}
          onClick={() => handleTimeRangeClick("WEEK")}
        >
          Week
        </button>
      </div>

      {activeChart === "HOUR" && (
        <div className={styles.metricContainer}>
          <DeviceMetrics
            type="hour"
            title={"CO2"}
            gradientColors={{ start: "#FFC700", end: "#FF5C00" }}
            normalRangeText={"Normal Range < 400"}
            text={weatherData?.co as number}
            max={400}
            value={weatherData?.co as number}
            id="co2"
          />
          <DeviceMetrics
            type="hour"
            title={"Temperature"}
            text={(temperature + "°C") as string}
            value={temperature as number}
            max={50}
            gradientColors={{ start: "#DBFF00", end: "#FFC700" }}
            id="temp"
          />
          <DeviceMetrics
            type="hour"
            title={"AQI"}
            max={100}
            text={weatherData?.aqi as number}
            value={weatherData?.aqi as number}
            normalRangeText={"Normal Range < 150"}
            gradientColors={{ start: "#32CD32", end: "#FFD700" }}
            id="aqi"
          />
          <DeviceMetrics
            type="hour"
            title={"SO2"}
            text={weatherData?.so2 as number}
            value={weatherData?.so2 as number}
            max={200}
            gradientColors={{ start: " #0000FF", end: "#00FFFF" }}
            id="so2"
          />
        </div>
      )}

      {activeChart === "TODAY" && (
        <div className={styles.metricContainer}>
          <DeviceMetrics
            value={coValue}
            min={coValue[0]}
            max={coValue[coValue.length - 1]}
            minVal={coValue[coValue.length/2]}
            normalRangeText={"Normal Range < 400"}
            id="co2"
            title="CO2"
            type="line"
            color="#FF5C00"
            labels={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ]}
          />
          <DeviceMetrics
            min={temperatureArray[0]}
            max={temperatureArray[temperatureArray.length - 1]}
            minVal={temperatureArray[temperatureArray.length/2]}
            value={temperatureArray}
            normalRangeText={"Normal Range : 30°C"}
            color="#F0A04B"
            labels={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ]}
            title="Temperature"
            id="temp"
            type="line"
          />

          <DeviceMetrics
            min={50}
            max={300}
            minVal={200}
            value={aqiValue}
            title="AQI"
            color="#D2F254"
            id="aqi"
            type="line"
            labels={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ]}
          />
          <DeviceMetrics
            value={soValue}
            title="SO2"
            min={soValue[0]}
            minVal={soValue[soValue.length/2]}
            max={soValue[soValue.length-1]}
            id="so2"
            type="line"
            color="#CF64D1"
            labels={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ]}
          />
        </div>
      )}
      {activeChart === "WEEK" && (
        <div className={styles.metricContainer}>
          <DeviceMetrics
            value={coValue}
            normalRangeText={"Normal Range < 400"}
            min={80}
            max={150}
            minVal={120}
            id="co2"
            title="CO2"
            color="#FF5C00"
            type="line"
            labels={days}
          />
           <DeviceMetrics
            min={temperatureArray[0]}
            max={temperatureArray[temperatureArray.length - 1]}
            minVal={22.3}
            value={temperatureArray}
            normalRangeText={"Normal Range : 30°C"}
            color="#F0A04B"
            labels={days}
            title="Temperature"
            id="temp"
            type="line"
          />

          <DeviceMetrics
            min={50}
            max={300}
            minVal={200}
            value={aqiValue}
            title="AQI"
            color="#D2F254"
            id="aqi"
            type="line"
            labels={days}
          />
          <DeviceMetrics
            value={soValue}
            title="SO2"
            min={10}
            color="#CF64D1"
            minVal={30}
            max={50}
            id="so2"
            type="line"
            labels={days}
          />
        </div>
      )}

{showRemoveDevice && <RemoveDevice no={noDeleteDevice} yes={yesDeleteDevice}/>}

    { currentUser?.uid === selectedDevice?.uid &&  <div className={styles.deviceRemove}
      onClick={() => {console.log("Clicked"); return setShowRemoveDevice(true)}}
      >
        <Image
          src="/icons/Remove.svg"
          width={23}
          height={23}
          alt="Remove-icon"
        />
        <p className={styles.deviceRemoveName}>Remove Device</p>
      </div>}
    </>
  );
};