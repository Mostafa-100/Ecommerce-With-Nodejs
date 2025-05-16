FROM node

WORKDIR /app

COPY package*.json ./

RUN npm i && npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "app"]