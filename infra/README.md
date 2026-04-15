# Find Your Dinner. - Infrastruktúra / Fejlesztői környezet

A receptek futtatásához szükséges a [Just](https://github.com/casey/just) telepítése. (Vagy manuálisan a `justfile`-ból kimásolva is végrehajthatóak a receptek.)

## Indítás

```bash
just infra-start
```

### Első indítás esetén

1. Futtasd le az `infra-setup` receptet, ez lemásolja az `.env.example` fájlt `.env` néven.

```bash
just infra-setup
```

2. Amennyiben szükséges, módosítsd a `.env` fájlban a környezeti változókat.

3. Ezután futtasd le az `infra-start` receptet, a containerek elindításához.

```bash
just infra-start
```

## Leállítás

```bash
just infra-stop
```

## Eltávolítás

```bash
just infra-remove # -v opcionális, a volume-ok törléséhez
```

## Postgres elérése

- Host: `localhost`
- Port: `5432`
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték

## CloudBeaver elérése

- URL: <http://cb.localhost> vagy <http://cb.vm1.test>
- Host: `postgres`
- Port: `5432`
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték

## Swagger elérése

- URL: <http://swagger.localhost> vagy <http://swagger.vm1.test>
