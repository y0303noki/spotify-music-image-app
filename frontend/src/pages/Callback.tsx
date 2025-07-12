import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
          const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
          console.log('API URL:', apiUrl)
          
          const response = await fetch(`${apiUrl}/auth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          })

          console.log('Response status:', response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log('Token received:', data.access_token ? 'success' : 'failed')
            localStorage.setItem('spotify_token', data.access_token)
            console.log('Token stored in localStorage')
            navigate('/dashboard')
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('Token exchange failed:', errorData)
            
            // invalid_grantエラーの場合は特別な処理
            if (errorData.details?.error === 'invalid_grant') {
              console.log('Invalid grant error - redirecting to login')
              navigate('/')
            } else {
              console.error('Token exchange failed:', errorData)
              navigate('/')
            }
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error)
          alert('ネットワークエラーが発生しました')
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