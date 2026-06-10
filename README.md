# ARCHIVO TXT CON CONTENIDO MARKDOWN

# Proyecto: LogistiTrack QR

# Contiene:

# 1. README.md raíz actualizado

# 2. README.md para api-gateway

# 3. README.md para auth-service

# 4. README.md para package-service

# 5. README.md para verification-service

# 6. .env.example de cada servicio

================================================================================
README.md RAÍZ
================================================================================

# LogistiTrack QR - Microservicios con NestJS, PostgreSQL, Redis y Docker

Proyecto universitario desarrollado con arquitectura de microservicios usando **NestJS**, **PostgreSQL**, **Redis** y **Docker Compose**.

La idea principal del proyecto es separar responsabilidades en distintos microservicios, donde cada uno tiene su propia base de datos y se comunica con otros servicios mediante eventos usando Redis como broker de mensajes.

Actualmente, el proyecto está dockerizado para que no sea necesario abrir varias terminales y ejecutar manualmente `npm run start:dev` en cada servicio. Con Docker Compose se levantan las bases de datos, Redis, el API Gateway y todos los microservicios.

---

## 1. Arquitectura general

El sistema está compuesto por los siguientes servicios:

```txt
api-gateway
auth-service
package-service
verification-service
```

El API Gateway funciona como punto de entrada principal para el cliente.

Los microservicios principales son:

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

Ejemplo de comunicación por eventos:

```txt
verification-service  -- publica evento -->  Redis  -- entrega evento -->  package-service
```

Ejemplo de evento:

```txt
delivery.verified
```

---

## 2. Servicios incluidos

| Servicio             | Puerto | Descripción                                       |
| -------------------- | -----: | ------------------------------------------------- |
| API Gateway          |   3000 | Punto de entrada principal del sistema            |
| Auth Service         |   3001 | Autenticación, login, refresh token y logout      |
| Package Service      |   3002 | Gestión de paquetes y estados de entrega          |
| Verification Service |   3003 | Gestión de verificaciones de entrega              |
| Redis                |   6379 | Broker/event bus para comunicación por eventos    |
| Auth DB              |   5433 | Base de datos PostgreSQL del Auth Service         |
| Package DB           |   5434 | Base de datos PostgreSQL del Package Service      |
| Verification DB      |   5435 | Base de datos PostgreSQL del Verification Service |

---

## 3. Estructura del proyecto

```txt
logistitrack-qr/
├── docker-compose.yml
├── api-gateway/
│   ├── Dockerfile
│   ├── .env
│   ├── .env.example
│   └── README.md
├── auth-service/
│   ├── Dockerfile
│   ├── .env
│   ├── .env.example
│   └── README.md
├── package-service/
│   ├── Dockerfile
│   ├── .env
│   ├── .env.example
│   └── README.md
└── verification-service/
    ├── Dockerfile
    ├── .env
    ├── .env.example
    └── README.md
```

Este repositorio utiliza una organización tipo **monorepo simple**: hay un solo repositorio de GitHub, pero cada microservicio es un proyecto NestJS independiente.

---

## 4. Tecnologías utilizadas

- NestJS
- TypeScript
- PostgreSQL
- Redis
- Docker
- Docker Compose
- TypeORM
- Swagger / OpenAPI
- JWT

---

## 5. Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

```txt
Docker
Docker Compose
```

Opcionalmente, si se desea ejecutar algún microservicio fuera de Docker:

```txt
Node.js
npm
NestJS CLI
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

## 6. Instalación inicial

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd logistitrack-qr
```

Si se va a trabajar completamente con Docker, no es obligatorio instalar las dependencias manualmente en cada servicio, porque Docker las instalará durante el build.

Sin embargo, para tener autocompletado, ejecutar scripts locales o trabajar fuera de Docker, se pueden instalar las dependencias de cada servicio:

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

