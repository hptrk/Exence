# Exence – Frontend

Az Exence egy személyes pénzügyi webalkalmazás, az Angular 21-es veriójában fejlesztve. HTTP-n szabványon keresztül kommunikál egy Spring Boot REST API-val, és teljes egészében a böngészőben fut SPA-ként.

A felhasználó a következőket teheti:

- Tranzakciókat rögzíthet, szűrhet, és kategóriákat kezelhet
- Megtakarítási célokat és adósságokat követhet nyomon
- 37+ diagram-widgetből testreszabható statisztikai irányítópultot építhet
- Más felhasználókkal megosztott munkaterületeket kezelhet
- Admin panel platform szintű felügyelethez

Kulcsfontosságú architekturális döntések, amelyek a napi fejlesztést érintik:

- Zoneless változásdetektálás – nincs Zone.js, a signalok vezérlik az újrarenderelést
- Teljes mértékben önálló komponensek – nincsenek NgModulok
- NgRx SignalStore állapotkezeléshez
- Cookie alapú hitelesítés automatikus token-megújítással

---

## Fájlstruktúra

Az új fájl helye attól függ, mi az:

```
src/app/
├── data-model/modules/     <- csak TypeScript interfészek és enumok (logika nélkül, főleg szerver DTO-k)
│   └── <csomag>/           <- egy mappa csomagonként (transaction, debt, goal, ...)
│
├── private/                <- hitelesített funkciós oldalak
│   └── <feature>/          <- új privát oldalhoz hozz létre egy új mappát ide
│       ├── <feature>.component.ts
│       ├── <feature>.component.html
│       ├── <feature>.component.scss
│       ├── <feature>.service.ts   (ha a feature igényli)
│       └── <feature>.store.ts   (ha a feature igényli)
│
├── public/                 <- nem hitelesített oldalak (login, register, ...)
│
└── shared/                 <- újrafelhasználható elemek, amelyeket 2+ feature használ
    ├── <component>/        <- általános UI komponensek (button, data-table, ...)
    ├── <service>.service.ts          <- alkalmazásszintű szolgáltatások (http, snackbar, dialog, ...)
    ├── pipes/
	└── <pipe>.pipe.ts
    ├── auth/
	├── guard/
	      └── <guard>.guard.ts
	└── interceptors/
	      └── <interceptor>.interceptor.ts
    ├── navigation/
	└── navigation-<scope>.service.ts          <- szegmensenként (/workspace, profile, ...)
    └── <directive>.directive.ts

src/
├── unit/                   <- egységtesztek (Karma/Jasmine)
├── integration/            <- integrációs tesztek (Karma/Jasmine)
└── styles/                 <- globális SCSS (témák, változók, komponens felülbírálások)

e2e/                        <- Playwright e2e tesztek
└── <feature>/
    ├── locators/           <- szelektor segédletek (nincs inline .locator() a spec fájlokban, data-testid-t használj)
    ├── tests/              <- *.spec.ts tesztfájlok
    ├── data/               <- *.data.json tesztadatok
    └── utils/              <- beállítási/segédfüggvények
```

**Gyors elhelyezési referencia:**

| Mit                          | Hova                                   |
| ---------------------------- | -------------------------------------- |
| Új privát oldal / feature    | `src/app/private/<feature>/`           |
| Új publikus (auth) oldal     | `src/app/public/<feature>/`            |
| Újrafelhasználható komponens | `src/app/shared/<component>/`          |
| Doménosztály / interfész     | `src/app/data-model/modules/<domain>/` |
| Egységteszt                  | `src/unit/<domain>/tests/`             |
| Integrációs teszt            | `src/integration/<feature>/tests/`     |
| E2E teszt                    | `e2e/<feature>/tests/`                 |

---

## Kódolási szabályok

### Komponensek

