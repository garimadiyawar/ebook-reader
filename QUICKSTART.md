# Quick Start - Ebook Reader PWA

## 5-Minute Setup

### 1. Test the App Locally (Right Now!)

```bash
cd C:\Users\gdiya\ebook-reader
npm start
```

Your app opens at **http://localhost:3000** - test it in your browser first!

### 2. Try Adding a Test Book

Create a simple test file `test.md`:

```markdown
# Chapter 1: Hello World
This is the first chapter of your test book.

# Chapter 2: Second Part
Now you can listen to this being read aloud!
```

Then:
1. Open the app at http://localhost:3000
2. Click "+ Add Book"
3. Select your `test.md` file
4. Click the book to open the reader
5. Click ▶ Play and listen to your first audiobook!

### 3. Deploy When Ready

Once you're happy with it, pick ONE option:

#### Option A: Vercel (Recommended - Takes 2 minutes)
```bash
npm install -g vercel
vercel
```
Follow the prompts, and your app is live!

#### Option B: Netlify
1. Run: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `build` folder
4. Done!

---

## App Features

| Feature | Status |
|---------|--------|
| Upload MD files | ✅ Works |
| Upload EPUB files | ✅ Works |
| Upload MOBI files | ✅ Works (basic) |
| Text-to-speech | ✅ Works |
| Offline mode | ✅ Works |
| Chapter navigation | ✅ Works |
| Speed control | ✅ Works |
| Pitch control | ✅ Works |
| Volume control | ✅ Works |
| Home screen PWA | ✅ Works on iOS |

---

## iOS Setup (When Deployed)

1. Open your deployed app in iPhone Safari
2. Tap Share → Add to Home Screen
3. Name it "Ebook Reader"
4. Open from home screen - it's now a full app!

---

## File Structure

```
ebook-reader/
├── src/
│   ├── App.tsx                 # Main app logic
│   ├── components/
│   │   ├── Upload.tsx          # Upload page
│   │   ├── Library.tsx         # Book library
│   │   └── Reader.tsx          # Reader with TTS
│   ├── utils/
│   │   ├── bookParser.ts       # Parse MD/EPUB/MOBI
│   │   └── textToSpeech.ts     # TTS engine
│   └── types.ts                # TypeScript types
├── public/
│   ├── service-worker.js       # Offline support
│   ├── manifest.json           # PWA config
│   └── index.html              # Main HTML
└── build/                      # Production build (run: npm run build)
```

---

## Commands

```bash
npm start          # Run locally (development)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Advanced: expose config (don't use unless needed)
```

---

## Troubleshooting

**Can't find npm?**
- Download Node.js from nodejs.org
- Restart your terminal after install

**Port 3000 already in use?**
```bash
# Kill the process on port 3000, or:
npm start -- --port 3001
```

**Need help with TTS settings?**
- **Speed**: 0.5x (slow) to 2x (fast) - try 1.2x for normal reading
- **Pitch**: 0.5 (low) to 2 (high) - 1 is normal
- **Volume**: 0 (silent) to 100% (loud)

---

## What's Next?

1. ✅ Run `npm start` to test locally
2. ✅ Add your first book (MD file)
3. ✅ Test the text-to-speech
4. ✅ Deploy to Vercel/Netlify
5. ✅ Open on iPhone
6. ✅ Add to home screen
7. ✅ Use at the gym! 💪

---

**Having issues?** Check DEPLOYMENT.md for detailed troubleshooting.
