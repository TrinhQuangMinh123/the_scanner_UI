// src/features/dashboard/components/ScanStep.jsx
import React, { useState } from 'react';
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
    Combobox,
    useCombobox,
    Button
} from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

function FormField({ field, params, handleParamChange }) {
    const key = field.name;
    const otherProps = {
        label: field.label,
        placeholder: field.placeholder,
    };

    // State và hook cho Combobox được khai báo ở cấp cao nhất của component
    const [searchValue, setSearchValue] = useState('');

    // Logic chung cho tất cả các loại field, trừ Combobox sẽ có logic riêng
    // (Lưu ý: hook useCombobox sẽ được gọi bên trong case 'Combobox' để tuân thủ luật của hooks)

    switch (field.component) {
        case 'TextInput':
            const isDisabled = field.name === 'ports' && params.allPorts === true;
            return (
                <React.Fragment key={key}>
                    <TextInput
                        {...otherProps}
                        value={params[field.name] || ''}
                        onChange={(event) => handleParamChange(field.name, event.currentTarget.value)}
                        disabled={isDisabled}
                    />
                    {field.presets && (
                        <Group gap="xs" mt="xs">
                            {field.presets.map(preset => (
                                <Button key={preset.label} variant="light" size="xs" onClick={() => handleParamChange(field.name, preset.value)}>
                                    {preset.label}
                                </Button>
                            ))}
                        </Group>
                    )}
                </React.Fragment>
            );

        case 'Combobox':
            const combobox = useCombobox({
                onOptionSubmit: (optionValue) => {
                    const currentValue = params[field.name] || '';
                    const parts = currentValue.split(',').map(p => p.trim());

                    // Thay thế phần tử cuối cùng (từ khóa đang gõ) bằng giá trị đã chọn
                    parts[parts.length - 1] = optionValue;

                    handleParamChange(field.name, parts.join(', '));
                    combobox.closeDropdown();
                },
            });

            // --- LOGIC LỌC MỚI ---
            // 1. Tách chuỗi nhập liệu và lấy ra từ khóa cuối cùng để tìm kiếm
            const currentInputValue = params[field.name] || '';
            const searchParts = currentInputValue.split(',');
            const currentSearchTerm = searchParts[searchParts.length - 1].trim();

            // 2. Lọc gợi ý dựa trên từ khóa cuối cùng đó
            const filteredOptions = field.data.filter((item) =>
                item.toLowerCase().includes(currentSearchTerm.toLowerCase())
            );

            const options = filteredOptions.map((item) => (
                <Combobox.Option value={item} key={item}>{item}</Combobox.Option>
            ));

            return (
                <Combobox store={combobox} withinPortal={false} key={key}>
                    <Combobox.Target>
                        <TextInput
                            {...otherProps}
                            value={currentInputValue} // Giá trị vẫn là chuỗi đầy đủ
                            onChange={(event) => {
                                handleParamChange(field.name, event.currentTarget.value);
                                combobox.openDropdown();
                                combobox.updateSelectedOptionIndex();
                            }}
                            onClick={() => combobox.openDropdown()}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                        />
                    </Combobox.Target>
                    <Combobox.Dropdown>
                        <Combobox.Options>
                            {options.length > 0 ? options : <Combobox.Empty>Không tìm thấy...</Combobox.Empty>}
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
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
                        if (field.name === 'allPorts' && isChecked) {
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
                    data={field.data}
                    value={params[field.name] || field.defaultValue}
                    onChange={(value) => handleParamChange(field.name, value)}
                />
            );

        case 'MultiSelect':
            return (
                <MultiSelect
                    key={key}
                    {...otherProps}
                    data={field.data}
                    value={params[field.name] || []}
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

function ScanStep({ step, onRemove, onParamsChange, listeners, style, scanTemplates }) {
    const template = scanTemplates.find(t => t.id === step.type);

    if (!template) {
        return (
            <Box style={style} bg="red.1" p="xs" radius="sm" mb="xs">
                <Text c="red">Lỗi: Không tìm thấy cấu hình cho loại scan "{step.type}"</Text>
            </Box>
        );
    }

    return (
        <Box style={style} bg="gray.0" p="xs" radius="sm" mb="xs">
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
                            {template.fields.map(field => (
                                <Box key={field.name} mb="sm">
                                    <FormField
                                        field={field}
                                        params={step.params}
                                        handleParamChange={(paramName, value) => onParamsChange(step.id, paramName, value)}
                                    />
                                </Box>
                            ))}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <ActionIcon color="red" variant="subtle" onClick={() => onRemove(step.id)} style={{ marginTop: '4px' }}>
                    <IconTrash size={18} />
                </ActionIcon>
            </Group>
        </Box>
    );
}

export default ScanStep;