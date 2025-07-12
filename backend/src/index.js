const express = require('express')
const cors = require('cors')
const axios = require('axios')
const querystring = require('querystring')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:8888', 'http://localhost:8888', 'http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://127.0.0.1:8888/callback'

// Routes
app.post('/auth/callback', async (req, res) => {
  try {
    const { code } = req.body
    console.log('Received callback request with code:', code ? 'present' : 'missing')

    if (!code) {
      console.error('No authorization code provided')
      return res.status(400).json({ error: 'Authorization code is required' })
    }

    console.log('Exchanging code for token...')
    console.log('Client ID:', SPOTIFY_CLIENT_ID ? 'set' : 'missing')
    console.log('Client Secret:', SPOTIFY_CLIENT_SECRET ? 'set' : 'missing')
    console.log('Redirect URI:', REDIRECT_URI)

    // Exchange code for access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }), {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    console.log('Token exchange successful')
    const { access_token, refresh_token } = tokenResponse.data

    res.json({
      access_token,
      refresh_token,
      token_type: 'Bearer'
    })
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message)
    
    // invalid_grantエラーの場合は400エラーを返す
    if (error.response?.data?.error === 'invalid_grant') {
      res.status(400).json({ 
        error: 'Invalid authorization code',
        details: error.response.data
      })
    } else {
      res.status(500).json({ 
        error: 'Failed to exchange code for token',
        details: error.response?.data || error.message
      })
    }
  }
})

app.get('/tracks/recent', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const accessToken = authHeader.split(' ')[1]

    // Get recently played tracks
    const tracksResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    // Process tracks and count play frequency
    const trackCounts = {}
    const trackDetails = {}

    tracksResponse.data.items.forEach(item => {
      const trackId = item.track.id
      const trackName = item.track.name
      const artistName = item.track.artists[0].name
      const albumName = item.track.album.name
      const imageUrl = item.track.album.images[0]?.url || ''
      const spotifyUrl = item.track.external_urls.spotify
      const albumUrl = item.track.album.external_urls.spotify

      if (!trackCounts[trackId]) {
        trackCounts[trackId] = 0
        trackDetails[trackId] = {
          id: trackId,
          name: trackName,
          artist: artistName,
          album: albumName,
          imageUrl: imageUrl,
          spotifyUrl: spotifyUrl,
          albumUrl: albumUrl
        }
      }
      trackCounts[trackId]++
    })

    // Convert to array and sort by play count
    const tracks = Object.keys(trackCounts).map(trackId => ({
      ...trackDetails[trackId],
      playCount: trackCounts[trackId]
    })).sort((a, b) => b.playCount - a.playCount)

    res.json({ tracks })
  } catch (error) {
    console.error('Error fetching recent tracks:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to fetch recent tracks' })
  }
})

app.get('/tracks/liked', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const accessToken = authHeader.split(' ')[1]

    // Get liked tracks with pagination (up to 200 tracks)
    let allLikedTracks = []
    let offset = 0
    const limit = 50
    
    // Fetch up to 4 pages (200 tracks total)
    for (let i = 0; i < 4; i++) {
      const likedTracksResponse = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const tracks = likedTracksResponse.data.items
      if (tracks.length === 0) break
      
      allLikedTracks = allLikedTracks.concat(tracks)
      offset += limit
    }

    // Process liked tracks and count by album
    const albumCounts = {}
    const albumDetails = {}

    allLikedTracks.forEach(item => {
      const track = item.track
      const albumId = track.album.id
      const albumName = track.album.name
      const artistName = track.artists[0].name
      const imageUrl = track.album.images[0]?.url || ''
      const albumUrl = track.album.external_urls.spotify

      if (!albumCounts[albumId]) {
        albumCounts[albumId] = 0
        albumDetails[albumId] = {
          id: albumId,
          name: albumName,
          artist: artistName,
          imageUrl: imageUrl,
          albumUrl: albumUrl,
          tracks: [] // アルバム内の曲リスト
        }
      }
      
      // アルバム内の曲を追加（重複を避ける）
      const trackInfo = {
        id: track.id,
        name: track.name,
        spotifyUrl: track.external_urls.spotify
      }
      
      const existingTrack = albumDetails[albumId].tracks.find(t => t.id === track.id)
      if (!existingTrack) {
        albumDetails[albumId].tracks.push(trackInfo)
      }
      
      albumCounts[albumId]++
    })

    // Convert to array and sort by count
    const albums = Object.keys(albumCounts).map(albumId => ({
      ...albumDetails[albumId],
      playCount: albumCounts[albumId]
    })).sort((a, b) => b.playCount - a.playCount)

    res.json({ tracks: albums })
  } catch (error) {
    console.error('Error fetching liked tracks:', error.response?.data || error.message)
    
    // スコープ不足の場合は特別なエラーメッセージを返す
    if (error.response?.data?.error?.status === 403) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        details: 'user-library-read scope is required to access liked tracks'
      })
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch liked tracks',
        details: error.response?.data || error.message
      })
    }
  }
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    clientId: SPOTIFY_CLIENT_ID ? 'set' : 'missing',
    clientSecret: SPOTIFY_CLIENT_SECRET ? 'set' : 'missing',
    redirectUri: REDIRECT_URI
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
}) 