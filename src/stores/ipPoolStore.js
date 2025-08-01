// src/stores/ipPoolStore.js
import { create } from 'zustand';

// Dữ liệu giả ban đầu
const initialIps = [
    { id: 1, target: '1.1.1.1' },
    { id: 2, target: 'example.com' },
    { id: 3, target: 'scanme.nmap.org' },
];

export const useIpPoolStore = create((set) => ({
    // State: danh sách các IPs
    ips: initialIps,

    // Actions: các hàm để thay đổi state
    addIp: (newIpTarget) => set((state) => {
        if (newIpTarget.trim() === '') return state; // Không thêm nếu rỗng
        const newItem = {
            id: Date.now(),
            target: newIpTarget.trim(),
        };
        return { ips: [...state.ips, newItem] };
    }),

    deleteIp: (idToDelete) => set((state) => ({
        ips: state.ips.filter(ip => ip.id !== idToDelete),
    })),
}));