- Minden komponens önálló (`standalone: true`).
- A szelektor előtagja `ex-` (pl. `ex-debt-list`, `ex-button`).
- Terjeszd ki a `BaseComponent`-et, ha a komponens RxJS feliratkozásokat kezel.
- Az `imports` tömbben csak azt importáld, amit a komponens közvetlenül használ.
- A feature szintű store-okat a komponens `providers`-ébe add meg, ne `root`-ba.
- Kerüld az `encapsulation` módosítását és a `::ng-deep` használatát.
- Elrendezéshez/térközökhöz használj Bootstrap segédosztályokat egyedi SCSS szabályok helyett.

### Állapotkezelés (NgRx Signals)

- Minden store a `withState -> withProps -> withMethods -> withComputed -> withHooks` összetételi sorrendet követi.
- Az aszinkron adatbetöltés a `resource()` / `rxResource()` mintát használja a `withProps`-on belül.
- A store metódusok általános CRUD igéket használnak: `updateX`, `deleteX`, `createX` (nem `renameX`, `archiveX`, stb.).
- Az `effect()` hívások a `withHooks` -> `onInit()`-ba kerülnek, nem osztálymezőkbe.
- A csak mellékhatások kiváltására használt signal-függőségek a `const _dependencies = [...]`-be kerülnek.

### Adatmodellek

- Soha ne módosítsd a `data-model/` interfészeket frontend-specifikus igényekre – hozz létre helyette helyi leképezési típust.

### HTTP

- Minden API-híváshoz használd a `HttpService`-t (nem közvetlenül a `HttpClient`-et).
- A `{ suppressErrorMessage: true }` értéket csak akkor add meg `HttpSettings`-ben, ha magad kezeled a hibát.

### Importok

- Soha ne használj inline `import('module').Type` castot – mindig add hozzá a típust a felső szintű importokhoz.

### TypeScript

- A strict mód be van kapcsolva – nincs `any`, publikus függvényeknek explicit visszatérési típus kell, nincsenek nem használt lokális változók/paraméterek.
- A szándékosan nem használt paramétereket `_` előtaggal jelöld (pl. `_event`).

### Tesztek

- A tesztek a `src/unit/` és `src/integration/` mappákban vannak, nem a forrásfájlok mellett.
- Az E2E lokátorok az `e2e/<feature>/locators/` fájlokba tartoznak – soha ne hívj `.locator()`-t inline a spec fájlokban.

### Stílusok

- A komponens stílusok hatókörrel rendelkező SCSS fájlok. A globális stílusok a `src/styles/`-ban vannak.
- Színekhez használd a meglévő CSS egyéni tulajdonságokat (`--primary-color`, stb.) – ne égesd bele a hex értékeket.
- Ha az Angular Material vagy más könyvtár komponens stílusait felül kell bírálni, hozz létre egy dedikált fájlt a `src/styles/components/<componentName>.scss` alatt, és importáld be a `styles.scss`-be.

### i18n

- Minden felhasználó felé megjelenő szövegnek Transloco fordítási kulcsot kell használnia.
- Típusbiztos kulcsépítéshez részesítsd előnyben a `BaseComponent.codeFor(prefix, suffix)` metódust.

---

## Telepítés

### Követelmények

| Eszköz  | Javasolt verzió           |
| ------- | ------------------------- |
| Node.js | 22.x                      |
| npm     | 10.x (Node 22-vel együtt) |

