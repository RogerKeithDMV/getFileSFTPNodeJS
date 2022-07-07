FROM node:16-alpine

RUN apk --no-cache add \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci --production

COPY . /usr/src/app

RUN chown -R node:node .
RUN chmod +x ./start.sh

USER node

ENTRYPOINT ["./start.sh"]