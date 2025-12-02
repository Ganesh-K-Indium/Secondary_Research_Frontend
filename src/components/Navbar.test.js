import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  test('renders navbar with title', () => {
    const mockProps = {
      currentChat: null,
      setCurrentChat: jest.fn(),
      currentSession: 'test-session',
      onNewSession: jest.fn()
    };

    render(<Navbar {...mockProps} />);
    expect(screen.getByText(/secondary research/i)).toBeInTheDocument();
  });
});