# 📚 Personal Ebook Reader PWA

A beautiful, offline-first Progressive Web App for reading ebooks aloud on your iPhone using natural text-to-speech. Perfect for listening while working out at the gym.

## ✨ Features

- 📱 **iPhone App-Like Experience** - Add to home screen, runs full-screen like a native app
- 🔊 **Natural Text-to-Speech** - Smooth, soothing narration with adjustable speed & pitch
- 📚 **Multiple Formats** - Upload MD (Markdown), EPUB, and MOBI files
- 🌐 **Works Offline** - All books stored locally, no internet needed
- ⚙️ **Full Controls** - Speed (0.5x-2x), Pitch (0.5-2), Volume (0-100%)
- 💾 **Persistent Storage** - Your books and reading position saved automatically
- 🎯 **Chapter Navigation** - Jump to any chapter instantly
- 🔒 **Private & Secure** - Everything stays on your device, no tracking

## 🚀 Quick Start

### 1. Test Locally (Right Now!)

```bash
cd C:\Users\gdiya\ebook-reader
npm start
```

Opens at **http://localhost:3000** - test before deploying!

### 2. Try with Example Book

The app comes with `EXAMPLE_BOOK.md`. When you start:
1. Click **+ Add Book**
2. Select `EXAMPLE_BOOK.md` from the project folder
3. Click the book to open reader
4. Click **▶ Play** and listen!

### 3. Deploy to iPhone (Choose One)

#### Quick Option: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Get a live URL in seconds.

#### Alternative: Netlify
1. Run: `npm run build`
2. Drag `build` folder to https://app.netlify.com/drop
3. Your app is live!

### 4. Add to iPhone Home Screen

1. Open your deployed app in Safari
2. Tap **Share** (box with arrow)
3. Tap **"Add to Home Screen"**
4. Name it "Ebook Reader"
5. Tap **Add** - now it's on your home screen! 🎉

## 📖 How to Use

### Adding Books

**Markdown Format** (Easiest for testing)
```markdown
# Chapter 1: Title
Your chapter content here...

# Chapter 2: Next Chapter
More content...
```

**EPUB Files**
- Standard ebook format
- Get from: Project Gutenberg, Smashwords, Draft2Digital
- Just upload and it works!

**MOBI Files**
- Amazon's format
- Works with basic chapter detection
- Convert to EPUB for better results

### Reading

1. Select a book from library
2. Adjust **Speed** (0.5x-2x), **Pitch** (0.5-2), **Volume** (0-100%)
3. Click **▶ Play**
4. Switch chapters with arrow buttons
5. Your position saves automatically

### Gym Tips

- **Speed**: 1.2x (keeps pace, not rushed)
- **Pitch**: 0.8-0.9 (soothing for long sessions)
- **Volume**: 100% (audible over gym noise)
- **Format**: Use chapters for shorter sessions

## 📂 Project Structure

```
ebook-reader/
├── src/
│   ├── App.tsx                 # Main app router
│   ├── components/
│   │   ├── Upload.tsx          # File upload interface
│   │   ├── Library.tsx         # Book library
│   │   └── Reader.tsx          # Reader + TTS controls
│   ├── utils/
│   │   ├── bookParser.ts       # Parse MD/EPUB/MOBI
│   │   └── textToSpeech.ts     # TTS engine
│   └── types.ts                # TypeScript types
├── public/
│   ├── service-worker.js       # Offline support
│   ├── manifest.json           # PWA config
│   └── index.html              # HTML with PWA meta tags
├── build/                      # Production build (generated)
├── SETUP_COMPLETE.md           # Complete setup guide
├── QUICKSTART.md               # 5-minute quick start
├── DEPLOYMENT.md               # Detailed deployment
├── EXAMPLE_BOOK.md             # Example markdown book
└── README.md                   # This file
```

## 💻 Available Scripts

```bash
npm start          # Run dev server (http://localhost:3000)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # ⚠️ Don't use (exposes internal config)
```

## 🛠️ Technology Stack

- **React** + **TypeScript** - Modern, type-safe UI
- **Web Speech API** - Built-in browser TTS (no external service)
- **IndexedDB** - Local book storage
- **Service Workers** - Offline support
- **JSZip** - EPUB file parsing
- **CSS3** - Beautiful, responsive design

