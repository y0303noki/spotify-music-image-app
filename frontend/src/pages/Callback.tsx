import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const Callback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
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

      // バックエンドにコードを送信してトークンを取得
      const exchangeCodeForToken = async () => {
        try {
          console.log('Exchanging code for token...')
          
          const data = await api.exchangeToken(code)
          console.log('Token received:', data.access_token ? 'success' : 'failed')
          
          localStorage.setItem('spotify_token', data.access_token)
          console.log('Token stored in localStorage')
          navigate('/dashboard')
        } catch (error) {
          console.error('Error exchanging code for token:', error)
          alert('認証に失敗しました。再度ログインしてください。')
          navigate('/')
        }
      }

      exchangeCodeForToken()
    } else {
      console.log('No authorization code found')
      navigate('/')
    }
  }, [navigate])

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