# 🎙️ My English Coach - Personal AI English Speaking Tutor

A modern, responsive, voice-first AI English Speaking Tutor web application built with **Next.js 14**, **Tailwind CSS**, **Web Speech API**, and the **Google Gemini API**.

---

## ✨ Features

- 🗣️ **Voice-First Speaking Practice**: Tap the microphone, speak naturally, and see your speech transcribed in real time.
- 🔍 **Instant Grammar & Phrasing Corrections**: Highlights errors clearly without making practice feel like an intimidating school exam.
- 💡 **Simple Explanations**: Understand *why* a correction was made with clear, beginner-friendly explanations.
- ✨ **Natural / Native Phrasing**: Learn how native speakers express the same idea with common idioms and phrasal verbs.
- 🔊 **Voice Response & Text-to-Speech**: AI replies verbally with customizable speech rate (0.75x to 1.5x), accent voices, and replay controls.
- 🎚️ **English Level Selector**: Choose between **Beginner (A1-A2)**, **Intermediate (B1-B2)**, and **Advanced (C1-C2)** anytime.
- 🎯 **8 Practice Topics**:
  - 💬 Free Conversation
  - ☕ Daily Life & Routines
  - 💼 Job Interview Practice
  - ✈️ Travel & Vacations
  - 🛍️ Ordering Food & Shopping
  - 👋 Self Introduction
  - 🚀 Technology & AI
  - 👨‍👩‍👧‍👦 Friends & Family
- ⏱️ **Daily Practice Goal Timer**: 5, 10, 15, or 30-minute practice session tracker with confetti celebration!
- 📱 **Mobile-First Responsive Design**: Works seamlessly on Android phones, iPhones, tablets, and desktop browsers.
- 🔒 **Zero Hardcoded Secrets**: Backend API route `/api/chat` securely handles all Gemini API communication.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+ or v20+ or v22+
- npm, yarn, or pnpm

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
cd my-english-coach
npm install
```

### 3. Configure Environment Variables
Create `.env.local` in the root folder:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(A `.env.example` template is included for reference).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Google Chrome, Microsoft Edge, or Safari.

---

## 🌐 Deploy to GitHub & Vercel (Step-by-Step)

### Step 1: Initialize Git and Push to GitHub
```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files (.env.local is already in .gitignore and will not be pushed)
git add .

# 3. Commit
git commit -m "Initial commit: My English Coach web application"

# 4. Create a new repository on GitHub (e.g. named my-english-coach)
# 5. Link and push to GitHub:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/my-english-coach.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"**.
2. Select your `my-english-coach` GitHub repository and click **Import**.
3. In the **Environment Variables** section:
   - Key: `GEMINI_API_KEY`
   - Value: `your_actual_gemini_api_key`
4. Click **Deploy**.
5. Within 1 minute, your live English Speaking Tutor web application will be live at `https://your-project.vercel.app`!

---

## 📱 Browser Compatibility & Permissions

| Browser / Device | Speech Recognition (Mic) | Speech Synthesis (Audio) | Notes |
| :--- | :--- | :--- | :--- |
| **Google Chrome (Desktop & Android)** | ✅ Native | ✅ Native | **Recommended experience** |
| **Microsoft Edge (Desktop & Mobile)** | ✅ Native | ✅ Native | Full native support |
| **Safari (iOS & macOS)** | ✅ Native | ✅ Native | Ensure microphone permission is granted |
| **Firefox** | ⌨️ Keyboard Fallback | ✅ Native | Speech recognition requires manual typing or browser flag |

> **Note**: For browsers without speech recognition support, the app includes an automatic on-screen keyboard text drawer for typing your sentences, with full AI audio speech responses enabled.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Brain**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)
- **Speech**: Web Speech API (`SpeechRecognition` + `SpeechSynthesis`)
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti

---

## 🔒 Security
- The `GEMINI_API_KEY` is kept strictly on the server-side Next.js route `/api/chat`.
- No client-side bundle ever receives or exposes the API key.
- `.env*` is ignored in `.gitignore`.