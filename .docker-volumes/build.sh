#!/bin/bash

# 使用方法
# 打包lynfoo正式环境镜像包 ./build.sh main build:lynfoo:prod mullet_client
# 打包mullet正式环境镜像包 ./build.sh main build:mullet:prod mullet_client
# 打包mullet测试环境镜像包 ./build.sh dev build:mullet:test mullet_client

# 变量
version="v1.0.0"
port="8000"
registry_project="$3"

# 丢弃修改
git checkout .
# 拉取最新代码
git pull origin $1
npm config set registry=https://registry.npm.taobao.org
npm i yarn -g
yarn install

echo "正在打包中..."
npm run $2
echo "打包完成"

echo "正在构建镜像中..."
docker_image="192.168.5.205:8866/trade-snapshot/${registry_project}:${version}"
# 构建镜像版本
docker build -t ${docker_image} -f Dockerfile .
echo "构建镜像完成"

# 登录服务器
docker login -u trade -p Trade1qazse4 192.168.5.205:8866

echo "推送镜像中..."
# 推送镜像
docker push 192.168.5.205:8866/trade-snapshot/${docker_image}
echo "推送镜像完成"

# docker stop ${registry_project}
# docker rm ${registry_project}
# docker run -d -p ${port}:80 --name ${registry_project} ${docker_image}
# docker update --restart=always ${registry_project}

