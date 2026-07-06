import React from 'react';
import IssueCard from './IssueCard';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function HealthGauge({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#ca8a04';
    return '#dc2626';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Good ✅';
    if (score >= 50) return 'Fair ⚠️';
    return 'Poor ❌';
  };

  const color = getColor(score);

  return (
    <div className="health-gauge-container">
      <h2>Code Health Score</h2>
      <div className="gauge-wrapper">
        <svg width="160" height="160" className="gauge-svg">
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            className="gauge-progress"
          />
        </svg>
        <div className="gauge-text">
          <span className="gauge-score" style={{ color }}>
            {score}
          </span>
          <span className="gauge-total">/100</span>
        </div>
      </div>
      <p className="gauge-label" style={{ color }}>
        {getLabel(score)}
      </p>
    </div>
  );
}

function ResultsDashboard({ result, sourceCode, fileName }) {

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/scan/report`,
        { fileName: fileName, sourceCode: sourceCode },
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
      alert('Failed to download PDF report!');
    }
  };

  return (
    <div className="results-container">

      {/* Animated Health Score Gauge */}
      <HealthGauge score={result.healthScore} />

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

      {/* Download PDF */}
      <div className="pdf-section">
        <button className="btn-pdf" onClick={handleDownloadPdf}>
          📄 Download PDF Report
        </button>
      </div>

    </div>
  );
}

export default ResultsDashboard;