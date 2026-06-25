import React, { useState, useEffect } from 'react';
import './App.css';
import { Upload } from './components/Upload';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { Book } from './types';

type ViewType = 'library' | 'reader' | 'upload';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    initDB();
    loadBooks();
  }, []);

  const initDB = () => {
    const request = indexedDB.open('ebook-reader', 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
    };
  };

  const loadBooks = async () => {
    const request = indexedDB.open('ebook-reader', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('books', 'readonly');
      const store = transaction.objectStore('books');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        setBooks(getAllRequest.result);
      };
    };
  };

  const handleAddBook = (book: Book) => {
    const request = indexedDB.open('ebook-reader', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('books', 'readwrite');
      const store = transaction.objectStore('books');
      store.add(book);
      transaction.oncomplete = () => {
        setBooks([...books, book]);
        setCurrentView('library');
      };
    };
  };

  const handleDeleteBook = (bookId: string) => {
    const request = indexedDB.open('ebook-reader', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('books', 'readwrite');
      const store = transaction.objectStore('books');
      store.delete(bookId);
      transaction.oncomplete = () => {
        setBooks(books.filter(b => b.id !== bookId));
      };
    };
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reader');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  return (
    <div className="app">
      {currentView === 'library' && (
        <Library
          books={books}
          onSelectBook={handleSelectBook}
          onAddBook={() => setCurrentView('upload')}
          onDeleteBook={handleDeleteBook}
        />
      )}
      {currentView === 'upload' && (
        <Upload
          onBookAdded={handleAddBook}
          onCancel={() => setCurrentView('library')}
        />
      )}
      {currentView === 'reader' && selectedBook && (
        <Reader
          book={selectedBook}
          onBack={handleBackToLibrary}
        />
      )}
    </div>
  );
}
