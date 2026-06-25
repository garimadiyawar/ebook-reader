import React from 'react';
import { Book } from '../types';
import './Library.css';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddBook: () => void;
  onDeleteBook: (bookId: string) => void;
}

export function Library({ books, onSelectBook, onAddBook, onDeleteBook }: LibraryProps) {
  const handleDelete = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this book?')) {
      onDeleteBook(bookId);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>📚 My Books</h1>
        <button className="add-button" onClick={onAddBook}>
          + Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h2>No books yet</h2>
          <p>Add your first book to get started</p>
          <button className="primary-button" onClick={onAddBook}>
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => onSelectBook(book)}
            >
              <div className="book-cover">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} />
                ) : (
                  <div className="cover-placeholder">📖</div>
                )}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.chapters.length} chapters</p>
                {book.lastRead && (
                  <p className="last-read">
                    Last read: {new Date(book.lastRead).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                className="delete-button"
                onClick={(e) => handleDelete(e, book.id)}
                title="Delete book"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
