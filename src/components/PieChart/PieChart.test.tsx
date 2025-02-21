import { render, screen } from "@testing-library/react";
import PieChart from "./PieChart";

describe("PieChart", () => {
  it("should render PieChart", () => {
    render(<PieChart />);
    expect(screen.getByTestId("piechart")).toBeInTheDocument();
    expect(screen.getByTitle(/PieChart/i)).toBeInTheDocument();
  });

  it("PieChart should contain metric label and value", () => {
    render(<PieChart value={10} label="Test" />);
    expect(screen.getByTestId("value")).toHaveTextContent("10");
    expect(screen.getByTestId("label")).toHaveTextContent("Test");
  });
});