cd api-gateway
npm install
cd ..
```

---

## 7. Variables de entorno

Cada microservicio debe tener su propio archivo `.env`.

También el API Gateway debe tener su propio archivo `.env`.

Los archivos `.env` reales no se suben a GitHub. Para eso existen los archivos `.env.example`.

---

## 8. Importante: variables dentro de Docker vs fuera de Docker

Cuando los servicios corren dentro de Docker, no deben usar `localhost` para conectarse entre sí.

Dentro de Docker, se usan los nombres de los servicios definidos en `docker-compose.yml`.

Ejemplo correcto dentro de Docker:

```env
DB_HOST=auth_db
REDIS_URL=redis://redis:6379
PACKAGE_SERVICE_URL=http://package-service:3002
```

Ejemplo incorrecto dentro de Docker:

```env
DB_HOST=localhost
REDIS_URL=redis://localhost:6379
PACKAGE_SERVICE_URL=http://localhost:3002
```

Regla rápida:

```txt
Desde tu PC:
localhost

Desde un contenedor Docker:
nombre_del_servicio
```

Ejemplo:

```txt
Desde tu PC hacia Auth DB:
localhost:5433

Desde auth-service hacia Auth DB:
auth_db:5432
```

---

## 9. Variables de entorno para Docker

### api-gateway/.env

```env
PORT=3000

AUTH_SERVICE_URL=http://auth-service:3001
PACKAGE_SERVICE_URL=http://package-service:3002
VERIFICATION_SERVICE_URL=http://verification-service:3003

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
```

### auth-service/.env

```env
PORT=3001

DB_HOST=auth_db
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
JWT_EXPIRES_IN=1d
```

### package-service/.env

```env
PORT=3002

DB_HOST=package_db
DB_PORT=5432
DB_USERNAME=package_user
DB_PASSWORD=package_password
DB_DATABASE=package_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

AUTH_SERVICE_URL=http://auth-service:3001
```

### verification-service/.env

```env
PORT=3003

DB_HOST=verification_db
DB_PORT=5432
DB_USERNAME=verification_user
DB_PASSWORD=verification_password
DB_DATABASE=verification_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

PACKAGE_SERVICE_URL=http://package-service:3002
AUTH_SERVICE_URL=http://auth-service:3001
```

---

## 10. Variables de entorno si se ejecuta fuera de Docker

Si se ejecutan los microservicios manualmente con `npm run start:dev`, los `.env` deben usar `localhost`.

Ejemplo para auth-service ejecutado desde la PC:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
JWT_EXPIRES_IN=1d
```

Ejemplo para api-gateway ejecutado desde la PC:

```env
PORT=3000

AUTH_SERVICE_URL=http://localhost:3001
PACKAGE_SERVICE_URL=http://localhost:3002
VERIFICATION_SERVICE_URL=http://localhost:3003

REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
```

---

## 11. Levantar todo el proyecto con Docker

Desde la carpeta raíz del proyecto:

```bash
docker compose up --build
```

Este comando levanta:

```txt
api-gateway
auth-service
package-service
verification-service
auth_db
package_db
verification_db
redis
```

Para ejecutarlo en segundo plano:

```bash
docker compose up -d --build
```

Para detener los contenedores:

```bash
docker compose down
```

Para detener y borrar también los volúmenes de las bases de datos:

```bash
docker compose down -v
```

Advertencia:

```txt
docker compose down -v
```

borra los volúmenes de PostgreSQL, por lo tanto elimina los datos guardados.

---

## 12. Verificar que los contenedores estén funcionando

```bash
docker compose ps
```

También se puede usar:

```bash
docker ps
```

---

## 13. Ver logs

Ver logs generales:

```bash
docker compose logs -f
```

Ver logs de un servicio específico:

```bash
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f package-service
docker compose logs -f verification-service
docker compose logs -f redis
```

---

## 14. URLs principales

