#!/bin/bash
echo ========== CHECKING FOR WEB CONTAINER ========

container=$(docker ps -q -f name="web-server")
if [ -n "$container" ]; then
  echo "Docker container web-server is existed"
else
  echo "Docker container web-server is not existed"
fi