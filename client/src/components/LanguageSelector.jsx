import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  // Add more as needed
];

function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="w-full flex flex-col items-start mt-4">
      <label className="text-sm text-gray-300 mb-1 font-medium">Transcription Language</label>
      <select
        className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        value={language}
        onChange={e => setLanguage(e.target.value)}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
