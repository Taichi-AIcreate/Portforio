<div class="dashboard-container">

<div class="clock-widget">
  <div class="time"></div>
  <div class="date"></div>
</div>

<div class="dashboard-grid">

<div class="widget-card">
### 📝 過去7日間に作成したノート
```dataview
LIST
FROM ""
WHERE file.ctime >= date(today) - dur(7 day)
SORT file.ctime DESC
```
</div>

<div class="widget-card">
### ✅ 未完了のタスク
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