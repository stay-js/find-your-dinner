# Adatbázis

## Futtatás

```bash
just start-db
```

### Első indítás esetén

- Előkészületek:

```bash
just setup-db
```

- Ezt követően, környezeti változók felülírása (amennyiben szükséges) a `.env` fájlban.

- Container indítása:

```bash
just start-db
```

- Migrációk futtatása:

```bash
just migrate
```

## Leállítás

```bash
just stop-db
```

## Postgres elérése

- Host: `localhost`
- Port: `5432`
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték

## CloudBeaver elérése

- URL: <http://cb.localhost>
- Host: `postgres`
- Port: `5432`
- Adatbázis: a `.env` fájlban megadott `POSTGRES_DB` érték
- Felhasználónév: a `.env` fájlban megadott `POSTGRES_USER` érték
- Jelszó: a `.env` fájlban megadott `POSTGRES_PASSWORD` érték
