import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MusicVisualizer from '../components/MusicVisualizer'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  imageUrl: string
  playCount: number
  spotifyUrl?: string
  albumUrl?: string
}

const Dashboard: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'recent' | 'liked'>('recent')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('spotify_token')
    console.log('Dashboard: Token check:', token ? 'present' : 'missing')
    
    if (!token) {
      console.log('Dashboard: No token found, redirecting to login')
      navigate('/')
      return
    }

    const fetchTracks = async () => {
      try {
        console.log(`Dashboard: Fetching ${mode} tracks...`)
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
        console.log('Dashboard: API URL:', apiUrl)
        
        const endpoint = mode === 'recent' ? '/tracks/recent' : '/tracks/liked'
        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        console.log('Dashboard: Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Dashboard: Tracks received:', data.tracks?.length || 0)
          setTracks(data.tracks)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Dashboard: Failed to fetch tracks:', errorData)
          
          // スコープ不足エラーの場合は特別なメッセージを表示
          if (response.status === 403) {
            setError('いいねした曲を取得するには、Spotifyで再度ログインしてください')
            // トークンを削除して再ログインを促す
            localStorage.removeItem('spotify_token')
          } else {
            setError('曲の取得に失敗しました')
          }
        }
      } catch (error) {
        console.error('Dashboard: Network error:', error)
        setError('ネットワークエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [navigate, mode])

  const handleLogout = () => {
    localStorage.removeItem('spotify_token')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spotify-green mx-auto"></div>
          <p className="mt-4 text-white">曲を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-spotify-green text-white px-4 py-2 rounded"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">あなたの音楽世界</h1>
          <div className="flex items-center space-x-4">
            {/* モード切り替えボタン */}
            <div className="flex bg-spotify-gray rounded-lg p-1">
              <button
                onClick={() => setMode('recent')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'recent'
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                最近聴いた曲
              </button>
              <button
                onClick={() => setMode('liked')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'liked'
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                いいねした曲
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-spotify-gray text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* 音楽ビジュアライザー */}
      <MusicVisualizer tracks={tracks} mode={mode} />
    </div>
  )
}

export default Dashboard 