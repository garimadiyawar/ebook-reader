import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { ttsEngine, TTSSettings } from '../utils/textToSpeech';
import './Reader.css';

interface ReaderProps {
  book: Book;
  onBack: () => void;
}

interface Bookmark {
  chapterIndex: number;
  sentenceIndex: number;
}

// Split text into sentences
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/g)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Render markdown-like formatting: **bold** → <strong>, *italic* → <em>
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function Reader({ book, onBack }: ReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(book.currentChapter || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0.9);
  const [volume, setVolume] = useState(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [resumeBookmark, setResumeBookmark] = useState<Bookmark | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const settingsSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentChapter = book.chapters[currentChapterIndex];
  const sentences = splitSentences(currentChapter.content);
  const bookmarkKey = `bm-${book.id}`;

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        const femaleIndex = voices.findIndex(v =>
          v.name.includes('Female') || v.name.includes('female') ||
          v.name.includes('Woman') || v.name.includes('Victoria') ||
          v.name.includes('Samantha') || v.name.includes('Moira')
        );
        setSelectedVoiceIndex(femaleIndex >= 0 ? femaleIndex : 0);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (settingsSyncTimeoutRef.current) {
        clearTimeout(settingsSyncTimeoutRef.current);
      }
    };
  }, []);

  // Load bookmark and restore position
  useEffect(() => {
    const saved = localStorage.getItem(bookmarkKey);
    if (saved) {
      const bm = JSON.parse(saved) as Bookmark;
      if (bm.chapterIndex === currentChapterIndex) {
        setCurrentSentenceIndex(bm.sentenceIndex);
        setResumeBookmark(bm);
      }
    }
  }, [bookmarkKey, currentChapterIndex]);

  // Auto-scroll to active sentence
  useEffect(() => {
    const ref = sentenceRefs.current[currentSentenceIndex];
    if (ref && contentRef.current) {
      setTimeout(() => {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [currentSentenceIndex]);

  // Save bookmark whenever sentence changes
  useEffect(() => {
    if (isPlaying) {
      localStorage.setItem(bookmarkKey, JSON.stringify({
        chapterIndex: currentChapterIndex,
        sentenceIndex: currentSentenceIndex
      }));
    }
  }, [currentSentenceIndex, isPlaying, bookmarkKey, currentChapterIndex]);

  const handlePlay = () => {
    if (isPaused) {
      ttsEngine.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      if (availableVoices.length > 0) {
        ttsEngine.setPreferredVoice(availableVoices[selectedVoiceIndex]);
      }
      const settings: TTSSettings = { rate: speed, pitch, volume };
      ttsEngine.speakSentences(
        sentences,
        currentSentenceIndex,
        settings,
        availableVoices.length > 0 ? availableVoices[selectedVoiceIndex] : null,
        (index) => setCurrentSentenceIndex(index),
        () => {
          setIsPlaying(false);
          setIsPaused(false);
        }
      );
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    ttsEngine.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    setSelectedVoiceIndex(index);
    if (availableVoices.length > 0) {
      ttsEngine.setPreferredVoice(availableVoices[index]);
      debounceSyncSettings(speed, pitch, volume, index);
    }
  };

  // Debounce settings changes: pause, wait 1s, then resume with new settings
  const debounceSyncSettings = (s: number, p: number, v: number, vi: number) => {
    if (settingsSyncTimeoutRef.current) {
      clearTimeout(settingsSyncTimeoutRef.current);
    }

    if (isPlaying && !isPaused) {
      ttsEngine.pause();
    }

    settingsSyncTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        const settings: TTSSettings = { rate: s, pitch: p, volume: v };
        if (availableVoices.length > 0) {
          ttsEngine.setPreferredVoice(availableVoices[vi]);
        }
        ttsEngine.updateLiveSettings(settings);
        ttsEngine.resume();
      }
      settingsSyncTimeoutRef.current = null;
    }, 1000);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    debounceSyncSettings(newSpeed, pitch, volume, selectedVoiceIndex);
  };

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    debounceSyncSettings(speed, newPitch, volume, selectedVoiceIndex);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    debounceSyncSettings(speed, pitch, newVolume, selectedVoiceIndex);
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      handleStop();
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentSentenceIndex(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      handleStop();
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentSentenceIndex(0);
    }
  };

  const handleChapterSelect = (index: number) => {
    handleStop();
    setCurrentChapterIndex(index);
    setCurrentSentenceIndex(0);
    setIsChaptersOpen(false);
  };

  const handleSentenceTap = (index: number) => {
    handleStop();
    setCurrentSentenceIndex(index);
    // Auto-play from this sentence
    setTimeout(() => {
      if (availableVoices.length > 0) {
        ttsEngine.setPreferredVoice(availableVoices[selectedVoiceIndex]);
      }
      const settings: TTSSettings = { rate: speed, pitch, volume };
      ttsEngine.speakSentences(
        sentences,
        index,
        settings,
        availableVoices.length > 0 ? availableVoices[selectedVoiceIndex] : null,
        (idx) => setCurrentSentenceIndex(idx),
        () => {
          setIsPlaying(false);
          setIsPaused(false);
        }
      );
      setIsPlaying(true);
    }, 50);
  };

  // Parse chapter content into blocks (paragraphs and headings)
  const renderContent = () => {
    const lines = currentChapter.content.split('\n');
    const blocks: (React.ReactNode)[] = [];
    let currentParagraph: string[] = [];

    let globalSentenceIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('# ') || line.startsWith('## ')) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ');
          const blockSentences = splitSentences(paragraphText);
          const startIdx = globalSentenceIndex;
          blocks.push(
            <p key={`p-${blocks.length}`} className="reader-body">
              {blockSentences.map((sent, idx) => {
                const sentIdx = startIdx + idx;
                return (
                  <span
                    key={sentIdx}
                    ref={(el) => { sentenceRefs.current[sentIdx] = el; }}
                    data-sentence={sentIdx}
                    className={`sentence ${currentSentenceIndex === sentIdx ? 'sentence-active' : ''}`}
                    onClick={() => handleSentenceTap(sentIdx)}
                  >
                    {renderFormattedText(sent)}{' '}
                  </span>
                );
              })}
            </p>
          );
          globalSentenceIndex += blockSentences.length;
          currentParagraph = [];
        }

        // Add heading
        const level = line.startsWith('## ') ? 2 : 1;
        const headingText = line.replace(/^#+\s/, '');
        blocks.push(
          <h2
            key={`h-${blocks.length}`}
            className={level === 1 ? 'reader-h1' : 'reader-h2'}
          >
            {headingText}
          </h2>
        );
      } else if (line.trim() === '') {
        // Paragraph break
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ');
          const blockSentences = splitSentences(paragraphText);
          const startIdx = globalSentenceIndex;
          blocks.push(
            <p key={`p-${blocks.length}`} className="reader-body">
              {blockSentences.map((sent, idx) => {
                const sentIdx = startIdx + idx;
                return (
                  <span
                    key={sentIdx}
                    ref={(el) => { sentenceRefs.current[sentIdx] = el; }}
                    data-sentence={sentIdx}
                    className={`sentence ${currentSentenceIndex === sentIdx ? 'sentence-active' : ''}`}
                    onClick={() => handleSentenceTap(sentIdx)}
                  >
                    {renderFormattedText(sent)}{' '}
                  </span>
                );
              })}
            </p>
          );
          globalSentenceIndex += blockSentences.length;
          currentParagraph = [];
        }
      } else {
        // Normal line
        currentParagraph.push(line);
      }
    }

    // Flush last paragraph
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ');
      const blockSentences = splitSentences(paragraphText);
      const startIdx = globalSentenceIndex;
      blocks.push(
        <p key={`p-${blocks.length}`} className="reader-body">
          {blockSentences.map((sent, idx) => {
            const sentIdx = startIdx + idx;
            return (
              <span
                key={sentIdx}
                ref={(el) => { sentenceRefs.current[sentIdx] = el; }}
                data-sentence={sentIdx}
                className={`sentence ${currentSentenceIndex === sentIdx ? 'sentence-active' : ''}`}
                onClick={() => handleSentenceTap(sentIdx)}
              >
                {renderFormattedText(sent)}{' '}
              </span>
            );
          })}
        </p>
      );
    }

    return blocks;
  };

  return (
    <div className="reader-container">
      {/* Top Bar */}
      <div className="reader-topbar">
        <button className="topbar-button" onClick={onBack} title="Back to library">
          ←
        </button>
        <h1 className="reader-title">{book.title}</h1>
        <button className="topbar-button" onClick={handlePreviousChapter} disabled={currentChapterIndex === 0} title="Previous chapter">
          ‹
        </button>
        <span className="chapter-counter">{currentChapterIndex + 1}/{book.chapters.length}</span>
        <button className="topbar-button" onClick={handleNextChapter} disabled={currentChapterIndex === book.chapters.length - 1} title="Next chapter">
          ›
        </button>
        <button className="topbar-button" onClick={() => setIsChaptersOpen(!isChaptersOpen)} title="Chapters">
          ≡
        </button>
        <button className="topbar-button" onClick={() => setIsSettingsOpen(!isSettingsOpen)} title="Settings">
          ⚙
        </button>
      </div>

      {/* Chapters Panel */}
      {isChaptersOpen && (
        <div className="chapters-overlay" onClick={() => setIsChaptersOpen(false)}>
          <div className="chapters-panel" onClick={(e) => e.stopPropagation()}>
            <div className="chapters-header">
              <h3>Chapters</h3>
              <button className="close-button" onClick={() => setIsChaptersOpen(false)}>✕</button>
            </div>
            <div className="chapters-list">
              {book.chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  className={`chapter-item ${index === currentChapterIndex ? 'active' : ''}`}
                  onClick={() => handleChapterSelect(index)}
                >
                  <span className="chapter-number">{index + 1}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Settings</h3>
              <button className="close-button" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>

            <div className="setting-item">
              <label className="setting-label">Voice ({availableVoices.length})</label>
              <select
                value={selectedVoiceIndex}
                onChange={handleVoiceChange}
                className="setting-select"
              >
                {availableVoices.length === 0 ? (
                  <option>Loading voices...</option>
                ) : (
                  availableVoices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Speed: {speed.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Pitch: {pitch.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Volume: {(volume * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resume Bookmark Toast */}
      {resumeBookmark && resumeBookmark.sentenceIndex > 0 && (
        <div className="bookmark-toast">
          <p>Resume reading from saved position</p>
          <button onClick={() => setResumeBookmark(null)}>✕</button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="reader-content" ref={contentRef}>
        <div className="reader-text">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="reader-controls">
        <button
          className={`control-button ${isPlaying && !isPaused ? 'active' : ''}`}
          onClick={handlePlay}
          disabled={isPlaying && !isPaused}
          title={isPlaying && !isPaused ? 'Now playing' : 'Play'}
        >
          {isPlaying && !isPaused ? '⏸' : '▶'}
        </button>

        {(isPlaying || isPaused) && (
          <button
            className="control-button"
            onClick={handleStop}
            title="Stop"
          >
            ⏹
          </button>
        )}
      </div>
    </div>
  );
}
