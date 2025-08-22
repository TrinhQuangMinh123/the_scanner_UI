// src/utils/cacheManager.js

const CACHE_PREFIX = 'scannerAppCache_';

/**
 * Lưu dữ liệu vào localStorage với một timestamp.
 * @param {string} key - Khóa để lưu.
 * @param {any} data - Dữ liệu cần lưu.
 * @param {number} durationInMinutes - Thời gian cache (phút).
 */
const set = (key, data, durationInMinutes) => {
    const cacheItem = {
        data: data,
        timestamp: new Date().getTime(), // Lưu thời điểm hiện tại
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
};

/**
 * Lấy dữ liệu từ localStorage và kiểm tra xem nó còn hợp lệ không.
 * @param {string} key - Khóa để lấy.
 * @param {number} durationInMinutes - Thời gian cache (phút).
 * @returns {any|null} - Trả về dữ liệu nếu còn hợp lệ, ngược lại trả về null.
 */
const get = (key, durationInMinutes) => {
    const itemStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    const cacheDuration = durationInMinutes * 60 * 1000; // Đổi phút ra mili giây

    // Kiểm tra xem cache đã hết hạn chưa
    if (now - item.timestamp > cacheDuration) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`); // Xóa cache cũ
        return null;
    }

    return item.data;
};

export const cacheManager = {
    set,
    get,
};