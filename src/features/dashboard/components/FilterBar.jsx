// src/features/dashboard/components/FilterBar.jsx
import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function FilterBar() {
    return (
        <TextInput
            placeholder="Tìm kiếm theo IP, port, service..."
            leftSection={<IconSearch size={14} />}
            w={300} // Đặt chiều rộng cố định hoặc để nó co giãn
        />
    );
}

export default FilterBar;