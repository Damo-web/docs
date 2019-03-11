#!/usr/bin/env sh
set -e

git add .
git commit -m $1
git push

