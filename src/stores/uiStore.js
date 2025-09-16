// src/stores/uiStore.js
import { create } from 'zustand';

export const useUiStore = create((set) => ({
    // State quản lý WorkflowBuilderModal
    isWorkflowModalOpen: false,
    initialWorkflowData: null, // Dùng null để dễ kiểm tra

    // Action để mở modal với dữ liệu ban đầu (nếu có)
    openWorkflowModal: (initialData = null) =>
        set({
            isWorkflowModalOpen: true,
            initialWorkflowData: initialData,
        }),

    // Action để đóng modal
    closeWorkflowModal: () =>
        set({
            isWorkflowModalOpen: false,
            initialWorkflowData: null, // Reset khi đóng
        }),
}));