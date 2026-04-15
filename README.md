# 📋 Find Your Dinner. – Dokumentáció

Üdvözlünk a **Find Your Dinner.** dokumentációs oldalán!
Itt megtalálod az alkalmazás különböző komponenseinek leírását, telepítési útmutatókat és fejlesztői információkat.

## ⚙️ Fejlesztői dokumentáció

- [Infrastruktúra / Fejlesztői környezet dokumentációja](infra/README.md)
- [Full-stack web app dokumentációja](web/README.md)

## Justfile

[Just](https://github.com/casey/just) telepítése után:

- Elérhető receptek listázása: `just --list`
- Alapértelmezett recept futtatása: `just` vagy `just default`

## Első indítás

0. A parancsok futtatásához szükséges a [Just](https://github.com/casey/just).

1. Futtasd le az `infra-setup` parancsot, ez lemásolja az `infra/.env.example` fájlt `infra/.env` néven.

```bash
just infra-setup
```

2. Ezután futtasd le a `infra-start` parancsot, a konténerek elindításához.

```bash
just infra-start
```

3. Ezt követően futtasd le a `setup` parancsot, ez lemásolja a `web/.env.example` fájlt `web/.env` néven, valamit letölti a szükséges függőségeket.

```bash
just setup
```

4. Hozz létre egy új [Clerk](https://clerk.com/) projektet (ez az autentikációhoz szükséges), majd a kapott API kulcsokkal írd felül a `web/.env` fájlban a következő sorokat:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

5. Futtasd le az adatbázis migrációkat a `migrate` paranccsal.

```bash
just migrate
```

6. Indítsd el a fejlesztői szervert a `just dev` paranccsal. Miután a szerver elindult, a böngészőben a <http://localhost:3000> címen érheted el az alkalmazást.

```bash
just dev
```

7. Hozz létre egy új fiókot, majd a [Clerk dashboard](https://dashboard.clerk.com/)-on keresd meg a létrehozott fiókhoz tartozó azonosítót.
8. Ezután egészítsd ki a `web/scripts/seeders/seed-admins.ts` fájl `data` tömbjét a felhasználó azonosítójával.
9. Végezetül futtasd le a `seed` parancsot, az adatbázis feltöltéséhez.

```bash
just seed
```
