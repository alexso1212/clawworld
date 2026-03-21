import { render, screen } from '@testing-library/react'
import App from '../../src/App'

test('renders the Clawworld office shell', () => {
  render(<App />)

  expect(screen.getByText('Clawworld')).toBeInTheDocument()
  expect(screen.getByTestId('scene-host')).toBeInTheDocument()
  expect(screen.getByTestId('overlay-root')).toBeInTheDocument()
})
