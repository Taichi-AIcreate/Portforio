# Obsidian ダッシュボード作成ガイド

## 概要
画像のような美しいダッシュボードをObsidianで作成する方法を説明します。

## 必要なプラグイン

### 既にインストール済み
- ✅ Calendar
- ✅ Obsidian Style Settings
- ✅ Obsidian Memos

### 追加推奨プラグイン
1. **Dataview** - データの動的表示
2. **Templater** - テンプレート機能
3. **Minimal Theme Settings** - テーマカスタマイズ
4. **Advanced Tables** - テーブル機能
5. **Dashboard** - ダッシュボード機能

## 実装手順

### ステップ1: プラグインのインストール
1. Obsidianの設定を開く
2. コミュニティプラグイン → ブラウズ
3. 上記のプラグインを検索してインストール

### ステップ2: ダッシュボードノートの作成
```markdown
---
title: Atlas Dashboard
date: 2025-01-19
tags: [dashboard, atlas]
---

# Atlas Dashboard

## 🕐 現在時刻
<div class="clock-widget">
  <div class="time">{{date:HH:mm:ss}}</div>
  <div class="date">{{date:dddd, MMMM D, YYYY}}</div>
</div>

## 📊 統計
```dataview
TABLE 
  length(file.inlinks) as "リンク数",
  length(file.outlinks) as "参照数"
FROM "Daily"
SORT file.name DESC
LIMIT 5
```

## 📝 最近のノート
```dataview
TABLE 
  file.mtime as "更新日"
FROM "Daily"
SORT file.mtime DESC
LIMIT 10
```

## 🎯 今日のタスク
- [ ] タスク1
- [ ] タスク2
- [x] 完了したタスク

## 📚 学習進捗
### Machine Learning
- [ ] 線形代数の復習
- [ ] 統計学の基礎
- [x] Python基礎

### 数学
- [ ] 積分法の応用
- [ ] 行列計算
- [x] 微分方程式
```

### ステップ3: CSSカスタマイズ
`.obsidian/snippets/dashboard.css` を作成：

```css
/* ダッシュボード用CSS */
.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  padding: 20px;
}

.clock-widget {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  margin: 20px 0;
}

.time {
  font-size: 3em;
  font-weight: bold;
}

.date {
  font-size: 1.2em;
  opacity: 0.9;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
  backdrop-filter: blur(10px);
}

.task-list {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin: 10px 0;
}
```

### ステップ4: テーマ設定
1. 設定 → 外観
2. テーマを「Minimal」に変更
3. Style Settings プラグインでカスタマイズ

## カスタマイズのポイント

### 1. レイアウト
- 3カラムレイアウト（左サイドバー、メイン、右サイドバー）
- グリッドシステムを使用したカード配置

### 2. 視覚的要素
- グラデーション背景
- カード形式のウィジェット
- アイコンと絵文字の活用

### 3. 動的コンテンツ
- Dataview クエリで最新ノート表示
- テンプレート変数で日時表示
- タスクリストの統合

## 高度なカスタマイズ

### JavaScript による時計機能
```javascript
// リアルタイム時計
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString('ja-JP', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 時計要素を更新
  const clockElement = document.querySelector('.clock-widget .time');
  if (clockElement) {
    clockElement.textContent = timeString;
  }
}

setInterval(updateClock, 1000);
```

## トラブルシューティング

### よくある問題
1. **プラグインが動作しない**
   - プラグインを有効化しているか確認
   - Obsidianを再起動

2. **CSSが適用されない**
   - スニペットが有効化されているか確認
   - ブラウザの開発者ツールでCSSを確認

3. **Dataviewクエリが動作しない**
   - クエリの構文を確認
   - ファイルパスが正しいか確認

## 参考リソース
- [Obsidian公式ドキュメント](https://help.obsidian.md/)
- [Dataviewプラグイン](https://blacksmithgu.github.io/obsidian-dataview/)
- [Obsidian Style Settings](https://github.com/mgmeyers/obsidian-style-settings) 