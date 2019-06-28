#!/bin/bash
echo ========== CHECKING FOR CONTAINER ========

container=$(docker ps -a | grep web-server)
if [ -n "$container" ]; then
  echo "Docker container web-server is existed"
  docker container stop web-server
  docker rm -f web-server
else
  echo "Docker container web-server is not existed"
fi

