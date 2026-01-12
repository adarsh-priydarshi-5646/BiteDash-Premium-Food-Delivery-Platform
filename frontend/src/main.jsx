/**
 * Main Entry Point - React app bootstrap
 *
 * Wraps App with: StrictMode, BrowserRouter, Redux Provider
 * Libraries: react, react-dom, react-router-dom, redux, @vercel/analytics
 * 
 * Features: Vercel Analytics for visitor tracking, Redux global state,
 * client-side routing, strict mode for development warnings
 * Renders to: #root element in index.html
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
