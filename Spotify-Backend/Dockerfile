
# Usa una imagen oficial de Java 17
FROM eclipse-temurin:17-jdk

# Crea el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el .jar generado en el paso anterior
COPY build/libs/app.jar app.jar

# Expón el puerto 8080 (Spring Boot por default)
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
