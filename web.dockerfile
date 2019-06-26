FROM node-base:latest as builder
LABEL maintainer="snowballer0705@gmail.com"
WORKDIR /src
COPY . /src/
RUN ls
RUN yarn build

FROM nginx:alpine
WORKDIR /root 
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
# RUN mkdir -p /var/www/html
# 因文档部署于 github pages 下 docs 中，这里需要复制至 docs 下
COPY --from=builder /src/dist /usr/share/nginx/html/docs
# EXPOSE 80 
# 保持容器存活不退出
# CMD tail -f /dev/null