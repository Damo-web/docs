#!/bin/bash
echo ========== CHECKING FOR CHANGES ========
changes=$(git diff HEAD^ HEAD -- yarn.lock)
if [ -n "$changes" ]; then
    echo ""
    echo "*** CHANGES FOUND ***"
    echo "$changes"
    echo "Yarn.lock has changed"
    rm -rf ./node_modules
    yarn install
else
    echo "Yarn.lock has not changed"
    yarn install
fi