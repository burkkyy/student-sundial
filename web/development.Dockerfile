FROM node:20.18.0-alpine3.19

RUN npm install -g npm@10.9.0

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
