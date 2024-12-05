import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';

test('renders Welcome heading', () => {
  const { getByText } = render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <UserProvider>
        <App />
      </UserProvider>
    </MemoryRouter>,
  );
  const headingElement = getByText(/Welcome to Our Financial App/i);
  expect(headingElement).toBeInTheDocument();
});
