import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceName } from './DeviceName';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { showPanel } from '@/redux/slice/isPanelOpen';
import { selectDevice } from '@/redux/slice/selectedDevice';
import { showEditPanel } from '@/redux/slice/EditDevice';
import { RootState } from '@/redux/store';

const mockStore = configureStore<RootState>([]);

describe('DeviceName Component', () => {
  const defaultProps = {
    deviceName: 'Test Device',
    deviceAddress: '123 Test St',
    deviceDescription: 'Test Description',
  };

  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  describe('View Mode (non-editing)', () => {
    it('renders device information in view mode correctly', () => {
      render(
        <Provider store={store}>
          <DeviceName {...defaultProps} isEditing={false} />
        </Provider>
      );

      expect(screen.getByText('Test Device')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('closes panel when clicking X icon', () => {
      render(
        <Provider store={store}>
          <DeviceName {...defaultProps} isEditing={false} />
        </Provider>
      );

      const xIcon = screen.getByAltText('x-icon');
      fireEvent.click(xIcon);

      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(store.dispatch).toHaveBeenCalledWith(showPanel(false));
      expect(store.dispatch).toHaveBeenCalledWith(showEditPanel(false));
      expect(store.dispatch).toHaveBeenCalledWith(selectDevice(null));
    });
  });

  describe('Edit Mode', () => {
    const mockSetDeviceName = jest.fn();
    const mockSetDeviceAddress = jest.fn();
    const mockSetDeviceDescription = jest.fn();

    const editProps = {
      ...defaultProps,
      isEditing: true,
      setDeviceName: mockSetDeviceName,
      setDeviceAddress: mockSetDeviceAddress,
      setDeviceDescription: mockSetDeviceDescription,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders input fields in edit mode', () => {
      render(
        <Provider store={store}>
          <DeviceName {...editProps} />
        </Provider>
      );

      expect(screen.getByDisplayValue('Test Device')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });

    it('updates device name when input changes', () => {
      render(
        <Provider store={store}>
          <DeviceName {...editProps} />
        </Provider>
      );

      const nameInput = screen.getByDisplayValue('Test Device');
      fireEvent.change(nameInput, { target: { value: 'New Device Name' } });

      expect(mockSetDeviceName).toHaveBeenCalledWith('New Device Name');
    });

    it('updates device address when input changes', () => {
      render(
        <Provider store={store}>
          <DeviceName {...editProps} />
        </Provider>
      );

      const addressInput = screen.getByDisplayValue('123 Test St');
      fireEvent.change(addressInput, { target: { value: '456 New St' } });

      expect(mockSetDeviceAddress).toHaveBeenCalledWith('456 New St');
    });

    it('updates device description when textarea changes', () => {
      render(
        <Provider store={store}>
          <DeviceName {...editProps} />
        </Provider>
      );

      const descriptionTextarea = screen.getByDisplayValue('Test Description');
      fireEvent.change(descriptionTextarea, { 
        target: { value: 'New Description' } 
      });

      expect(mockSetDeviceDescription).toHaveBeenCalledWith('New Description');
    });
  });

  describe('Image rendering', () => {
    it('renders all required images with correct props', () => {
      render(
        <Provider store={store}>
          <DeviceName {...defaultProps} isEditing={false} />
        </Provider>
      );

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3); // X icon, Location icon, Pen icon

      expect(screen.getByAltText('x-icon')).toHaveAttribute('src', '/icons/Xline.svg');
      expect(screen.getByAltText('logout-icon')).toHaveAttribute('src', '/icons/Location.svg');
      expect(screen.getByAltText('pen-icon')).toHaveAttribute('src', '/icons/Pen.svg');
    });
  });
});