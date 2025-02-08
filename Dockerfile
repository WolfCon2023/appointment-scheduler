FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-cache

COPY . .

CMD ["node", "server.js"]