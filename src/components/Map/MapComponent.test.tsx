import React from "react";
import { MapComponent } from "./MapComponent";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";


// jest.mock("@/redux/selectors/deviceSelector", () => ({
//   allDevicesSelector: jest.fn(() => []),
// }));
// Mocking Firebase auth, firestore, and database services
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn(),
  })),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
}));

// Mocking mapbox-gl (you can customize mock as needed)
jest.mock("mapbox-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    flyTo: jest.fn(),
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
  })),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn(),
    remove: jest.fn(),
  })),
}));



beforeAll(() => {
  Object.defineProperty(global.navigator, "geolocation", {
    value: {
      getCurrentPosition: jest.fn((success) =>
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
          },
        })
      ),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
    writable: true,
  });
});

describe("MapComponent", () => {
  test("renders the map container", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  test("renders the spinner initially", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("spinner1")).toBeInTheDocument();
  });

  test("hides the spinner after map loads", async () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  test("renders the bottom section", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("bottomSection")).toBeInTheDocument();
  });

  test("renders the bottom section left", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("bottomSectionLeft")).toBeInTheDocument();
  });

  test("renders the bottom section right", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("bottomSectionRight")).toBeInTheDocument();
  });

  test("renders the zoom in button", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("mapButtonPlus")).toBeInTheDocument();
  });

  test("renders the zoom out button", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("mapButtonMinus")).toBeInTheDocument();
  });

  test("renders the center button", () => {
    render(
      <Provider store={store}>
        <MapComponent isPanelOpen={false} />
      </Provider>
    );
    expect(screen.getByTestId("mapButtonCenter")).toBeInTheDocument();
  });
});