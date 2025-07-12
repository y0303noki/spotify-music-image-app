import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Callback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Implicit Grant Flowでは、アクセストークンがURLのフラグメントに含まれる
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const error = params.get('error')

    console.log('Callback received:', { accessToken: accessToken ? 'present' : 'missing', error })

    if (error) {
      console.error('Spotify authorization error:', error)
      navigate('/')
      return
    }

    if (accessToken) {
      // URLからトークンを削除して再利用を防ぐ
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)

      console.log('Access token received:', accessToken ? 'success' : 'failed')
      localStorage.setItem('spotify_token', accessToken)
      console.log('Token stored in localStorage')
      navigate('/dashboard')
    } else {
      console.log('No access token found')
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