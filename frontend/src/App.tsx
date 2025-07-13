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
    const urlParams = new URLSearchParams(location.search)
    const code = urlParams.get('code')
    
    if (code) {
      // クエリパラメータを保持したまま/callbackにリダイレクト
      navigate(`/callback${location.search}`)
    }
  }, [navigate, location.search])

  return <Login />
}

function App() {
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