# Find Your Dinner. - Infrastruktúra / Fejlesztői környezet

## Futtatás

```bash
just start-infra
```

### Első indítás esetén

- Előkészületek:

```bash
just setup-infra
```

- Ezt követően, környezeti változók felülírása (amennyiben szükséges) a `.env` fájlban.

- Containerek indítása:

```bash
just start-infra
```

- Migrációk futtatása:

```bash
just migrate
```

## Leállítás

```bash
just stop-infra
```

## Eltávolítás

```bash
just remove-infra # -v opcionális, a volume-ok törléséhez
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
