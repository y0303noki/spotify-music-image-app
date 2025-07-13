import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Callback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // URLから認証コードを取得
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      navigate('/')
      return
    }

    if (code) {
      // URLから認証コードを削除して再利用を防ぐ
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)

      // バックエンドでトークン交換を行う
      exchangeCodeForToken(code)
    } else {
      navigate('/')
    }
  }, [navigate])

  const exchangeCodeForToken = async (code: string) => {
    try {
      // 環境に応じてAPI URLを設定
      const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
      const apiUrl = isLocalhost 
        ? 'http://127.0.0.1:8000' 
        : (import.meta.env.VITE_REACT_APP_API_URL || 'https://your-backend-url.vercel.app');
      
      const response = await fetch(`${apiUrl}/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Token exchange failed')
      }

      const tokenData = await response.json()
      
      // アクセストークンをlocalStorageに保存
      localStorage.setItem('spotify_access_token', tokenData.access_token)
      if (tokenData.refresh_token) {
        localStorage.setItem('spotify_refresh_token', tokenData.refresh_token)
      }
      
      // ダッシュボードに移動
      navigate('/dashboard')
    } catch (error) {
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