# Find Your Dinner. - Full-stack web app dokumentációja

## Adatbázis séma

![Adatbázis séma](docs/media/db.png)

### Adatbázis séma generálása

1. Futtasd a `dbml` receptet, ami létrehozza a `web/schema.dbml` fájlt az adatbázis séma alapján.

```bash
just dbml
```

2. Ezután töltsd fel a `web/schema.dbml` fájlt a [dbdiagram.io](https://dbdiagram.io/) oldalra, majd töltsd le a generált képet és írd felül a `docs/media/db.png`-t.
