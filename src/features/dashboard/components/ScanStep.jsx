import React from 'react';
import {
    Accordion,
    TextInput,
    Switch,
    Select,
    MultiSelect,
    Group,
    ActionIcon,
    Text,
    Box,
    NumberInput,
    Textarea,
    TagsInput
} from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

// --- Component FormField đã được cập nhật ---
function FormField({ field, params, handleParamChange }) {
    const key = field.name;
    const otherProps = {
        label: field.label,
        placeholder: field.placeholder,
    };

    switch (field.component) {
        case 'TextInput':
            const isDisabled = field.name === 'ports' && params.all_ports === true;
            return (
                <TextInput
                    {...otherProps}
                    value={params[field.name] || ''}
                    onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                    disabled={isDisabled}
                />
            );

        case 'Textarea': // THÊM MỚI: Hỗ trợ Textarea cho bruteforce-scan
            return (
                <Textarea
                    {...otherProps}
                    value={params[field.name] || ''}
                    onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                    autosize
                    minRows={3}
                />
            );

        case 'TagsInput':
            return (
                <TagsInput
                    key={key}
                    {...otherProps}
                    data={field.data} // Autocomplete suggestion list
                    value={params[field.name] || []} // Value is always an array
                    onChange={(value) => handleParamChange(field.name, value)} // onChange directly returns the new array
                    clearable
                />
            );

        case 'Switch':
            return (
                <Switch
                    key={key}
                    {...otherProps}
                    mt="md"
                    checked={params[field.name] ?? field.defaultValue}
                    onChange={(event) => {
                        const isChecked = event.currentTarget.checked;
                        handleParamChange(field.name, isChecked);
                        if (field.name === 'all_ports' && isChecked) {
                            handleParamChange('ports', '');
                        }
                    }}
                />
            );

        case 'Select':
            return (
                <Select
                    key={key}
                    {...otherProps}
                    // SỬA LỖI: Chuyển đổi value của option thành string
                    data={field.data.map(option => ({
                        ...option,
                        value: String(option.value)
                    }))}
                    // SỬA LỖI: Chuyển đổi value của component thành string
                    value={String(params[field.name] ?? field.defaultValue)}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );

        case 'MultiSelect':
            return (
                <MultiSelect
                    key={key}
                    {...otherProps}
                    // SỬA LỖI: Chuyển đổi value của option thành string
                    data={field.data.map(option => (
                        typeof option === 'string'
                            ? option
                            : { ...option, value: String(option.value) }
                    ))}
                    // SỬA LỖI: Chuyển đổi value của component thành mảng các string
                    value={(params[field.name] || []).map(String)}
                    onChange={(value) => handleParamChange(field.name, value)}
                    clearable
                />
            );

        case 'NumberInput':
            return (
                <NumberInput
                    key={key}
                    {...otherProps}
                    value={params[field.name] ?? field.defaultValue}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );

        default:
            return null;
    }
}

// --- Component ScanStep đã được cập nhật ---
// Thêm logic hiển thị có điều kiện cho bruteforce-scan
const ScanStep = React.forwardRef(({ step, onRemove, onParamsChange, listeners, style, scanTemplates, ...props }, ref) => {
    const template = scanTemplates.find(t => t.id === step.type);

    if (!template) {
        return (
            <Box ref={ref} style={style} bg="red.1" p="xs" radius="sm" mb="xs" {...props}>
                <Text c="red">Lỗi: Không tìm thấy cấu hình cho loại scan "{step.type}"</Text>
            </Box>
        );
    }

    return (
        <Box ref={ref} style={style} bg="gray.0" p="xs" radius="sm" mb="xs" {...props}>
            <Group gap="xs" wrap="nowrap" align="flex-start">
                <ActionIcon variant="transparent" {...listeners} style={{ cursor: 'grab', touchAction: 'none', marginTop: '4px' }}>
                    <IconGripVertical size={18} />
                </ActionIcon>

                <Accordion chevronPosition="left" w="100%">
                    <Accordion.Item value={step.id}>
                        <Accordion.Control>
                            <Text fw={500}>{template.name}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {template.fields.map(field => {
                                // --- THÊM MỚI: Logic hiển thị có điều kiện cho bruteforce-scan ---
                                if (step.type === 'bruteforce-scan') {
                                    const strategy = step.params.strategy || 'dictionary';
                                    if (field.name === 'users_list' && strategy === 'stuffing') return null;
                                    if (field.name === 'passwords_list' && strategy === 'stuffing') return null;
                                    if (field.name === 'pairs_list' && strategy !== 'stuffing') return null;
                                }

                                return (
                                    <Box key={field.name} mb="sm">
                                        <FormField
                                            field={field}
                                            params={step.params}
                                            handleParamChange={(paramName, value) => {
                                                onParamsChange(step.id, paramName, value);
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <ActionIcon color="red" variant="subtle" onClick={() => onRemove(step.id)} style={{ marginTop: '4px' }}>
                    <IconTrash size={18} />
                </ActionIcon>
            </Group>
        </Box>
    );
});

export default ScanStep;