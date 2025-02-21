import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import styles from './WeekChart.module.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function WeekChart() {
    const charts = useRef<Record<string, Chart>>({});
    const co2CanvasRef = useRef<HTMLCanvasElement | null>(null);
    const temperatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const unknownCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const pm25CanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const createChart = (
            canvas: HTMLCanvasElement | null,
            data: number[],
            label: string,
            borderColor: string,
            stepSize: number,
            min: number = 0,
            max: number = 10
        ) => {
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const canvasId = canvas.id;
            if (charts.current[canvasId]) {
                charts.current[canvasId].destroy(); 
            }

            charts.current[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [16,17,18,19,20,21],
                    datasets: [
                        {
                            label,
                            data,
                            borderColor,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            pointRadius: 0,
                            tension: 0.5,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { position: 'right' },
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
            });
        };

        createChart(pm25CanvasRef.current, [2, 8,4,10], 'PM2.5', '#B72E88', 2, 0, 12);
        createChart(co2CanvasRef.current, [150, 250, 200,600,375,200], 'CO2', '#B72E2E', 200, 0, 800);
        createChart(temperatureCanvasRef.current, [5,12.5,7.6, 6.9, 8,5], 'Temperature', '#2E75B7', 1, 5, 15);
        createChart(unknownCanvasRef.current, [12, 20, 17,14,19,16,12], 'Unknown Metrics', '#2EB74E', 12, 12, 20);

        return () => {
            
            Object.values(charts.current).forEach((chart) => chart.destroy());
            charts.current = {};
        };
    }, []);

    return (
        <section className={styles.line}>
            <div className={styles.valueBoxContainer}>
                <div className={styles.valueBoxContainer1}>
                    <div className={styles.valueBox}>
                        <p className={styles.valueHeading}>PM2.5</p>
                        <p className={styles.valueRangeType}>Normal Range: 1-9</p>
                        <canvas ref={pm25CanvasRef} id="pm25Canvas" width={149} height={145}></canvas>
                    </div>
                    <div className={styles.valueBox}>
                        <p className={styles.valueHeading}>CO2</p>
                        <p className={styles.valueRangeType}>Normal Range: &lt; 400</p>
                        <canvas ref={co2CanvasRef} id="co2Canvas" width={149} height={145}></canvas>
                    </div>
                </div>
                <div className={styles.valueBoxContainer2}>
                    <div className={styles.valueBox}>
                        <p className={styles.valueHeading}>Temperature</p>
                        <canvas ref={temperatureCanvasRef} id="temperatureCanvas" width={149} height={145}></canvas>
                    </div>
                    <div className={styles.valueBox}>
                        <p className={styles.valueHeading}>Unknown Metrics</p>
                        <canvas ref={unknownCanvasRef} id="unknownCanvas" width={149} height={145}></canvas>
                    </div>
                </div>
            </div>
        </section>
    );
}
