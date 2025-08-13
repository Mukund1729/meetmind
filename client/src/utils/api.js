import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append('audio', file);
  const res = await axios.post(`${API_BASE}/transcribe-and-summarize`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // { transcript, summary }
}

export async function submitLink(url) {
  const res = await axios.post(`${API_BASE}/link`, { url });
  return res.data;
}

export async function summarizeTranscript(transcript) {
  const res = await axios.post(`${API_BASE}/summarize`, { transcript });
  return res.data;
} 