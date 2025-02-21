import { render, screen, waitFor } from '@testing-library/react';

import HourChart from './HourChart';

describe('GaugeChart', () => {
  it('should render GaugeChart', () => {
    render(<HourChart value={10} text="10" id="testChart" max={100} gradientColors={{ start: "#acf254", end: "#20944e" }} />);
    expect(screen.getByTestId('hourchart')).toBeInTheDocument();
  });

  it('should contain metric value', async() => {
    render(<HourChart value={10} text="10" id="testChart" max={100} gradientColors={{ start: "#acf254", end: "#20944e" }} />);

    await waitFor(() => {
          expect(screen.getByTestId("value")).toHaveTextContent("10");
        });
  });
});
