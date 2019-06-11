FROM node:alpine
ENV PROJECT_ENV production
ENV NODE_ENV production
WORKDIR /site
WORKDIR /site-build
ADD ./ /site-build/
RUN yarn install && \
    yarn run build && \
    mv  /site-build/dist /site/ && \
    rm -rf /site-build
# ENTRYPOINT $MOVE_DIST_TO_SHARED_FOLDER_AND__KEEP_CONTAINER_ALIVE