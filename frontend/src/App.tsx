import Ballpit from './components/Backgrounds/Ballpit';
import './App.css';

function App() {
  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Ballpit Background */}
      <div className="fixed inset-0 -z-10">
        <Ballpit 
          followCursor={true}
          colors={[0x7dd3fc, 0xfca5a5, 0xfde68a, 0x86efac, 0xd8b4fe]}
          count={100}
        />
      </div>

      {/* Content Container */}
      <div className="container">
        <h1>メタゲーム西中島月次報告</h1>
        <div id="july-content">
          <p style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)'}}>2025年7月1日~7月31日</p>
          <h2 className="section-title">7月度 運営状況</h2>
          <div className="grid-container">
            <div className="card">
              <h2>稼働率</h2>
              <div className="value green">89.4%</div>
            </div>
            <div className="card">
              <h2>給付費</h2>
              <div className="value green">¥1,426,845</div>
            </div>
            <div className="card">
              <h2>生産活動費</h2>
              <div className="value red">¥0</div>
            </div>
            <div className="card">
              <h2>退所者数</h2>
              <div className="value blue">0人</div>
            </div>
            <div className="card">
              <h2>新規契約者</h2>
              <div className="value green">3名</div>
            </div>
            <div className="card">
              <h2>体験・見学人数</h2>
              <div className="value green">3名</div>
            </div>
          </div>
          
          <h2 className="section-title">6月・7月比較</h2>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>6月</th>
                <th>7月</th>
                <th>変化</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>給付費</td>
                <td>¥858,000</td>
                <td>¥1,426,845</td>
                <td className="comparison-positive">+¥568,845 (+66.3%)</td>
              </tr>
              <tr>
                <td>利用日数/目標</td>
                <td>143日/189日</td>
                <td>210日/235日</td>
                <td className="comparison-positive">+67日 (+46.9%)</td>
              </tr>
              <tr>
                <td>利用率</td>
                <td>75.7%</td>
                <td>89.4%</td>
                <td className="comparison-positive">+13.7%</td>
              </tr>
              <tr>
                <td>見学実施数</td>
                <td>3人</td>
                <td>3人</td>
                <td className="comparison-neutral">±0人 (維持)</td>
              </tr>
              <tr>
                <td>契約数</td>
                <td>3件</td>
                <td>3件</td>
                <td className="comparison-neutral">±0件 (維持)</td>
              </tr>
              <tr>
                <td>契約率</td>
                <td>100%</td>
                <td>100%</td>
                <td className="comparison-neutral">維持</td>
              </tr>
              <tr>
                <td>退所者数</td>
                <td>0人</td>
                <td>0人</td>
                <td className="comparison-neutral">変動なし</td>
              </tr>
            </tbody>
          </table>
          
          <h2 className="section-title">7月度 目標達成率</h2>
          <div className="progress-section">
            <div className="progress-item">
              <label>見学見込み (達成率30%)</label>
              <div className="progress-bar-container">
                <div className="progress-bar blue-bar" style={{width: '30%'}}>3件/10件</div>
              </div>
            </div>
            <div className="progress-item">
              <label>見学実施 (達成率38%)</label>
              <div className="progress-bar-container">
                <div className="progress-bar blue-bar" style={{width: '38%'}}>3件/8件</div>
              </div>
            </div>
            <div className="progress-item">
              <label>契約数 (達成率75%)</label>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{width: '75%'}}>3件/4件</div>
              </div>
            </div>
            <div className="progress-item">
              <label>利用日数 (達成率89%)</label>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{width: '89%'}}>210日/235日</div>
              </div>
            </div>
          </div>
          
          <h2 className="section-title">7月度 総評</h2>
          <div className="summary-section">
            <div className="summary-item">
              <h3>【成果】</h3>
              <p>7月は給付費が¥1,426,845と大幅に増加し、前月比66.3%の成長を記録しました。利用率も89.4%まで上昇し、6月の75.7%から13.7ポイントの改善を達成しました。利用日数も210日と大幅に増加し、目標235日に対して89%の達成率を記録しています。新規契約者3名の定着も順調で、契約率100%を維持しています。</p>
            </div>
            <div className="summary-item">
              <h3>【課題】</h3>
              <p>見学見込み・見学実施数は6月と同様に目標を下回っており、営業活動の強化が引き続き必要です。生産活動も3ヶ月連続で実績がない状態が続いており、今後の活動再開に向けた計画策定が急務です。また、新規利用者の獲得と既存利用者の利用率向上の両面での取り組みが必要です。</p>
            </div>
            <div className="summary-item">
              <h3>【今後の展望】</h3>
              <p>7月の好調な実績を基盤に、利用率90%達成を目指します。見学から契約への転換率100%を維持しつつ、見学機会自体を増やす施策を展開します。給付費の大幅増加を継続し、年間目標の早期達成を目指します。また、生産活動の再開に向けて、利用者様のニーズに合った新たな活動内容の検討を進め、収益の多様化を図ります。</p>
            </div>
          </div>
          
          <div className="footer">
            作成日:2025年8月3日 | メタゲーム西中島 島林
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
