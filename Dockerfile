# --- GIAI ĐOẠN 1: BUILDER ---
# Giai đoạn này dùng để build code React thành các file tĩnh
FROM node:18-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để tận dụng cache của Docker
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ source code còn lại
COPY . .

# Chạy lệnh build của Vite để tạo ra thư mục /dist
RUN npm run build


# --- GIAI ĐOẠN 2: FINAL ---
# Giai đoạn này dùng một web server nhẹ để phục vụ các file đã được build
FROM nginx:1.25-alpine

# Copy các file tĩnh đã được build từ giai đoạn 'builder'
# vào thư mục web-root mặc định của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx mà chúng ta đã tạo ở trên
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Lệnh EXPOSE: "Thông báo" rằng container này sẽ lắng nghe trên cổng 80
EXPOSE 80

# Lệnh để khởi động Nginx khi container chạy
CMD ["nginx", "-g", "daemon off;"]