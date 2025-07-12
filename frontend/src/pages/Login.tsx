import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Login component mounted')
    console.log('Current URL:', window.location.href)
    
    // URLから認証コードを確認
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    console.log('URL params:', { code: code ? 'present' : 'missing', error })

    if (code) {
      console.log('Login: Found authorization code, redirecting to callback')
      // 認証コードがある場合はコールバック処理を行う
      handleCallback(code)
    } else if (error) {
      console.error('Login: Authorization error:', error)
      alert('認証エラーが発生しました。')
    }
  }, [navigate])

  const handleCallback = async (code: string) => {
    try {
      console.log('Login: Exchanging code for token...')
      
      // クライアントサイドでトークン交換を行う
      // 注意: この方法はセキュリティ上の理由で推奨されませんが、デモ用として実装
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
      const redirectUri = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback'
      
      console.log('Login: Client ID:', clientId)
      console.log('Login: Redirect URI:', redirectUri)
      
      // 実際のアプリケーションでは、バックエンドでトークン交換を行うべきです
      // ここではデモ用に、認証コードをlocalStorageに保存して、後で処理する
      localStorage.setItem('spotify_auth_code', code)
      
      // デモ用: 認証コードをアクセストークンとして使用（実際には無効）
      // 実際のアプリケーションでは、バックエンドでトークン交換を行う必要があります
      console.log('Login: Auth code stored for demo purposes')
      alert('デモ版: 認証コードを保存しました。実際のアプリケーションではバックエンドでのトークン交換が必要です。')
      
      // URLから認証コードを削除
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      
      // デモ用にダッシュボードに移動
      navigate('/dashboard')
    } catch (error) {
      console.error('Login: Error exchanging code for token:', error)
      alert('認証に失敗しました。再度ログインしてください。')
    }
  }

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

  const handleTestClick = () => {
    console.log('Test button clicked')
    alert('テストボタンがクリックされました。JavaScriptは正常に動作しています。')
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
          <button
            onClick={handleTestClick}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            テストボタン（JavaScript動作確認）
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login 