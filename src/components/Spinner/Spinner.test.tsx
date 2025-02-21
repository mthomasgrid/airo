import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';


describe('Spinner Component', () => {
  it('renders the spinner with default size and light theme', () => {
    const { getByTestId } = render(<Spinner />);
    const spinner = getByTestId('spinner');

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
    expect(spinner).toHaveClass('md');    
    expect(spinner).not.toHaveClass('dark'); 
  });

  it('renders the spinner with large size and dark theme', () => {
    const { getByTestId } = render(<Spinner size="lg" dark={true} />);
    const spinner = getByTestId('spinner');

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner'); 
    expect(spinner).toHaveClass('lg');   
    expect(spinner).toHaveClass('dark'); 
  });

  it('renders the spinner with small size', () => {
    const { getByTestId } = render(<Spinner size="sm" />);
    const spinner = getByTestId('spinner');

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner'); 
    expect(spinner).toHaveClass('sm');   
    expect(spinner).not.toHaveClass('dark');
  });
});