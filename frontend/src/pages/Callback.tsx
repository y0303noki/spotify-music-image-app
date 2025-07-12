import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Callback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Callback page loaded')
    console.log('Current URL:', window.location.href)
    
    // URLから認証コードを取得
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    console.log('Callback received:', { code: code ? 'present' : 'missing', error })

    if (error) {
      console.error('Spotify authorization error:', error)
      navigate('/')
      return
    }

    if (code) {
      // URLから認証コードを削除して再利用を防ぐ
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)

      // クライアントサイドでトークン交換を行う
      exchangeCodeForToken(code)
    } else {
      console.log('No authorization code found')
      navigate('/')
    }
  }, [navigate])

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log('Exchanging code for token...')
      
      // クライアントサイドでトークン交換を行う
      // 注意: この方法はセキュリティ上の理由で推奨されませんが、デモ用として実装
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
      const redirectUri = import.meta.env.VITE_REACT_APP_REDIRECT_URI || 'https://y0303noki.github.io/spotify-music-image-app/#/callback'
      
      console.log('Client ID:', clientId)
      console.log('Redirect URI:', redirectUri)
      
      // 実際のアプリケーションでは、バックエンドでトークン交換を行うべきです
      // ここではデモ用に、認証コードをlocalStorageに保存して、後で処理する
      localStorage.setItem('spotify_auth_code', code)
      
      // デモ用: 認証コードをアクセストークンとして使用（実際には無効）
      // 実際のアプリケーションでは、バックエンドでトークン交換を行う必要があります
      console.log('Auth code stored for demo purposes')
      alert('デモ版: 認証コードを保存しました。実際のアプリケーションではバックエンドでのトークン交換が必要です。')
      
      // デモ用にダッシュボードに移動
      navigate('/dashboard')
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      alert('認証に失敗しました。再度ログインしてください。')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spotify-green mx-auto"></div>
        <p className="mt-4 text-white">認証中...</p>
      </div>
    </div>
  )
}

export default Callback 