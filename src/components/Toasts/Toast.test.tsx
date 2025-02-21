import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import { hideToast } from "@/redux/slice/toastSlice";
import Toast from "./Toast";

const mockStore = configureMockStore([]);
const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <Toast type={""} msg={""} />
    </Provider>
  );



  jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
  }));

describe("Toast Component", () => {
  test("should not render when toast is not visible", () => {
    const store = mockStore({ toast: { isVisible: false, message: "", type: "success" } });
    renderWithStore(store);
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  test("should render success toast", () => {
    const store = mockStore({ toast: { isVisible: true, message: "Success message", type: "success" } });
    renderWithStore(store);
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  test("should render error toast", () => {
    const store = mockStore({ toast: { isVisible: true, message: "Error message", type: "error" } });
    renderWithStore(store);
    expect(screen.getByText("Oops!")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  test("should hide toast after 5 seconds", () => {
    jest.useFakeTimers();
    const store = mockStore({ toast: { isVisible: true, message: "Auto-hide test", type: "success" } });
    store.dispatch = jest.fn();

    renderWithStore(store);
    jest.advanceTimersByTime(5000);

    expect(store.dispatch).toHaveBeenCalledWith(hideToast());
  });

  test("should render button when isBtn is true", () => {
    const store = mockStore({ toast: { isVisible: true, message: "Button test", type: "success" } });
    render(
      <Provider store={store}>
        <Toast isBtn={true} btnText="Retry" type={""} msg={""} />
      </Provider>
    );

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });
});
