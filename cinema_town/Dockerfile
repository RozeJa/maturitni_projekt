## tento konfig nebyl odskousen

# Stage 1: Kompilace aplikace s plným JDK
FROM maven:3-openjdk-17 as java-build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

# Stage 2: Vytvoření odlehčeného kontejneru
FROM openjdk:17-jdk-alpine
# Nastavení pracovního adresáře
WORKDIR /app
COPY src src
COPY templates templates

ARG src="Arial Unicode MS.TTF"
ARG target="Arial Unicode MS.TTF"
COPY ${src} ${target}

COPY --from=java-build /app/target/app.jar .
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

# docker build mp-backend .
# docker volume create mp-film-images
# docker run -d \
# -p 8081:8080 \
# --mount source=mp-film-images,target=/app/frontend/src/assets/imgs/films-imgs \
# --mount type=bind,src=/home/john/mp-data/tickets/,dst=/app/tickets \
# --name mp-backend-container \
# mp-backend
# docker network connect mp-net mp-backend-container