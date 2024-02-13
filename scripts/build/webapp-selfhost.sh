#!/bin/bash

set -e

if [ -z "$1" ]
then
  echo "Invalid command. Usage: ./webapp-selfhost.sh v1.0.0"
  exit 1
fi

docker buildx build . \
  --push \
  --platform linux/arm64/v8,linux/amd64 \
  -f packages/frontend/selfhost.Dockerfile \
  --build-arg VERSION=$1 \
  -t fsckyou2/recipesage-selfhost:static-latest \
  -t fsckyou2/recipesage-selfhost:static-$1

