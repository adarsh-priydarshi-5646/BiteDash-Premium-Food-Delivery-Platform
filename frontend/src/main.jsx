/**
 * Main Entry Point - React app bootstrap
 *
 * Wraps App with: BrowserRouter, Redux Provider
 * Libraries: react, react-dom, react-router-dom, redux
 * 
 * Features: Redux global state, client-side routing
 * Renders to: #root element in index.html
 */
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import axios from 'axios';

// Configure axios to always send credentials (cookies) with requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
