const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/api/getTranscript', async (req, res) => {
  const { youtubeUrl } = req.body;
  console.log(youtubeUrl);
  // Validate YouTube URL
  if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Get the transcript using the YouTube Data API
    const apiKey = 'AIzaSyBw89JmKaWh1WKIvZD7g6Y8AvrTkk4cWec';
    const videoId = extractVideoId(youtubeUrl);
    const transcript = await getVideoTranscript(videoId, apiKey);

    return res.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return res.status(500).json({ error: 'Error fetching transcript' });
  }
});

// Helper functions to get transcript from YouTube API
async function getVideoTranscript(videoId, apiKey) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  const response = await axios.get(apiUrl);
  const transcript = response.data.items[0]?.snippet?.description || '';
  return transcript;
}

function extractVideoId(youtubeUrl) {
  // Extract video id from the YouTube URL (You can use regex for this)
  const regExp = /(?:\/|%3D|v=|vi=)([0-9A-z-_]{11})(?:[%#?&]|$)/;
  const match = youtubeUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('Invalid YouTube URL: Video ID not found');
  }
}

function isValidYouTubeUrl(url) {
  const regExp = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i;

  if (regExp.test(url)) {
    return regExp.test(url);
  }
  throw new Error('Invalid YouTube URL: incorrect url format');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
