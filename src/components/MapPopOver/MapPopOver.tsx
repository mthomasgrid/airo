
import { useEffect, useState } from "react";
import styles from "./MapPopOver.module.css";
import { MapPopoverProps } from "@/types/Types";
import Spinner from "../Spinner/Spinner";
import locationIcon from "@/assets/images/locationIcon.svg";
import Image from "next/image";
import PieChart from "../PieChart/PieChart";


export const MapPopover:React.FC<MapPopoverProps> = ({
          device,
          x,
          y,
          isTriggered,
          handleMouseEnter,
          handleMouseLeave,
          isMouseOver
        }) => {

          const [PM2_5, setPM2_5] = useState(0);
          const [CO, setCO] = useState(0);
          const [O3, setO3] = useState(0);
          const [SO2, setSO2] = useState(0);
          const [isLoading, setIsLoading] = useState(true);
        
          useEffect(() => {
            if (device) {
              fetch(
                `https://api.weatherbit.io/v2.0/current/airquality?lat=${device.location.lat}&lon=${device.location.lng}&key=${process.env.NEXT_PUBLIC_WEATHER_ACCESS_TOKEN}`
              )
                .then((response) => { return response.json()})
                .then((data) => {
                
                  setPM2_5(data.data[0].pm25);
                  setCO(data.data[0].co);
                  setO3(data.data[0].o3);
                  setSO2(data.data[0].so2);
                  setIsLoading(false);
                })
                .catch((e) => console.log(e.message));

         
            }
          }, [device]);
        
          const MetricContainer = ({ ttl = '', value = 0, unit = '' }) => {
            return (
              <div  className={styles.metric}>
                <div className={styles.ttl}>{ttl}</div>
                <div className={styles.value}>
                  {value ? value.toFixed(1) : ''}
                  {unit && ` ${unit}`}
                </div>
              </div>
            );
          };
        
          const { name = '', address = '' } = device || {};
        
          let content;
        
          if (isLoading) {
            content = <Spinner  size='sm' />;
          } else {
            content = (
              <>
                <div className={styles.header}>
                  <div className={styles.chart}>
                    <PieChart
                      label='PM2.5'
                      value={PM2_5}
                      max={100}
                      outerRadius={35}
                      innerRadius={27.5}
                    />
                  </div>
                  <div className={styles.deviceInfo}>
                    <p  className={styles.name}>
                      {name}
                    </p>
                    <div className={styles.address}>
                      <Image className={styles.icon} src={locationIcon} alt='Location' />
                      <p >{address}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.metrics}>
                  <MetricContainer ttl='CO2' value={CO} />
                  <MetricContainer ttl='O3' value={O3}/>
                  <MetricContainer ttl="SO2" value={SO2} />
                </div>
              </>
            );
          }
          return (
            (isTriggered || isMouseOver) && (
              <div

                className={styles.wrapper}
                style={{ top: `${y! + 30}px`, left: `${x! - 175}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {content}
              </div>
            )
          );
        };
        