| Recurso                      | URL                            |
| ---------------------------- | ------------------------------ |
| API Gateway                  | http://localhost:3000          |
| API Gateway Swagger          | http://localhost:3000/api/docs |
| Auth Service                 | http://localhost:3001          |
| Auth Service Swagger         | http://localhost:3001/api/docs |
| Package Service              | http://localhost:3002          |
| Package Service Swagger      | http://localhost:3002/api/docs |
| Verification Service         | http://localhost:3003          |
| Verification Service Swagger | http://localhost:3003/api/docs |
| Redis                        | localhost:6379                 |

---

## 15. Puertos utilizados

### Microservicios

```txt
api-gateway          -> 3000
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

## 16. Conexión a las bases de datos

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

## 17. Conexión a las bases desde Beekeeper, DBeaver o pgAdmin

### Auth DB

```txt
Host: localhost
Port: 5433
User: auth_user
Password: auth_password
Database: auth_db
```

### Package DB

```txt
Host: localhost
Port: 5434
User: package_user
Password: package_password
Database: package_db
```

### Verification DB

```txt
Host: localhost
Port: 5435
User: verification_user
Password: verification_password
Database: verification_db
```

---

## 18. Verificar Redis

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

También se puede verificar directamente con Docker Compose:

```bash
docker compose exec redis redis-cli ping
```

Respuesta esperada:

```txt
PONG
```

---

## 19. Ejecutar seeds

Las seeds deben ejecutarse dentro del contenedor correspondiente.

Por ejemplo, para cargar usuarios iniciales en el Auth Service:

```bash
docker compose exec auth-service npm run seed
```

Usuarios de prueba:

```txt
usuario@logistitrack.com
courier@logistitrack.com
ejemplo@logistitrack.com
prueba@logistitrack.com
test@logistitrack.com
```

Contraseña:

```txt
Password123
```

Si la seed detecta usuarios existentes, puede no volver a crearlos dependiendo de su lógica interna.

---

## 20. Comunicación entre microservicios

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

## 21. API Gateway

El API Gateway es el punto de entrada principal del sistema.

Desde el frontend o desde Postman se recomienda consumir primero el API Gateway:

```txt
http://localhost:3000
```

El API Gateway se comunica internamente con:

```txt
auth-service         -> http://auth-service:3001
package-service      -> http://package-service:3002
verification-service -> http://verification-service:3003
```

Estas URLs internas solo funcionan dentro de Docker.

---

## 22. Swagger

Cada servicio puede exponer su documentación con Swagger.

URLs:

```txt
API Gateway:          http://localhost:3000/api/docs
Auth Service:         http://localhost:3001/api/docs
Package Service:      http://localhost:3002/api/docs
Verification Service: http://localhost:3003/api/docs
```

Si se instala Swagger en un servicio, se debe reconstruir el contenedor:

```bash
docker compose up --build nombre-del-servicio
```

Ejemplo:

```bash
docker compose up --build auth-service
```

---

## 23. Comandos útiles de Docker

Levantar todo:

```bash
docker compose up --build
```

Levantar todo en segundo plano:

```bash
docker compose up -d --build
```

Detener todo:

```bash
docker compose down
```

Ver contenedores activos:

```bash
docker compose ps
```

Ver todos los contenedores:

```bash
docker ps -a
```

Ver logs:

```bash
docker compose logs -f
```

Reiniciar servicios:

```bash
docker compose restart
```

Reconstruir un servicio específico:

```bash
docker compose up --build auth-service
```

Borrar contenedores y volúmenes:

```bash
docker compose down -v
```

Advertencia: el comando anterior elimina los volúmenes, por lo tanto borra los datos guardados en PostgreSQL.

---

## 24. Verificar variables dentro de un contenedor

Ejemplo con Auth Service:

```bash
docker compose exec auth-service printenv
```

Filtrar variables de Redis:

```bash
docker compose exec auth-service printenv | grep REDIS
```

Filtrar variables de base de datos:

```bash
docker compose exec auth-service printenv | grep DB
```

Ejemplo esperado:

```txt
REDIS_URL=redis://redis:6379
DB_HOST=auth_db
DB_PORT=5432
```

---

## 25. Flujo recomendado para trabajar

Cada vez que se quiera trabajar en el proyecto:

```bash
# 1. Levantar todo el entorno dockerizado

