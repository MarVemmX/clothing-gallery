// Subtle high-end tactile sound synthesis using Web Audio API (Zero external assets needed)

let audioCtx = null;
let soundEnabled = true;

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('arewa_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch {}
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('arewa_sound_enabled', String(soundEnabled));
    } catch {}
  }
  if (!soundEnabled && audioCtx && audioCtx.state === 'running') {
    try {
      audioCtx.suspend();
    } catch {}
  }
}

export function toggleSound() {
  setSoundEnabled(!soundEnabled);
  return soundEnabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended' && soundEnabled) {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle metallic hanger hook clink on rod
export function playRailClink() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1420, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Graceful fallback
  }
}

// Soft fabric swoosh / flip sound
export function playFabricSwoosh() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Filtered pink-ish noise buffer for cloth texture
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {
    // Graceful fallback
  }
}

// Crisp subtle UI tap
export function playSoftClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Graceful fallback
  }
}
