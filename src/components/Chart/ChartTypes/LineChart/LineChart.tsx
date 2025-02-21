import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import styles from './LineChart.module.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function LineChart({
   value,
   label,
   min,
   max,
   title,
   id,
   minVal,
   labels,
   color
}:Props) {
    const charts = useRef<Record<string, Chart>>({});
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


    
    useEffect(() => {
      const createChart = (
          canvas: HTMLCanvasElement | null,
          data: number[],
          label: string,
          borderColor: string,
          stepSize: number,
          min: number,
          max: number
      ) => {
          if (!canvas) return;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
  
          const canvasId = canvas.id;
  
          if (charts.current[canvasId]) {
              charts.current[canvasId].destroy();
          }
  
          // Create a new chart
          charts.current[canvasId] = new Chart(ctx, {
              type: "line",
              data: {
                  labels: labels,
                  datasets: [
                      {
                          label,
                          data,
                          borderColor,
                          pointRadius: 0,
                          tension: 0.4,
                          borderWidth: 2,
                      },
                  ],
              },
              options: {
                  responsive: true,
                  scales: {
                      x: { position: "bottom" },
                      y: {
                          beginAtZero: false,
                          min,
                          max,
                          ticks: { stepSize },
                      },
                  },
                  plugins: {
                      legend: { display: false },
                  },
              },
              plugins: [
                  {
                      id: "minValueLine",
                      afterDatasetsDraw(chart) {
                          if (!chart.chartArea) return;
  
                          const { ctx, chartArea: { left, right } } = chart;
  
                          const yScale = chart.scales.y;
                          const y = yScale.getPixelForValue(minVal);
  
                          ctx.save();
                          ctx.beginPath();
                          ctx.moveTo(left, y);
                          ctx.lineTo(right, y);
                          ctx.lineWidth = 0.5;
                          ctx.strokeStyle = "white";
                          ctx.stroke();
                          ctx.restore();
                      },
                  },
              ],
          });
      };
  
      createChart(canvasRef.current, value, label!, color, 4, min, max);
  
      return () => {
          Object.values(charts.current).forEach((chart) => chart.destroy());
          charts.current = {};
      };
  }, [value, label, min, max, color, labels, minVal]);

    return (
       
                    <div className={styles.valueBox}>
                        <p className={styles.valueHeading}>{title}</p>
                        <canvas ref={canvasRef}  data-testid={id} id={id} width={128} height={88}></canvas>
                    </div>
                
    );
}


interface Props{
    value:number[],
    label?:string,
    labels:number[]
    min:number,
    max:number,
    title?:string,
    id:string,
    color:string
    minVal:number
}