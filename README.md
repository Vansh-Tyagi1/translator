# 🧬 String Gene (Babel Matrix)

A full-stack, real-time **text translator** built with **React** on the frontend and **Node.js** on the backend, wrapped in an animated **Matrix-style digital rain** UI. It supports translation across **12 languages** and uses the **MyMemory Translation API** as its core engine.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Matrix Rain Animation](#matrix-rain-animation)
- [Translation Flow](#translation-flow)
- [Supported Languages](#supported-languages)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Screenshots / Demo](#screenshots--demo)
- [Known Issues & Notes](#known-issues--notes)
- [Future Improvements](#future-improvements)

---

## 🧠 Overview

**String Gene** (internally also called **Babel Matrix**) is a text translation web app that combines a functional utility (translate text between 12 languages) with a striking visual identity — a falling-character "Matrix rain" background reminiscent of *The Matrix* movie, giving the otherwise simple translator app a distinct, hacker-aesthetic feel.

The project was built as a single repository containing both the **React frontend** and the **Node.js backend**, communicating over a REST API, with the backend acting as a proxy/middleman to the translation provider.

---

## ✨ Features

- 🔤 Translate text between **12 supported languages**
- 🌧️ Animated **Matrix-style digital rain** running continuously in the background using HTML5 Canvas
- ⚡ Real-time translation requests handled via a Node.js backend
- 🔄 Language switcher UI (source language → target language)
- 🧩 Clean separation of concerns: React handles UI/state, Node.js handles API calls to the translation provider
- 🛡️ Fallback-driven API integration (see [Translation Flow](#translation-flow))

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Create React App) |
| Backend | Node.js (Express-style server) |
| Translation Engine | MyMemory Translation API |
| Animation | HTML5 Canvas + JavaScript (Matrix rain effect) |
| Styling | CSS (custom, matrix/terminal theme) |

> ⚠️ Fill in the exact backend framework (e.g. Express) and any additional libraries (axios/node-fetch, cors, dotenv) used in your actual `package.json` — update this table to match precisely.

---

## 📁 Folder Structure

Since this is a **single repo** containing both frontend and backend:

```
string-gene/
├── public/                 # Static assets, index.html
├── src/                    # React frontend source
│   ├── components/         # UI components (Translator box, Matrix Rain canvas, Language selector)
│   ├── App.js               # Root React component
│   ├── App.css               # Global + matrix theme styling
│   └── index.js
├── server/                 # Node.js backend
│   ├── routes/              # API route handlers (e.g. /translate)
│   ├── controllers/         # Logic that calls MyMemory API
│   └── server.js             # Entry point for backend
├── package.json             # Frontend dependencies (CRA)
├── server/package.json      # Backend dependencies (if separated)
└── README.md
```

> ⚠️ Adjust this tree to match your actual file/folder names — this is a representative structure based on the "single repo, frontend + backend together" setup.

---

## 🌧️ Matrix Rain Animation

The signature visual feature — falling green/glowing characters cascading down the screen, similar to *The Matrix* movie's iconic effect.

**How it typically works:**
1. An HTML5 `<canvas>` element is rendered full-screen behind the translator UI.
2. A `setInterval` (or `requestAnimationFrame`) loop redraws the canvas at a fixed frame rate.
3. Each "column" of the canvas tracks a falling character (often randomized letters, numbers, or symbols).
4. A semi-transparent black rectangle is drawn over the canvas on each frame *before* drawing new characters — this creates the "fading trail" effect instead of characters disappearing instantly.
5. Column positions (`y` coordinates) reset to the top randomly once they reach the bottom, creating a continuous rain loop.
6. This runs independently of React's render cycle — typically inside a `useEffect` hook that sets up the canvas and animation loop once on mount, and cleans up the interval on unmount.

> ⚠️ Update this section with your actual canvas logic (frame rate, character set used, colors) if it differs.

---

## 🔄 Translation Flow

1. **User Input** — User types text into the input box and selects source & target languages from dropdowns.
2. **Frontend Request** — React sends a request (e.g. `POST /api/translate`) to the Node.js backend with `{ text, sourceLang, targetLang }`.
3. **Backend Proxy** — The Node.js server receives the request and forwards it to the **MyMemory Translation API** (a free, key-less translation API).
4. **API Response** — MyMemory returns the translated text as JSON.
5. **Backend Response** — Node.js relays the translated text back to the React frontend.
6. **UI Update** — React updates state and displays the translated text to the user.

### Why MyMemory?
The project originally attempted integration with the **Anthropic API** and **Gemini API** for translation, but ran into issues (likely around access/keys/rate limits for a lightweight translation use case). **MyMemory's free API** was ultimately chosen as it requires no API key for basic usage and is purpose-built for translation, making it a simpler and more reliable fit for this project.

> ⚠️ Add the actual MyMemory endpoint used (e.g. `https://api.mymemory.translated.net/get`) and any request/response shape details from your code.

---

## 🌐 Supported Languages

The app supports translation across **12 languages**.

> ⚠️ List the exact 12 languages here (e.g. English, Hindi, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian) — fill in based on your actual dropdown options.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd string-gene

# Install frontend dependencies
npm install

# Install backend dependencies (if in a separate server folder)
cd server
npm install
cd ..
```

### Running the App

```bash
# Start the backend server
cd server
npm start

# In a separate terminal, start the React frontend
npm start
```

The frontend will run on `http://localhost:3000` by default. The backend port depends on your server configuration (commonly `3001` or `5000`).

> ⚠️ Confirm exact backend port and update accordingly.

---

## 📜 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the frontend app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page reloads automatically on changes, and lint errors show in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production into the `build` folder. Bundles React in production mode, optimizes the build, and minifies output with hashed filenames — ready for deployment.

### `npm run eject`
**One-way operation.** Removes the single build dependency and copies all configuration files (Webpack, Babel, ESLint, etc.) directly into the project for full manual control. Not recommended unless you specifically need to customize the build configuration.

---

## 🔐 Environment Variables

> ⚠️ If the backend uses any environment variables (e.g. `PORT`, translation API base URL, or fallback keys for Anthropic/Gemini attempts), list them here in a `.env.example` style:

```
PORT=5000
TRANSLATE_API_URL=https://api.mymemory.translated.net/get
```

---

## 📸 Screenshots / Demo

> ⚠️ Add screenshots or a GIF of:
> - The Matrix rain animation running in the background
> - The translator UI with language dropdowns
> - A sample translation in action

```
![Matrix Rain Demo](./screenshots/matrix-rain.png)
![Translator UI](./screenshots/translator-ui.png)
```

---

## ⚠️ Known Issues & Notes

- Initial attempts to use **Anthropic API** and **Gemini API** for translation were dropped due to integration issues; **MyMemory API** is the current, stable translation provider.
- MyMemory's free tier may have daily request limits — worth noting for heavy usage/testing.

---

## 🔮 Future Improvements

- Add voice input/output for translations
- Add translation history / saved phrases
- Add dark/light theme toggle alongside the matrix theme
- Improve error handling for API rate limits or network failures
- Add unit tests for translation flow

---

## 📚 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php)
