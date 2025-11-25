
// Use a shared AudioContext so we can prime it once and avoid the "first play" issue
let sharedAudioContext: AudioContext | null = null;

export const primeAudioContext = async () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  if (!sharedAudioContext) sharedAudioContext = new AudioContext();
  if (sharedAudioContext.state === 'suspended') {
    try {
      await sharedAudioContext.resume();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('AudioContext resume failed while priming (may require a user gesture):', err);
    }
  }
};

export const playAlertSound = async (type: 'warning' | 'end') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = sharedAudioContext || new AudioContext();
    if (!sharedAudioContext) sharedAudioContext = ctx;

    // On some browsers, the context starts in a suspended state and must be
    // resumed in response to a user gesture. If it's suspended, try to resume
    // (we await here so the oscillator is created and started only after the
    // resume resolves). If resume is rejected, we still attempt to create the
    // oscillator — playback may remain silent due to autoplay restrictions.
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        // Not fatal — just log. If resume fails because there wasn't a user
        // gesture, the sound will be blocked; subsequent user gestures can
        // resume the context and later calls will succeed.
        // eslint-disable-next-line no-console
        console.warn('AudioContext resume failed (may require a user gesture):', err);
      }
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Centralized configuration for alert sounds so we can tune them easily
    const WARNING_DURATION = 1.0; // seconds - must be less than END_DURATION
    const WARNING_FREQ = 880; // A5
    const WARNING_INITIAL_GAIN = 0.50; // increase volume for warning

    const END_DURATION = 1.5; // seconds
    const END_FREQ = 440; // A4
    const END_INITIAL_GAIN = 0.20;

    if (type === 'warning') {
      // Longer short beep, high pitch - 30s warning (still shorter than the end alert)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(WARNING_FREQ, now);
      // Start louder for better noticeability, then fade quickly but keep audible
      gain.gain.setValueAtTime(WARNING_INITIAL_GAIN, now);
      // Maintain a high volume for most of the beep, then fade towards the end
      gain.gain.linearRampToValueAtTime(WARNING_INITIAL_GAIN * 0.25, now + WARNING_DURATION * 0.75);
      gain.gain.linearRampToValueAtTime(0.01, now + WARNING_DURATION);
      osc.start(now);
      osc.stop(now + WARNING_DURATION);
    } else {
      // Long beep (Lower pitch, longer sustain) - Time up
      osc.type = 'square';
      osc.frequency.setValueAtTime(END_FREQ, now);
      gain.gain.setValueAtTime(END_INITIAL_GAIN, now);
      // Keep the end alert sustained then fade out to 0
      gain.gain.linearRampToValueAtTime(END_INITIAL_GAIN, now + 1.0);
      gain.gain.linearRampToValueAtTime(0, now + END_DURATION);
      osc.start(now);
      osc.stop(now + END_DURATION);
    }
    
    // If we created a transient ctx (not the shared one), close it after
    // playback finishes to avoid leaking audio contexts (desktop browsers
    // limit the total number of contexts). If we used the shared context,
    // leave it open (it can be closed by the app/host if desired).
    if (ctx !== sharedAudioContext) {
      const cleanupDelay = Math.max(WARNING_DURATION, END_DURATION) * 1000 + 500;
      setTimeout(() => {
        if (ctx.state !== 'closed') ctx.close();
      }, cleanupDelay);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};
