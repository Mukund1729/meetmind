import React, { useRef, useState } from 'react';

function FileUpload({ onFileSelected, horizontal }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp3', 'audio/x-wav', 'audio/mp4'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file type. Please upload MP3, WAV, or M4A.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25MB limit.');
      return;
    }
    setError(null);
    onFileSelected(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div
      className={`w-full ${horizontal ? 'flex flex-row items-center justify-center min-h-[90px] p-4 gap-4' : 'flex flex-col items-center p-6'} bg-white/80 rounded-2xl shadow-lg border-2 transition-all cursor-pointer select-none ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label="Upload audio file"
    >
      <label className="block w-full text-center cursor-pointer">
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className={`flex ${horizontal ? 'flex-row items-center gap-4' : 'flex-col items-center'} justify-center w-full`}>
          <svg className={`shrink-0 ${horizontal ? 'w-10 h-10' : 'w-12 h-12'} text-blue-400 mb-0`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M20.25 16.5A8.25 8.25 0 1 1 3.75 7.5a8.25 8.25 0 0 1 16.5 9z" /></svg>
          <div className="flex flex-col items-start justify-center">
            <span className="text-gray-700 font-medium text-base">Click or drag file here</span>
            <span className="text-xs text-gray-400">MP3, WAV, M4A, max 25MB</span>
          </div>
        </div>
      </label>
      {error && <p className="mt-2 text-red-500 text-sm w-full text-left">{error}</p>}
    </div>
  );
}

export default FileUpload; 