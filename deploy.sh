#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-0.1.2}"
IMAGE_NAME="idu-web"
FULL_TAG="${IMAGE_NAME}:v${VERSION}"
TAR_FILE="${IMAGE_NAME}-v${VERSION}.tar"

echo "🐳 Building Docker image: ${FULL_TAG}..."
docker build --platform linux/amd64 -t "${FULL_TAG}" .

echo "📦 Saving to ${TAR_FILE}..."
docker save -o "${TAR_FILE}" "${FULL_TAG}"

echo "✅ Done! File: ${TAR_FILE} ($(du -h "${TAR_FILE}" | cut -f1))"
echo ""
echo "On the server:"
echo "  docker load -i ${TAR_FILE}"
echo "  docker run -d -p 8080:8080 --name ${IMAGE_NAME} ${FULL_TAG}"
