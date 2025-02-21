import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore,{ MockStoreEnhanced } from 'redux-mock-store';
import EditDevicePanel from './EditDevicePanel';


interface State {
  selectedDevice: {
    id: string;
    name: string;
    address: string;
    description: string;
    location: {
      lat: number;
      lng: number;
    };
    aqi: number;
    uid: string;
  };
}

const mockStore = configureStore([]);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn(),
  })),
}));

describe('EditDevicePanel', () => {
  let store: MockStoreEnhanced<State>;

  beforeEach(() => {
    
    store = mockStore({
      selectedDevice: {
        id: '1',
        name: 'Test Device',
        address: '123 Test St',
        description: 'Test Description',
        location: { lat: 0, lng: 0 },
        aqi: 50,
        uid: 'user123',
      },
    });
  });

 

  it('toggles edit mode when the Edit/Save button is clicked', () => {
    render(
      <Provider store={store}>
        <EditDevicePanel />
      </Provider>
    );

    
    const editButton = screen.getByText('Edit Device');
    expect(editButton).toBeInTheDocument();

    
    fireEvent.click(editButton);

    
    expect(screen.getByText('Save')).toBeInTheDocument();

   
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Edit Device')).toBeInTheDocument();
  });

  it('shows the remove device modal when the remove button is clicked', () => {
    render(
      <Provider store={store}>
        <EditDevicePanel />
      </Provider>
    );

   
    const removeButton = screen.getByText('Remove Device');
    fireEvent.click(removeButton);

    
    expect(screen.getByText('Are you sure you want to remove this device?')).toBeInTheDocument();
  });

  it('cancels edit mode when the Cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <EditDevicePanel />
      </Provider>
    );

  
    fireEvent.click(screen.getByText('Edit Device'));

   
    fireEvent.click(screen.getByText('Cancel'));

    
    expect(screen.getByText('Edit Device')).toBeInTheDocument();
  });
});