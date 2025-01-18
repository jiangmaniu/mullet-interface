FROM nginx
# 拷贝前端构建文件到Nginx目录
ADD dist/ /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

