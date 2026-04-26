# Find Your Dinner. - Vizsgaremek dokumentáció

Budapesti Műszaki Szakképzési Centrum\
Neumann János Informatikai Technikum

Szoftverfejlesztő és -tesztelő (**5-0613-12-03**)

K. Papp Benjámin 13.A\
Nagy Zétény 13.A\
Polyák Panna Dorka 13.D

Budapest, 2026

<br>

## Bevezetés

Üdvözlünk a **Find Your Dinner.** dokumentációs oldalán!
Itt megtalálod az alkalmazás különböző komponenseinek leírását, telepítési útmutatókat és fejlesztői információkat.

## 📋 Linkek

- [Find Your Dinner.](https://find-your-dinner.znagy.hu) - Élő alkalmazás
- [Trello](https://trello.com/b/8IluY86i/vizsgaremek) - Projektmenedzsment és feladatkövetés
- [Figma](https://www.figma.com/design/zaDlDEk8JzH6Fh6TtaQZbu/Find-Your-Dinner.) - UI/UX design tervezés

## ⚙️ Fejlesztői dokumentáció

- [Infrastruktúra / Fejlesztői környezet dokumentációja](infra/README.md)
- [Full-stack web app dokumentációja](web/README.md)
- [Tesztelési jegyzőkönyv](docs/testing_report.md)

## Előfeltételek

- [Docker](https://www.docker.com/) - Az infra konténerek futtatásához.
- [Node.js](https://nodejs.org/) (LTS) + [pnpm](https://pnpm.io/) vagy npm - A full-stack web app függőségeinek kezeléséhez és futtatásához.
- [Just](https://github.com/casey/just) - A receptek futtatásához. (Vagy manuálisan a `justfile`-ból kimásolva is végrehajthatóak a receptek.)

## Justfile (~ Makefile alternatíva)

[Just](https://github.com/casey/just) telepítése után:

- Elérhető receptek listázása: `just --list`
- Alapértelmezett recept futtatása: `just` vagy `just default`

## Első indítás

1. Futtasd az `infra-setup` receptet, ez lemásolja az `infra/.env.example` fájlt `infra/.env` néven.

```bash
just infra-setup
```

2. Ezután futtasd az `infra-start` receptet, a containerek elindításához.

```bash
just infra-start
```

3. Ezt követően futtasd a `setup` receptet, ez lemásolja a `web/.env.example` fájlt `web/.env` néven, valamint letölti a szükséges függőségeket.

```bash
just setup
```

4. Hozz létre egy új [Clerk](https://clerk.com/) projektet (ez a felhasználókezeléshez szükséges), majd a kapott API kulcsokkal írd felül a `web/.env` fájlban a következő sorokat:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

5. Futtasd az adatbázis migrációkat a `migrate` recepttel.

```bash
just migrate
```

6. Indítsd el a fejlesztői szervert a `dev` receptettel. Miután a szerver elindult, a böngészőben a <http://localhost:3000> címen érheted el az alkalmazást.

```bash
just dev
```

7. Hozz létre egy új fiókot, majd a [Clerk dashboard](https://dashboard.clerk.com/)-on keresd meg a létrehozott fiókhoz tartozó azonosítót.
8. Ezután egészítsd ki a `web/scripts/seeders/seed-admins.ts` fájl `data` tömbjét a felhasználó azonosítójával.
9. Végezetül futtasd a `seed` receptet, az adatbázis feltöltéséhez.

```bash
just seed
```
