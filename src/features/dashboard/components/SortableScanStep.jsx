// src/features/dashboard/components/SortableScanStep.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ScanStep from './ScanStep';

function SortableScanStep({ step, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <ScanStep
            ref={setNodeRef}
            style={style}
            listeners={listeners}
            {...attributes}
            step={step}
            {...props}
        />
    );
}

export default SortableScanStep;