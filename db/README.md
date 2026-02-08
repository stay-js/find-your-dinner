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

## MySQL elérése

- Host: `localhost`
- Port: `3306`
- Felhasználónév: a `.env` fájlban megadott `MYSQL_USER` érték
- Jelszó: a `.env` fájlban megadott `MYSQL_PASSWORD` érték
- Adatbázis: a `.env` fájlban megadott `MYSQL_DATABASE` érték

## PHPMyAdmin elérése

- URL: <http://localhost:8080>
- Szerver: üresen hagyható, amennyiben az `.env` fájlban meg van adva a `PMA_HOST` érték
- Felhasználónév: a `.env` fájlban megadott `MYSQL_USER` érték
- Jelszó: a `.env` fájlban megadott `MYSQL_PASSWORD` érték
