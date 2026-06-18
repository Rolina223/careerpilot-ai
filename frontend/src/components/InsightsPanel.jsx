function InsightsPanel({ strengths, weaknesses }) {
  return (
    <div className="insights-grid">
      <div className="insights-card insights-strengths">
        <h3>Strengths</h3>
        <ul>
          {strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="insights-card insights-weaknesses">
        <h3>Weaknesses</h3>
        <ul>
          {weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default InsightsPanel;
