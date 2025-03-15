import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

const root = document.getElementById('root');

if (!root) {
  console.error("Root element not found. Make sure your HTML file has an element with id='root'.");
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
