import { readFileSync } from 'fs'
import { join } from 'path'

describe('script.js logic', () => {
  let scriptContent: string

  beforeAll(() => {
    const scriptPath = join(__dirname, '../public/script.js')
    scriptContent = readFileSync(scriptPath, 'utf8')
  })

  beforeEach(() => {
    // Setup the DOM structure that script.js expects
    document.body.innerHTML = `
      <div id="lyrics-content"></div>
      <button id="start-btn"></button>
      <div id="playback-controls" style="display: none;">
        <button id="pause-btn"></button>
        <button id="stop-btn"></button>
        <button id="restart-btn"></button>
      </div>
      <canvas id="visualizer"></canvas>
    `
    // Eval the script content
    // We need to wrap it to avoid global scope issues if necessary, 
    // but script.js seems to be designed for global scope.
    const script = document.createElement('script')
    script.textContent = `{ ${scriptContent} }`
    document.body.appendChild(script)
  })

  it('populates the lyrics content', () => {
    const lyricsContent = document.getElementById('lyrics-content')
    expect(lyricsContent?.children.length).toBeGreaterThan(0)
    expect(lyricsContent?.querySelector('#line-0')).toHaveTextContent('[Verse 1]')
  })

  it('sets up button click handlers', () => {
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement
    expect(typeof startBtn.onclick).toBe('function')
  })

  it('starts performance when start button is clicked', async () => {
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement
    const playbackControls = document.getElementById('playback-controls')
    
    // Mocking AudioContext is already done in jest.setup.ts
    
    startBtn.click()
    
    // In script.js:
    // startBtn.style.display = 'none';
    // playbackControls.style.display = 'flex';
    
    expect(startBtn.style.display).toBe('none')
    expect(playbackControls?.style.display).toBe('flex')
  })
})
