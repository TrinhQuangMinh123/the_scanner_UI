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
    Button,
    TagsInput // 1. `TagsInput` is added, `Combobox` and `useCombobox` are removed.
} from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

// --- Component FormField được tái cấu trúc hoàn chỉnh ---
// Component FormField giờ đã đơn giản hơn
function FormField({ field, params, handleParamChange }) {
    const key = field.name;
    const otherProps = {
        label: field.label,
        placeholder: field.placeholder,
    };

    // The `searchValue` state is no longer needed and has been removed.

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

        // 2. The `TagsInput` case is now the correct implementation.
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

// --- Component ScanStep chính (không thay đổi) ---
function ScanStep({ step, onRemove, onParamsChange, listeners, style, scanTemplates }) {
    const template = scanTemplates.find(t => t.id === step.type);

    if (!template) {
        return (
            <Box style={style} bg="red.1" p="xs" radius="sm" mb="xs">
                <Text c="red">Error: Configuration not found for scan type "{step.type}"</Text>
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
                                        handleParamChange={(paramName, value) => {
                                            console.log('✅ ScanStep is trying to send:', { stepId: step.id, paramName, value });
                                            onParamsChange(step.id, paramName, value);
                                        }}
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