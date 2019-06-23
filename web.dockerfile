FROM node-base:latest as builder
WORKDIR /src
COPY . /src/
RUN ls
RUN yarn build

FROM nginx:alpine
WORKDIR /root 
COPY --from=builder /src/dist /usr/share/nginx/html/docs
# EXPOSE 80 
# CMD tail -f /dev/null