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

Üdvözlünk a **Find Your Dinner.** dokumentációs oldalán! Itt megtalálod az alkalmazás különböző komponenseinek leírását, telepítési útmutatókat, fejlesztői információkat, valamit az alkalmazáshoz tartozó részletes felhasználói dokumentációt (használati útmutató).

A **Find Your Dinner.** egy receptes alkalmazás, amely lehetővé teszi a felhasználók számára, hogy a rendelkezésükre álló hozzávalók alapján keressenek recepteket, ezzel elkerülve a felesleges bevásárlást. A keresési oldalon pedig a szelektálási és verseny funkciók segítenek leegyszerűsíteni a nap legnehezebb döntését.

<br>

## 📋 Linkek

- [Find Your Dinner.](https://find-your-dinner.znagy.hu) - Élő alkalmazás
- [GitHub repository](https://github.com/stay-js/find-your-dinner) - Forráskód és dokumentáció
- [Felhasználói dokumentáció](docs/user-documentation.md) - A web app használatával kapcsolatos információk, használati útmutató
- [Trello](https://trello.com/b/8IluY86i/vizsgaremek) - Projektmenedzsment és feladatkövetés
- [Figma](https://www.figma.com/design/zaDlDEk8JzH6Fh6TtaQZbu/Find-Your-Dinner.) - UI/UX design tervezés

<br>

## ⚙️ Fejlesztői dokumentáció

- [Infrastruktúra / Fejlesztői környezet dokumentációja](infra/README.md)
- [Full-stack web app dokumentációja](web/README.md)
- [Tesztelési jegyzőkönyv](docs/testing-report.md)

<br>

## Előfeltételek

- [Docker](https://www.docker.com/) - Az infra konténerek futtatásához.
- [Node.js](https://nodejs.org/) (`v24.x LTS`) + [pnpm](https://pnpm.io/) - A full-stack web app függőségeinek kezeléséhez és futtatásához.
- [Just](https://github.com/casey/just) (`>1.46.0`, Ubuntu 24.04 (NeuDockerBase2025) esetén az `apt install just` régebbi, nem támogatott verziót telepít) - A receptek futtatásához. (Vagy manuálisan a `justfile`-ból kimásolva is végrehajthatóak a receptek.)

[NeuDockerBase2025 előkészítése](docs/neu-docker-base-2025-prep.md) - Ha a NeuDockerBase2025 környezetet használod, kövesd ezt az útmutatót a szükséges eszközök telepítéséhez.

<br>

## Justfile (~ Makefile alternatíva)

[Just](https://github.com/casey/just) telepítése után:

- Elérhető receptek listázása: `just --list`
- Alapértelmezett recept futtatása: `just` vagy `just default`

<br>

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

7. Hozz létre egy új fiókot (lsd.: [Find Your Dinner. - Felhasználói dokumentáció, Fiók létrehozása](docs/user-documentation.md#11-fiók-létrehozása)), majd a [Clerk dashboard](https://dashboard.clerk.com/)-on keresd meg a létrehozott fiókhoz tartozó azonosítót.
8. Ezután egészítsd ki a `web/scripts/seeders/seed-admins.ts` fájl `data` tömbjét a felhasználó azonosítójával.
9. Végezetül futtasd a `seed` receptet, az adatbázis feltöltéséhez.

```bash
just seed
```

<br>

## Teszteléssel kapcsolatos információk

- [Tesztelési jegyzőkönyv](docs/testing-report.md)
- [API tesztek](web/README.md#81-api-tesztek-vitest)
- [Unit tesztek](web/README.md#82-unit-tesztek-vitest)
- [E2E tesztek](web/README.md#83-e2e-tesztek-playwright)
- [Manuális tesztek](web/README.md#84-manuális-tesztek)
