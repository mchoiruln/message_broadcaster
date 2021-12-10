FROM node:14-alpine3.12
WORKDIR /app

ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm install --prod
# ADD . /app

CMD [ "node" ]
