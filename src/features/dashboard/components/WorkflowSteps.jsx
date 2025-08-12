// src/features/dashboard/components/WorkflowSteps.jsx
import React from 'react';
import { Text, Stack } from '@mantine/core';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableScanStep from './SortableScanStep';

function WorkflowSteps({ steps, setSteps, onRemove, onParamsChange }) {
    const sensors = useSensors(useSensor(PointerSensor, {
        // Yêu cầu di chuyển chuột một chút trước khi bắt đầu kéo
        activationConstraint: {
            distance: 8,
        },
    }));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setSteps((currentSteps) => {
                const oldIndex = currentSteps.findIndex((s) => s.id === active.id);
                const newIndex = currentSteps.findIndex((s) => s.id === over.id);
                return arrayMove(currentSteps, oldIndex, newIndex);
            });
        }
    };

    return (
        <Stack>
            <Text fw={500}>Luồng quét sẽ thực thi (Kéo thả để sắp xếp)</Text>
            {steps.length === 0 ? (
                <Text c="dimmed" ta="center" p="xl">
                    Chọn một loại scan từ cột bên trái để bắt đầu.
                </Text>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={steps} strategy={verticalListSortingStrategy}>
                        {steps.map(step => (
                            <SortableScanStep
                                key={step.id}
                                step={step}
                                onRemove={onRemove}
                                onParamsChange={onParamsChange}
                                scanTemplates={scanTemplates} // Truyền `scanTemplates` xuống dưới
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </Stack>
    );
}

export default WorkflowSteps;