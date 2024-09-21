import React from 'react';
import ReactDOM from 'react-dom/client'; // Use this for React 18+
import './index.css'; // Your global styles
import App from './App'; // Your main App component

// Create a root for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
