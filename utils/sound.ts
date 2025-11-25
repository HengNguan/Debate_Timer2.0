
export const playAlertSound = (type: 'warning' | 'end') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'warning') {
      // Short beep (High pitch) - 30s warning
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.50);
    } else {
      // Long beep (Lower pitch, longer sustain) - Time up
      osc.type = 'square'; 
      osc.frequency.setValueAtTime(440, now); // A4
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 1.0); 
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
    }
    
    // Clean up context after sound
    setTimeout(() => {
        if (ctx.state !== 'closed') ctx.close();
    }, 2000);
  } catch (e) {
    console.error("Audio error", e);
  }
};
