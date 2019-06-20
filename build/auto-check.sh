#!/bin/bash
echo ========== CHECKING FOR CHANGES ========
changes=$(git diff HEAD^ HEAD -- yarn.lock)
if [ -n "$changes" ]; then
    echo ""
    echo "*** CHANGES FOUND ***"
    echo "$changes"
    echo "Yarn.lock has changed"
    yarn install
    docker build -t node-base -f node.dockerfile .
    docker tag node-base harbor.snowball.site/web/node-base
    docker login harbor.snowball.site
    docker push harbor.snowball.site/web/node-base
else
    echo ""
    echo "*** CHANGES NOT FOUND ***"
    echo "Yarn.lock has not changed"
    echo $$USERNAME
fi