// Web Audio API utilities for playing notes

class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Set master volume
    }
    return this.audioContext;
  }

  playNote(frequency: number, duration: number = 0.5): void {
    const context = this.getAudioContext();
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();

    // Create a guitar-like sound with multiple harmonics
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Set up envelope (ADSR)
    noteGain.gain.setValueAtTime(0, context.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.01); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.3, context.currentTime + 0.1); // Decay
    noteGain.gain.setValueAtTime(0.3, context.currentTime + duration - 0.1); // Sustain
    noteGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration); // Release

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode!);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);

    // Clean up
    oscillator.onended = () => {
      oscillator.disconnect();
      noteGain.disconnect();
    };
  }

  async playSequence(frequencies: number[], noteDuration: number = 0.5, gap: number = 0.1): Promise<void> {
    for (const frequency of frequencies) {
      this.playNote(frequency, noteDuration);
      await new Promise(resolve => setTimeout(resolve, (noteDuration + gap) * 1000));
    }
  }
}

export const audioPlayer = new AudioPlayer();
