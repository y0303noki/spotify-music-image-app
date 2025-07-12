// 環境変数のデフォルト値
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'mock_client_id';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://y0303noki.github.io/spotify-music-image-app/';
const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback';

export const api = {
  // Spotify認証URLを取得
  getSpotifyAuthUrl: async () => {
    const scope = 'user-read-recently-played user-library-read';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    return { authUrl };
  },

  // トークン交換
  exchangeToken: async (code: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  // 最近再生した楽曲を取得
  getRecentlyPlayed: async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/recently-played`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired');
        }
        throw new Error('Failed to fetch recently played tracks');
      }

      return await response.json();
    } catch (error) {
      console.error('Recently played error:', error);
      throw error;
    }
  },

  // お気に入り楽曲を取得
  getLikedTracks: async (accessToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/liked-tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired');
        }
        throw new Error('Failed to fetch liked tracks');
      }

      return await response.json();
    } catch (error) {
      console.error('Liked tracks error:', error);
      throw error;
    }
  }
}; 