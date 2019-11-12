#Option 1: build project and run with Node
FROM node:8 as builder

# make a working directory
RUN mkdir -p /usr/local/app

# set the working directory
WORKDIR /usr/local/app

# copy dependency definitions
COPY . /usr/local/app

#install dependencies
RUN npm install

#deploy to NGINX
FROM nginx
COPY --from=builder ./usr/local/app/app /etc/nginx/html/newpghd1frontend/
COPY --from=builder ./usr/local/app/nginx.conf /etc/nginx/conf.d/default.conf
