import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserPanel from "./UserPanelComponent";
import { authUserSelector } from "@/redux/selectors/authSelector";
import { allDevicesSelector } from "@/redux/selectors/deviceSelector";

jest.mock("@/redux/selectors/authSelector", () => ({
  authUserSelector: jest.fn(),
}));

jest.mock("@/redux/selectors/deviceSelector", () => ({
  allDevicesSelector: jest.fn(),
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

describe("UserPanel Component", () => {
  let store;
  beforeEach(() => {
    store = mockStore({});
    authUserSelector.mockReturnValue({
      uid: "123",
      email: "testuser@example.com",
      displayName: "Test User",
      photoURL: "/test-photo.png",
    });
    allDevicesSelector.mockReturnValue([
      { uid: "123", name: "Device 1", address: "Address 1" },
    ]);
  });

  test("renders user profile information", () => {
    render(
      <Provider store={store}>
        <UserPanel />
      </Provider>
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  test("renders user devices", () => {
    render(
      <Provider store={store}>
        <UserPanel />
      </Provider>
    );
    expect(screen.getByText("Device 1")).toBeInTheDocument();
  });

  test("displays context menu on right-click", () => {
    render(
      <Provider store={store}>
        <UserPanel />
      </Provider>
    );

    const deviceElement = screen.getByText("Device 1");
    fireEvent.contextMenu(deviceElement);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
});
