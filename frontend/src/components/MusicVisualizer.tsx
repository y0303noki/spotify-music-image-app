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
      {/* 上位3曲のカードエリア */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-6xl px-4">
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6">
          {/* 3位のカード */}
          {thirdTrack && (
            <div className="flex-1 max-w-32 sm:max-w-40 md:max-w-48">
              <div className="relative group cursor-pointer" onClick={() => handleClick(thirdTrack)}>
                {/* カード背景 */}
                <div className="bg-spotify-gray/80 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-spotify-green/20 hover:border-spotify-green/40 transition-all duration-300">
                  {/* 順位表示 */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-spotify-green rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  
                  {/* 画像 */}
                  <img
                    src={thirdTrack.imageUrl}
                    alt={thirdTrack.name}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                    title={`${thirdTrack.name} - ${thirdTrack.artist}`}
                    draggable={false}
                  />
                  
                  {/* 情報 */}
                  <div className="mt-2 text-center">
                    <p className="text-white text-xs sm:text-sm font-semibold truncate mb-1">
                      {thirdTrack.name}
                    </p>
                    <p className="text-gray-300 text-xs truncate mb-1">
                      {thirdTrack.artist}
                    </p>
                    <div className="inline-flex items-center bg-spotify-green/20 px-2 py-1 rounded-full">
                      <span className="text-spotify-green text-xs font-bold">
                        {mode === 'recent' ? `♪ ${thirdTrack.playCount}回` : `♥ ${thirdTrack.playCount}曲`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1位のカード（中央、大きく） */}
          <div className="flex-1 max-w-40 sm:max-w-48 md:max-w-56">
            <div className="relative group cursor-pointer" onClick={() => handleClick(mainTrack)}>
              {/* カード背景 */}
              <div className="bg-spotify-gray/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-spotify-green/30 hover:border-spotify-green/60 transition-all duration-300">
                {/* 順位表示 */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                
                {/* グロー効果 */}
                <div className="absolute inset-0 bg-spotify-green rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                {/* 画像 */}
                <img
                  src={mainTrack.imageUrl}
                  alt={mainTrack.name}
                  className="relative w-full aspect-square object-cover rounded-lg shadow-xl"
                  title={`${mainTrack.name} - ${mainTrack.artist}`}
                  draggable={false}
                />
                
                {/* 情報 */}
                <div className="mt-3 text-center">
                  <p className="text-white text-sm sm:text-base font-bold truncate mb-1">
                    {mainTrack.name}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm truncate mb-2">
                    {mainTrack.artist}
                  </p>
                  <div className="inline-flex items-center bg-spotify-green/30 px-3 py-1 rounded-full">
                    <span className="text-spotify-green text-sm font-bold">
                      {mode === 'recent' ? `♪ ${mainTrack.playCount}回` : `♥ ${mainTrack.playCount}曲`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2位のカード */}
          {secondTrack && (
            <div className="flex-1 max-w-32 sm:max-w-40 md:max-w-48">
              <div className="relative group cursor-pointer" onClick={() => handleClick(secondTrack)}>
                {/* カード背景 */}
                <div className="bg-spotify-gray/80 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-spotify-green/20 hover:border-spotify-green/40 transition-all duration-300">
                  {/* 順位表示 */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-spotify-green rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  
                  {/* 画像 */}
                  <img
                    src={secondTrack.imageUrl}
                    alt={secondTrack.name}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                    title={`${secondTrack.name} - ${secondTrack.artist}`}
                    draggable={false}
                  />
                  
                  {/* 情報 */}
                  <div className="mt-2 text-center">
                    <p className="text-white text-xs sm:text-sm font-semibold truncate mb-1">
                      {secondTrack.name}
                    </p>
                    <p className="text-gray-300 text-xs truncate mb-1">
                      {secondTrack.artist}
                    </p>
                    <div className="inline-flex items-center bg-spotify-green/20 px-2 py-1 rounded-full">
                      <span className="text-spotify-green text-xs font-bold">
                        {mode === 'recent' ? `♪ ${secondTrack.playCount}回` : `♥ ${secondTrack.playCount}曲`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 中央エリアの背景画像（カードエリアの下のスペースを埋める） */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {tracks.slice(3, 6).map((track: Track, index: number) => {
          const angle = (index * 120) * (Math.PI / 180) // 120度ずつ配置
          const distance = window.innerWidth < 768 ? 80 : 120
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance
          const size = window.innerWidth < 768 ? 60 : 80

          return (
            <div
              key={`center-${track.id}`}
              className="absolute transition-all duration-700 ease-out hover:scale-125 hover:z-20"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative group">
                {/* ホバー時のグロー効果 */}
                <div className="absolute inset-0 bg-spotify-green rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  className="relative rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-all duration-300 border-2 border-transparent hover:border-spotify-green/50 cursor-pointer"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    objectFit: 'cover',
                  }}
                  onClick={() => handleClick(track)}
                  title={`${track.name} - ${track.artist}`}
                  draggable={false}
                />
                
                {/* ホバー時の情報表示 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                    <p className="text-xs font-semibold truncate max-w-20 mb-1">
                      {track.name}
                    </p>
                    <p className="text-xs truncate max-w-20 mb-1">
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
      </div>

      {/* 4位以降の曲/アルバムを無作為に配置 - レスポンシブ対応 */}
      {tracks.slice(6).map((track: Track, index: number) => {
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