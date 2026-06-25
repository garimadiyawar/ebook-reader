export interface TTSSettings {
  rate: number;
  pitch: number;
  volume: number;
}

export class TextToSpeechEngine {
  private synth = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private settings: TTSSettings = { rate: 1, pitch: 1, volume: 1 };
  private preferredVoice: SpeechSynthesisVoice | null = null;

  // Sentence-queue state
  private sentences: string[] = [];
  private currentSentenceIndex = 0;
  private isRunning = false;
  private isPausedState = false;
  private onSentenceStart?: (index: number) => void;
  private onDone?: () => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  setPreferredVoice(voice: SpeechSynthesisVoice | null) {
    this.preferredVoice = voice;
  }

  speakSentences(
    sentences: string[],
    startIndex: number,
    settings: TTSSettings,
    voice: SpeechSynthesisVoice | null,
    onSentenceStart?: (index: number) => void,
    onDone?: () => void
  ) {
    if (!sentences || sentences.length === 0) {
      console.warn('No sentences to speak');
      return;
    }

    this.sentences = sentences;
    this.currentSentenceIndex = startIndex;
    this.isRunning = true;
    this.isPausedState = false;
    this.settings = settings;
    this.preferredVoice = voice;
    this.onSentenceStart = onSentenceStart;
    this.onDone = onDone;

    this.synth.cancel();
    this.speakNextSentence();
  }

  private speakNextSentence() {
    if (!this.isRunning || this.currentSentenceIndex >= this.sentences.length) {
      this.isRunning = false;
      if (this.onDone) {
        this.onDone();
      }
      return;
    }

    const sentence = this.sentences[this.currentSentenceIndex];
    if (this.onSentenceStart) {
      this.onSentenceStart(this.currentSentenceIndex);
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = Math.max(0.1, Math.min(10, this.settings.rate));
    utterance.pitch = Math.max(0, Math.min(2, this.settings.pitch));
    utterance.volume = Math.max(0, Math.min(1, this.settings.volume));
    utterance.lang = 'en-US';

    const voices = this.synth.getVoices();
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    } else if (voices.length > 0) {
      const femaleVoices = voices.filter(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Female') ||
         v.name.includes('female') ||
         v.name.includes('Woman') ||
         v.name.includes('woman') ||
         v.name.includes('Victoria') ||
         v.name.includes('Samantha') ||
         v.name.includes('Moira') ||
         v.name.includes('Google UK English Female') ||
         v.name.includes('Google US English Female') ||
         v.name.includes('Ava') ||
         v.name.includes('Zira') ||
         v.name.includes('Aria'))
      );
      utterance.voice = femaleVoices.length > 0 ? femaleVoices[0] : voices[0];
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.currentSentenceIndex++;
      this.speakNextSentence();
    };

    utterance.onend = () => {
      this.currentSentenceIndex++;
      this.speakNextSentence();
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch (error) {
      console.error('Error starting speech synthesis:', error);
    }
  }

  updateLiveSettings(settings: Partial<TTSSettings>) {
    const newSettings = { ...this.settings, ...settings };
    this.settings = newSettings;

    if (this.isRunning && !this.isPausedState) {
      const savedIndex = this.currentSentenceIndex;
      this.synth.cancel();
      this.currentUtterance = null;
      this.currentSentenceIndex = savedIndex;
      this.speakNextSentence();
    }
  }

  pause() {
    this.synth.pause();
    this.isPausedState = true;
  }

  resume() {
    this.synth.resume();
    this.isPausedState = false;
  }

  stop() {
    this.synth.cancel();
    this.currentUtterance = null;
    this.isRunning = false;
    this.isPausedState = false;
  }

  getCurrentSentenceIndex(): number {
    return this.currentSentenceIndex;
  }

  isPlaying(): boolean {
    return this.isRunning && !this.isPausedState;
  }

  isPaused(): boolean {
    return this.isPausedState;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
}

export const ttsEngine = new TextToSpeechEngine();
