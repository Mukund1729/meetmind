# MeetMind

MeetMind is a full-stack web app where you can upload any audio file and instantly get its transcript and summary. It features a dark/light mode toggle and a modern, ChatGPT-style UI.

## Features

- 🎤 **Audio Upload:** Upload MP3, WAV, or M4A files.
- 📝 **Transcript & Summary:** Get transcript and summary using OpenAI API.
- 🌗 **Dark/Light Mode:** Toggle for comfortable viewing.
- ⚡ **Modern UI:** Full-screen, ChatGPT-inspired experience.

## Folder Structure

```
MeetMind/
│
├── client/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
│
├── server/         # Node.js/Express backend
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── package.json    # Root: concurrently script for both client & server
└── README.md
```

## Setup & Run

1. **Install Dependencies:**
   - In the root folder:
     ```
     yarn install
     ```
   - In the client folder:
     ```
     cd client
     yarn install
     ```
   - In the server folder:
     ```
     cd server
     yarn install
     ```

2. **Set API Keys:**
   - Create a `server/.env` file:
     ```
     ASSEMBLYAI_API_KEY=your_assemblyai_api_key
     COHERE_API_KEY=your_cohere_api_key
     ```

3. **Start the Project:**
   - In the root folder:
     ```
     yarn start
     ```
   - This will run both client (localhost:3000) and server (localhost:3001) together.

## Usage

1. Open `http://localhost:3000` in your browser.
2. Upload an audio file.
3. View the transcript and summary.
4. Toggle dark/light mode as needed.

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Node.js, Express, OpenAI, AssemblyAI, Cohere
- **Other:** Multer, uuid, concurrently

## License

MIT

---

**Enjoy MeetMind! Instantly convert audio to text.**