A Node verziók kezeléséhez az [nvm](https://github.com/nvm-sh/nvm) vagy az [fnm](https://github.com/Schniz/fnm) használata ajánlott.

### Lépések

```bash
# 1. Függőségek telepítése
npm install

# 2. Fejlesztői szerver indítása
npm start
# Az alkalmazás a http://localhost:4200 címen érhető el
# A /api/* kérések a http://localhost:8080-ra vannak proxyzva (a backendnek futnia kell)
```

> A backend API-nak helyileg a 8080-as porton kell futnia, hogy az alkalmazás működjön. A beállítási utasításokért lásd a backend repository-t.

---

## npm Scriptek

| Script                     | Parancs                                        | Leírás                                                                |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `npm start`                | `ng serve`                                     | Fejlesztői szerver indítása `http://localhost:4200`-on live reloaddal |
| `npm run build`            | `ng build`                                     | Produkciós build; kimenet a `dist/exence/` mappába kerül              |
| `npm run watch`            | `ng build --watch --configuration development` | Növekményes fejlesztői build, amely fájlváltozáskor újraépít          |
| `npm test`                 | unit -> integration -> e2e sorrendben fut      | A teljes tesztcsomag futtatása (mindhárom szint)                      |
| `npm run test:unit`        | `ng test src/unit/**`                          | Csak egységtesztek (Karma/Jasmine, egyszeri futás)                    |
| `npm run test:integration` | `ng test src/integration/**`                   | Csak integrációs tesztek (Karma/Jasmine, egyszeri futás)              |
| `npm run test:e2e`         | `npx playwright test`                          | E2E tesztek (Playwright, fej nélküli Chromium)                        |
| `npm run test:e2e:headed`  | `npx playwright test --headed`                 | E2E tesztek látható böngészővel                                       |
| `npm run test:e2e:ui`      | `npx playwright test --ui`                     | E2E tesztek az interaktív Playwright felülettel                       |
| `npm run lint:check`       | `ng lint`                                      | ESLint + Prettier ellenőrzés (írás nélkül)                            |
| `npm run lint:apply`       | `ng lint --fix`                                | ESLint automatikus javítás                                            |
| `npm run format:check`     | `prettier . --check`                           | Prettier formázásellenőrzés (írás nélkül)                             |
| `npm run format:apply`     | `prettier . --write`                           | Prettier automatikus formázás minden fájlon                           |

> Az `npm test` mindhárom szintet sorban futtatja, és az első hibánál megáll. Egyes scriptek (`test:unit`, `test:integration`, `test:e2e`) célzott futtatáshoz is használhatók.

> **Megbízhatatlan tesztek:** Egyes tesztek – különösen az E2E és integrációs tesztek – időzítési problémák miatt időnként meghibásodhatnak, nem a kód hibájából. Ha egy teszt váratlanul meghibásodik, futtasd újra, mielőtt vizsgálni kezdenéd. A Playwright konfiguráció ezért már 3 újrapróbálkozást állít be CI-ban.

---

## Amit érdemes tudni hozzájárulás előtt

- **Zoneless változásdetektálás** – nincs Zone.js. Ne támaszkodj arra, hogy a `setTimeout`/`Promise` újrarenderelést vált ki; helyette használj signalokat és `resource()`-t.
- **Proxy** – a `/api/*` a `proxy.conf.js`-en keresztül a `http://localhost:8080`-ra van proxyzva. A backendnek helyileg futnia kell.
- **Service Worker** – csak produkciós buildekben aktív (`npm run build`). A fejlesztői szerver nem aktiválja.
- **Témák** – három beépített téma (`theme-blue-dolphin`, `theme-light`, `theme-dark`). Váltás a `<html>` elemen lévő CSS osztály kapcsolásával történik; ne égesd bele a színértékeket.
- **Lusta betöltés** – minden privát útvonal `loadComponent`-et használ. A feature store-okat az útvonal szintjén add meg, ne `root`-ban.
- **Dekorátor kulcssorrend** – az ESLint érvényesíti a `selector -> templateUrl -> styleUrl -> imports -> providers` sorrendet a `@Component`-ben.
- **`imports` tömb sorrendje** – csoportosítsd a bejegyzéseket: Angular modulok (pl. `ReactiveFormsModule`) -> Material direktívák/tokenek (pl. `MatLabel`, `MatDialogClose`) -> komponensek -> direktívák -> pipe-ok.
