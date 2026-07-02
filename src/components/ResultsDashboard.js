import React from 'react';
import IssueCard from './IssueCard';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function ResultsDashboard({ result, sourceCode, fileName }) {

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#ca8a04';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Good ✅';
    if (score >= 50) return 'Fair ⚠️';
    return 'Poor ❌';
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/scan/report`,
        {
          fileName: fileName,
          sourceCode: sourceCode
        },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF report! Make sure backend is running.');
    }
  };

  return (
    <div className="results-container">

      {/* Health Score */}
      <div className="health-score-card">
        <h2>Code Health Score</h2>
        <div
          className="score-circle"
          style={{ borderColor: getScoreColor(result.healthScore) }}
        >
          <span
            className="score-number"
            style={{ color: getScoreColor(result.healthScore) }}
          >
            {result.healthScore}
          </span>
          <span className="score-total">/100</span>
        </div>
        <p
          className="score-label"
          style={{ color: getScoreColor(result.healthScore) }}
        >
          {getScoreLabel(result.healthScore)}
        </p>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h2>📊 Issue Summary</h2>
        <div className="summary-grid">
          <div className="summary-item critical">
            <span className="summary-count">
              {result.issueCountBySeverity.CRITICAL}
            </span>
            <span className="summary-label">Critical</span>
          </div>
          <div className="summary-item high">
            <span className="summary-count">
              {result.issueCountBySeverity.HIGH}
            </span>
            <span className="summary-label">High</span>
          </div>
          <div className="summary-item medium">
            <span className="summary-count">
              {result.issueCountBySeverity.MEDIUM}
            </span>
            <span className="summary-label">Medium</span>
          </div>
          <div className="summary-item low">
            <span className="summary-count">
              {result.issueCountBySeverity.LOW}
            </span>
            <span className="summary-label">Low</span>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="issues-section">
        <h2>🐛 Detected Issues ({result.issues.length})</h2>
        {result.issues.length === 0 ? (
          <div className="no-issues">
            <p>✅ No issues found! Your code looks clean!</p>
          </div>
        ) : (
          result.issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} index={index + 1} />
          ))
        )}
      </div>

      {/* Download PDF Button */}
      <div className="pdf-section">
        <button className="btn-pdf" onClick={handleDownloadPdf}>
          📄 Download PDF Report
        </button>
      </div>

    </div>
  );
}

export default ResultsDashboard;