# Imagem da API para o Render. Duas etapas: a primeira compila com JDK e Maven; a segunda leva só o JRE e o .jar,
# o que deixa a imagem final pequena e sem ferramentas de build.

# --- Compilação ---
FROM maven:3.9.16-eclipse-temurin-21 AS build
WORKDIR /build

# Baixa as dependências numa camada própria: enquanto o pom.xml não muda, o Docker reaproveita essa camada e o build
# seguinte só recompila o código.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
# Os testes rodam na máquina de quem desenvolve e no CI (precisam de Docker para o Testcontainers), não aqui.
RUN mvn -B -q -DskipTests package && cp target/*.jar app.jar

# --- Execução ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Sem root: se a aplicação for comprometida, o processo não tem privilégios no container.
RUN addgroup -S api && adduser -S api -G api
USER api

COPY --from=build /build/app.jar app.jar

# O plano gratuito do Render tem 512 MB. O heap fica com 60% da memória do container; o resto cobre metaspace,
# threads e buffers. Sem memória, a JVM encerra e o Render reinicia o serviço, em vez de ficar travada.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60 -XX:+ExitOnOutOfMemoryError -Xss512k"

# O Render informa a porta na variável PORT; o application.yml já a lê (padrão 8080).
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
