// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core'; // Thêm createTheme
import { Notifications } from '@mantine/notifications';
import App from './App.jsx';

import '@mantine/core/styles.css';

// --- BẮT ĐẦU TẠO THEME TÙY CHỈNH ---

const theme = createTheme({
    /**
     * 1. Cải thiện Typography (Kiểu chữ)
     */
    fontFamily: 'Verdana, sans-serif', // Sử dụng một font hiện đại, dễ đọc
    headings: {
        // Tăng kích thước cho tiêu đề chính "The Scanner" (Title order={1})
        sizes: {
            h1: { fontSize: 'rem(36px)' },
            // In đậm cho các tiêu đề của Card (Title order={4})
            h4: { fontWeight: '700' },
        },
    },

    /**
     * 2. Tăng Khoảng trắng (Whitespace)
     * Tăng giá trị mặc định cho các khoảng cách lớn (lg, xl)
     */
    spacing: {
        lg: 'rem(24px)',
        xl: 'rem(32px)',
    },

    /**
     * 3. Đổ bóng và Bo góc (Shadows & Borders)
     */
    // Sử dụng đổ bóng nhẹ và nhất quán hơn
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px',
        md: '0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
    },
    // Đồng bộ bo góc cho các component
    radius: {
        md: '8px',
    },
});

// --- KẾT THÚC TẠO THEME TÙY CHỈNH ---


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            {/* 4. Áp dụng theme vào MantineProvider */}
            <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
                <Notifications />
                <App />
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
);