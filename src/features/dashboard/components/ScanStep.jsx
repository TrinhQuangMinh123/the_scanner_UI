// src/features/dashboard/components/ScanStep.jsx
import React from 'react';
import { Accordion, TextInput, Switch, Select, MultiSelect, Group, ActionIcon, Text, Box } from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { scanTemplates } from '../../../scanTemplates';

// Hàm render form field đã được điều chỉnh một chút
const renderFormField = (field, params, handleParamChange) => {
    const commonProps = {
        key: field.name,
        label: field.label,
        placeholder: field.placeholder,
    };

    switch (field.component) {
        case 'TextInput':
            // Thêm logic disable cho Nmap
            const isDisabled = field.name === 'ports' && params.allPorts === true;
            return (
                <TextInput
                    {...commonProps}
                    value={params[field.name] || ''}
                    onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                    disabled={isDisabled}
                />
            );
        case 'Switch':
            return (
                <Switch
                    {...commonProps}
                    mt="md"
                    checked={params[field.name] === undefined ? field.defaultValue : params[field.name]}
                    onChange={(event) => {
                        handleParamChange(field.name, event.currentTarget.checked);
                        // Nếu bật 'allPorts', xóa giá trị trong ô 'ports'
                        if (field.name === 'allPorts' && event.currentTarget.checked) {
                            handleParamChange('ports', '');
                        }
                    }}
                />
            );
        case 'Select':
            return (
                <Select
                    {...commonProps}
                    data={field.data}
                    value={params[field.name] || field.defaultValue}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );
        // ... MultiSelect và các case khác giữ nguyên
        default:
            return null;
    }
};

function ScanStep({ step, onRemove, onParamsChange, listeners, ref, style }) {
    const template = scanTemplates.find(t => t.id === step.type);

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