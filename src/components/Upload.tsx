import React, { useRef, useState } from 'react';
import { Book } from '../types';
import { parseMarkdown, parseEpub, parseMobi } from '../utils/bookParser';
import './Upload.css';

interface UploadProps {
  onBookAdded: (book: Book) => void;
  onCancel: () => void;
}

export function Upload({ onBookAdded, onCancel }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      let book: Book | null = null;

      if (file.name.endsWith('.md')) {
        book = await parseMarkdown(file);
      } else if (file.name.endsWith('.epub')) {
        book = await parseEpub(file);
      } else if (file.name.endsWith('.mobi')) {
        book = await parseMobi(file);
      } else {
        setError('Unsupported file format. Please upload .md, .epub, or .mobi files.');
        setIsLoading(false);
        return;
      }

      if (book) {
        onBookAdded(book);
      }
    } catch (err) {
      setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h1>Add a Book</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="upload-area" onClick={triggerFileInput}>
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing your book...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📚</div>
              <p className="upload-text">Tap to select a file</p>
              <p className="upload-hint">Supports .md, .epub, .mobi</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.epub,.mobi"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <button className="cancel-button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
