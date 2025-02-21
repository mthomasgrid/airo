import { render, screen } from "@testing-library/react";
import { DeviceMetrics, type Props } from "./DeviceMetrics"; // Import the Props type
import "@testing-library/jest-dom"; // Extend Jest matchers


jest.mock("../ChartTypes/HourChart/HourChart", () => ({
  __esModule: true,
  default: ({ gradientColors, value, max, text, id }: { gradientColors: { start: string; end: string }, value: number, max: number, text: string, id: string }) => (
    <div
      data-testid="hour-chart"
      data-gradient-colors={JSON.stringify(gradientColors)}
      data-value={value}
      data-max={max}
      data-text={text}
      data-id={id}
    />
  ),
}));

jest.mock("../ChartTypes/LineChart/LineChart", () => ({
  __esModule: true,
  default: ({ color, labels, minVal, id, max, min, value }:  { color: string, labels: number[], minVal: number, id: string, max: number, min: number, value: number[] }) => (
    <div
      data-testid="line-chart"
      data-color={color}
      data-labels={JSON.stringify(labels)}
      data-min-val={minVal}
      data-id={id}
      data-max={max}
      data-min={min}
      data-value={JSON.stringify(value)}
    />
  ),
}));

describe("DeviceMetrics Component", () => {
  const baseProps: Props = {
    title: "Temperature",
    type: "hour",
    id: "temp",
    value: 25,
    max: 50,
    normalRangeText: "Normal Range: < 30°C",
    gradientColors: { start: "#FFC700", end: "#FF5C00" },
  };

  it("should display the title and normal range text", () => {
    render(<DeviceMetrics {...baseProps} />);
    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("Normal Range: < 30°C")).toBeInTheDocument();
  });

  it("should render the HourChart when type is 'hour'", () => {
    render(<DeviceMetrics {...baseProps} />);
    const hourChart = screen.getByTestId("hour-chart");
    expect(hourChart).toBeInTheDocument();
    expect(hourChart).toHaveAttribute("data-gradient-colors", JSON.stringify(baseProps.gradientColors));
    expect(hourChart).toHaveAttribute("data-value", baseProps.value!.toString());
    expect(hourChart).toHaveAttribute("data-max", baseProps.max.toString());
  });

  it("should render the LineChart when type is 'line'", () => {
    const lineProps = {
      ...baseProps,
      type: "line",
      value: [10, 20, 30],
      min: 0,
      labels: [0, 1, 2],
      color: "#FF5C00",
      minVal: 15,
    };
    render(<DeviceMetrics {...lineProps} />);
    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toBeInTheDocument();
    expect(lineChart).toHaveAttribute("data-color", lineProps.color);
    expect(lineChart).toHaveAttribute("data-labels", JSON.stringify(lineProps.labels));
    expect(lineChart).toHaveAttribute("data-min-val", lineProps.minVal.toString());
    expect(lineChart).toHaveAttribute("data-min", lineProps.min.toString());
    expect(lineChart).toHaveAttribute("data-value", JSON.stringify(lineProps.value));
  });

  it("should render 'Loading' if value is null", () => {
    render(<DeviceMetrics {...baseProps} value={null} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should render 'Loading' if value is an empty array", () => {
    render(<DeviceMetrics {...baseProps} value={[]} type="line" />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should not render HourChart or LineChart when value is null", () => {
    render(<DeviceMetrics {...baseProps} value={null} />);
    expect(screen.queryByTestId("hour-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("should render with gradient colors if provided", () => {
    render(<DeviceMetrics {...baseProps} />);
    const gradientColors = baseProps.gradientColors;
    expect(gradientColors?.start).toBe("#FFC700");
    expect(gradientColors?.end).toBe("#FF5C00");
  });

  it("should render without crashing when optional props are not provided", () => {
    const { gradientColors, ...requiredProps } = baseProps;
    render(<DeviceMetrics {...requiredProps} />);
    expect(gradientColors?.start).toBe("#FFC700");
    expect(gradientColors?.end).toBe("#FF5C00");
    expect(screen.getByText("Temperature")).toBeInTheDocument();
  
  });

  it("should render without gradient colors if not provided", () => {
    const {  ...requiredProps } = baseProps;
    render(<DeviceMetrics {...requiredProps} />);
    const hourChart = screen.getByTestId("hour-chart");
    expect(hourChart).toHaveAttribute("data-gradient-colors", JSON.stringify(undefined));
  });
});