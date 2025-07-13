import React, { useEffect, useState } from 'react'

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

interface MusicVisualizerProps {
  tracks: Track[]
  mode: 'recent' | 'liked'
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ tracks, mode }) => {
  const [positions, setPositions] = useState<Array<{ x: number; y: number; size: number }>>([])

  useEffect(() => {
    if (tracks.length === 0) return

    // 4位以降の曲/アルバムを無作為に配置
    const otherTracks = tracks.slice(3)
    const newPositions = otherTracks.map((track: Track) => {
      // ランダムな位置を生成（中央を避ける）
      const angle = Math.random() * 2 * Math.PI
      // モバイル対応: 距離を調整
      const distance = window.innerWidth < 768 ? 100 + Math.random() * 200 : 200 + Math.random() * 400
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      // サイズを聴取回数に基づいて計算（モバイル対応）
      const baseSize = window.innerWidth < 768 ? 40 + (track.playCount * 5) : 80 + (track.playCount * 10)
      const maxSize = window.innerWidth < 768 ? 100 : 200
      const size = Math.min(baseSize, maxSize)
      
      return { x, y, size }
    })
    
    setPositions(newPositions)
  }, [tracks])

  const handleClick = (track: Track) => {
    if (mode === 'liked' && track.albumUrl) {
      window.open(track.albumUrl, '_blank')
    } else if (mode === 'recent' && track.spotifyUrl) {
      window.open(track.spotifyUrl, '_blank')
    }
  }

  if (tracks.length === 0) return null

  const mainTrack = tracks[0]
  const secondTrack = tracks[1]
  const thirdTrack = tracks[2]

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-spotify-black">
      {/* メインの曲/アルバム（中央に大きく表示） - レスポンシブ対応 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative group">
          {/* グロー効果 */}
          <div className="absolute inset-0 bg-spotify-green rounded-full blur-3xl opacity-20 animate-pulse" />
          
          <img
            src={mainTrack.imageUrl}
            alt={mainTrack.name}
            className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl border-4 border-spotify-green/30 hover:border-spotify-green/60 transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={() => handleClick(mainTrack)}
            title={`${mainTrack.name} - ${mainTrack.artist}`}
            draggable={false}
          />
          
          {/* 情報オーバーレイ - レスポンシブ対応 */}
          <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 text-center">
            <h3 className="text-white text-lg sm:text-xl font-bold truncate max-w-48 sm:max-w-64 md:max-w-80 mb-1 sm:mb-2">
              {mainTrack.name}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base truncate max-w-48 sm:max-w-64 md:max-w-80 mb-1">
              {mainTrack.artist}
            </p>
            <div className="inline-flex items-center bg-spotify-green/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              <span className="text-spotify-green text-sm sm:text-lg font-bold">
                {mode === 'recent' ? `♪ ${mainTrack.playCount}回` : `♥ ${mainTrack.playCount}曲`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2位の曲/アルバム（右上に配置） */}
      {secondTrack && (
        <div className="absolute top-1/4 right-1/4 z-25 transition-all duration-700 ease-out hover:scale-110 hover:z-30">
          <div className="relative group">
            {/* ホバー時のグロー効果 */}
            <div className="absolute inset-0 bg-spotify-green rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <img
              src={secondTrack.imageUrl}
              alt={secondTrack.name}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-xl shadow-lg opacity-85 hover:opacity-100 transition-all duration-300 border-2 border-transparent hover:border-spotify-green/40 cursor-pointer"
              onClick={() => handleClick(secondTrack)}
              title={`${secondTrack.name} - ${secondTrack.artist}`}
              draggable={false}
            />
            
            {/* 情報表示 */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white text-sm sm:text-base font-semibold truncate max-w-32 sm:max-w-40 md:max-w-48 mb-1">
                {secondTrack.name}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm truncate max-w-32 sm:max-w-40 md:max-w-48 mb-1">
                {secondTrack.artist}
              </p>
              <div className="inline-flex items-center bg-spotify-green/15 px-2 sm:px-3 py-1 rounded-full">
                <span className="text-spotify-green text-xs sm:text-sm font-bold">
                  {mode === 'recent' ? `♪ ${secondTrack.playCount}回` : `♥ ${secondTrack.playCount}曲`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3位の曲/アルバム（左上に配置） */}
      {thirdTrack && (
        <div className="absolute top-1/4 left-1/4 z-25 transition-all duration-700 ease-out hover:scale-110 hover:z-30">
          <div className="relative group">
            {/* ホバー時のグロー効果 */}
            <div className="absolute inset-0 bg-spotify-green rounded-lg blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <img
              src={thirdTrack.imageUrl}
              alt={thirdTrack.name}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-xl shadow-lg opacity-85 hover:opacity-100 transition-all duration-300 border-2 border-transparent hover:border-spotify-green/40 cursor-pointer"
              onClick={() => handleClick(thirdTrack)}
              title={`${thirdTrack.name} - ${thirdTrack.artist}`}
              draggable={false}
            />
            
            {/* 情報表示 */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white text-sm sm:text-base font-semibold truncate max-w-32 sm:max-w-40 md:max-w-48 mb-1">
                {thirdTrack.name}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm truncate max-w-32 sm:max-w-40 md:max-w-48 mb-1">
                {thirdTrack.artist}
              </p>
              <div className="inline-flex items-center bg-spotify-green/15 px-2 sm:px-3 py-1 rounded-full">
                <span className="text-spotify-green text-xs sm:text-sm font-bold">
                  {mode === 'recent' ? `♪ ${thirdTrack.playCount}回` : `♥ ${thirdTrack.playCount}曲`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4位以降の曲/アルバムを無作為に配置 - レスポンシブ対応 */}
      {tracks.slice(3).map((track: Track, index: number) => {
        const position = positions[index]
        if (!position) return null

        return (
          <div
            key={track.id}
            className="absolute z-20 transition-all duration-700 ease-out hover:scale-125 hover:z-30"
            style={{
              left: `calc(50% + ${position.x}px)`,
              top: `calc(50% + ${position.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative group">
              {/* ホバー時のグロー効果 */}
              <div className="absolute inset-0 bg-spotify-green rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              
              <img
                src={track.imageUrl}
                alt={track.name}
                className="relative rounded-lg shadow-lg opacity-90 hover:opacity-100 transition-all duration-300 border-2 border-transparent hover:border-spotify-green/50 cursor-pointer"
                style={{
                  width: `${position.size}px`,
                  height: `${position.size}px`,
                  objectFit: 'cover',
                }}
                onClick={() => handleClick(track)}
                title={`${track.name} - ${track.artist}`}
                draggable={false}
              />
              
              {/* ホバー時の情報表示 - レスポンシブ対応 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 sm:p-2">
                  <p className="text-xs font-semibold truncate max-w-24 sm:max-w-32 mb-1">
                    {track.name}
                  </p>
                  <p className="text-xs truncate max-w-24 sm:max-w-32 mb-1">
                    {track.artist}
                  </p>
                  <p className="text-spotify-green text-xs font-bold">
                    {mode === 'recent' ? `♪ ${track.playCount}回` : `♥ ${track.playCount}曲`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* 背景を埋めるための追加画像（画面の隙間を埋める） - レスポンシブ対応 */}
      {Array.from({ length: Math.max(0, (window.innerWidth < 768 ? 10 : 20) - tracks.length) }).map((_, index: number) => {
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)]
        if (!randomTrack) return null

        const angle = Math.random() * 2 * Math.PI
        const distance = window.innerWidth < 768 ? 150 + Math.random() * 250 : 300 + Math.random() * 500
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance
        const size = window.innerWidth < 768 ? 20 + Math.random() * 30 : 40 + Math.random() * 60

        return (
          <div
            key={`background-${index}`}
            className="absolute z-10 opacity-30 hover:opacity-60 transition-opacity duration-300"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={randomTrack.imageUrl}
              alt=""
              className="rounded-lg shadow-sm"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                objectFit: 'cover',
              }}
              draggable={false}
            />
          </div>
        )
      })}
    </div>
  )
}

export default MusicVisualizer 