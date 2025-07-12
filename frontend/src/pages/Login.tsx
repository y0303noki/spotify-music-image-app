import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const handleSpotifyLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    const redirectUri = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback'
    const scope = 'user-read-recently-played user-library-read'
    
    console.log('Login: Client ID:', clientId)
    console.log('Login: Redirect URI:', redirectUri)
    
    if (!clientId || clientId === 'mock_client_id') {
      alert('Spotify Client IDが設定されていません。環境変数を確認してください。')
      return
    }
    
    // Authorization Code Flowを使用（response_type=code）
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    
    console.log('Login: Auth URL:', authUrl)
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Spotify Music Image App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            最近聴いた曲のジャケット写真を見てみましょう
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSpotifyLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-spotify-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green"
          >
            Spotifyでログイン
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login 