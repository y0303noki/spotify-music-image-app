import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MusicVisualizer from '../components/MusicVisualizer'
import { api } from '../services/api'

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
    const token = localStorage.getItem('spotify_access_token')
    console.log('Dashboard: Token check:', token ? 'present' : 'missing')
    
    if (!token) {
      console.log('Dashboard: No token found, redirecting to login')
      navigate('/')
      return
    }

    const fetchTracks = async () => {
      try {
        console.log(`Dashboard: Fetching ${mode} tracks...`)
        
        const response = mode === 'recent' 
          ? await api.getRecentlyPlayed(token)
          : await api.getLikedTracks(token)
        
        console.log('Dashboard: Albums received:', response.albums?.length || 0)
        
        // アルバムデータをTrack形式に変換
        const tracksFromAlbums: Track[] = response.albums.map((album: any) => ({
          id: album.album.id,
          name: album.album.name,
          artist: album.album.artists?.[0]?.name || 'Unknown Artist',
          album: album.album.name,
          imageUrl: album.album.images?.[0]?.url || 'https://via.placeholder.com/300x300',
          playCount: album.count,
          spotifyUrl: album.album.external_urls?.spotify,
          albumUrl: album.album.external_urls?.spotify
        }))
        
        setTracks(tracksFromAlbums)
      } catch (error) {
        console.error('Dashboard: API error:', error)
        if (error instanceof Error && error.message === 'Token expired') {
          setError('トークンが期限切れです。再度ログインしてください')
          localStorage.removeItem('spotify_access_token')
        } else {
          setError('曲の取得に失敗しました')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [navigate, mode])

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
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
          <div className="flex items-center space-x4">
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