#!/usr/bin/env sh

set -e
yarn build

cd dist

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/Damo-web/docs.git master:gh-pages

# cd ../
# rm dist

cd -