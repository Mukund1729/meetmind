require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(cors());
app.use(express.json());

// Log every incoming request
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp3', 'audio/x-wav', 'audio/mp4'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

app.post('/api/transcribe-and-summarize', upload.single('audio'), async (req, res) => {
  try {
    // 1. Upload audio to AssemblyAI
    const audioData = fs.readFileSync(req.file.path);
    const uploadRes = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      audioData,
      {
        headers: {
          'authorization': process.env.ASSEMBLYAI_API_KEY,
          'content-type': 'application/octet-stream'
        }
      }
    );
    const audio_url = uploadRes.data.upload_url;

    // 2. Request transcription
    const transcriptRes = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url },
      {
        headers: {
          'authorization': process.env.ASSEMBLYAI_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
    const transcriptId = transcriptRes.data.id;

    // 3. Poll for completion
    let transcript;
    while (true) {
      const pollingRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { 'authorization': process.env.ASSEMBLYAI_API_KEY } }
      );
      if (pollingRes.data.status === 'completed') {
        transcript = pollingRes.data.text;
        break;
      } else if (pollingRes.data.status === 'failed') {
        return res.status(500).json({ error: 'Transcription failed.' });
      }
      await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds
    }

    // 4. Summarize with Cohere
    if (!transcript || transcript.length < 250) {
      return res.json({
        transcript,
        summary: 'Transcript too short to summarize.'
      });
    }
    const cohereRes = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: transcript,
        length: 'medium',
        format: 'paragraph',
        model: 'summarize-xlarge',
        extractiveness: 'auto'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // 5. Return transcript and summary
    res.json({
      transcript,
      summary: cohereRes.data.summary
    });

    fs.unlinkSync(req.file.path); // Clean up
  } catch (err) {
    console.error('API ERROR (transcribe-and-summarize):', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/link', async (req, res) => {
  const { url } = req.body;
  try {
    if (typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Download YouTube audio
      const id = uuidv4();
      const tempPath = path.join('uploads', `${id}.mp3`);
      const stream = ytdl(url, { filter: 'audioonly' });
      ffmpeg(stream)
        .audioCodec('libmp3lame')
        .save(tempPath)
        .on('end', async () => {
          try {
            // 1. Upload audio to AssemblyAI
            const audioData = fs.readFileSync(tempPath);
            const uploadRes = await axios.post(
              'https://api.assemblyai.com/v2/upload',
              audioData,
              {
                headers: {
                  'authorization': process.env.ASSEMBLYAI_API_KEY,
                  'content-type': 'application/octet-stream'
                }
              }
            );
            const audio_url = uploadRes.data.upload_url;
            // 2. Request transcription
            const transcriptRes = await axios.post(
              'https://api.assemblyai.com/v2/transcript',
              { audio_url },
              {
                headers: {
                  'authorization': process.env.ASSEMBLYAI_API_KEY,
                  'content-type': 'application/json'
                }
              }
            );
            const transcriptId = transcriptRes.data.id;
            // 3. Poll for completion
            let transcript;
            while (true) {
              const pollingRes = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                { headers: { 'authorization': process.env.ASSEMBLYAI_API_KEY } }
              );
              if (pollingRes.data.status === 'completed') {
                transcript = pollingRes.data.text;
                break;
              } else if (pollingRes.data.status === 'failed') {
                fs.unlinkSync(tempPath);
                return res.status(500).json({ error: 'Transcription failed.' });
              }
              await new Promise(r => setTimeout(r, 3000));
            }
            // 4. Summarize with Cohere
            if (!transcript || transcript.length < 250) {
              return res.json({
                transcript,
                summary: 'Transcript too short to summarize.'
              });
            }
            const cohereRes = await axios.post(
              'https://api.cohere.ai/v1/summarize',
              {
                text: transcript,
                length: 'medium',
                format: 'paragraph',
                model: 'summarize-xlarge',
                extractiveness: 'auto'
              },
              {
                headers: {
                  'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            res.json({ transcript, summary: cohereRes.data.summary });
            fs.unlinkSync(tempPath);
          } catch (err) {
            fs.unlinkSync(tempPath);
            console.error('API ERROR (link):', err);
            res.status(500).json({ error: err.message });
          }
        })
        .on('error', (err) => {
          res.status(500).json({ error: 'Failed to process YouTube audio.' });
        });
    } else if (url.includes('drive.google.com')) {
      return res.json({ note: 'Please download the file from Drive and upload it manually.' });
    } else if (url.includes('spotify.com')) {
      return res.json({ note: 'Spotify support is limited. Please upload an MP3 if possible.' });
    } else {
      return res.status(400).json({ error: 'Unsupported link type.' });
    }
  } catch (err) {
    console.error('API ERROR (link):', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 