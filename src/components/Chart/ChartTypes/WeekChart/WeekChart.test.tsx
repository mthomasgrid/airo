import { render } from "@testing-library/react";
import { Chart } from "chart.js";
import WeekChart from "./WeekChart";

jest.mock("chart.js", () => {
          class MockChart {
            constructor(ctx: string, config: string) {
              Object.assign(this, {
                config,
                ctx,
                destroy: jest.fn(),
                update: jest.fn()
              });
             
              (MockChart).instances.push(this);
            }
            
            static instances: MockChart[] = [];
            static register = jest.fn();
            
            
            static resetInstances() {
              this.instances = [];
            }
          }
        
          return {
            Chart: MockChart,
            LineController: jest.fn(),
            LineElement: jest.fn(),
            PointElement: jest.fn(),
            LinearScale: jest.fn(),
            CategoryScale: jest.fn(),
            Title: jest.fn(),
            Tooltip: jest.fn(),
            Legend: jest.fn(),
          };
        });

describe("WeekChart Component", () => {
  test("chart creation uses correct data for PM2.5", () => {
    render(<WeekChart />);
    const chartInstance = Chart.instances[0];
    
    expect(chartInstance.config.data.datasets[0].label).toBe("PM2.5");
    expect(chartInstance.config.data.datasets[0].data).toEqual([2, 8, 4, 10]);
    expect(chartInstance.config.data.datasets[0].borderColor).toBe("#B72E88");
  });

  test("chart creation uses correct data for CO2", () => {
    render(<WeekChart />);
    const chartInstance = Chart.instances[1];
    
    expect(chartInstance.config.data.datasets[0].label).toBe("CO2");
    expect(chartInstance.config.data.datasets[0].data).toEqual([150, 250, 200, 600, 375, 200]);
    expect(chartInstance.config.data.datasets[0].borderColor).toBe("#B72E2E");
  });
});
