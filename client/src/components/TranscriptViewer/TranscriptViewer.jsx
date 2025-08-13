import React from 'react';

function TranscriptViewer({ transcript }) {
  if (!transcript) return null;
  return (
    <div className="bg-gray-900/80 rounded-xl shadow p-4 mt-6 border border-fuchsia-900/30">
      <h2 className="text-lg font-semibold mb-2 text-fuchsia-400">Transcript</h2>
      <pre className="whitespace-pre-wrap text-gray-100 text-sm max-h-60 overflow-y-auto bg-gray-950/60 rounded p-2 border border-gray-800">{transcript}</pre>
    </div>
  );
}

export default TranscriptViewer; 