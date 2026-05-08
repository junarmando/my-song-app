import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the title and subtitle', () => {
    render(<Home />)
    expect(screen.getByText('Future in the Glimmer')).toBeInTheDocument()
    expect(screen.getByText('Text to speech with a beat.')).toBeInTheDocument()
  })

  it('renders the start button', () => {
    render(<Home />)
    const startButton = screen.getByRole('button', { name: /start performance/i })
    expect(startButton).toBeInTheDocument()
  })

  it('renders the playback controls', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
  })

  it('renders the lyrics window and visualizer canvas', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#lyrics-window')).toBeInTheDocument()
    expect(container.querySelector('#visualizer')).toBeInTheDocument()
  })

  it('injects the script.js on mount', () => {
    render(<Home />)
    const script = document.querySelector('script[src="./script.js"]')
    expect(script).toBeInTheDocument()
  })
})
