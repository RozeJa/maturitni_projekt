## tento konfig nebyl odskousen
# Stage 1: Build React app
FROM node:14-alpine as react-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Kompilace aplikace s plným JDK
FROM maven:3-openjdk-17 as java-build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

# Stage 3: Build final image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY templates templates

ARG src="Arial Unicode MS.TTF"
ARG target="Arial Unicode MS.TTF"
COPY ${src} ${target}

COPY --from=java-build /app/target/app.jar .
COPY --from=react-build /app/build ./frontend
EXPOSE 8080
EXPOSE 3000

ENTRYPOINT ["java", "-jar", "app.jar"]
RUN npm run eject