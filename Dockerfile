FROM node:12-alpine

RUN set -o errexit -o nounset \
  && apk add --no-cache tzdata

WORKDIR /webapp
ADD build/ .
RUN npm install --production

ENV MONGO_URL mongodb://mongo:27017/apollo-react
ENV PORT 4000
ENV ROOT_URL http://localhost:4000

EXPOSE 4000

CMD [ "node", "node_modules/pm2/bin/pm2", "start", "--no-daemon" ]
