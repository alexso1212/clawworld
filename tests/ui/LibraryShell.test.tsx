import { fireEvent, render, screen } from '@testing-library/react'
import App from '../../src/App'

test('renders the clawlibrary-style shell as the default app experience', () => {
  render(<App />)

  expect(screen.getByText('ClawLibrary')).toBeInTheDocument()
  expect(screen.getByTestId('scene-host')).toBeInTheDocument()
  expect(screen.getByLabelText('Library room details')).toBeInTheDocument()
  expect(screen.getByLabelText('Library room details')).toHaveTextContent('Alarm Board')
  expect(screen.getByRole('button', { name: 'Runtime Monitor' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Queue Hub' })).toBeInTheDocument()
  expect(screen.getByText('Preview Shelf')).toBeInTheDocument()
  expect(screen.getByLabelText('Asset preview')).toHaveTextContent('Watch Slip')
  expect(screen.getByLabelText('Library status rail')).toHaveTextContent('Mock Feed')
  expect(screen.getByLabelText('Library room details')).toHaveTextContent('rerouting')
})

test('updates the room detail panel when a library room is selected', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'Document Archive' }))

  expect(screen.getByLabelText('Library room details')).toHaveTextContent('Document Archive')
  expect(screen.getByLabelText('Library room details')).toHaveTextContent('Indexed assets')
  expect(screen.getByLabelText('Asset preview')).toHaveTextContent('Website Refresh Specification')
})

test('updates the asset preview when a room asset is selected', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'Code Lab' }))
  fireEvent.click(screen.getByRole('button', { name: 'Route Pressure Map' }))

  expect(screen.getByLabelText('Asset preview')).toHaveTextContent('Route Pressure Map')
  expect(screen.getByLabelText('Asset preview')).toHaveTextContent('queue bottlenecks')
})
