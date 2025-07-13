// 環境変数のデフォルト値
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'mock_client_id';
const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback';
// ブラウザからアクセス可能なURLを使用
const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = {
  // Spotify認証URLを取得
  getSpotifyAuthUrl: async () => {
    const scope = 'user-read-recently-played user-library-read';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    return { authUrl };
  },

  // トークン交換（クライアントサイドでは直接交換できないため、別の方法を使用）
  exchangeToken: async (code: string) => {
    // クライアントサイドでは直接トークン交換できないため、
    // 認証コードをURLから取得して、ブラウザのlocalStorageに保存
    // 実際のトークン交換は別途実装が必要
    throw new Error('Client-side token exchange not supported');
  },

  // 最近再生した楽曲を取得（バックエンドAPIを使用）
  getRecentlyPlayed: async (accessToken: string, limit: number = 200) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracks/recent?limit=${limit}`, {
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

      const data = await response.json();
      
      // バックエンドから返される形式に合わせて変換
      const albums = data.tracks.map((track: any) => ({
        album: {
          id: track.id,
          name: track.name,
          artists: [{ name: track.artist }],
          images: [{ url: track.imageUrl }],
          external_urls: { spotify: track.spotifyUrl }
        },
        count: track.playCount
      }));
      
      return { albums, totalFetched: data.totalFetched, requestedLimit: data.requestedLimit };
    } catch (error) {
      console.error('Recently played error:', error);
      throw error;
    }
  },

  // お気に入り楽曲を取得（バックエンドAPIを使用）
  getLikedTracks: async (accessToken: string, limit: number = 200) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracks/liked?limit=${limit}`, {
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

      const data = await response.json();
      
      // バックエンドから返される形式に合わせて変換
      const albums = data.tracks.map((album: any) => ({
        album: {
          id: album.id,
          name: album.name,
          artists: [{ name: album.artist }],
          images: [{ url: album.imageUrl }],
          external_urls: { spotify: album.albumUrl }
        },
        count: album.playCount
      }));
      
      return { albums, totalFetched: data.totalFetched, requestedLimit: data.requestedLimit };
    } catch (error) {
      console.error('Liked tracks error:', error);
      throw error;
    }
  }
}; 