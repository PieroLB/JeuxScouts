FROM node:latest
WORKDIR /app/SERVER
COPY SERVER/package.json /app/SERVER
RUN npm install
COPY . /app
EXPOSE 5000
CMD ["npm", "run", "start"]