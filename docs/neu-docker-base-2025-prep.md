# Find Your Dinner. - NeuDockerBase2025 előkészítése

<br>

## Tartalomjegyzék

- [1. Node.js és pnpm telepítése](#1-nodejs-és-pnpm-telepítése)
- [2. Just telepítése](#2-just-telepítése)
  - [2.1 Just telepítése Cargo segítségével](#21-just-telepítése-cargo-segítségével)

<br>
<br>

## 1. Node.js és pnpm telepítése

1. [Node.js](https://nodejs.org/en/) és [pnpm](https://pnpm.io/) telepítéséhez látogass el a Node.js hivatalos oldalán a [Telepítés](https://nodejs.org/en/download) szekcióra.
2. Válaszd ki az **LTS** (`Long Term Support`) verziót, **Linux**-ra **fnm** segítségével, **pnpm**-mel.
3. Majd kövessd az oldalon megjelenő utasításokat.

<br>
<br>

## 2. Just telepítése

> Mivel `Ubuntu 24.04`-en az `apt install just` régebbi (`1.21.0`), nem támogatott verziót telepít, ezért manuálisan kell telepíteni a Just-ot.

1. [Just](https://github.com/casey/just) telepítéséhez látogass el a Just hivatalos GitHub oldalára.
2. Kövesd a [Pre-Built Binaries](https://github.com/casey/just#pre-built-binaries) szekcióban található utasításokat, vagy telepítsd **Cargo** segítségével, ehhez kövesd a lenti lépéseket [2.1. Just telepítése Cargo segítségével](#21-just-telepítése-cargo-segítségével).

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
