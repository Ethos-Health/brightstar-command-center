# BrightStar Care · Owner Command Center
### Shoreline–Mill Creek · Pre-launch Dashboard

A standalone React app that lives at your own GitHub Pages URL.
Your tasks and checkmarks save automatically in your browser's localStorage.

---

## 🚀 Deploy to GitHub Pages in 5 steps (15 minutes, no code needed)

### Step 1 — Create a free GitHub account
Go to **https://github.com** and sign up if you don't have an account.
Your username will become part of your URL, e.g. `jilllee` → `jilllee.github.io`

---

### Step 2 — Create a new repository
1. Click the **+** button (top right) → **New repository**
2. Name it exactly: `brightstar-command-center`
3. Set it to **Public**
4. Click **Create repository**
5. Copy the repository URL shown — looks like:
   `https://github.com/YOUR-USERNAME/brightstar-command-center.git`

---

### Step 3 — Update package.json with your URL
Open `package.json` and find this line near the top:

```json
"homepage": ".",
```

Change it to your actual GitHub Pages URL:

```json
"homepage": "https://YOUR-USERNAME.github.io/brightstar-command-center",
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

### Step 4 — Install and deploy
Open Terminal (Mac) or Command Prompt (Windows) in this folder and run:

```bash
npm install
npm run deploy
```

That's it. The `deploy` script builds the app and pushes it to GitHub automatically.

---

### Step 5 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select branch: `gh-pages`, folder: `/ (root)`
4. Click **Save**
5. Wait 2–3 minutes, then visit:

```
https://YOUR-USERNAME.github.io/brightstar-command-center
```

🎉 **Your command center is live.**

---

## 📱 Add to your phone home screen (optional but great)

**iPhone / Safari:**
1. Open your URL in Safari
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Name it "Command Center" → Add

**Android / Chrome:**
1. Open your URL in Chrome
2. Tap the three-dot menu
3. Tap **Add to Home Screen**

It will appear as an app icon on your home screen.

---

## 🔄 How to update the app in future

After making changes to any file, just run:

```bash
npm run deploy
```

Your live URL updates automatically within 2–3 minutes.

---

## 📁 Project structure

```
brightstar-command-center/
├── public/
│   └── index.html          ← Page shell
├── src/
│   ├── App.jsx             ← Main dashboard component
│   ├── App.css             ← All styles
│   ├── data.js             ← Tasks, milestones, categories
│   ├── index.js            ← React entry point
│   └── index.css           ← Global styles
├── package.json            ← Dependencies + deploy scripts
└── README.md               ← This file
```

---

## ✏️ How to add or edit tasks without code

Open `src/data.js` in any text editor (even Notepad).
Each task looks like this:

```js
{ id: 1, name: 'Your task name', due: '2026-06-01', cat: 'ops', pri: 'high' },
```

- `due`: date in YYYY-MM-DD format
- `cat`: one of `ops`, `licensing`, `hiring`, `marketing`, `clinical`
- `pri`: one of `high`, `med`, `low`

Save the file, then run `npm run deploy` to push the update live.

---

Built for Jill (Peiyao) Lee · BrightStar Care Shoreline–Mill Creek · 2026
