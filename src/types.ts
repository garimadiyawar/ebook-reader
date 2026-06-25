export interface Book {
  id: string;
  title: string;
  content: string;
  chapters: Chapter[];
  coverImage?: string;
  uploadDate: number;
  lastRead?: number;
  currentChapter?: number;
  currentPosition?: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface ReaderState {
  isPlaying: boolean;
  currentChapterIndex: number;
  currentWord: number;
  speed: number;
}
