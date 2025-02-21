import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore,{ MockStoreEnhanced } from "redux-mock-store";
import AddNew from "./AddComponent";
import { showAddDevicePanel } from "@/redux/slice/isAddDevicePanelSlice";
import { RootState } from "@/redux/store";
import { AnyAction } from "@reduxjs/toolkit";

const mockStore = configureStore<Partial<RootState>, AnyAction>([]);
jest.mock("@/firebase/firebase.utils", () => ({
  addDevicetofb: jest.fn(() => Promise.resolve("mock-device-id")),
}));

describe("AddNew Component", () => {
  let store: MockStoreEnhanced<Partial<RootState>, AnyAction>;

  beforeEach(() => {
    store = mockStore({
      auth: { user: { uid: "test-user" } },
    });
    store.dispatch = jest.fn();
  });

  test("renders the component and form", () => {
    render(
      <Provider store={store}>
        <AddNew />
      </Provider>
    );

    expect(screen.getByText("Add new")).toBeInTheDocument();
    expect(screen.getByText("Device")).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
  });

  test("updates form inputs", () => {
    render(
      <Provider store={store}>
        <AddNew/>
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText("Type name...");
    fireEvent.change(nameInput, { target: { value: "Test Device" } });
    expect(nameInput).toHaveValue("Test Device");
  });

  test("calls dispatch when closing form", () => {
    render(
      <Provider store={store}>
        <AddNew />
      </Provider>
    );

    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);
    expect(store.dispatch).toHaveBeenCalledWith(showAddDevicePanel(false));
  });
});
