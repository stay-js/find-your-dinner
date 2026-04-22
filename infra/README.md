# Find Your Dinner. - Infrastruktúra / Fejlesztői környezet

Előfeltételek: [Find Your Dinner. - Dokumentáció, Előfeltételek](../README.md#előfeltételek)

## 1. Környezeti változók

Az `infra/.env` fájlban (a `infra/.env.example` alapján) az alábbi változók konfigurálhatók:

| Változó neve           | Leírás                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `COMPOSE_PROJECT_NAME` | Docker Compose projekt neve (konténerek és volume-ok prefixe) |
| `TZ`                   | Időzóna a Postgres konténer számára                           |
| `POSTGRES_USER`        | Postgres felhasználónév                                       |
| `POSTGRES_PASSWORD`    | Postgres jelszó                                               |
| `POSTGRES_DB`          | Postgres adatbázis neve                                       |

## 2. Szolgáltatások

| Szolgáltatás  | Leírás                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| `caddy`       | [Caddy](https://caddyserver.com/) reverse proxy                             |
| `postgres`    | [PostgreSQL](https://www.postgresql.org/) adatbázis                         |
| `cloudbeaver` | [CloudBeaver](https://dbeaver.com/docs/cloudbeaver/) webes adatbázis-kezelő |
| `swagger`     | [Swagger UI](https://swagger.io/tools/swagger-ui/) API dokumentáció         |

## 3. Indítás

```bash
just infra-start
```

### 3.1. Első indítás esetén

1. Futtasd az `infra-setup` receptet, ez lemásolja az `.env.example` fájlt `.env` néven.

```bash
just infra-setup
```

2. Amennyiben szükséges, módosítsd a `.env` fájlban a környezeti változókat.

3. Ezután futtasd az `infra-start` receptet, a containerek elindításához.

```bash
just infra-start
```

## 4. Leállítás

```bash
just infra-stop
```

## 5. Eltávolítás

```bash
just infra-remove # -v opcionális, a volume-ok törléséhez
```

## 6. Szolgáltatások elérése

### 6.1. Postgres

- Host: `localhost`
- Port: `5432`
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték

### 6.2. CloudBeaver

- URL: <http://cb.localhost> vagy <http://cb.vm1.test>
- Host: `postgres`
- Port: `5432`
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték

### 6.3. Swagger

- URL: <http://swagger.localhost> vagy <http://swagger.vm1.test>

[Full-stack web app dokumentációja - API dokumentáció (Swagger)](../web/README.md#api-dokumentáció-swagger)
