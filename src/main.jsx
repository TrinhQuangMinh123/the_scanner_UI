import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';

// Dòng này CỰC KỲ QUAN TRỌNG để tải tất cả style của Mantine
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Component này CỰC KỲ QUAN TRỌNG để các component Mantine hoạt động */}
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <App />
        </MantineProvider>
    </React.StrictMode>
);