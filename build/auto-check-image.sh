#!/bin/bash
echo ========== CHECKING FOR NODE BASE IMAGE ========

image=$(docker images -q node-base 2> /dev/null)
if [ -n "$image" ]; then
  echo "Docker image node-base is existed"
else
  echo "Docker image node-base is not existed"
  docker build -t node-base -f node.dockerfile .
  docker tag node-base harbor.snowball.site/web/node-base
  docker push harbor.snowball.site/web/node-base
fi

