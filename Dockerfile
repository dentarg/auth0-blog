FROM jfromaniello/jekyll

EXPOSE 80

# install nodejs, npm and git
RUN \
  apt-get update && \
  apt-get install -y nginx nodejs npm git git-core  # 2016-01-25

# Set up nginx as no-daemon
RUN \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

ADD nginx.conf /etc/nginx/nginx.conf

ADD . /data
WORKDIR /data
COPY Gemfile /data

# install gems
RUN bundle install

ENV JEKYLL_ENV production

RUN jekyll build

CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]
