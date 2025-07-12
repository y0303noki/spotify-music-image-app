import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import './App.css'

// ルートパスでのコールバック処理を行うコンポーネント
const RootCallback: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    console.log('RootCallback component mounted')
    console.log('Location pathname:', location.pathname)
    console.log('Location search:', location.search)
    console.log('Location hash:', location.hash)
    
    const urlParams = new URLSearchParams(location.search)
    const code = urlParams.get('code')
    
    console.log('Code in RootCallback:', code ? 'present' : 'missing')
    
    if (code) {
      console.log('Code found in root path, redirecting to callback')
      // クエリパラメータを保持したまま/callbackにリダイレクト
      navigate(`/callback${location.search}`)
    }
  }, [navigate, location.search])

  return <Login />
}

function App() {
  useEffect(() => {
    console.log('App component mounted')
    console.log('Current pathname:', window.location.pathname)
    console.log('Current search:', window.location.search)
    console.log('Current hash:', window.location.hash)
    
    // クエリパラメータを直接チェック
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    console.log('Code in App:', code ? 'present' : 'missing')
  }, [])

  // ローカル環境かどうかを判定
  const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  const basename = isLocalhost ? '' : '/spotify-music-image-app'

  return (
    <Router basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<RootCallback />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 