# Ebook Reader PWA - Deployment Guide

Your Ebook Reader Progressive Web App is ready to use! This guide will help you deploy it to your iPhone.

## What You Have

A **Progressive Web App (PWA)** that works like a native app on your iPhone:
- ✅ Offline support - works without internet after first load
- ✅ Home screen installation - looks and feels like a real app
- ✅ Natural text-to-speech - reads your books with a smooth voice
- ✅ Full offline reading - all your books stored locally on your phone
- ✅ No data tracking - everything stays on your device

## Deployment Option 1: Local Development (Easiest for Testing)

### Quick Start on Your Computer

```bash
cd C:\Users\gdiya\ebook-reader
npm start
```

Then open http://localhost:3000 in your browser. You can test the app here first!

## Deployment Option 2: Deploy to Free Hosting

### Using Vercel (Recommended - Easiest)

Vercel offers free hosting perfect for PWAs:

1. Go to https://vercel.com and sign up (it's free)
2. Connect your GitHub account OR upload the project directly
3. Click "Import Project"
4. Select the `ebook-reader` folder
5. Click "Deploy"

Vercel will give you a URL like `https://ebook-reader-xyz.vercel.app`

### Using Netlify (Alternative)

1. Go to https://netlify.com and sign up
2. Drag & drop the `build` folder to deploy
3. Your app is live!

### Using GitHub Pages

1. Upload the `build` folder contents to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your app is live at `https://username.github.io/ebook-reader`

## Deployment Option 3: Self-Hosted (Docker)

If you want to host it yourself:

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build
```

Then access it from your iPhone by navigating to your computer's IP address.

---

## How to Use on iPhone

### Step 1: Open the App in Safari

Open the deployed URL in Safari on your iPhone.

Example: `https://ebook-reader-xyz.vercel.app`

### Step 2: Add to Home Screen (Makes It Look Like a Real App!)

1. Open the app in Safari
2. Tap the **Share** button (square with arrow at bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Enter a name (e.g., "Ebook Reader")
5. Tap **"Add"**

Now the app appears on your home screen like a real app! It will open full-screen without the Safari address bar.

### Step 3: Upload Your Books

1. Tap the **+ Add Book** button
2. Tap the upload area to select a file
3. Choose from your Files app:
   - **Markdown files** (.md)
   - **EPUB files** (.epub)
   - **MOBI files** (.mobi)

### Step 4: Start Listening

1. Select a book from your library
2. Tap the **▶ Play** button
3. Adjust **Speed**, **Pitch**, and **Volume** to your preference
4. Switch chapters with the navigation buttons
5. Your position is saved automatically

---

## Tips for Gym Use

- 🔊 **Increase Volume**: Set volume to 100% for the gym
- ⚡ **Adjust Speed**: Start at 1.2x for faster reading
- 🎵 **Pitch**: Lower pitch (0.8-0.9) sounds more soothing
- 📚 **Organize Books**: Shorter books work better for gym sessions
- 💾 **Works Offline**: No WiFi needed after first load - perfect for the gym!

---

## File Format Tips

### Markdown (.md)
```markdown
# Chapter 1: Introduction
Your content here...

# Chapter 2: Next Part
More content...
```

### EPUB
Standard e-book format - works great! Get from:
- Project Gutenberg (free classics)
- Smashwords
- Draft2Digital

### MOBI
Amazon's format - works but has limitations on chapter detection

---

## Troubleshooting

**"File not loading"**
- Ensure file size < 50MB
- Try converting EPUB to a different format
- Test with a simple Markdown file first

**"Voice not working"**
- Check system volume isn't muted
- Try a different voice pitch/speed
- Restart the app

**"Book disappeared after refresh"**
- Books are stored locally - they persist across sessions
- Try adding the book again

**"App not working offline"**
- Open it once with WiFi first to cache it
- Then it works fully offline

---

## Recommended Deployment (Best for You)

Based on your needs:

1. **Easiest & Free**: Use Vercel
   - Free tier is unlimited
   - Automatic updates
   - Very reliable

2. **Alternative**: Use Netlify (also free, very similar)

3. **Self-Hosted**: If you have a spare computer/server

---

## Questions?

The app uses free, open-source technologies:
- React (framework)
- Web Speech API (text-to-speech)
- IndexedDB (local storage)
- Service Workers (offline support)

All your books and preferences stay on YOUR device - nothing is uploaded anywhere!

---

## Next Steps

1. Choose a deployment option above
2. Deploy your app
3. Open on iPhone
4. Add to home screen
5. Upload your first book
6. Start listening at the gym! 🏋️‍♂️

Enjoy your audiobook reader! 📚
