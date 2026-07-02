import React, { useState } from 'react';

function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MEDIUM': return '#ca8a04';
      case 'LOW': return '#16a34a';
      default: return '#718096';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#fee2e2';
      case 'HIGH': return '#ffedd5';
      case 'MEDIUM': return '#fef9c3';
      case 'LOW': return '#dcfce7';
      default: return '#f1f5f9';
    }
  };

  const getSeverityEmoji = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '🔴';
      case 'HIGH': return '🟠';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div
      className="issue-card"
      style={{ borderLeft: `4px solid ${getSeverityColor(issue.severity)}` }}
    >
      {/* Issue Header */}
      <div
        className="issue-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="issue-title">
          <span>{getSeverityEmoji(issue.severity)}</span>
          <span className="issue-number">#{index}</span>
          <span
            className="issue-badge"
            style={{
              background: getSeverityBg(issue.severity),
              color: getSeverityColor(issue.severity)
            }}
          >
            {issue.severity}
          </span>
          <span className="issue-name">{issue.title}</span>
        </div>
        <div className="issue-meta">
          <span>Line {issue.line}</span>
          <span>{issue.category}</span>
          <span>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Issue Details - shown when expanded */}
      {expanded && (
        <div className="issue-details">

          {/* Description */}
          <div className="detail-section">
            <h4>📋 Description</h4>
            <p>{issue.description}</p>
          </div>

          {/* Code Snippet */}
          {issue.codeSnippet && (
            <div className="detail-section">
              <h4>💻 Code</h4>
              <pre className="code-snippet">{issue.codeSnippet}</pre>
            </div>
          )}

          {/* AI Explanation */}
          {issue.aiExplanation && (
            <div className="detail-section ai-section">
              <h4>🤖 AI Explanation</h4>
              <p>{issue.aiExplanation}</p>
            </div>
          )}

          {/* Suggested Fix */}
          {issue.suggestedFix && (
            <div className="detail-section fix-section">
              <h4>✅ Suggested Fix</h4>
              <pre className="code-snippet">{issue.suggestedFix}</pre>
            </div>
          )}

          {/* Location */}
          <div className="detail-section">
            <h4>📍 Location</h4>
            <p>Method: <strong>{issue.location}</strong> | Line: <strong>{issue.line}</strong> | Rule: <strong>{issue.ruleId}</strong></p>
          </div>

        </div>
      )}
    </div>
  );
}

export default IssueCard;