import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; 
import { Panel } from "./Panel";
import { configureStore } from "redux-mock-store";


jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
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
describe("Panel Component",()=>{
  test("renders Initial Settings Panel Component", () => {
          render(
              <Provider store={store}>
                  <Panel/>
              </Provider>
          );
          const element = screen.getByText("Settings");
          expect(element).toBeInTheDocument();
      });

      test("renders User Panel Component when user is authenticated", () => {
        const store = mockStore({
            auth: { user: { name: "John Doe" } }, 
            selectedDevice: null,
            isEditDevicePanelShow: false
        });
    
        render(
            <Provider store={store}>
                <Panel />
            </Provider>
        );
    });
    

    
    test("renders Device Panel Component when a device is selected", () => {
        const store = mockStore({
            auth: { user: null },
            selectedDevice: { id: 1, name: "Device 1" },
            isEditDevicePanelShow: false
        });
    
        render(
            <Provider store={store}>
                <Panel />
            </Provider>
        );
    });
    

  
})
