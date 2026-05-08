import '@testing-library/jest-dom'

// Mock Web Audio API
class AudioContextMock {
  createAnalyser() {
    return {
      fftSize: 256,
      frequencyBinCount: 128,
      getByteFrequencyData: jest.fn(),
    }
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    }
  }
  createOscillator() {
    return {
      frequency: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }
  }
  createBuffer() {
    return {
      getChannelData: jest.fn(() => new Float32Array(100)),
    }
  }
  createBufferSource() {
    return {
      connect: jest.fn(),
      start: jest.fn(),
    }
  }
  createBiquadFilter() {
    return {
      type: 'highpass',
      frequency: { value: 1000 },
      connect: jest.fn(),
    }
  }
  close() { return Promise.resolve() }
  suspend() { return Promise.resolve() }
  resume() { return Promise.resolve() }
  currentTime = 0
  destination = {}
}

global.AudioContext = AudioContextMock as any
global.webkitAudioContext = AudioContextMock as any

// Mock SpeechSynthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
} as any

global.SpeechSynthesisUtterance = class {
  constructor(public text: string) {}
  lang = 'en-US'
  pitch = 0.5
  rate = 0.8
} as any

// Mock Canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
})) as any
