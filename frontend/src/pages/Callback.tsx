import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Callback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    alert('Callback component is executing!')
    console.log('Callback page loaded')
    console.log('Current URL:', window.location.href)
    console.log('Current pathname:', window.location.pathname)
    console.log('Current search:', window.location.search)
    console.log('Current hash:', window.location.hash)
    
    // URLから認証コードを取得
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    console.log('URL Search Params:', window.location.search)
    console.log('URLSearchParams entries:', Array.from(urlParams.entries()))
    console.log('Code from URLSearchParams:', code)
    console.log('Error from URLSearchParams:', error)
    console.log('Callback received:', { code: code ? 'present' : 'missing', error })
    console.log('Full URL params:', Object.fromEntries(urlParams.entries()))

    if (error) {
      console.error('Spotify authorization error:', error)
      alert('認証エラーが発生しました: ' + error)
      navigate('/')
      return
    }

    if (code) {
      console.log('Authorization code found:', code.substring(0, 20) + '...')
      
      // URLから認証コードを削除して再利用を防ぐ
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)

      // バックエンドでトークン交換を行う
      exchangeCodeForToken(code)
    } else {
      console.log('No authorization code found')
      console.log('Available URL parameters:', Array.from(urlParams.keys()))
      alert('認証コードが見つかりませんでした')
      navigate('/')
    }
  }, [navigate])

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log('Exchanging code for token via backend...')
      
      // 環境に応じてAPI URLを設定
      const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
      const apiUrl = isLocalhost 
        ? 'http://127.0.0.1:8000' 
        : (import.meta.env.VITE_REACT_APP_API_URL || 'https://your-backend-url.vercel.app');
      console.log('API URL:', apiUrl)
      
      const response = await fetch(`${apiUrl}/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Token exchange failed:', errorData)
        throw new Error(errorData.error || 'Token exchange failed')
      }

      const tokenData = await response.json()
      console.log('Token exchange successful')
      
      // アクセストークンをlocalStorageに保存
      localStorage.setItem('spotify_access_token', tokenData.access_token)
      if (tokenData.refresh_token) {
        localStorage.setItem('spotify_refresh_token', tokenData.refresh_token)
      }
      
      console.log('Tokens stored successfully')
      
      // ダッシュボードに移動
      navigate('/dashboard')
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      alert('認証に失敗しました: ' + (error instanceof Error ? error.message : 'Unknown error'))
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