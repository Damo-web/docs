#!/bin/bash
echo ========== CHECKING FOR NODE BASE IMAGE ========

image=$(docker images -q node-base 2> /dev/null)
if [ -n "$image" ]; then
  echo "Docker image node-base is existed"
else
  echo "Docker image node-base is not existed"
  docker build -t node-base:latest -f node.dockerfile .
  docker tag node-base:latest harbor.snowball.site/web/node-base:latest
  docker push harbor.snowball.site/web/node-base:latest
fi

