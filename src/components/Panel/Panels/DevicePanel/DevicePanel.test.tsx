import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore , { MockStoreEnhanced }from 'redux-mock-store';
import { DevicePanel } from './DevicePanel';
import { RootState } from '@/redux/store';

const mockStore = configureStore<RootState>([]);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn(),
  })),
}));

describe('DevicePanel', () => {
  let store:MockStoreEnhanced<RootState> ;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { id: '123', name: 'Test User' }, 
      },
      selectedDevice: {
        id: '1',
        name: 'Test Device',
        address: '123 Test St',
        description: 'Test Description',
        location: { lat: 0, lng: 0 },
      },
    });
  });

  it('renders the device name and address', () => {
    render(
      <Provider store={store}>
        <DevicePanel />
      </Provider>
    );

    expect(screen.getByText('Test Device')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('changes the active chart when time range buttons are clicked', () => {
    render(
      <Provider store={store}>
        <DevicePanel />
      </Provider>
    );

    const hourButton = screen.getByText('Hour');
    const todayButton = screen.getByText('Today');
    const weekButton = screen.getByText('Week');

    fireEvent.click(todayButton);
    expect(screen.getByText('Today').closest('button')).toHaveClass('active');

    fireEvent.click(weekButton);
    expect(screen.getByText('Week').closest('button')).toHaveClass('active');

    fireEvent.click(hourButton);
    expect(screen.getByText('Hour').closest('button')).toHaveClass('active');
  });

  it('shows the remove device modal when the remove button is clicked', () => {
    render(
      <Provider store={store}>
        <DevicePanel />
      </Provider>
    );

    const removeButton = screen.getByText('Remove Device');
    fireEvent.click(removeButton);

    expect(screen.getByText('Are you sure you want to remove this device?')).toBeInTheDocument();
  });
});