# LogistiTrack QR - Microservicios con NestJS, PostgreSQL y Redis

Proyecto universitario desarrollado con arquitectura de microservicios usando **NestJS**, **PostgreSQL**, **Redis** y **Docker Compose**.

La idea principal del proyecto es separar responsabilidades en distintos microservicios, donde cada uno tiene su propia base de datos y se comunica con otros servicios mediante eventos usando Redis como broker de mensajes.

---

## 1. Arquitectura general

El sistema está compuesto por 3 microservicios:

```txt
auth-service
package-service
verification-service
```

Cada microservicio tiene su propia base de datos PostgreSQL:

```txt
auth-service         -> auth_db
package-service      -> package_db
verification-service -> verification_db
```

Además, se utiliza Redis para la comunicación entre microservicios usando el patrón **Publish/Subscribe**.

```txt
verification-service  -- publica evento -->  Redis  -- entrega evento -->  package-service
```

Ejemplo de evento:

```txt
delivery.verified
```

---

## 2. Estructura del repositorio

```txt
logistitrack-qr/
│
├── docker-compose.yml
├── README.md
├── .gitignore
│
├── auth-service/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── package-service/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── ...
│
└── verification-service/
    ├── src/
    ├── package.json
    ├── .env.example
    └── ...
```

Este repositorio utiliza una organización tipo **monorepo simple**: hay un solo repositorio de GitHub, pero cada microservicio es un proyecto NestJS independiente.

---

## 3. Tecnologías utilizadas

- NestJS
- TypeScript
- PostgreSQL
- Redis
- Docker
- Docker Compose
- TypeORM

---

## 4. Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

```txt
Node.js
npm
NestJS CLI
Docker
Docker Compose
```

Verificar instalaciones:

```bash
node --version
npm --version
nest --version
docker --version
docker compose version
```

---

## 5. Instalación inicial

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd logistitrack-qr
```

Instalar dependencias en cada microservicio:

```bash
cd auth-service
npm install
cd ..

cd package-service
npm install
cd ..

cd verification-service
npm install
cd ..
```

---

## 6. Variables de entorno

Cada microservicio debe tener su propio archivo `.env`.
También la api gateway debe tener su propio archivo `.env`.

Los archivos `.env` reales no se suben a GitHub. Para eso existen los archivos `.env.example`.

### auth-service/.env

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_HOST=localhost
REDIS_PORT=6379

REDIS_URL=redis://localhost:6379

JWT_SECRET=clave_secreta_jwt
```

### package-service/.env

```env
PORT=3002

DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=package_user
DB_PASSWORD=package_password
DB_DATABASE=package_db

REDIS_HOST=localhost
REDIS_PORT=6379
```

### verification-service/.env

```env
PORT=3003

DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=verification_user
DB_PASSWORD=verification_password
DB_DATABASE=verification_db

REDIS_HOST=localhost
REDIS_PORT=6379
```

### api-gateway/.env

```env

```
PORT=3000

AUTH_SERVICE_URL=http://localhost:3001
PACKAGE_SERVICE_URL=http://localhost:3002
VERIFICATION_SERVICE_URL=http://localhost:3003

REDIS_URL=redis://localhost:6379

JWT_SECRET=clave_secreta_jwt
---

## 7. Levantar infraestructura con Docker

Desde la carpeta raíz del proyecto:

```bash
docker compose up -d
```

Este comando levanta los siguientes servicios:

```txt
auth_db
package_db
verification_db
redis_broker
```

Es decir, Docker levanta:

```txt
- Base de datos PostgreSQL para auth-service
- Base de datos PostgreSQL para package-service
- Base de datos PostgreSQL para verification-service
- Redis para mensajería entre microservicios
```

Verificar que los contenedores estén funcionando:

```bash
docker ps
```

Ver logs generales:

```bash
docker compose logs
```

Ver logs de un servicio específico:

```bash
docker compose logs auth_db
```

```bash
docker compose logs redis
```

---

## 8. Ejecutar los microservicios

Una vez levantadas las bases de datos y Redis con Docker, ejecutar cada microservicio en una terminal separada.

### Terminal 1 - auth-service

```bash
cd auth-service
npm run start:dev
```

El servicio debería quedar disponible en:

```txt
http://localhost:3001
```

### Terminal 2 - package-service

```bash
cd package-service
npm run start:dev
```

El servicio debería quedar disponible en:

```txt
http://localhost:3002
```

### Terminal 3 - verification-service

```bash
cd verification-service
npm run start:dev
```

