import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GalleryRecovery from './GalleryRecovery.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GalleryRecovery>
      <App />
    </GalleryRecovery>
  </React.StrictMode>
);
