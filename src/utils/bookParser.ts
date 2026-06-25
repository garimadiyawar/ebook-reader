import { Book, Chapter } from '../types';
import JSZip from 'jszip';

export async function parseMarkdown(file: File): Promise<Book> {
  const text = await file.text();
  const chapters = extractChaptersFromMarkdown(text);

  return {
    id: generateId(),
    title: file.name.replace('.md', ''),
    content: text,
    chapters,
    uploadDate: Date.now(),
  };
}

export async function parseEpub(file: File): Promise<Book> {
  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    // Extract available files
    const files = Object.keys(content.files);

    const chapters: Chapter[] = [];
    let fullContent = '';
    let title = file.name.replace('.epub', '');

    // Extract text from HTML files
    const htmlFiles = files.filter(f =>
      (f.includes('OEBPS') || f.includes('content')) &&
      (f.endsWith('.xhtml') || f.endsWith('.html'))
    ).sort();

    for (const htmlPath of htmlFiles) {
      const fileContent = await content.file(htmlPath)?.async('text');
      if (fileContent) {
        const plainText = stripHtml(fileContent);
        if (plainText.trim().length > 0) {
          const chapterTitle = extractTitleFromHtml(fileContent) || `Chapter ${chapters.length + 1}`;
          fullContent += plainText + '\n\n';
          chapters.push({
            id: generateId(),
            title: chapterTitle,
            content: plainText,
          });
        }
      }
    }

    return {
      id: generateId(),
      title: title,
      content: fullContent,
      chapters: chapters.length > 0 ? chapters : [{ id: generateId(), title: 'Content', content: fullContent }],
      uploadDate: Date.now(),
    };
  } catch (error) {
    throw new Error(`Failed to parse EPUB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseMobi(file: File): Promise<Book> {
  // MOBI is a complex binary format. Extract as text from available content
  const text = await file.text().catch(() => '');
  const chapters = extractChaptersFromText(text || file.name);

  return {
    id: generateId(),
    title: file.name.replace('.mobi', ''),
    content: text,
    chapters,
    uploadDate: Date.now(),
  };
}

function extractChaptersFromMarkdown(content: string): Chapter[] {
  const chapters: Chapter[] = [];
  const lines = content.split('\n');
  let currentChapter = '';
  let currentTitle = 'Introduction';
  let foundFirstHeading = false;

  for (const line of lines) {
    // Treat ## as chapter breaks first (more specific)
    if (line.startsWith('## ')) {
      if (currentChapter.trim().length > 0) {
        chapters.push({
          id: generateId(),
          title: currentTitle,
          content: currentChapter.trim(),
        });
      }
      currentTitle = line.replace('## ', '').trim();
      currentChapter = '';
    }
    // Treat # as main title, but if we already found content, treat it as a chapter too
    else if (line.startsWith('# ')) {
      if (foundFirstHeading && currentChapter.trim().length > 0) {
        chapters.push({
          id: generateId(),
          title: currentTitle,
          content: currentChapter.trim(),
        });
      }
      currentTitle = line.replace('# ', '').trim();
      currentChapter = '';
      foundFirstHeading = true;
    } else {
      currentChapter += line + '\n';
    }
  }

  // Push the last chapter
  if (currentChapter.trim().length > 0) {
    chapters.push({
      id: generateId(),
      title: currentTitle,
      content: currentChapter.trim(),
    });
  }

  // If no chapters found, return the whole content as one chapter
  if (chapters.length === 0) {
    return [{ id: generateId(), title: 'Content', content: content.trim() }];
  }

  return chapters;
}

function extractChaptersFromText(content: string): Chapter[] {
  // Split by common chapter markers or just return as one chapter
  const chapters = content
    .split(/Chapter\s+\d+/i)
    .filter(ch => ch.trim().length > 0)
    .map((ch, idx) => ({
      id: generateId(),
      title: `Chapter ${idx + 1}`,
      content: ch.trim(),
    }));

  return chapters.length > 0 ? chapters : [{ id: generateId(), title: 'Content', content }];
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function extractTitleFromHtml(html: string): string | null {
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (titleMatch) {
    return stripHtml(titleMatch[1]);
  }
  const docTitleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (docTitleMatch) {
    return stripHtml(docTitleMatch[1]);
  }
  return null;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
