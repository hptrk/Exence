# Exence – Pénzügyi adatkezelő backend

Spring Boot 3.4.1 / Java 23 alapú REST API személyes pénzügyi menedzsmenthez. Egy különálló Angular frontend alkalmazás számára biztosít közel 90 végpontot 21 controlleren keresztül.

## Rendszerkövetelmények

| Komponens | Minimális verzió |
|---|---|
| Java Development Kit (JDK) | 23 |
| Docker Engine / Desktop | 24.0 |
| Docker Compose | 2.20 |

Gradle-t nem szükséges külön telepíteni — a projekt tartalmaz Gradle Wrapper szkriptet (`gradlew`), amely első futáskor automatikusan letölti a megfelelő verziót.

Hardveres minimumkövetelmény: 4 GB RAM, 2 GB szabad tárhely, 2015 után gyártott kétmagos x86-64 processzor.

## Telepítés és indítás

### 1. Adatbázis indítása Dockerrel

Az alkalmazás PostgreSQL 16 adatbázist és Maildev e-mail szervert használ, amelyeket a mellékelt Docker Compose konfiguráció hoz létre:

```bash
cd technical/exence-docker
docker compose up -d
cd ../..
```

A `-d` kapcsoló háttérben indítja a konténereket. Az alapértelmezett kapcsolódási paraméterek:

| Paraméter | Alapértelmezett érték |
|---|---|
| Adatbázis host | `localhost` |
| Adatbázis port | `5432` |
| Adatbázis neve | `exence_db` |
| Felhasználónév | `exencedev` |
| Jelszó | `exencepwd` |
| Maildev Web UI | `http://localhost:6808` |
| Maildev SMTP port | `6800` |

Ezek a paraméterek környezeti változókkal felülírhatók (pl. `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).

### 2. Az alkalmazás fordítása és indítása

```bash
./gradlew bootRun
```

Sikeres indítás után az alkalmazás a **8080-as porton** fogadja a HTTP-kéréseket.

Az alapértelmezett aktív profil `dev`, amelyben az alkalmazás automatikusan betölti a tesztadatokat a `src/main/resources/db/changelog/data/test-data.yaml` fájlból.

### Önálló `.jar` készítése

```bash
./gradlew bootJar
```

A lefordított `.jar` a `build/libs/` könyvtárban keletkezik, és `java -jar` paranccsal futtatható.

## API dokumentáció

Az alkalmazás indítása után az interaktív OpenAPI dokumentáció (RapiDoc) a következő címen érhető el:

```
http://localhost:8080/docs.html
```

A felületen szűrhető és kipróbálható az összes REST-végpont anélkül, hogy külső eszközre (pl. Postman) lenne szükség.

## Hasznos Gradle-parancsok

```bash
# Tesztek futtatása
./gradlew test

# Egyetlen tesztosztály futtatása
./gradlew test --tests "com.exence.finance.validators.PasswordValidatorTest"

# Kódformázás alkalmazása (Palantir Java Format)
./gradlew spotlessApply

# Formázás ellenőrzése alkalmazás nélkül
./gradlew spotlessCheck

# Checkstyle futtatása
./gradlew checkstyleMain
```

## Konfiguráció

Az alkalmazás az `src/main/resources/application.yml` fájlból olvassa az alapértelmezett konfigurációt. A beállítások környezeti változókkal felülírhatók:

| Környezeti változó | Leírás | Alapértelmezett |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Aktív Spring profil (`dev` / `prod`) | `dev` |
| `DB_HOST` | Adatbázis host | `localhost` |
| `DB_PORT` | Adatbázis port | `5432` |
| `DB_NAME` | Adatbázis neve | `exence_db` |
| `DB_USERNAME` | Adatbázis felhasználónév | `exencedev` |
| `DB_PASSWORD` | Adatbázis jelszó | `exencepwd` |
| `JWT_SECRET` | JWT aláíró kulcs | *(fejlesztői alapértelmezett)* |
| `MAIL_HOST` | SMTP szerver host | `localhost` |
| `MAIL_PORT` | SMTP szerver port | `6800` |
| `FRONTEND_URL` | Frontend alkalmazás URL-je (CORS) | `http://localhost:4200` |

## Modulstruktúra

```
com.exence.finance
├── modules/
│   ├── auth          – Hitelesítés, JWT tokenek, munkamenet-kezelés
│   ├── category      – Tranzakciókategóriák
│   ├── transaction   – Pénzügyi tranzakciók, dinamikus szűrés
│   ├── statistics    – Dashboard widgetek (~35 adatszolgáltató)
│   └── email         – E-mail küldés és sablonkezelés
├── common/           – Validátorok, kivételek, DTO-k, aspektusok
├── config/           – Spring konfigurációs osztályok
└── security/         – JWT filter, e-mail verifikációs interceptor
```

## Technológiai stack

- **Java 23** virtuális szálakkal (Project Loom)
- **Spring Boot 3.4.1** (Spring Security, Spring Data JPA, Spring Mail)
- **PostgreSQL 16** – Liquibase migrációkkal, materializált nézetekkel
- **QueryDSL** – dinamikus lekérdezések
- **MapStruct** – DTO-entitás leképezés
- **Lombok** – boilerplate csökkentés
- **JaVers** – mezőszintű audit napló
- **Argon2id** – jelszókivonatolás
