FROM node:alpine
RUN mkdir /src
WORKDIR /src
COPY ./package*.json /src/
COPY ./yarn.lock /src/
RUN yarn install
# CMD tail -f /dev/null


# FROM node:alpine
# RUN mkdir /workspace
# ADD ./package.json /workspace/
# ADD ./yarn.lock /workspace/
# RUN mkdir /data
# RUN ln -s /workspace/package.json /data/
# RUN ln -s /workspace/yarn.lock /data/
# WORKDIR /data
# RUN yarn install
# ENV NODE_PATH /data/node_modules/
# WORKDIR /workspace