FROM node:14-alpine3.12

COPY --from=trajano/alpine-libfaketime  /faketime.so /lib/faketime.so
ENV LD_PRELOAD=/lib/faketime.so

WORKDIR /app

ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm install --prod
# ADD . /app

CMD [ "node" ]