docker compose up --build
```

O en segundo plano:

```bash
docker compose up -d --build
```

Luego se puede probar el sistema desde:

```txt
http://localhost:3000/api/docs
```

Si el frontend consume el API Gateway, debe apuntar a:

```txt
http://localhost:3000
```

---

## 26. Buenas prácticas del proyecto

- Cada microservicio debe acceder solamente a su propia base de datos.
- Un microservicio no debe consultar directamente la base de datos de otro microservicio.
- La comunicación entre servicios debe hacerse mediante eventos o requests definidos explícitamente.
- Los archivos `.env` no deben subirse a GitHub.
- Cada servicio debe tener su propio `.env.example`.
- Redis se usa como broker de mensajes para comunicación asíncrona.
- PostgreSQL se usa como almacenamiento persistente de cada microservicio.
- Dentro de Docker no se debe usar `localhost` para conectar servicios entre sí.
- El API Gateway debe centralizar las peticiones del cliente.
- Para desarrollo se puede usar `synchronize: true`, pero para producción se recomiendan migraciones.

---

## 27. Estado inicial esperado

Luego de ejecutar Docker Compose, el sistema debería quedar así:

```txt
Infraestructura Docker:

- auth_db corriendo en localhost:5433
- package_db corriendo en localhost:5434
- verification_db corriendo en localhost:5435
- redis_broker corriendo en localhost:6379

Microservicios NestJS:

- api-gateway corriendo en localhost:3000
- auth-service corriendo en localhost:3001
- package-service corriendo en localhost:3002
- verification-service corriendo en localhost:3003
```

---

## 28. Notas para desarrollo

Durante el desarrollo se puede usar TypeORM con:

```ts
synchronize: true;
```

Esto permite que TypeORM cree o actualice las tablas automáticamente a partir de las entidades.

Para un entorno más profesional o producción, se recomienda usar migraciones en lugar de `synchronize: true`.

---

## 29. Resumen rápido

```bash
# Levantar todo el proyecto

docker compose up --build
```

En segundo plano:

```bash
docker compose up -d --build
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f
```

Ejecutar seed de usuarios:

```bash
docker compose exec auth-service npm run seed
```

Abrir Swagger del API Gateway:

```txt
http://localhost:3000/api/docs
```

Con esto el entorno queda listo para desarrollar y probar la comunicación entre microservicios sin abrir múltiples terminales manualmente.

---

## 30. .gitignore recomendado

```gitignore
# Entorno
.env

# Dependencias
node_modules

# Build
dist

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema
.DS_Store
```

================================================================================
api-gateway/README.md
================================================================================

# API Gateway

El API Gateway es el punto de entrada principal del sistema LogistiTrack QR.

Se encarga de recibir las peticiones del cliente y redirigirlas hacia los microservicios correspondientes:

```txt
auth-service
package-service
verification-service
```

También maneja WebSockets para notificaciones y eventos como el cierre forzado de sesión.

---

## Puerto

```txt
3000
```

URL local:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/api/docs
```

---

## Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build api-gateway
```

O levantar todo el sistema:

```bash
docker compose up --build
```

---

## Variables de entorno

Crear un archivo `.env` dentro de `api-gateway/`.

### .env

```env
PORT=3000

AUTH_SERVICE_URL=http://auth-service:3001
PACKAGE_SERVICE_URL=http://package-service:3002
VERIFICATION_SERVICE_URL=http://verification-service:3003

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
```

---

## .env.example

```env
PORT=3000

