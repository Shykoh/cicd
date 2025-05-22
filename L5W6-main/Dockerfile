FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

copy . .

EXPOSE 1202

CMD ["npm", "start"]