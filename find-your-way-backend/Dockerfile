FROM node:20-alpine

# Build tools needed for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src/ ./src/

VOLUME ["/app/data"]

ENV PORT=3001

EXPOSE 3001

CMD ["node", "src/index.js"]