AUTH_SERVICE_URL=http://auth-service:3001
PACKAGE_SERVICE_URL=http://package-service:3002
VERIFICATION_SERVICE_URL=http://verification-service:3003

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=change_this_secret
```

---

## Importante sobre Redis

Dentro de Docker, Redis se accede con:

```env
REDIS_URL=redis://redis:6379
```

No usar:

```env
REDIS_URL=redis://localhost:6379
```

porque `localhost` dentro del contenedor apunta al propio contenedor del API Gateway.

---

## Ver logs

```bash
docker compose logs -f api-gateway
```

---

## Verificar variables

```bash
docker compose exec api-gateway printenv | grep REDIS
```

Debe mostrar:

```txt
REDIS_URL=redis://redis:6379
```

---

## Comunicación interna

El API Gateway se comunica con los servicios usando los nombres definidos en Docker Compose:

```txt
auth-service         -> http://auth-service:3001
package-service      -> http://package-service:3002
verification-service -> http://verification-service:3003
```

No usar `localhost` para comunicación entre contenedores.

================================================================================
auth-service/README.md
================================================================================

# Auth Service

Microservicio encargado de la autenticación de usuarios.

Funciones principales:

- Login
- Refresh token
- Logout
- Gestión de sesiones
- Publicación de eventos en Redis
- Validación de usuarios

---

## Puerto

```txt
3001
```

URL local:

```txt
http://localhost:3001
```

Swagger:

```txt
http://localhost:3001/api/docs
```

---

## Base de datos

Este servicio usa una base PostgreSQL propia:

```txt
auth_db
```

Desde Docker:

```txt
Host: auth_db
Port: 5432
```

Desde la PC:

```txt
Host: localhost
Port: 5433
```

---

## Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build auth-service
```

O levantar todo:

```bash
docker compose up --build
```

---

## Variables de entorno

Crear un archivo `.env` dentro de `auth-service/`.

### .env

```env
PORT=3001

DB_HOST=auth_db
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=clave_secreta_jwt
JWT_EXPIRES_IN=1d
```

---

## .env.example

```env
PORT=3001

DB_HOST=auth_db
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

---

## Ejecutar seed de usuarios

La seed debe ejecutarse dentro del contenedor:

```bash
docker compose exec auth-service npm run seed
```

Usuarios de prueba:

```txt
usuario@logistitrack.com
courier@logistitrack.com
ejemplo@logistitrack.com
prueba@logistitrack.com
test@logistitrack.com
```

Contraseña:

```txt
Password123
```

---

## Ver logs

```bash
docker compose logs -f auth-service
```

---

## Verificar conexión a Redis

```bash
docker compose exec auth-service printenv | grep REDIS
```

Debe mostrar:

```txt
REDIS_URL=redis://redis:6379
```

---

## Verificar conexión a base de datos

```bash
docker compose exec auth-service printenv | grep DB
```

Debe mostrar valores similares a:

```txt
DB_HOST=auth_db
DB_PORT=5432
DB_USERNAME=auth_user
DB_DATABASE=auth_db
```

================================================================================
package-service/README.md
================================================================================

# Package Service

Microservicio encargado de la gestión de paquetes.

Funciones principales:

- Crear paquetes
- Listar paquetes
- Buscar paquetes por ID
- Buscar paquetes por tracking code
- Buscar paquetes por courier
- Actualizar estado del paquete
- Marcar paquetes como entregados
- Emitir o reaccionar a eventos relacionados con entregas

---

## Puerto

```txt
3002
```

URL local:

```txt
http://localhost:3002
```

Swagger:

```txt
http://localhost:3002/api/docs
```

---

## Base de datos

Este servicio usa una base PostgreSQL propia:

```txt
package_db
```

Desde Docker:

```txt
Host: package_db
Port: 5432
```

Desde la PC:

```txt
Host: localhost
Port: 5434
```

---

## Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build package-service
```

O levantar todo:

```bash
docker compose up --build
```

---

## Variables de entorno

Crear un archivo `.env` dentro de `package-service/`.

### .env

```env
PORT=3002

DB_HOST=package_db
DB_PORT=5432
DB_USERNAME=package_user
DB_PASSWORD=package_password
DB_DATABASE=package_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

AUTH_SERVICE_URL=http://auth-service:3001
```

---

## .env.example

