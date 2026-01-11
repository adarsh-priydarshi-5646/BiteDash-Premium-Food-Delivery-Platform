/**
 * Main Entry Point - React app bootstrap
 *
 * Wraps App with: StrictMode, BrowserRouter, Redux Provider
 * Includes Vercel Analytics for visitor tracking
 * Renders to #root element in index.html
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Analytics />
    </Provider>
  </BrowserRouter>,
);
