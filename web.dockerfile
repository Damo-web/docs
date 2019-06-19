FROM node-base as builder
WORKDIR /src
COPY . /src/
RUN ls
RUN yarn build

FROM nginx:alpine
WORKDIR /root 
COPY --from=builder /src/dist /usr/share/nginx/html 
EXPOSE 80 
# CMD tail -f /dev/null