```env
PORT=3002

DB_HOST=package_db
DB_PORT=5432
DB_USERNAME=package_user
DB_PASSWORD=package_password
DB_DATABASE=package_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

AUTH_SERVICE_URL=http://auth-service:3001
```

---

## Ver logs

```bash
docker compose logs -f package-service
```

---

## Verificar variables

```bash
docker compose exec package-service printenv | grep DB
docker compose exec package-service printenv | grep REDIS
```

---

## Importante

Dentro de Docker, este servicio debe conectarse a la base usando:

```env
DB_HOST=package_db
DB_PORT=5432
```

No usar:

```env
DB_HOST=localhost
DB_PORT=5434
```

`localhost:5434` solo sirve desde la PC, por ejemplo con Beekeeper o DBeaver.

================================================================================
verification-service/README.md
================================================================================

# Verification Service

Microservicio encargado de gestionar verificaciones de entrega.

Funciones principales:

- Crear verificaciones
- Listar verificaciones
- Buscar verificaciones por ID
- Buscar verificaciones por orderId
- Actualizar verificaciones
- Cambiar estado de verificación
- Emitir eventos de entrega verificada mediante Redis

---

## Puerto

```txt
3003
```

URL local:

```txt
http://localhost:3003
```

Swagger:

```txt
http://localhost:3003/api/docs
```

---

## Base de datos

Este servicio usa una base PostgreSQL propia:

```txt
verification_db
```

Desde Docker:

```txt
Host: verification_db
Port: 5432
```

Desde la PC:

```txt
Host: localhost
Port: 5435
```

---

## Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build verification-service
```

O levantar todo:

```bash
docker compose up --build
```

---

## Variables de entorno

Crear un archivo `.env` dentro de `verification-service/`.

### .env

```env
PORT=3003

DB_HOST=verification_db
DB_PORT=5432
DB_USERNAME=verification_user
DB_PASSWORD=verification_password
DB_DATABASE=verification_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

PACKAGE_SERVICE_URL=http://package-service:3002
AUTH_SERVICE_URL=http://auth-service:3001
```

---

## .env.example

```env
PORT=3003

DB_HOST=verification_db
DB_PORT=5432
DB_USERNAME=verification_user
DB_PASSWORD=verification_password
DB_DATABASE=verification_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

PACKAGE_SERVICE_URL=http://package-service:3002
AUTH_SERVICE_URL=http://auth-service:3001
```

---

## Ver logs

```bash
docker compose logs -f verification-service
```

---

## Verificar variables

```bash
docker compose exec verification-service printenv | grep DB
docker compose exec verification-service printenv | grep REDIS
```

---

## Importante

Dentro de Docker, este servicio debe conectarse a PostgreSQL con:

```env
DB_HOST=verification_db
DB_PORT=5432
```

No usar:

```env
DB_HOST=localhost
DB_PORT=5435
```

`localhost:5435` solo sirve desde la PC.

================================================================================
.env.example DE CADA SERVICIO
================================================================================

api-gateway/.env.example

```env
PORT=3000

AUTH_SERVICE_URL=http://auth-service:3001
PACKAGE_SERVICE_URL=http://package-service:3002
VERIFICATION_SERVICE_URL=http://verification-service:3003

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=change_this_secret
```

auth-service/.env.example

```env
PORT=3001

DB_HOST=auth_db
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_DATABASE=auth_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

package-service/.env.example

```env
PORT=3002

DB_HOST=package_db
DB_PORT=5432
DB_USERNAME=package_user
DB_PASSWORD=package_password
DB_DATABASE=package_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

AUTH_SERVICE_URL=http://auth-service:3001
```

verification-service/.env.example

```env
PORT=3003

DB_HOST=verification_db
DB_PORT=5432
DB_USERNAME=verification_user
DB_PASSWORD=verification_password
DB_DATABASE=verification_db

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

PACKAGE_SERVICE_URL=http://package-service:3002
AUTH_SERVICE_URL=http://auth-service:3001
```
