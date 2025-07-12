// 環境変数のデフォルト値
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'mock_client_id';
const REDIRECT_URI = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback';

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

  // 最近再生した楽曲を取得（直接Spotify APIを呼び出し）
  getRecentlyPlayed: async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
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

      // アルバムごとにグループ化して再生回数をカウント
      const albumCounts: any = {};
      data.items.forEach((item: any) => {
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

      const albums = Object.values(albumCounts).sort((a: any, b: any) => b.count - a.count);
      
      return { albums };
    } catch (error) {
      console.error('Recently played error:', error);
      throw error;
    }
  },

  // お気に入り楽曲を取得（直接Spotify APIを呼び出し）
  getLikedTracks: async (accessToken: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
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

      // アルバムごとにグループ化してカウント
      const albumCounts: any = {};
      data.items.forEach((item: any) => {
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

      const albums = Object.values(albumCounts).sort((a: any, b: any) => b.count - a.count);
      
      return { albums };
    } catch (error) {
      console.error('Liked tracks error:', error);
      throw error;
    }
  }
}; 