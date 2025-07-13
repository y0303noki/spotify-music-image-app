const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// CORS設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Spotify認証エンドポイント
app.get('/api/auth/spotify', (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scope = 'user-read-recently-played user-library-read';
  
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  
  res.json({ authUrl });
});

// トークン交換エンドポイント
app.post('/api/auth/callback', async (req, res) => {
  try {
    const { code } = req.body;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const response = await axios.post('https://accounts.spotify.com/api/token', 
      `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// 最近再生した楽曲を取得
app.get('/api/recently-played', async (req, res) => {
  try {
    const { access_token } = req.headers;
    
    if (!access_token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    // アルバムごとにグループ化して再生回数をカウント
    const albumCounts = {};
    response.data.items.forEach(item => {
      const albumId = item.track.album.id;
      if (!albumCounts[albumId]) {
        albumCounts[albumId] = {
          album: item.track.album,
          count: 0,
          tracks: []
        };
      }
      albumCounts[albumId].count++;
      albumCounts[albumId].tracks.push(item.track);
    });

    const albums = Object.values(albumCounts).sort((a, b) => b.count - a.count);
    
    res.json({ albums });
  } catch (error) {
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Token expired', needsReauth: true });
    } else {
      res.status(500).json({ error: 'Failed to fetch recently played tracks' });
    }
  }
});

// お気に入り楽曲を取得
app.get('/api/liked-tracks', async (req, res) => {
  try {
    const { access_token } = req.headers;
    
    if (!access_token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const response = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    // アルバムごとにグループ化してカウント
    const albumCounts = {};
    response.data.items.forEach(item => {
      const albumId = item.track.album.id;
      if (!albumCounts[albumId]) {
        albumCounts[albumId] = {
          album: item.track.album,
          count: 0,
          tracks: []
        };
      }
      albumCounts[albumId].count++;
      albumCounts[albumId].tracks.push(item.track);
    });

    const albums = Object.values(albumCounts).sort((a, b) => b.count - a.count);
    
    res.json({ albums });
  } catch (error) {
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Token expired', needsReauth: true });
    } else {
      res.status(500).json({ error: 'Failed to fetch liked tracks' });
    }
  }
});

// Vercel Functions用のエクスポート
module.exports = app; 