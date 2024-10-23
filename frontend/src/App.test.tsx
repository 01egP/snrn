import { render } from '@testing-library/react';
import App from './App';

test('renders User List heading', () => {
  const { getByText } = render(<App />);
  const headingElement = getByText(/user list/i); // Update to match the actual content
  expect(headingElement).toBeInTheDocument();
});
