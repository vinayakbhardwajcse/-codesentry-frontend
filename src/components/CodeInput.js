import React, { useState, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://codesentry-backend-ztuy.onrender.com';

function CodeInput({ onScanComplete, onError, onLoading }) {
  const [fileName, setFileName] = useState('MyCode.java');
  const [sourceCode, setSourceCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleScan = async () => {
    if (!sourceCode.trim()) {
      onError('Please paste some Java code or upload a .java file first!');
      return;
    }
    onLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/scan/text`, {
        fileName: fileName,
        sourceCode: sourceCode
      });
      onScanComplete(response.data, sourceCode, fileName);
    } catch (error) {
      onError('Failed to scan code. Please try again!');
    } finally {
      onLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.java')) {
      onError('Please upload a .java file only!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSourceCode(e.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setSourceCode('');
    setFileName('MyCode.java');
  };

  return (
    <div className="code-input-container">
      <div className="code-input-header">
        <h2>📝 Paste or Upload Java Code</h2>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="filename-input"
          placeholder="Enter file name..."
        />
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".java"
          style={{ display: 'none' }}
        />
        <p>📁 Drag & drop a <strong>.java</strong> file here or <span className="upload-link">click to browse</span></p>
      </div>

      <textarea
        className="code-textarea"
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        placeholder={`Or paste your Java code here...\n\nExample:\npublic class Example {\n    void method() {\n        try {\n            int x = 1;\n        } catch (Exception e) {\n            // empty catch block\n        }\n    }\n}`}
        rows={15}
      />

      <div className="code-input-buttons">
        <button className="btn-scan" onClick={handleScan}>
          🔍 Scan Code
        </button>
        <button className="btn-clear" onClick={handleClear}>
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}

export default CodeInput;