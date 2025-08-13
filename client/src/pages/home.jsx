import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../components/ThemeContext';
import FileUpload from '../components/FileUpload';
import LinkInput from '../components/LinkInput';
import LanguageSelector from '../components/LanguageSelector';
import TranscriptViewer from '../components/TranscriptViewer/TranscriptViewer';
import SummaryBox from '../components/SummaryBox/SummaryBox';
import { uploadAudio, submitLink, summarizeTranscript } from '../utils/api';

function Home() {
  const [messages, setMessages] = useState([]); // {role: 'user'|'system', type: 'transcript'|'summary'|'error'|'note', content: string}
  const [inputLink, setInputLink] = useState('');
  const [inputFile, setInputFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const { theme } = useTheme();
  const chatEndRef = useRef(null);



  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileSelected = async (file) => {
    setLoading(true);
    setError(null);
    setInputFile(file);
    setInputLink('');
    setTranscript('');
    setSummary('');
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', type: 'file', content: `Uploaded file: ${file.name}` },
    ]);
    try {
      const data = await uploadAudio(file, language);
      setTranscript(data.transcript);
      setMessages((msgs) => [
        ...msgs,
        { role: 'system', type: 'transcript', content: data.transcript },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setMessages((msgs) => [
        ...msgs,
        { role: 'system', type: 'error', content: err.response?.data?.error || err.message },
      ]);
    }
    setLoading(false);
  };

  const handleLinkSubmit = async (link) => {
    setLoading(true);
    setError(null);
    setInputLink(link);
    setInputFile(null);
    setTranscript('');
    setSummary('');
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', type: 'link', content: `Submitted link: ${link}` },
    ]);
    try {
      const data = await submitLink(link, language);
      if (data.transcript) {
        setTranscript(data.transcript);
        setMessages((msgs) => [
          ...msgs,
          { role: 'system', type: 'transcript', content: data.transcript },
        ]);
      }
      if (data.note) {
        setMessages((msgs) => [
          ...msgs,
          { role: 'system', type: 'note', content: data.note },
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setMessages((msgs) => [
        ...msgs,
        { role: 'system', type: 'error', content: err.response?.data?.error || err.message },
      ]);
    }
    setLoading(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', type: 'summarize', content: 'Summarize this transcript.' },
    ]);
    try {
      const data = await summarizeTranscript(transcript);
      setSummary(data.summary);
      setMessages((msgs) => [
        ...msgs,
        { role: 'system', type: 'summary', content: data.summary },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setMessages((msgs) => [
        ...msgs,
        { role: 'system', type: 'error', content: err.response?.data?.error || err.message },
      ]);
    }
    setLoading(false);
  };

  // Chat bubble rendering
  const renderMessage = (msg, idx) => {
    const isUser = msg.role === 'user';
    let bubbleColor = isUser
      ? 'bg-blue-100 text-blue-900 dark:bg-gradient-to-r dark:from-fuchsia-500 dark:to-blue-700 dark:text-white'
      : msg.type === 'error'
      ? 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-white'
      : msg.type === 'note'
      ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-400 dark:text-gray-900'
      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100';
    let align = isUser ? 'justify-end' : 'justify-start';
    let avatar = isUser ? (
      <div className="w-8 h-8 rounded-full bg-blue-400 dark:bg-fuchsia-500 flex items-center justify-center text-white font-bold shadow">U</div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow">MM</div>
    );
    return (
      <div key={idx} className={`w-full flex ${align} mb-2`}>
        {!isUser && avatar}
        <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${bubbleColor} mx-2 whitespace-pre-line break-words border border-blue-100 dark:border-gray-700`}>
          {msg.content}
        </div>
        {isUser && avatar}
      </div>
    );
  };

  // Input bar at the bottom
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Subtle animated background */}
      <div className="fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-200 via-blue-100 to-white opacity-60 dark:from-fuchsia-700 dark:via-blue-900 dark:to-purple-900 dark:opacity-60" />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.03" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgGlow)" />
        </svg>
      </div>
      {/* Top bar: MeetMind logo left, dark/light toggle right */}
      <div className="w-full flex items-center justify-between px-10 pt-7 pb-2 z-30">
        <div className="flex items-center">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-400 to-blue-800 dark:from-fuchsia-400 dark:via-blue-400 dark:to-purple-400 drop-shadow tracking-tight select-none">MeetMind</span>
        </div>
        <ThemeToggle />
      </div>
      {/* Main chat container, centered and aesthetic */}
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[80vh]">
        <div className="w-full max-w-2xl flex flex-col gap-6 px-4 py-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-blue-200/40 dark:border-gray-800 backdrop-blur-xl transition-colors duration-500 relative">
          {/* Language Selector top-left inside container */}
          <div className='absolute top-4 left-6 z-30'>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>
          {/* Chat area */}
          <div className="flex-1 flex flex-col items-center justify-start w-full overflow-y-auto px-2 py-4 mt-2 bg-transparent min-h-[300px] max-h-[500px]">
            <main className="flex flex-col items-center justify-start w-full h-full">
              <div className="w-full flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="text-center text-lg text-blue-700 mb-6 font-medium mt-10">Audio-to-Text Transcription & Summarization</div>
                )}
                {messages.map((msg, idx) => renderMessage(msg, idx))}
                {loading && (
                  <div className="w-full flex justify-start mb-2">
                    <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow bg-blue-200 text-blue-900 mx-2 animate-pulse">Processing...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </main>
          </div>
          {/* FileUpload area */}
          <div className="w-full flex justify-center items-center px-2 pb-2">
            <div className="w-full">
              <FileUpload onFileSelected={handleFileSelected} horizontal={true} />
            </div>
          </div>
          {/* Input bar at the bottom of the container */}
          <div className="w-full flex flex-col items-center bg-gradient-to-t from-blue-100/60 via-white/90 to-transparent dark:from-gray-900/80 dark:via-gray-900/60 dark:to-transparent px-2 pt-2 pb-2 border-t border-blue-200/40 dark:border-gray-800 transition-colors duration-500 rounded-b-2xl">
            <div className="w-full flex flex-col md:flex-row items-center gap-2">
              <form
                className="flex-1 flex gap-2 items-center w-full"
                onSubmit={e => {
                  e.preventDefault();
                  if (inputLink.trim()) handleLinkSubmit(inputLink.trim());
                }}
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-fuchsia-400 transition"
                  placeholder="Paste audio/video link here..."
                  value={inputLink}
                  onChange={e => setInputLink(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition font-semibold"
                  disabled={loading || !inputLink.trim()}
                >
                  Submit
                </button>
              </form>
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition font-semibold ml-2"
                onClick={handleSummarize}
                disabled={loading || !transcript}
              >
                Summarize
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer outside card, fixed at bottom */}
      <footer className="fixed bottom-0 left-0 w-full text-center text-xs text-blue-700 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 py-2 border-t border-blue-200/40 dark:border-gray-800 shadow z-40 select-none">
        &copy; {new Date().getFullYear()} MeetMind &mdash; Powered by OpenAI Whisper & GPT-4
      </footer>
    </div>
  );
}

export default Home;
