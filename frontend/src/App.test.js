import { render, screen } from '@testing-library/react';
import App from './App';

test('renders User List heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/user list/i); // Update to match the actual content
  expect(headingElement).toBeInTheDocument();
});
