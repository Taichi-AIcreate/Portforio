# メタゲーム西中島月次報告 - React + Vite

このプロジェクトは、メタゲーム西中島の月次報告を表示するReactアプリケーションです。ReactBits MCPを使用したBallpit背景アニメーションと、美しいガラスモーフィズムUIを組み合わせています。

## 技術スタック

- **React 19** + **TypeScript**
- **Vite** - 高速なビルドツール
- **Three.js** + **@react-three/fiber** - 3D背景アニメーション
- **ReactBits MCP** - Ballpit背景コンポーネント
- **TailwindCSS** - スタイリング
- **GSAP** - アニメーション

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## GitHub Pagesでの公開

このプロジェクトはGitHub Pagesで自動デプロイされるように設定されています。

### 初回セットアップ

1. GitHubでリポジトリを作成
2. ローカルリポジトリをGitHubにプッシュ
3. GitHubリポジトリの設定で「Pages」を有効化
4. ソースを「GitHub Actions」に設定

### 自動デプロイ

- `main`ブランチにプッシュすると自動的にビルド・デプロイされます
- デプロイ先: `https://<USERNAME>.github.io/mynote/`

### 設定ファイル

- `vite.config.ts` - `base: "/mynote/"` を設定（リポジトリ名に合わせて変更）
- `.github/workflows/deploy.yml` - GitHub Actionsワークフロー
- `scripts/postbuild.cjs` - SPAルーティング用の404.html生成

## プロジェクト構造

```
frontend/
├── src/
│   ├── components/
│   │   └── Backgrounds/
│   │       └── Ballpit.tsx    # ReactBits MCP由来の背景コンポーネント
│   ├── App.tsx                # メインアプリケーション
│   ├── App.css               # スタイル（TailwindCSS + カスタムCSS）
│   └── main.tsx              # エントリーポイント
├── scripts/
│   └── postbuild.cjs         # ビルド後スクリプト
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions設定
├── vite.config.ts            # Vite設定
└── tailwind.config.js        # TailwindCSS設定
```

## 特徴

- **美しい背景アニメーション**: ReactBits MCPのBallpitコンポーネントを使用
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **ガラスモーフィズムUI**: モダンな半透明エフェクト
- **TypeScript**: 型安全性の確保
- **自動デプロイ**: GitHub Actionsによる継続的デプロイ

## 開発者向け情報

### ReactBits MCPの使用

このプロジェクトではReactBits MCPを使用してBallpit背景コンポーネントを取得しています：

```typescript
// MCPから取得したコンポーネントを使用
import Ballpit from './components/Backgrounds/Ballpit';

// 使用例
<Ballpit 
  followCursor={true}
  colors={[0x7dd3fc, 0xfca5a5, 0xfde68a, 0x86efac, 0xd8b4fe]}
  count={220}
/>
```

### カスタマイズ

- 背景色やアニメーション設定は`Ballpit`コンポーネントのpropsで調整可能
- スタイルは`src/App.css`でカスタマイズ可能
- TailwindCSSクラスを組み合わせてレイアウトを調整

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
