#!/bin/bash
echo ========== CHECKING FOR CHANGES ========
changes=$(git diff HEAD^ HEAD -- yarn.lock)
if [ -n "$changes" ]; then
    echo ""
    echo "*** CHANGES FOUND ***"
    echo "$changes"
    echo "Yarn.lock has changed"
    docker build -t node-test .
else
    echo ""
    echo "*** CHANGES NOT FOUND ***"
    echo "Yarn.lock has not changed"
    docker build -t node-test .
fi