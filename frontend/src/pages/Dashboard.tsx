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
  const [trackLimit, setTrackLimit] = useState<number>(200)
  const [showSettings, setShowSettings] = useState(false)
  const [totalFetched, setTotalFetched] = useState<number>(0)
  const [screenshotMode, setScreenshotMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token')
    
    if (!token) {
      navigate('/')
      return
    }

    const fetchTracks = async () => {
      try {
        const response = mode === 'recent' 
          ? await api.getRecentlyPlayed(token, trackLimit)
          : await api.getLikedTracks(token, trackLimit)
        
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
        setTotalFetched(response.totalFetched || 0)
      } catch (error) {
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
  }, [navigate, mode, trackLimit])

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
    navigate('/')
  }

  const handleLimitChange = (newLimit: number) => {
    setTrackLimit(newLimit)
    setLoading(true)
  }

  const handleScreenshotMode = () => {
    setScreenshotMode(!screenshotMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spotify-green mx-auto"></div>
          <p className="mt-4 text-white">曲を読み込み中...</p>
          <p className="mt-2 text-sm text-gray-400">取得数: {trackLimit}曲</p>
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
      <div className={`absolute top-0 left-0 right-0 z-40 p-2 sm:p-4 transition-all duration-300 ${
        screenshotMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
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
            
            {/* 設定ボタン */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full sm:w-auto bg-spotify-gray text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              設定
            </button>
          </div>
        </div>
        
        {/* 設定パネル */}
        {showSettings && (
          <div className="mt-4 p-4 bg-spotify-gray/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="text-white text-sm sm:text-base">
                取得曲数:
              </label>
              <select
                value={trackLimit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                className="bg-spotify-black text-white px-3 py-2 rounded border border-gray-600 text-sm sm:text-base"
              >
                <option value={200}>200曲</option>
                <option value={500}>500曲</option>
                <option value={1000}>1000曲</option>
              </select>
              <span className="text-gray-300 text-xs sm:text-sm">
                実際に取得: {totalFetched}曲
              </span>
              
              {/* スクリーンショットボタン */}
              <button
                onClick={handleScreenshotMode}
                className="px-4 py-2 rounded-lg transition-colors text-sm sm:text-base bg-spotify-green hover:bg-green-600 text-white"
              >
                スクリーンショット
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ログアウトボタン - 右下の小さなアイコンボタン */}
      <div className={`absolute bottom-4 right-4 z-50 transition-all duration-300 ${
        screenshotMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
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

      {/* スクリーンショットモード時の専用ボタン */}
      {screenshotMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              スクリーンショットモード - UI要素を非表示中
            </div>
            <button
              onClick={handleScreenshotMode}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg"
            >
              撮影完了
            </button>
          </div>
        </div>
      )}

      {/* 音楽ビジュアライザー */}
      <MusicVisualizer tracks={tracks} mode={mode} />
    </div>
  )
}

export default Dashboard 