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

RUN mkdir /usr/src/app/key

COPY ./Keypair6Delta.ppk /usr/src/app/key

RUN chown -R node:node .
RUN chmod +x ./start.sh

ENV URI_RABBITMQ='amqp://guest:guest@rabbitmq-service.oih.svc.cluster.local'

USER node

ENTRYPOINT ["./start.sh"]
