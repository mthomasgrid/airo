import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ContextMenu from '@/components/ContextMenu/ContextMenu';


describe('ContextMenu Component', () => {
  const mockMenuActions = [
    { label: 'Edit', onClick: jest.fn() },
    { label: 'Delete', onClick: jest.fn(), className: 'delete-button' },
  ];

  it('renders the context menu with the correct actions', () => {
    render(<ContextMenu menuActions={mockMenuActions} />);

    const menuContainer = screen.getByRole('menu');
    expect(menuContainer).toBeInTheDocument();

    
    mockMenuActions.forEach((action) => {
      const menuItem = screen.getByText(action.label);
      expect(menuItem).toBeInTheDocument();
      expect(menuItem).toHaveClass('menuItem'); 
      if (action.className) {
        expect(menuItem).toHaveClass(action.className);
      }
    });
  });

  it('calls the onClick handler when a menu item is clicked', () => {
    render(<ContextMenu menuActions={mockMenuActions} />);

    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(mockMenuActions[0].onClick).toHaveBeenCalledTimes(1);

  
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockMenuActions[1].onClick).toHaveBeenCalledTimes(1);
  });


});