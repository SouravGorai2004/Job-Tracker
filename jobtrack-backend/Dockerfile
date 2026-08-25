# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first so Maven's dependency cache survives across builds
# unless pom.xml itself changes -- avoids re-downloading ~100MB every time
# you only touch source code.
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Informational only -- Render assigns the real port via $PORT at runtime.
EXPOSE 8081

ENTRYPOINT ["./docker-entrypoint.sh"]