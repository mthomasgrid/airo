
import HourChart from "../ChartTypes/HourChart/HourChart";
import LineChart from "../ChartTypes/LineChart/LineChart";
import styles from "./DeviceMetrics.module.css";


export const DeviceMetrics = ({title,type,gradientColors,id,normalRangeText,value,min,max,minVal,labels, text,color}:Props) => {

  if (
    !value ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.length === 0)
  ) {
    return <p>Loading</p>;
  }


          return (
                    <div className={styles.chart}>
                      <div className={styles.valueBoxContainer}>
                        <div className={styles.valueBox}>
                          <p className={styles.valueHeading}>{title}</p>
                          <p className={styles.valueRangeType}>{normalRangeText}</p>

                              {type === 'hour' && (<HourChart value={value as number} max={max} text={text!}  gradientColors={gradientColors!} id={id}/>)}
                              {type === 'line' && (<LineChart color={color!} labels={labels!} minVal={minVal!}  id={id}  max={max} min={min!} value={value as number[]} />)}
                        </div>
                    </div>
                  </div>
          );
}



export interface Props{
title:string,
type:string,
gradientColors?:{start:string,end:string},
id:string,
normalRangeText?:string,
value:number|string | number[] | null,
max:number,
min?:number,
labels?:number[]
minVal?:number
color?:string
text?:string|number
}

