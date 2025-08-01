// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';

import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter> {/* 2. Bọc App trong BrowserRouter */}
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <App />
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
);