FROM node-test
WORKDIR /src
COPY . /src/
RUN ls
RUN yarn build
# CMD tail -f /dev/null