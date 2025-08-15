// src/features/jobs/results/ResultsWrapper.jsx
import React from 'react';
import { Loader, Alert, Text, Center } from '@mantine/core';

function ResultsWrapper({ isLoading, error, data, children, emptyMessage = "Không tìm thấy kết quả nào." }) {
    if (isLoading) {
        return <Center><Loader /></Center>;
    }

    if (error) {
        return <Alert color="red" title="Lỗi">{error}</Alert>;
    }

    if (!data || data.length === 0) {
        return <Center><Text c="dimmed">{emptyMessage}</Text></Center>;
    }

    // Nếu mọi thứ đều ổn, render component con được truyền vào
    return <>{children}</>;
}

export default ResultsWrapper;