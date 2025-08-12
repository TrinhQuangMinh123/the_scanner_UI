// src/features/dashboard/components/ScanStep.jsx
import React from 'react';
import { Accordion, TextInput, Switch, Select, MultiSelect, Group, ActionIcon, Text, Box } from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

// Hàm để render một trường form động
const renderFormField = (field, params, handleParamChange) => {
    // Tách 'key' ra khỏi các props khác
    const key = field.name;
    const otherProps = {
        label: field.label,
        placeholder: field.placeholder,
    };

    switch (field.component) {
        case 'TextInput':
            const isDisabled = field.name === 'ports' && params.allPorts === true;
            return (
                <TextInput
                    key={key} // Truyền key trực tiếp
                    {...otherProps} // Trải các props còn lại
                    value={params[field.name] || ''}
                    onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                    disabled={isDisabled}
                />
            );
        case 'Switch':
            return (
                <Switch
                    key={key} // Truyền key trực tiếp
                    {...otherProps} // Trải các props còn lại
                    mt="md"
                    checked={params[field.name] === undefined ? field.defaultValue : params[field.name]}
                    onChange={(event) => {
                        handleParamChange(field.name, event.currentTarget.checked);
                        if (field.name === 'allPorts' && event.currentTarget.checked) {
                            handleParamChange('ports', '');
                        }
                    }}
                />
            );
        case 'Select':
            return (
                <Select
                    key={key} // Truyền key trực tiếp
                    {...otherProps} // Trải các props còn lại
                    data={field.data}
                    value={params[field.name] || field.defaultValue}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );
        case 'MultiSelect':
            return (
                <MultiSelect
                    key={key} // Truyền key trực tiếp
                    {...otherProps} // Trải các props còn lại
                    data={field.data}
                    value={params[field.name] || []}
                    onChange={(value) => handleParamChange(field.name, value)}
                    clearable
                />
            );
        default:
            return null;
    }
};

function ScanStep({ step, onRemove, onParamsChange, listeners, ref, style, scanTemplates }) {
    // Tìm template từ props thay vì từ file import
    const template = scanTemplates.find(t => t.id === step.type);

    // Thêm một bước kiểm tra an toàn
    if (!template) {
        return (
            <Box ref={ref} style={style} bg="red.1" p="xs" radius="sm" mb="xs">
                <Text c="red">Lỗi: Không tìm thấy cấu hình cho loại scan "{step.type}"</Text>
            </Box>
        );
    }

    return (
        // Box ngoài cùng sẽ nhận ref và style cho việc kéo thả
        <Box ref={ref} style={style} bg="gray.0" p="xs" radius="sm" mb="xs">
            <Group gap="xs" wrap="nowrap">
                {/* Nút nắm kéo sẽ nhận các listeners */}
                <ActionIcon variant="transparent" {...listeners} style={{ cursor: 'grab' }}>
                    <IconGripVertical size={18} />
                </ActionIcon>

                <Accordion chevronPosition="left" w="100%">
                    <Accordion.Item value={step.id}>
                        <Accordion.Control>
                            <Text fw={500}>{template.name}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {template.fields.map(field =>
                                renderFormField(field, step.params, (paramName, value) => onParamsChange(step.id, paramName, value))
                            )}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <ActionIcon color="red" variant="subtle" onClick={() => onRemove(step.id)}>
                    <IconTrash size={18} />
                </ActionIcon>
            </Group>
        </Box>
    );
}

export default ScanStep;