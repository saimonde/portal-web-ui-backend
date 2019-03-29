FROM node:8.11.3-alpine AS builder

RUN apk update && apk add openssh-client git

WORKDIR /src


COPY ./package.json ./package-lock.json /src/

RUN npm install --production && \
    rm -rf /root/.ssh

FROM node:8.11.3-alpine

WORKDIR /src
CMD ["node", "/src/index.js"]

COPY --from=builder /src /src
COPY ./api.json ./db.js ./index.js ./requests.js /src/
