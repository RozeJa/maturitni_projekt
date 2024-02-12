# Použití oficiálního Node.js image
FROM node:14

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování zdrojových kódů do kontejneru
COPY . .

# Instalace závislostí
RUN npm install

# Vystav port 3000
EXPOSE 3000

# Příkaz pro spuštění aplikace
CMD ["npm", "start"]

# docker build --tag mp-frontend .
# docker run --rm -p 3000:3000 \
# --mount source=mp-film-images,target=/app/src/assets/imgs/films-imgs \
# --name mp-frontend-container \ 
# mp-frontend
# docker network connect mp-net mp-frontend-container