FROM node:alpine
# alpine 版本不包含 git 和 docker
RUN apk update && apk add --no-cache git && \
    apk add docker
RUN mkdir /src
WORKDIR /src
COPY ./package*.json /src/
COPY ./yarn.lock /src/
RUN yarn install --production
# CMD tail -f /dev/null
