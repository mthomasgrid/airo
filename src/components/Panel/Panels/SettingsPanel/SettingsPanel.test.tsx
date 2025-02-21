import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPanel from "./SettingsPanel";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { AppDispatch, store } from "@/redux/store";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { toggleOnboardPopup } from "@/redux/slice/isOnBoarding";
import { useDispatch } from "react-redux";

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
}));

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn()
}));

describe("SettingsPanel Component", () => {
    let dispatch:  jest.MockedFunction<AppDispatch>;;

    beforeEach(() => {
        dispatch = jest.fn();
        useDispatch.mockReturnValue(dispatch);
    });

    test("renders component title successfully", () => {
        render(
            <Provider store={store}>
                <SettingsPanel />
            </Provider>
        );
        const element = screen.getByText("Settings");
        expect(element).toBeInTheDocument();
    });

    test("renders sign-in button", () => {
        render(
            <Provider store={store}>
                <SettingsPanel />
            </Provider>
        );
        const signInButton = screen.getByText("Sign In");
        expect(signInButton).toBeInTheDocument();
    });


    test("dispatches showPanel(false) when close icon is clicked", () => {
        render(
            <Provider store={store}>
                <SettingsPanel />
            </Provider>
        );
        const closeIcon = screen.getByAltText("x-icon");
        fireEvent.click(closeIcon);
        expect(dispatch).toHaveBeenCalledWith(showPanel(false));
    });

    test("dispatches toggleOnboardPopup(true) and hides panel when 'About this Application' is clicked", () => {
        render(
            <Provider store={store}>
                <SettingsPanel />
            </Provider>
        );
        const aboutAppText = screen.getByText("About this Application →");
        fireEvent.click(aboutAppText);
        expect(dispatch).toHaveBeenCalledWith(toggleOnboardPopup(true));
        expect(dispatch).toHaveBeenCalledWith(showPanel(false));
    });
});
