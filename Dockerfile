FROM nginx:1.26.3
VOLUME /tmp
ENV LANG en_US.UTF-8
ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
