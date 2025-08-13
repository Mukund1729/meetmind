import React from 'react';

function SummaryBox({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-gradient-to-br from-fuchsia-900/60 to-blue-900/60 rounded-xl shadow p-4 mt-6 border border-fuchsia-900/30">
      <h2 className="text-lg font-semibold mb-2 text-blue-300">Summary</h2>
      <pre className="whitespace-pre-wrap text-gray-100 text-sm max-h-40 overflow-y-auto bg-gray-950/60 rounded p-2 border border-blue-900/40">{summary}</pre>
    </div>
  );
}

export default SummaryBox; 