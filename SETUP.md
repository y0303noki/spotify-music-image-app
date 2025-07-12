# 🚀 Spotify Music Image App セットアップガイド

## 📋 前提条件

- Docker Desktop がインストールされている
- Spotify Developer Account を持っている
- GitHub Account を持っている

## 🔧 セットアップ手順

### 1. Spotify Developer 設定

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) にアクセス
2. 新しいアプリケーションを作成
3. アプリケーション設定で以下を設定：
   - **Redirect URI**: `http://127.0.0.1:8888/callback`
   - **Client ID** と **Client Secret** をメモ

### 2. 環境変数の設定

```bash
# env.example を .env にコピー
cp env.example .env

# .env ファイルを編集して以下を設定
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### 3. Docker環境の起動

```bash
# Docker Composeでアプリケーションを起動
docker-compose up --build
```

### 4. アプリケーションにアクセス

- **フロントエンド**: http://127.0.0.1:8888
- **バックエンド**: http://127.0.0.1:8000

## 🎯 使用方法

1. ブラウザで http://127.0.0.1:8888 にアクセス
2. "Spotifyでログイン" ボタンをクリック
3. Spotifyアカウントで認証
4. 最近聴いた曲のジャケット写真が表示される
5. 聴取頻度に応じて写真サイズが調整される

## 🚀 GitHub Pages デプロイ

### 1. GitHub リポジトリの作成

1. GitHubで新しいリポジトリを作成
2. ローカルリポジトリをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[username]/spotify-music-image-app.git
git push -u origin main
```

### 2. GitHub Pages の設定

1. リポジトリの Settings > Pages に移動
2. Source を "Deploy from a branch" に設定
3. Branch を "gh-pages" に設定
4. Save をクリック

### 3. 環境変数の設定

1. リポジトリの Settings > Secrets and variables > Actions に移動
2. 以下のシークレットを追加：
   - `VITE_REACT_APP_API_URL`: バックエンドのURL
   - `VITE_REACT_APP_REDIRECT_URI`: 本番環境のRedirect URI

### 4. Spotify Developer 設定の更新

本番環境用のRedirect URIを追加：
`https://[username].github.io/spotify-music-image-app/callback`

## 🔍 トラブルシューティング

### よくある問題

1. **Docker が起動しない**
   - Docker Desktop が起動しているか確認
   - ポート 3000, 8000 が使用されていないか確認

2. **Spotify 認証エラー**
   - Redirect URI が正確に設定されているか確認
   - Client ID と Secret が正しく設定されているか確認

3. **API エラー**
   - バックエンドが正常に起動しているか確認
   - 環境変数が正しく設定されているか確認

### ログの確認

```bash
# フロントエンドのログ
docker-compose logs frontend

# バックエンドのログ
docker-compose logs backend
```

## 📁 プロジェクト構造

```
spotify-music-image-app/
├── frontend/                 # React アプリケーション
│   ├── src/
│   │   ├── pages/          # ページコンポーネント
│   │   ├── App.tsx         # メインアプリケーション
│   │   └── main.tsx        # エントリーポイント
│   ├── package.json        # フロントエンド依存関係
│   └── Dockerfile          # フロントエンドDocker設定
├── backend/                 # Express API サーバー
│   ├── src/
│   │   └── index.js        # メインサーバーファイル
│   ├── package.json        # バックエンド依存関係
│   └── Dockerfile          # バックエンドDocker設定
├── docker-compose.yml      # Docker環境設定
├── .github/workflows/      # GitHub Actions
└── README.md              # プロジェクト説明
```

## 🛠️ 開発

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

### バックエンド開発

```bash
cd backend
npm install
npm run dev
```

## �� ライセンス

MIT License 