**Everything is free and open source!** No paid APIs, subscriptions, or tracking.

## 🔒 Privacy

✅ **100% Private**
- Your books stay on your device
- No cloud sync
- No tracking
- No accounts needed
- Everything works offline

All data is stored in your browser's IndexedDB. Nothing leaves your device.

## 📚 Where to Get Books

### Free Books
- **Project Gutenberg**: https://www.gutenberg.org (70,000+ classics)
- **Standard Ebooks**: https://standardebooks.org (quality public domain)
- **Open Library**: https://openlibrary.org

### Paid Books
- **Smashwords**: https://www.smashwords.com
- **Draft2Digital**: https://www.draft2digital.com
- **Amazon Kindle** (convert with Calibre)

### Convert Formats
- **PDF → EPUB**: Online converter tools
- **MOBI → EPUB**: Use Calibre (free)
- Any text → Markdown: Copy/paste into `.md` file

## 🎯 Supported Formats

| Format | Support | Best For |
|--------|---------|----------|
| **Markdown (.md)** | ✅ Full | Quick testing, simple books |
| **EPUB (.epub)** | ✅ Full | Professional ebooks |
| **MOBI (.mobi)** | ⚠️ Basic | Amazon books, works but basic |

## 📱 Browser Requirements

Works on:
- ✅ iPhone (Safari)
- ✅ Android (Chrome)
- ✅ Desktop (Chrome, Safari, Firefox, Edge)

Best experience on iOS Safari.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't hear voice | Check volume, try different pitch/speed |
| Books don't save | Add to home screen (PWA mode) |
| EPUB not parsing | Try converting to MD, max ~50MB |
| Offline not working | Open app once with internet first |
| Port 3000 busy | Run `npm start -- --port 3001` |

See **DEPLOYMENT.md** for detailed troubleshooting.

## 🚀 Deployment Checklist

- [ ] Run `npm start` and test locally
- [ ] Try with example book (`EXAMPLE_BOOK.md`)
- [ ] Add your own book (test with Markdown first)
- [ ] Run `npm run build` (creates optimized build)
- [ ] Deploy to Vercel, Netlify, or GitHub Pages
- [ ] Open URL on iPhone in Safari
- [ ] Add to home screen
- [ ] Test offline mode
- [ ] Upload more books and enjoy!

## 📞 Need Help?

### Read These Docs
1. **QUICKSTART.md** - 5-minute setup
2. **SETUP_COMPLETE.md** - Everything explained
3. **DEPLOYMENT.md** - Detailed deployment guide

### Common Commands

```bash
# Test locally
npm start

# Deploy with Vercel (easiest)
npm install -g vercel
vercel

# Build for production
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

## 💡 Tips & Tricks

- **New feature**: Create a test book with just 1-2 chapters to test quickly
- **Speed up deployment**: Use Vercel (takes ~1 minute)
- **Better EPUB support**: Convert to Markdown with Calibre
- **Fastest testing**: Start with EXAMPLE_BOOK.md
- **Best pitch**: 0.85 for soothing, 1.1 for clarity
- **Gym comfort**: 1.2x speed leaves time to think between sentences

## 📈 Next Steps

**Right Now (5 minutes)**
```bash
npm start
# Open http://localhost:3000
# Try EXAMPLE_BOOK.md
```

**Today (15 minutes)**
- Deploy to Vercel
- Open on iPhone
- Add to home screen

**This Week**
- Upload your first real book
- Use during gym sessions
- Adjust speed/pitch to preference

**Next Week**
- Build a library of books
- Share with friends
- Make it part of your routine!

## 🎉 You're All Set!

Your ebook reader is:
- ✅ Built
- ✅ Tested  
- ✅ Ready to deploy
- ✅ Optimized for mobile
- ✅ Works offline
- ✅ 100% free

**Let's go!**

```bash
cd C:\Users\gdiya\ebook-reader
npm start
```

Then visit http://localhost:3000 and enjoy your first audiobook! 📚🎧

---

Made with ❤️ using React, TypeScript, and Web APIs.  
Perfect for gym sessions, commutes, and reading at any time.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
