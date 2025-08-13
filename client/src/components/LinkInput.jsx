import React, { useState } from 'react';

function LinkInput({ onLinkSubmit }) {
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!link.trim()) {
      setError('Please enter a link.');
      return;
    }
    setError(null);
    onLinkSubmit(link);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center p-6 bg-white/80 rounded-2xl shadow-lg border border-gray-200 mt-4">
      <div className="w-full flex items-center gap-2 mb-2">
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3A2.25 2.25 0 0 0 8.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0 1 13.5 21h-3a2.25 2.25 0 0 1-2.25-2.25V9m7.5 0h-7.5" /></svg>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-700 shadow-sm"
          placeholder="Paste YouTube, Drive, or Spotify link"
          value={link}
          onChange={e => setLink(e.target.value)}
        />
      </div>
      {error && <p className="mt-1 text-red-500 text-sm w-full text-left">{error}</p>}
      <button
        type="submit"
        className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded shadow hover:from-purple-600 hover:to-blue-600 transition font-semibold w-full"
      >
        Submit Link
      </button>
    </form>
  );
}

export default LinkInput; 