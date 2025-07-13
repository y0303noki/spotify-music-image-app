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
      {/* ヘッダー - レスポンシブ対応 */}
      <div className="absolute top-0 left-0 right-0 z-40 p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          {/* タイトル */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center sm:text-left">
            Music Gallery
          </h1>
          
          {/* コントロールボタン群 */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* モード切り替えボタン - モバイル対応 */}
            <div className="flex bg-spotify-gray rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setMode('recent')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition-colors ${
                  mode === 'recent'
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                最近聴いた曲
              </button>
              <button
                onClick={() => setMode('liked')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition-colors ${
                  mode === 'liked'
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                いいねした曲
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ログアウトボタン - 右下の小さなアイコンボタン */}
      <div className="absolute bottom-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-spotify-gray/50 hover:bg-spotify-gray/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          title="ログアウト"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* 音楽ビジュアライザー */}
      <MusicVisualizer tracks={tracks} mode={mode} />
    </div>
  )
}

export default Dashboard 