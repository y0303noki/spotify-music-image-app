import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const handleSpotifyLogin = () => {
    // モック版では直接ダッシュボードに移動
    navigate('/dashboard')
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
            Spotifyでログイン（モック版）
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login 