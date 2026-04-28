# Find Your Dinner. - NeuDockerBase2025 előkészítése

<br>

## Tartalomjegyzék

- [1. Node.js és pnpm telepítése](#1-nodejs-és-pnpm-telepítése)
- [2. Just telepítése](#2-just-telepítése)
  - [2.1 Just telepítése Cargo segítségével](#21-just-telepítése-cargo-segítségével)
- [3. Port továbbítás](#3-port-továbbítás)

<br>
<br>

## 1. Node.js és pnpm telepítése

1. [Node.js](https://nodejs.org/en/) és [pnpm](https://pnpm.io/) telepítéséhez látogass el a Node.js hivatalos oldalán a [Telepítés](https://nodejs.org/en/download) szekcióra.
2. Válaszd ki a **v24.x LTS** (`Long Term Support`) verziót, **Linux**-ra **fnm** segítségével, **pnpm**-mel.
3. Majd kövessd az oldalon megjelenő utasításokat.

<br>
<br>

## 2. Just telepítése

> Mivel `Ubuntu 24.04` esetén az `apt install just` régebbi (`1.21.0`), nem támogatott verziót telepít, ezért manuálisan kell telepíteni a Just-ot.

1. [Just](https://github.com/casey/just) telepítéséhez látogass el a Just hivatalos GitHub oldalára.
2. Kövesd a [Pre-Built Binaries](https://github.com/casey/just#pre-built-binaries) szekcióban található utasításokat, vagy telepítsd Cargo segítségével: [2.1. Just telepítése Cargo segítségével](#21-just-telepítése-cargo-segítségével).

<br>

### 2.1 Just telepítése Cargo segítségével

1. Először telepítsd a **build-essential** csomagot, amely tartalmazza a Just fordításához szükséges eszközöket:

```bash
sudo apt update
sudo apt install build-essential
```

2. Ezt követően telepítsd a [Rust](https://rust-lang.org/) programozási nyelvet, [rustup](https://rustup.rs/) segítségével.
3. Végezetül telepítsd a Just-ot:

```bash
cargo install just
```

<br>
<br>

## 3. Port továbbítás

A projekt a `3000`-es portot használja, ezért szükséges egy új port továbbítási szabály beállítása VirtualBox-ban, hogy a host gépről is elérhető legyen az alkalmazás.

1. Nyisd meg a VirtualBox-ot, és válaszd ki a futó virtuális gépet.
2. Nyisd meg a "Konfigurálás" menüt.
3. A fejlécben válaszd ki a "Szakértő" módot.
4. Majd az oldalsávban válaszd ki a "Hálózat" szekciót.
5. Kattints a "Port továbbítása" gombra.
6. Végezetül adj hozzá egy új szabályt a következő beállításokkal:
   - **Protokoll:** `TCP`
   - **Gazda IP:** `127.0.0.1`
   - **Gazda port:** `3000`
   - **Vendég port:** `3000`
