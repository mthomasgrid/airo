import { render, screen} from "@testing-library/react";
import OnBoardingComponent from "./OnBoardingComponent";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import {store} from "@/redux/store";


const mockCloseOnBoarding = jest.fn();

  jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
  }));

describe("OnBoardingComponent", () => {
    test("renders onboarding content", () => {
        render(<Provider store={store}>
            <OnBoardingComponent closeOnBoarding={mockCloseOnBoarding} />
        </Provider>);
    
        expect(screen.getByText("Hi there!")).toBeInTheDocument();
        expect(screen.getByText(/Let us introduce the AIRO by Grid Dynamics/i)).toBeInTheDocument();
    });

    test("renders logo images", () => {
        render(<Provider store={store}>
            <OnBoardingComponent closeOnBoarding={mockCloseOnBoarding} />
        </Provider>);

        const logo = screen.getByAltText("Logo");
        expect(logo).toBeInTheDocument();
    });

  
});