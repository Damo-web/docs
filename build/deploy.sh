#!/usr/bin/env sh

set -e
yarn build

cd dist

git init
git add -A
git commit -m $1
git push -f https://github.com/Damo-web/docs.git master:gh-pages

cd ../
rm -rf dist

# cd -