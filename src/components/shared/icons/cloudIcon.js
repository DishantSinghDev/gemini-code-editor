import React from 'react';
import './Spinner.css'; // Import the CSS file for the spinner styles

const CloudIcon = ({ cloudLoading, cloudFetched=true, cloudError }) => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    gap: '2px',
  };

  const iconStyle = {
    marginRight: '1px',
  };

  return (
    <div style={containerStyle}>
      {cloudLoading && (
        <div style={containerStyle}>
          <div className="spinner" style={iconStyle}></div>
          <span style={{ fontSize: '16px' }}>Loading...</span>
        </div>
      )}

      {cloudError && (
        <div style={containerStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          <span style={{ fontSize: '16px' }}>Error</span>
        </div>
      )}

      {cloudFetched && (
        <div style={containerStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
          <span style={{ fontSize: '16px' }}>Saved</span>
        </div>
      )}
    </div>
  );
};

export default CloudIcon;
