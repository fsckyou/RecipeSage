#!/bin/bash

set -e

if [ -z "$1" ]
then
  echo "Invalid command. Usage: ./api-selfhost.sh v1.0.0"
  exit 1
fi

docker build --build-arg VERSION=$1 -f Backend/Dockerfile -t rs-api-builder .
docker build --build-arg VERSION=$1 -f Backend/selfhost.Dockerfile -t fsckyou2/recipesage-selfhost:api-latest .

# Only push to latest tag if tag is a versioned tag
#if [[ $1 == v* ]]
#then
#  docker push julianpoy/recipesage-selfhost:api-latest
#fi
#
docker image tag fsckyou2/recipesage-selfhost:api-latest fsckyou2/recipesage-selfhost:api-$1
docker push fsckyou2/recipesage-selfhost:api-$1

#docker rmi fsckyou/recipesage-selfhost:api-$1

#docker rmi julianpoy/recipesage-selfhost:api-latest
#docker rmi rs-api-builder

