import { render, screen, fireEvent } from "@testing-library/react";
import { RemoveDevice } from "./RemoveDevice";


jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
  }));

describe("RemoveDevice Component", () => {
  test("renders correctly with text and buttons", () => {
    render(<RemoveDevice no={() => {}} yes={() => {}} />);

    expect(screen.getByText("Remove Device")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to remove this device?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
  });

  test("calls the correct functions when buttons are clicked", () => {
    const mockNo = jest.fn();
    const mockYes = jest.fn();

    render(<RemoveDevice no={mockNo} yes={mockYes} />);

    fireEvent.click(screen.getByRole("button", { name: /no/i }));
    expect(mockNo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /yes/i }));
    expect(mockYes).toHaveBeenCalledTimes(1);
  });
});