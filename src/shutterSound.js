/* ==========================================================================
   Shutter Sound Player & Synthesizer
   --------------------------------------------------------------------------
   Plays a crisp, physical camera shutter sound effect when the export /
   download button is clicked.

   Customization:
   1. Procedural Web Audio (default): Tweak the parameters below (pitch,
      noise frequency, doubleAction, volume) to adjust the mechanical tone.
   2. Custom Audio File: Set `audioUrl` to an MP3/WAV path (e.g., '/shutter.mp3')
      to play your own recorded audio sample instead of synthesis.
   ========================================================================== */

export const DEFAULT_SHUTTER_CONFIG = {
  enabled: true,
  volume: 0.70,            // Master volume (0.0 = silent, 1.0 = maximum)
  audioUrl: '',            // Optional: path to an audio file (e.g. '/shutter.mp3'). If set, plays this file.

  // ── Procedural Synthesizer Parameters ──
  pitch: 1800,             // Starting frequency of mechanical click transient (Hz)
  pitchDecay: 0.03,        // Duration of click transient (seconds)
  noiseFreq: 4100,         // Center frequency of shutter aperture noise (Hz)
  noiseDuration: 0.035,    // Duration of shutter noise burst (seconds)
  doubleAction: true,      // Dual mechanical action ("ka-chick" dual-curtain release)
  doubleActionDelay: 0.032,// Delay between first and second curtain click (seconds)
  curtainVolume: 0.70,     // Volume ratio of the secondary curtain click
};

// Global active config that can be modified or overridden
export let activeShutterConfig = { ...DEFAULT_SHUTTER_CONFIG };

export function configureShutterSound(customOptions = {}) {
  activeShutterConfig = { ...activeShutterConfig, ...customOptions };
  return activeShutterConfig;
}

let cachedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!cachedAudioCtx || cachedAudioCtx.state === 'closed') {
    cachedAudioCtx = new AudioCtx();
  }
  if (cachedAudioCtx.state === 'suspended') {
    cachedAudioCtx.resume().catch(() => { });
  }
  return cachedAudioCtx;
}

/**
 * Trigger the shutter sound effect.
 * @param {Object} [overrides] - Optional per-call overrides for any SHUTTER_CONFIG field.
 */
export function playShutterSound(overrides = {}) {
  const cfg = { ...activeShutterConfig, ...overrides };
  if (!cfg.enabled || cfg.volume <= 0) return;

  // Mode 1: Custom audio file playback (if audioUrl provided)
  if (cfg.audioUrl) {
    try {
      const audio = new Audio(cfg.audioUrl);
      audio.volume = Math.max(0, Math.min(1, cfg.volume));
      audio.play().catch((err) => {
        console.warn('Custom shutter audio playback failed:', err);
      });
      return;
    } catch (e) {
      console.warn('Audio element error, falling back to Web Audio synthesis:', e);
    }
  }

  // Mode 2: Procedural Web Audio API camera shutter synthesis
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(cfg.volume, now);
    masterGain.connect(ctx.destination);

    // 1. Noise burst helper (filtered mechanical blade friction)
    const createNoiseBurst = (startTime, duration, centerFreq, gainLevel) => {
      const bufferSize = Math.max(256, Math.floor(ctx.sampleRate * duration));
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(centerFreq, startTime);
      filter.Q.setValueAtTime(2.8, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(gainLevel, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);

      whiteNoise.start(startTime);
      whiteNoise.stop(startTime + duration);
    };

    // 2. Click transient helper (pitch-dropping mechanical trip)
    const createClickTransient = (startTime, duration, startFreq, gainLevel) => {
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(70, startTime + duration);

      clickGain.gain.setValueAtTime(gainLevel, startTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(clickGain);
      clickGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Curtain 1: Initial trip snap
    createClickTransient(now, cfg.pitchDecay, cfg.pitch, 0.45);
    createNoiseBurst(now, cfg.noiseDuration, cfg.noiseFreq, 0.55);

    // Curtain 2: Secondary mechanical close ("ka-chick")
    if (cfg.doubleAction) {
      const curtainTime = now + cfg.doubleActionDelay;
      createClickTransient(curtainTime, cfg.pitchDecay * 0.9, cfg.pitch * 0.8, 0.35 * cfg.curtainVolume);
      createNoiseBurst(curtainTime, cfg.noiseDuration * 0.9, cfg.noiseFreq * 0.85, 0.45 * cfg.curtainVolume);
    }
  } catch (err) {
    console.warn('Procedural shutter sound error:', err);
  }
}
