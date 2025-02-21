import { render, screen } from "@testing-library/react";
import LineChart from "./LineChart";
import { Chart as MockChart } from "chart.js";

interface ChartConfig {
  data: {
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      pointRadius: number;
      tension: number;
      borderWidth: number;
    }[];
  };
}



jest.mock("chart.js", () => {
  class MockChart {
    config: ChartConfig;
    static instances: MockChart[] = [];
    static register = jest.fn();
    destroy = jest.fn();
    update = jest.fn();

    constructor(ctx: string, config: ChartConfig) {
      this.config = {
        data: {
          datasets: [
            {
              label: "",
              data: [],
              borderColor: "",
              pointRadius: 0,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        },
      };
      Object.assign(this.config, config);
      MockChart.instances.push(this);
    }

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

describe("LineChart Component", () => {
  test("should render the component", () => {
    render(
      <LineChart
        value={[1, 2, 3, 4]}
        label="Test Label"
        labels={[1, 2, 3, 4]}
        min={0}
        max={5}
        title="Test Chart"
        id="testChart"
        color="blue"
        minVal={1}
      />
    );

    expect(screen.getByText("Test Chart")).toBeInTheDocument();
    const canvasElement = screen.getByTestId("testChart");
    expect(canvasElement).toBeInTheDocument();
  });

  test("should create a chart with correct data", () => {
    const value = [1, 2, 3, 4];
    const label = "Test Label";
    const color = "blue";

    render(
      <LineChart
        value={value}
        label={label}
        labels={[1, 2, 3, 4]}
        min={0}
        max={5}
        title="Test Chart"
        id="testChart"
        color={color}
        minVal={1}
      />
    );

    const chartInstance = MockChart.instances[0];
    expect(chartInstance.config.data.datasets[0].data).toEqual(value);
    expect(chartInstance.config.data.datasets[0].label).toBe(label);
    expect(chartInstance.config.data.datasets[0].borderColor).toBe(color);
  });

  test("should display a canvas element with correct id", () => {
    const canvasId = "testCanvas";

    render(
      <LineChart
        value={[1, 2, 3, 4]}
        label="Test Label"
        labels={[1, 2, 3, 4]}
        min={0}
        max={5}
        title="Test Chart"
        id={canvasId}
        color="blue"
        minVal={1}
      />
    );

    const canvasElement = screen.getByTestId(canvasId);
    expect(canvasElement).toHaveAttribute("id", canvasId);
  });
});
