import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // URLから認証コードを確認
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (code) {
      // 認証コードがある場合はコールバック処理を行う
      handleCallback(code)
    }
  }, [navigate])

  const handleCallback = async (code: string) => {
    try {
      // クライアントサイドでトークン交換を行う
      // 注意: この方法はセキュリティ上の理由で推奨されませんが、デモ用として実装
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
      const redirectUri = 'https://y0303noki.github.io/spotify-music-image-app/callback'
      
      // 実際のアプリケーションでは、バックエンドでトークン交換を行うべきです
      // ここではデモ用に、認証コードをlocalStorageに保存して、後で処理する
      localStorage.setItem('spotify_auth_code', code)
      
      // デモ用: 認証コードをアクセストークンとして使用（実際には無効）
      // 実際のアプリケーションでは、バックエンドでトークン交換を行う必要があります
      
      // URLから認証コードを削除
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      
      // デモ用にダッシュボードに移動
      navigate('/dashboard')
    } catch (error) {
      // エラーハンドリング
    }
  }

  const handleSpotifyLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    const redirectUri = 'https://y0303noki.github.io/spotify-music-image-app/callback'
    const scope = 'user-read-recently-played user-library-read'
    
    if (!clientId || clientId === 'mock_client_id') {
      return
    }
    
    // Authorization Code Flowを使用（response_type=code）
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    
    // エラーハンドリングを追加
    try {
      window.location.href = authUrl
    } catch (error) {
      // エラーハンドリング
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
            Spotify Music Image App
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-400">
            最近聴いた曲のジャケット写真を見てみましょう
          </p>
        </div>
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <button
            onClick={handleSpotifyLogin}
            className="group relative w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-spotify-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green transition-colors"
          >
            Spotifyでログイン
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login 