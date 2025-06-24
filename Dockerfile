FROM node

WORKDIR /app

COPY package*.json ./

RUN npm i && npm install -g nodemon

COPY . .

WORKDIR /app/src

EXPOSE 3000

CMD ["nodemon", "server.js"]