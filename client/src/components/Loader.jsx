import React from 'react';

const Loader = ({ text = 'Processing...' }) => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
    <span className="text-blue-700 dark:text-fuchsia-300 text-sm font-medium animate-pulse">{text}</span>
  </div>
);

export default Loader;
