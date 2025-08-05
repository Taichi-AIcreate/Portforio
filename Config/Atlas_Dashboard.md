<div class="dashboard-container">

<div class="clock-widget">
  <div class="time"></div>
  <div class="date"></div>
</div>

<div class="dashboard-grid">

<div class="widget-card">
### 📝 最近のノート
```dataview
TABLE file.mtime as "更新日時"
FROM ""
SORT file.mtime DESC
LIMIT 5
```
</div>

<div class="widget-card">
### ✅ タスクリスト
```dataview
TASK
FROM ""
WHERE !completed
```
</div>

<div class="widget-card">
### 🚀 クイックリンク
- [[Dashboard]]
- [[日次レビュー]]
- [[プロジェクト一覧]]
</div>

<div class="widget-card">
### 📈 ノート数の統計
<div class="stat-card">
**合計ノート数**
`$=dv.pages().length`
</div>
</div>

</div>

</div>