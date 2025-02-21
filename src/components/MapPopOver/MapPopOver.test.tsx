import { render, screen, waitFor } from "@testing-library/react";
import { MapPopover } from "./MapPopOver";
import { MapPopoverProps } from "@/types/Types";



jest.mock("../PieChart/PieChart", () => {
  const MockPieChart = () => <div data-testid="piechart" />;
  MockPieChart.displayName = "MockPieChart"; 
  return MockPieChart;
});


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: [{ pm25: 12, co: 34, o3: 56, so2: 78 }],
      }),
  })
) as jest.Mock;

describe("MapPopover", () => {
  const mockProps: MapPopoverProps = {
    device: {
      id:'adhbiu123',
      uid:'18298ubhcs',
      description:'Test desc',
      name: "Test name",
      address: "Test address",
      location: { lat: 59.89, lng: 30.51 },
    },
    x: 0,
    y: 0,
    isTriggered: true,
    isMouseOver: false,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show spinner initially and device name, address and metrics after an API call", async () => {
    render(<MapPopover {...mockProps} />);
    
   
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    
   
    expect(fetch).toHaveBeenCalledTimes(1);

   
    await waitFor(() => expect(screen.getByText("Test name")).toBeInTheDocument());

   
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();

   
    expect(screen.getByText("Test name")).toBeInTheDocument();
    expect(screen.getByText("Test address")).toBeInTheDocument();

  
    expect(screen.getByText("34.0")).toBeInTheDocument(); 
    expect(screen.getByText("56.0")).toBeInTheDocument(); 
    expect(screen.getByText("78.0")).toBeInTheDocument(); 
  });
});
