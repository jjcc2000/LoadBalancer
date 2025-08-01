FROM node:18

WORKDIR /app
COPY . .

RUN npm install && npm run build

# Usamos vite preview para servir
RUN npm install -g vite
EXPOSE 4173
CMD ["vite", "preview", "--host"]
