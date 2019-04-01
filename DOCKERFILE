FROM node:10-alpine
MAINTAINER Yesterday17

RUN mkdir -p /home/ProxyStatusChecker
WORKDIR /home/ProxyStatusChecker

COPY . /home/ProxyStatusChecker

RUN npm install -g -s --no-progress yarn
RUN yarn

# Expose port 8080 to host 
EXPOSE 8080

CMD [ "yarn", "start" ]