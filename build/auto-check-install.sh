#!/bin/bash
echo ========== CHECKING FOR CHANGES ========

changes=$(git diff HEAD^ HEAD -- yarn.lock)
if [ -n "$changes" ]; then
    echo ""
    echo "*** CHANGES FOUND ***"
    echo "$changes"
    echo "Yarn.lock has changed"
    docker build -t node-base:latest -f node.dockerfile .
    docker tag node-base:latest harbor.snowball.site/web/node-base:latest
    docker push harbor.snowball.site/web/node-base:latest
else
    echo ""
    echo "*** CHANGES NOT FOUND ***"
    echo "Yarn.lock has not changed"
fi