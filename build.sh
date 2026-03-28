#!/usr/bin/env bash
set -euo pipefail

FULL_IMAGE="harbor.launchoptions.by/borbalo/idu-web"

TAG="${1:?Usage: ./build.sh <tag>}"

echo "Building ${FULL_IMAGE}:${TAG} ..."

docker build \
  --platform linux/amd64 \
  -t "${FULL_IMAGE}:${TAG}" \
  -t "${FULL_IMAGE}:latest" \
  .

TAR_FILE="idu-web-${TAG}.tar"

echo ""
echo "Saving to ${TAR_FILE} ..."
docker save -o "${TAR_FILE}" "${FULL_IMAGE}:${TAG}" "${FULL_IMAGE}:latest"

echo ""
echo "Done! File: ${TAR_FILE}"
echo "To push manually:"
echo "  docker load -i ${TAR_FILE}"
echo "  docker push ${FULL_IMAGE}:${TAG}"
echo "  docker push ${FULL_IMAGE}:latest"
