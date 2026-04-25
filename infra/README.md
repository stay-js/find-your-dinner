# Find Your Dinner. - Infrastruktúra / Fejlesztői környezet

Előfeltételek: [Find Your Dinner. - Dokumentáció, Előfeltételek](../README.md#előfeltételek)

<br>

## Tartalomjegyzék

- [1. Környezeti változók](#1-környezeti-változók)
- [2. Szolgáltatások](#2-szolgáltatások)
- [3. Indítás](#3-indítás)
  - [3.1. Első indítás](#31-első-indítás)
- [4. Leállítás](#4-leállítás)
- [5. Eltávolítás](#5-eltávolítás)
- [6. Szolgáltatások elérése](#6-szolgáltatások-elérése)
  - [6.1. Postgres](#61-postgres)
  - [6.2. CloudBeaver](#62-cloudbeaver)
  - [6.3. Swagger](#63-swagger)

<br>
<br>

## 1. Környezeti változók

Az `infra/.env` fájlban (a `infra/.env.example` alapján) az alábbi változók konfigurálhatók:

| Változó                | Leírás                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `COMPOSE_PROJECT_NAME` | Docker Compose projekt neve (konténerek és volume-ok prefixe) |
| `TZ`                   | Időzóna a Postgres konténer számára                           |
| `POSTGRES_USER`        | Postgres felhasználónév                                       |
| `POSTGRES_PASSWORD`    | Postgres jelszó                                               |
| `POSTGRES_DB`          | Postgres adatbázis neve                                       |

<br>
<br>

## 2. Szolgáltatások

| Szolgáltatás  | Leírás                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| `caddy`       | [Caddy](https://caddyserver.com/) reverse proxy                             |
| `postgres`    | [PostgreSQL](https://www.postgresql.org/) adatbázis                         |
| `cloudbeaver` | [CloudBeaver](https://dbeaver.com/docs/cloudbeaver/) webes adatbázis-kezelő |
| `swagger`     | [Swagger UI](https://swagger.io/tools/swagger-ui/) API dokumentáció         |

<br>
<br>

## 3. Indítás

```bash
just infra-start
```

<br>

### 3.1. Első indítás

1. Futtasd az `infra-setup` receptet, ez lemásolja az `.env.example` fájlt `.env` néven.

```bash
just infra-setup
```

2. Amennyiben szükséges, módosítsd a `.env` fájlban a környezeti változókat.

3. Ezután futtasd az `infra-start` receptet, a containerek elindításához.

```bash
just infra-start
```

<br>
<br>

## 4. Leállítás

```bash
just infra-stop
```

<br>
<br>

## 5. Eltávolítás

```bash
just infra-remove # -v opcionális, a volume-ok törléséhez
```

<br>
<br>

## 6. Szolgáltatások elérése

### 6.1. Postgres

- Host: `localhost`
- Port: `5432`
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték

<br>

### 6.2. CloudBeaver

- URL: <http://cb.localhost> vagy <http://cb.vm1.test>
- Host: `postgres`
- Port: `5432`
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték

<br>

### 6.3. Swagger

- URL: <http://swagger.localhost> vagy <http://swagger.vm1.test>

[Full-stack web app dokumentációja - 5. API dokumentáció (Swagger)](../web/README.md#5-api-dokumentáció-swagger)
