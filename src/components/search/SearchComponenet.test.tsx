import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Search from "@/components/search/SearchComponent";
import { allDevicesSelector } from "@/redux/selectors/deviceSelector";

jest.mock("@/redux/selectors/deviceSelector", () => ({
  allDevicesSelector: jest.fn(),
}));

jest.mock("@/redux/slice/isPanelOpen", () => ({
  showPanel: jest.fn(),
}));

jest.mock("@/redux/slice/selectedDevice", () => ({
  selectDevice: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn(),
  })),
}));

const mockStore = configureStore([]);

describe("Search Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      devices: [{ id: 1, name: "Device 1", address: "Address 1" }, { id: 2, name: "Device 2", address: "Address 2" }],
    });
    allDevicesSelector.mockReturnValue(store.getState().devices);
    store.dispatch = jest.fn();
  });

  test("renders search input field", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    expect(screen.getByPlaceholderText("Type address or device name...")).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const input = screen.getByPlaceholderText("Type address or device name...");
    fireEvent.change(input, { target: { value: "Device 1" } });
    expect(input.value).toBe("Device 1");
  });

});
