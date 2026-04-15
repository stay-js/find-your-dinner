import Link from 'next/link';

export const metadata = {
  description:
    'Ez az oldal részletesen bemutatja, hogy hogyan kezeljük a Find Your Dinner alkalmazásban a személyes adatokat, milyen jogok illetnek meg téged, és milyen intézkedéseket teszünk az adataid védelme érdekében.',
  path: '/privacy',
  title: 'Adatkezelési tájékoztató',
};

export default function PrivacyPage() {
  return (
    <div className="container flex h-full flex-col gap-12 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Adatkezelési tájékoztató</h1>
        <p className="text-muted-foreground text-sm">Utoljára frissítve: 2026. április. 15.</p>
      </div>

      <div className="flex flex-col gap-8">
        <Section title="Áttekintés">
          <p>
            A Find Your Dinner. csapata (továbbiakban &quot;mi&quot;) üzemelteti ezt a
            webalkalmazást. Ez a tájékoztató ismerteti, hogy milyen adatokat gyűjtünk, hogyan
            használjuk fel azokat, és milyen jogok illetnek meg az adataiddal kapcsolatban. Csak a
            szolgáltatás működéséhez szükséges adatokat gyűjtjük, és NEM adjuk el azokat!
          </p>
        </Section>

        <Section title="Kezelt adatok">
          <p>
            <span className="text-foreground font-medium">Fiókadatok:</span> A felhasználói fiókok
            kezelését a{' '}
            <Link
              className="text-foreground underline underline-offset-4"
              href="https://clerk.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Clerk
            </Link>{' '}
            harmadik féltől származó szolgáltatás végzi. Regisztráció során a Clerk a következő
            adatokat gyűjti és tárolja a saját szerverein: e-mail-cím, jelszó (hashelve), név és
            profilkép. Ezekhez az adatokhoz a Clerk a saját adatkezelési tájékoztatója szerint
            férhetsz hozzá: részletekért látogass el a{' '}
            <Link
              className="text-foreground underline underline-offset-4"
              href="https://clerk.com/legal/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              clerk.com/legal/privacy
            </Link>{' '}
            oldalra. A mi adatbázisunkban kizárólag a Clerk által generált egyedi felhasználói
            azonosítót tároljuk!
          </p>
          <p>
            <span className="text-foreground font-medium">Általad létrehozott tartalom:</span> A
            platformra feltöltött receptek és egyéb tartalmak a saját szervereinken kerülnek
            tárolásra, hogy te és mások is hozzáférhessenek.
          </p>
          <p>
            <span className="text-foreground font-medium">Beállítások és preferenciák:</span> Az
            alkalmazásban mentett személyes beállításokat, például: az alapértelmezett hozzávalóidat
            és a kedvenc recepteidet a saját adatbázisunkban tároljuk, a Clerk felhasználói
            azonosítódhoz rendelve.
          </p>
          <p>
            <span className="text-foreground font-medium">Használati adatok:</span> A szabványos
            szerver-naplók (IP-cím, böngészőtípus, meglátogatott oldalak, időbélyegek) biztonsági és
            hibakeresési célból kerülnek megőrzésre a{' '}
            <Link
              className="text-foreground underline underline-offset-4"
              href="https://vercel.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vercel
            </Link>{' '}
            szerverein. Ezek az adatok nincsenek összekapcsolva a felhasználói fiókoddal, és nem
            használjuk őket profilozásra vagy reklámozásra. Ezzel kapcsolatban további
            információkért látogass el a következő oldalra:{' '}
            <Link
              className="text-foreground underline underline-offset-4"
              href="https://vercel.com/legal/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              vercel.com/legal/privacy-policy
            </Link>
            .
          </p>
        </Section>

        <Section title="Az adatok felhasználása">
          <p>Az összegyűjtött adatokat a következő célokra használjuk:</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>Fiókkezelés (a Clerk szolgáltatásán keresztül).</li>
            <li>A recepteid és mentett tartalmaid tárolása és kiszolgálása.</li>
            <li>Technikai problémák diagnosztizálása és a szolgáltatás fejlesztése.</li>
            <li>Jogszabályi kötelezettségek teljesítése.</li>
          </ul>
          <p>
            Adataidat nem használjuk reklámozáshoz, és nem osztjuk meg harmadik féllel (a Clerk
            kivételével, ami a felhasználói fiókok kezelését végzi).
          </p>
        </Section>

        <Section title="Böngésző tárhelye">
          <p>
            Az alkalmazás a böngésző helyi tárhelyén és cookie-kban tárolja a preferált színsémádat
            (világos, sötét vagy rendszer), illetve az oldalsáv állapotát. A Clerk munkamenet
            kezeléséhez saját, biztonságos HTTP-only cookie-kat használ. Nyomkövető sütiket nem
            alkalmazunk.
          </p>
        </Section>

        <Section title="Adatmegőrzés">
          <p>
            A fiókhoz kapcsolódó adataidat (receptek, beállítások, mentett tartalmak) a fiók aktív
            ideje alatt őrizzük meg. A fiókod törlésekor az alkalmazásunkban tárolt személyes
            adataidat (a recepteiden kívül) 30 napon belül véglegesen töröljük. A Clerk által tárolt
            fiókadatok (e-mail, jelszó, név) törlését a fiókkezelő felületen kezdeményezheted,
            ezeket a Clerk a saját adatmegőrzési szabályzata szerint kezeli.
          </p>
        </Section>

        <Section title="A te jogaid">
          <p>Jogod van:</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>Hozzáférni az általunk tárolt személyes adataidhoz.</li>
            <li>
              Pontatlan adatok helyesbítéséhez (a profil szerkesztésével vagy kapcsolatfelvétellel).
            </li>
            <li>A fiókod és a kapcsolódó adatok törlésének kérelmezéséhez.</li>
            <li>A recepteid exportálásához.</li>
          </ul>
          <p>
            A Clerk által kezelt adatokhoz (e-mail, jelszó, profilkép) a fiókbeállítások oldalán
            férhetsz hozzá és módosíthatod azokat.
          </p>
        </Section>

        <Section title="Biztonság">
          <p>
            Ipari szabványú intézkedéseket alkalmazunk az adataid védelméhez, beleértve a
            titkosított kapcsolatokat (HTTPS) és a Clerk által biztosított, iparági legjobb
            gyakorlatoknak megfelelő jelszókezelést. Az interneten keresztüli adatátvitel egyetlen
            módja sem 100%-ig biztonságos, de megtesszük a megfelelő óvintézkedéseket.
          </p>
        </Section>

        <Section title="A tájékoztató módosításai">
          <p>
            Időről időre frissíthetjük ezt a tájékoztatót. Amikor ez megtörténik, az oldal tetején
            lévő &quot;utoljára frissítve&quot; dátum megváltozik. A Find Your Dinner. folyamatos
            használata a módosítások közzétételét követően a frissített tájékoztató elfogadásának
            minősül.
          </p>
        </Section>

        <Section title="Kapcsolat">
          <p>
            Ha kérdésed, észrevételed van, nyiss egy issue-t a nyilvános{' '}
            <Link
              className="text-foreground underline underline-offset-4"
              href="https://github.com/stay-js/find-your-dinner"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub repository
            </Link>
            -nkban.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-muted-foreground flex flex-col gap-2">{children}</div>
    </section>
  );
}
