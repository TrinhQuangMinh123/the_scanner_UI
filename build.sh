#!/bin/bash
# Dừng script ngay lập tức nếu có lỗi
set -e

# Đặt tên cho container và image của UI để dễ quản lý
CONTAINER_NAME="scannervpn-ui-container"
IMAGE_NAME="scannervpn-ui"

# 1. Dừng và xóa container UI cũ nếu nó đang tồn tại
echo "--> Stopping and removing old UI container..."
docker rm -f $CONTAINER_NAME || true

# 2. Build lại Docker image mới cho UI
echo "--> Building new UI Docker image..."
docker build -t $IMAGE_NAME .

# 3. Chạy container UI mới
# Ánh xạ cổng 8080 của máy bạn vào cổng 80 của container (Nginx)
echo "--> Running new UI container on http://localhost:8000"
docker run -d --name $CONTAINER_NAME -p 8000:80 $IMAGE_NAME

echo "--> Done! The new UI container is running."