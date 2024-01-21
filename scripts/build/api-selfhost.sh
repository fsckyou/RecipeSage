#!/bin/bash

set -e

if [ -z "$1" ]
then
  echo "Invalid command. Usage: ./api-selfhost.sh v1.0.0"
  exit 1
fi

docker build --build-arg VERSION=$1 -f packages/backend/Dockerfile -t fsckyou2/recipesage-selfhost:api-latest .

docker image tag fsckyou2/recipesage-selfhost:api-latest fsckyou2/recipesage-selfhost:api-$1
docker push fsckyou2/recipesage-selfhost:api-$1
docker push fsckyou2/recipesage-selfhost:api-latest

docker rmi fsckyou2/recipesage-selfhost:api-$1

docker rmi fsckyou2/recipesage-selfhost:api-latest