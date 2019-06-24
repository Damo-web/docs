FROM node-base:latest as builder
LABEL maintainer="snowballer0705@gmail.com"
WORKDIR /src
COPY . /src/
RUN ls
RUN yarn build

FROM nginx:alpine
WORKDIR /root 
COPY --from=builder /src/dist /usr/share/nginx/html/docs
# EXPOSE 80 
# 保持容器存活不退出
# CMD tail -f /dev/null