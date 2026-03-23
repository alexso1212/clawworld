import { render, screen } from '@testing-library/react'
import App from '../../src/App'

test('renders the ClawLibrary shell by default', () => {
  render(<App />)

  expect(screen.getByText('ClawLibrary')).toBeInTheDocument()
  expect(screen.getByTestId('scene-host')).toBeInTheDocument()
  expect(screen.getByLabelText('Library room details')).toBeInTheDocument()
})
