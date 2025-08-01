# 🎵 Spotify Music Image App

Spotify APIを使用して最近聴いている曲のジャケット写真を取得し、聴取頻度に応じて写真サイズを調整するWebアプリケーションです。

## ✨ 機能

- Spotifyアカウントでのログイン
- 最近聴いた曲の取得
- ジャケット写真の表示
- 聴取頻度に応じた写真サイズの調整

## 🛠️ 技術スタック

- **フロントエンド**: React, TypeScript, Tailwind CSS
- **バックエンド**: Node.js, Express
- **API**: Spotify Web API
- **環境**: Docker
- **デプロイ**: GitHub Pages

## 🚀 セットアップ

### 前提条件

- Docker
- Spotify Developer Account
- GitHub Account

### 1. リポジトリのクローン

```bash
git clone https://github.com/[username]/spotify-music-image-app.git
cd spotify-music-image-app
```

### 2. Spotify Developer設定

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) にアクセス
2. 新しいアプリケーションを作成
3. Redirect URIを設定:
   - 開発環境: `http://127.0.0.1:8888/callback`
   - 本番環境: `https://[username].github.io/spotify-music-image-app/callback`

### 3. 環境変数の設定

```bash
# .env ファイルを作成
cp .env.example .env

# 環境変数を設定
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

### 4. Docker環境の起動

```bash
docker-compose up --build
```

### 5. アプリケーションにアクセス

- フロントエンド: http://127.0.0.1:8888
- バックエンド: http://127.0.0.1:8000

## 📁 プロジェクト構造

```
spotify-music-image-app/
├── frontend/                 # React アプリケーション
├── backend/                  # Express API サーバー
├── docker-compose.yml        # Docker 設定
├── .github/                  # GitHub Actions
└── README.md
```

## 🔧 開発

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

## 🚀 デプロイ

### GitHub Pages へのデプロイ

1. リポジトリの設定で GitHub Pages を有効化
2. ソースを `gh-pages` ブランチに設定
3. GitHub Actions で自動デプロイ

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！ #   s p o t i f y - m u s i c - i m a g e - a p p  
 