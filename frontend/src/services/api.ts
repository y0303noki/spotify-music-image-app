// 環境変数のデフォルト値
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'mock_client_id';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';
const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'http://localhost:8888/callback';

// モックデータ
const mockAlbums = [
  {
    album: {
      id: '1',
      name: 'Mock Album 1',
      images: [{ url: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Album+1' }],
      external_urls: { spotify: 'https://open.spotify.com/album/1' }
    },
    count: 15,
    tracks: []
  },
  {
    album: {
      id: '2',
      name: 'Mock Album 2',
      images: [{ url: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Album+2' }],
      external_urls: { spotify: 'https://open.spotify.com/album/2' }
    },
    count: 12,
    tracks: []
  },
  {
    album: {
      id: '3',
      name: 'Mock Album 3',
      images: [{ url: 'https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Album+3' }],
      external_urls: { spotify: 'https://open.spotify.com/album/3' }
    },
    count: 8,
    tracks: []
  },
  {
    album: {
      id: '4',
      name: 'Mock Album 4',
      images: [{ url: 'https://via.placeholder.com/300x300/96CEB4/FFFFFF?text=Album+4' }],
      external_urls: { spotify: 'https://open.spotify.com/album/4' }
    },
    count: 6,
    tracks: []
  },
  {
    album: {
      id: '5',
      name: 'Mock Album 5',
      images: [{ url: 'https://via.placeholder.com/300x300/FFEAA7/FFFFFF?text=Album+5' }],
      external_urls: { spotify: 'https://open.spotify.com/album/5' }
    },
    count: 4,
    tracks: []
  }
];

export const api = {
  // Spotify認証URLを取得（モック）
  getSpotifyAuthUrl: async () => {
    return {
      authUrl: `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-recently-played%20user-library-read`
    };
  },

  // トークン交換（モック）
  exchangeToken: async (code: string) => {
    return {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600
    };
  },

  // 最近再生した楽曲を取得（モック）
  getRecentlyPlayed: async (accessToken: string) => {
    // モックデータを返す
    return { albums: mockAlbums };
  },

  // お気に入り楽曲を取得（モック）
  getLikedTracks: async (accessToken: string) => {
    // モックデータを返す
    return { albums: mockAlbums.slice(0, 3) };
  }
}; 