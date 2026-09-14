/* ==========================================================================
   Card Cycle Click Sound Synthesizer
   --------------------------------------------------------------------------
   Tactile, organic acoustic click designed specifically for cycling cards.
   Engineered to prevent ear fatigue over repeated clicks:
   1. Warm Acoustic Timbre: Centered at ~530Hz (warm cardstock/wood pop)
      without piercing high frequencies or boomy bass.
   2. Micro-Pitch Randomization (±4%): Jitters the frequency slightly on each
      click so the ear never hears an identical synthetic repetition.
   3. Ultra-Fast Envelope (~18ms): Snappy tactile feedback that disappears
      cleanly without lingering.
   4. Fully Customizable: Easily tweak volume, frequency, or point to an audio
      file URL in CARD_CLICK_CONFIG.
   ========================================================================== */

export const CARD_CLICK_CONFIG = {
  enabled: true,
  volume: 0.20,              // Soft, comfortable volume floor (0.0 to 1.0)
  baseFreq: 530,             // Warm fundamental frequency (Hz)
  pitchJitter: 0.045,        // ±4.5% random detuning per click (humanization)
  decay: 0.018,              // Ultra-fast decay duration in seconds (~18ms)
  audioUrl: '',              // Optional: path to an audio file (e.g. '/card-click.mp3')
};

export let activeCardClickConfig = { ...CARD_CLICK_CONFIG };

export function configureCardClick(customOptions = {}) {
  activeCardClickConfig = { ...activeCardClickConfig, ...customOptions };
  return activeCardClickConfig;
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
    cachedAudioCtx.resume().catch(() => {});
  }
  return cachedAudioCtx;
}

/**
 * Plays an organic, tactile click sound for card cycling.
 * @param {Object} [overrides] - Optional per-call overrides
 */
export function playCardCycleSound(overrides = {}) {
  const cfg = { ...activeCardClickConfig, ...overrides };
  if (!cfg.enabled || cfg.volume <= 0) return;

  // Mode 1: Custom audio file playback (if configured)
  if (cfg.audioUrl) {
    try {
      const audio = new Audio(cfg.audioUrl);
      audio.volume = Math.max(0, Math.min(1, cfg.volume));
      audio.play().catch(() => {});
      return;
    } catch (e) {}
  }

  // Mode 2: Procedural organic paper/cardstock synthesis
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Micro-jitter frequency by ±pitchJitter so every cycle click is subtly unique
    const jitter = (Math.random() * 2 - 1) * cfg.pitchJitter;
    const freq = cfg.baseFreq * (1 + jitter);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(cfg.volume, now);
    masterGain.connect(ctx.destination);

    // 1. Warm body pop (fast exponential decay)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.005);

    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + cfg.decay);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + cfg.decay);

    // 2. Subtle cardstock surface texture (micro-filtered noise burst)
    const bufferSize = Math.max(128, Math.floor(ctx.sampleRate * 0.015));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.8, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 0.015);
  } catch (err) {
    // Graceful fallback if audio context blocked
  }
}
