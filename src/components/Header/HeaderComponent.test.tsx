import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header/HeaderComponent';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      signOut: jest.fn(),
    })),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      setCustomParameters: jest.fn(),
    })),
  }));

  describe("Header",()=>{
    test("renders sign-in button", () => {
        render(
            <Provider store={store}>
                <Header />
            </Provider>
        );
        const signInButton = screen.getByText("Voronoi clasterization");
        expect(signInButton).toBeInTheDocument();
    });
   test("toggle button",()=>{
    render(
        <Provider store={store}>
            <Header />
        </Provider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);
    expect(toggleButton.classList.contains('active')).toBe(true);
   });

  })


  