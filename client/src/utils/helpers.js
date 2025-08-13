export function isValidAudioFile(file) {
  const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp3', 'audio/x-wav', 'audio/mp4'];
  if (!allowed.includes(file.type)) return false;
  if (file.size > 25 * 1024 * 1024) return false;
  return true;
} 