El servicio debería quedar disponible en:

```txt
http://localhost:3003
```

---

## 9. Puertos utilizados

### Microservicios

```txt
auth-service         -> 3001
package-service      -> 3002
verification-service -> 3003
```

### Bases de datos PostgreSQL

```txt
auth_db         -> localhost:5433
package_db      -> localhost:5434
verification_db -> localhost:5435
```

### Redis

```txt
redis_broker -> localhost:6379
```

---

## 10. Conexión a las bases de datos

### auth_db

```bash
docker exec -it auth_db psql -U auth_user -d auth_db
```

### package_db

```bash
docker exec -it package_db psql -U package_user -d package_db
```

### verification_db

```bash
docker exec -it verification_db psql -U verification_user -d verification_db
```

Dentro de PostgreSQL, listar tablas:

```sql
\dt
```

Salir de PostgreSQL:

```sql
\q
```

---

## 11. Verificar Redis

Entrar al contenedor de Redis:

```bash
docker exec -it redis_broker redis-cli
```

Probar conexión:

```bash
PING
```

Respuesta esperada:

```txt
PONG
```

Salir:

```bash
exit
```

---

## 12. Comunicación entre microservicios

La comunicación entre microservicios se realiza mediante Redis usando eventos.

Ejemplo de flujo:

```txt
1. verification-service verifica una entrega.
2. verification-service guarda la verificación en verification_db.
3. verification-service publica un evento en Redis.
4. package-service escucha ese evento.
5. package-service actualiza el estado del paquete en package_db.
```

Ejemplo de evento:

```txt
delivery.verified
```

Payload de ejemplo:

```json
{
  "packageId": 1,
  "verifiedAt": "2026-04-30T12:00:00.000Z"
}
```

---

## 13. Comandos útiles de Docker

Levantar infraestructura:

```bash
docker compose up -d
```

Detener infraestructura:

```bash
docker compose down
```

Ver contenedores activos:

```bash
docker ps
```

Ver todos los contenedores:

```bash
docker ps -a
```

Ver logs:

```bash
docker compose logs
```

Reiniciar servicios:

```bash
docker compose restart
```

Borrar contenedores y volúmenes:

```bash
docker compose down -v
```

Advertencia: el comando anterior elimina los volúmenes, por lo tanto borra los datos guardados en PostgreSQL.

---

## 14. Flujo recomendado para trabajar

Cada vez que se quiera trabajar en el proyecto:

```bash
# 1. Levantar infraestructura

docker compose up -d

# 2. Ejecutar auth-service

cd auth-service
npm run start:dev

# 3. Ejecutar package-service en otra terminal

cd package-service
npm run start:dev

# 4. Ejecutar verification-service en otra terminal

cd verification-service
npm run start:dev
```

---

## 15. Buenas prácticas del proyecto

- Cada microservicio debe acceder solamente a su propia base de datos.
- Un microservicio no debe consultar directamente la base de datos de otro microservicio.
- La comunicación entre servicios debe hacerse mediante eventos o requests definidos explícitamente.
- Los archivos `.env` no deben subirse a GitHub.
- Cada servicio debe tener su propio `.env.example`.
- Redis se usa como broker de mensajes para comunicación asíncrona.
- PostgreSQL se usa como almacenamiento persistente de cada microservicio.

---

## 16. Estado inicial esperado

Luego de ejecutar Docker y los tres microservicios, el sistema debería quedar así:

```txt
Infraestructura Docker:

- auth_db corriendo en localhost:5433
- package_db corriendo en localhost:5434
- verification_db corriendo en localhost:5435
- redis_broker corriendo en localhost:6379

Microservicios NestJS:

- auth-service corriendo en localhost:3001
- package-service corriendo en localhost:3002
- verification-service corriendo en localhost:3003
```

---

## 17. Notas para desarrollo

Durante el desarrollo se puede usar TypeORM con:

```ts
synchronize: true
```

Esto permite que TypeORM cree o actualice las tablas automáticamente a partir de las entidades.

Para un entorno más profesional o producción, se recomienda usar migraciones en lugar de `synchronize: true`.

---

## 18. Resumen rápido

```bash
# Levantar PostgreSQL x3 + Redis

docker compose up -d

# Ejecutar auth-service

cd auth-service
npm run start:dev

# Ejecutar package-service

cd package-service
npm run start:dev

# Ejecutar verification-service

cd verification-service
npm run start:dev
```

Con esto el entorno inicial queda listo para desarrollar y probar la comunicación entre microservicios.
