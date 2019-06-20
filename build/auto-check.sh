#!/bin/bash
echo ========== CHECKING FOR CHANGES ========
changes=$(git diff HEAD^ HEAD -- yarn.lock)
if [ -n "$changes" ]; then
    echo ""
    echo "*** CHANGES FOUND ***"
    echo "$changes"
    echo "Yarn.lock has changed"
    # yarn install
    # docker push harbor.snowball.site/web/node-base
else
    echo ""
    echo "*** CHANGES NOT FOUND ***"
    echo "Yarn.lock has not changed"
    yarn install
    docker push harbor.snowball.site/web/node-base
fi