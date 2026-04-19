# Integration Test User Stories

Csoportosítva flow-k szerint. Minden story RestAssured-alapú integrációs tesztnek van szánva.

---

## 1. Auth Flow

### Regisztráció
- **US-AUTH-01** — Felhasználó sikeresen regisztrál érvényes adatokkal (username, email, password, confirmPassword, workspaceName, baseCurrency): HTTP 200, response tartalmaz userId-t és username-t, cookie-ban access_token és refresh_token megjelenik.
- **US-AUTH-02** — Regisztráció után a felhasználó `isVerified = false` állapotban van, a GET /user endpoint visszaadja ezt.
- **US-AUTH-03** — Regisztráció már használt email-lel: HTTP 409, hibakód `EMAIL_ALREADY_IN_USE`.
- **US-AUTH-04** — Regisztráció érvénytelen jelszóval (pl. csak kisbetűk, 7 karakter): HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-05** — Regisztráció nem egyező jelszó és confirmPassword esetén: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-06** — Regisztráció üres workspace névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-07** — Regisztráció 101 karakteres workspace névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-08** — Regisztráció nem létező baseCurrency értékkel (pl. `"XYZ"`): HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-09** — Sikeres regisztrációnál automatikusan létrejön az első workspace és alapértelmezett dashboard widgetek.

### Bejelentkezés
- **US-AUTH-10** — Felhasználó sikeresen bejelentkezik érvényes email + jelszó kombinációval: HTTP 200, access_token és refresh_token cookie-ban.
- **US-AUTH-11** — Bejelentkezés hibás jelszóval: HTTP 401, hibakód `AUTHENTICATION_FAILED`.
- **US-AUTH-12** — Bejelentkezés nem létező email-lel: HTTP 401, hibakód `AUTHENTICATION_FAILED`.
- **US-AUTH-13** — Bejelentkezés ugyanarról az eszközről (azonos user-agent + IP) revoke-olja az előző session-t, az előző access_token érvénytelen lesz.
- **US-AUTH-14** — Bejelentkezés üres email mezővel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-15** — Bejelentkezés üres jelszóval: HTTP 400, hibakód `VALIDATION_ERROR`.

### Token megújítás
- **US-AUTH-16** — Érvényes refresh_token-nel POST /auth/refresh-token: HTTP 204, új access_token cookie-ban megjelenik.
- **US-AUTH-17** — Lejárt vagy érvénytelen refresh_token-nel POST /auth/refresh-token: HTTP 401, hibakód `JWT_TOKEN_EXPIRED` vagy `INVALID_TOKEN`.
- **US-AUTH-18** — Revokált refresh_token-nel (kijelentkezett eszköz) megújítás kísérlete: HTTP 401.

### Email verifikáció
- **US-AUTH-19** — Érvényes verification token-nel POST /auth/verify-email: HTTP 204, GET /user visszaad `isVerified = true`.
- **US-AUTH-20** — Már verifikált felhasználón újra verifikálás kísérlete: HTTP 409, hibakód `EMAIL_ALREADY_VERIFIED`.
- **US-AUTH-21** — Érvénytelen/lejárt verification token: HTTP 401, hibakód `INVALID_TOKEN` vagy `JWT_TOKEN_EXPIRED`.
- **US-AUTH-22** — POST /user/request-verify-email nem verifikált felhasználónak: HTTP 204, sikeres (új token kiküldés).
- **US-AUTH-23** — POST /user/request-verify-email már verifikált felhasználónak: HTTP 409, hibakód `EMAIL_ALREADY_VERIFIED`.

### Jelszó-visszaállítás
- **US-AUTH-24** — POST /auth/forgot-password létező email-lel: HTTP 204, rate-limit nélkül.
- **US-AUTH-25** — POST /auth/forgot-password nem létező email-lel: HTTP 204 (security by design, nem derül ki a hiány).
- **US-AUTH-26** — POST /auth/forgot-password kétszer egymás után rövid időn belül: HTTP 429, hibakód `TOO_MANY_EMAILS`.
- **US-AUTH-27** — Érvényes reset token-nel POST /auth/reset-password új jelszóval: HTTP 204, a régi jelszó utána nem működik.
- **US-AUTH-28** — Jelszó-visszaállítás után az összes access_token és refresh_token érvénytelenné válik (pl. korábbi GET /user 401-et ad vissza).
- **US-AUTH-29** — Reset password érvénytelen token-nel: HTTP 401, hibakód `INVALID_TOKEN`.
- **US-AUTH-30** — Reset password gyenge jelszóval: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-AUTH-31** — Reset password korábbi jelszóval (password history): HTTP 400, hibakód `INVALID_PASSWORD`.

---

## 2. Session Management Flow

- **US-SESSION-01** — GET /sessions bejelentkezett felhasználónak visszaadja az aktív sessionöket, a jelenlegi session `isCurrent = true`.
- **US-SESSION-02** — Két különböző "eszközről" (különböző User-Agent fejléc) bejelentkezve mindkét session megjelenik a GET /sessions listában.
- **US-SESSION-03** — DELETE /sessions/{sessionId} revokálja a megadott session-t; a revokált session-ből érkező kérés 401-et ad.
- **US-SESSION-04** — DELETE /sessions/others revokálja az összes többi session-t a jelenlegi kivételével; a jelenlegi session továbbra is működik.
- **US-SESSION-05** — Nem autentikált felhasználó GET /sessions: HTTP 401.
- **US-SESSION-06** — Nem létező sessionId-vel DELETE /sessions/{sessionId}: nem ad hibát (idempotens törlés) vagy 404.

---

## 3. User Profile Flow

- **US-USER-01** — GET /user bejelentkezett felhasználónak visszaadja az id-t, username-t, email-t, isVerified-ot, role-t.
- **US-USER-02** — PATCH /user érvényes username-mel frissíti a nevet; GET /user utána az új nevet adja vissza.
- **US-USER-03** — PATCH /user érvénytelen username-mel (pl. speciális karakterek): HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-USER-04** — POST /user/change-password helyes régi jelszóval, érvényes új jelszóval: HTTP 204, régi jelszóval utána nem lehet bejelentkezni.
- **US-USER-05** — POST /user/change-password hibás régi jelszóval: HTTP 400, hibakód `INVALID_PASSWORD`.
- **US-USER-06** — POST /user/change-password után az összes token érvénytelenné válik (forced re-login).
- **US-USER-07** — POST /user/change-password jelszó-előzménnyel megegyező új jelszóval: HTTP 400, hibakód `INVALID_PASSWORD`.
- **US-USER-08** — DELETE /user: HTTP 204, utána GET /user 401-et ad (user nem létezik).
- **US-USER-09** — Nem autentikált hívás GET /user: HTTP 401.

---

## 4. User Settings Flow

- **US-USETTINGS-01** — GET /user/settings visszaadja a language, primaryTheme, secondaryTheme, baseCurrency, showBaseCurrency mezőket.
- **US-USETTINGS-02** — PATCH /user/settings érvényes language értékkel frissíti a beállítást; GET /user/settings az új értéket adja vissza.
- **US-USETTINGS-03** — PATCH /user/settings érvényes primaryTheme értékkel frissíti a beállítást.
- **US-USETTINGS-04** — PATCH /user/settings érvénytelen language kóddal: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-USETTINGS-05** — PATCH /user/settings részleges frissítés (csak showBaseCurrency): a többi mező változatlan marad.

---

## 5. Workspace Management Flow

### Alapműveletek
- **US-WS-01** — POST /workspaces érvényes névvel és baseCurrency-vel létrehoz egy workspace-t; a válasz tartalmaz id-t, nevet, currency-t és OWNER role-t.
- **US-WS-02** — GET /workspaces visszaadja az összes workspace-t ahol a user tag, beleértve az OWNER/MEMBER szerepkört.
- **US-WS-03** — PATCH /workspaces/{id} érvényes névvel átnevezi a workspace-t (owner-nek).
- **US-WS-04** — PATCH /workspaces/{id} MEMBER szerepkörű userrel: HTTP 403, hibakód `WORKSPACE_OWNER_REQUIRED`.
- **US-WS-05** — DELETE /workspaces/{id} az owner által: HTTP 204.
- **US-WS-06** — DELETE /workspaces/{id} MEMBER szerepkörű userrel: HTTP 403, hibakód `WORKSPACE_OWNER_REQUIRED`.
- **US-WS-07** — DELETE /workspaces/{id} ha ez az egyetlen workspace: HTTP 409, hibakód `WORKSPACE_CANNOT_DELETE_LAST`.
- **US-WS-08** — Nem létező workspace ID-vel PATCH/DELETE: HTTP 404, hibakód `WORKSPACE_NOT_FOUND`.
- **US-WS-09** — POST /workspaces 101 karakteres névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-WS-10** — POST /workspaces üres névvel: HTTP 400, hibakód `VALIDATION_ERROR`.

### Tag-kezelés
- **US-WS-11** — POST /workspaces/{id}/members érvényes email-lel (létező user) hozzáadja a usert MEMBER szerepkörrel.
- **US-WS-12** — POST /workspaces/{id}/members már tag userrel: HTTP 409, hibakód `WORKSPACE_MEMBER_ALREADY_EXISTS`.
- **US-WS-13** — POST /workspaces/{id}/members nem létező email-lel: HTTP 404, hibakód `USER_NOT_FOUND`.
- **US-WS-14** — POST /workspaces/{id}/members MEMBER szerepkörű userrel (nem owner): HTTP 403, hibakód `WORKSPACE_OWNER_REQUIRED`.
- **US-WS-15** — GET /workspaces/{id}/members visszaadja az összes tagot a szerepkörükkel.
- **US-WS-16** — DELETE /workspaces/{id}/members (owner eltávolít egy MEMBER-t): HTTP 204, GET members listából eltűnik.
- **US-WS-17** — DELETE /workspaces/{id}/members az owner saját magát próbálja eltávolítani: HTTP 409, hibakód `WORKSPACE_OWNER_CANNOT_BE_REMOVED`.
- **US-WS-18** — DELETE /workspaces/{id}/members/me MEMBER-ként (kilépés): HTTP 204.
- **US-WS-19** — DELETE /workspaces/{id}/members/me OWNER-ként: HTTP 409, hibakód `WORKSPACE_OWNER_CANNOT_LEAVE`.

### Workspace Settings
- **US-WS-20** — GET /workspaces/settings (X-Workspace-ID headerrel) visszaadja a baseCurrency-t és showBaseCurrency-t.
- **US-WS-21** — PATCH /workspaces/settings (owner) frissíti a showBaseCurrency értékét.
- **US-WS-22** — PATCH /workspaces/settings MEMBER szerepkörű userrel: HTTP 403, hibakód `WORKSPACE_OWNER_REQUIRED`.

---

## 6. Category Flow

- **US-CAT-01** — POST /categories érvényes névvel, iconnal, colorral, type-pal létrehoz egy kategóriát; HTTP 201, response tartalmaz id-t.
- **US-CAT-02** — GET /categories/{id} visszaadja a kategória összes mezőjét.
- **US-CAT-03** — GET /categories visszaadja az összes workspace kategóriát névsor szerint.
- **US-CAT-04** — POST /categories már létező névvel (azonos workspace): HTTP 409, hibakód `CATEGORY_ALREADY_EXISTS`.
- **US-CAT-05** — Két különböző workspace-ben azonos névvel létrehozott kategóriák nem ütköznek egymással.
- **US-CAT-06** — POST /categories 2 karakteres névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-CAT-07** — POST /categories 51 karakteres névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-CAT-08** — POST /categories érvénytelen hex colorral (pl. `"#ZZZZZZ"`): HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-CAT-09** — PATCH /categories/{id} névfrissítéssel: az új név megjelenik a GET válaszban.
- **US-CAT-10** — PATCH /categories/{id} más workspace-ben lévő kategória nevére: HTTP 409, ha azonos workspace-ben már van ilyen név.
- **US-CAT-11** — DELETE /categories/{id} tranzakció nélküli kategória: HTTP 204.
- **US-CAT-12** — DELETE /categories/{id} tranzakciókhoz kötött kategória: HTTP 409, hibakód `CATEGORY_IN_USE`.
- **US-CAT-13** — GET /categories/top-by-amount EXPENSE type-szal visszaadja a legtöbbet elköltött kategóriákat.
- **US-CAT-14** — Más workspace kategóriájához nem lehet hozzáférni az aktuális workspace contextusban (404).

---

## 7. Transaction Flow

### Alapműveletek
- **US-TXN-01** — POST /transactions érvényes adatokkal (title, date, amount, type, categoryId): HTTP 201, response tartalmaz id-t és baseCurrencyAmount-ot.
- **US-TXN-02** — GET /transactions/{id} visszaadja az összes tranzakció mezőt.
- **US-TXN-03** — GET /transactions visszaadja a workspace összes tranzakcióját, alapból date desc sorrendben.
- **US-TXN-04** — POST /transactions nem létező categoryId-vel: HTTP 404, hibakód `CATEGORY_NOT_FOUND`.
- **US-TXN-05** — POST /transactions negatív összeggel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-TXN-06** — POST /transactions 2 karakteres title-lel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-TXN-07** — POST /transactions 101 karakteres title-lel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-TXN-08** — PATCH /transactions/{id} összegfrissítéssel: új összeg megjelenik a GET válaszban.
- **US-TXN-09** — PATCH /transactions/{id} kategóriaváltással érvényes categoryId-re: sikeres.
- **US-TXN-10** — PATCH /transactions/{id} nem létező categoryId-re: HTTP 404, hibakód `CATEGORY_NOT_FOUND`.
- **US-TXN-11** — DELETE /transactions/{id}: HTTP 204, GET /transactions/{id} utána 404.
- **US-TXN-12** — Nem létező tranzakcióhoz GET/PATCH/DELETE: HTTP 404, hibakód `TRANSACTION_NOT_FOUND`.

### Szűrés és lapozás
- **US-TXN-13** — GET /transactions?type=EXPENSE csak expense tranzakciókat ad vissza.
- **US-TXN-14** — GET /transactions?categoryId={id} csak az adott kategória tranzakcióit adja vissza.
- **US-TXN-15** — GET /transactions?dateFrom=...&dateTo=... az adott dátumtartományba eső tranzakciókat adja vissza.
- **US-TXN-16** — GET /transactions?amountFrom=100&amountTo=500 csak a tartományba eső összegű tranzakciókat adja vissza.
- **US-TXN-17** — GET /transactions?page=0&size=5 legfeljebb 5 elemet ad vissza, response tartalmaz totalElements-t.
- **US-TXN-18** — GET /transactions/totals visszaadja a totalIncome-ot és totalExpense-t alap pénznemben.

### Workspace izoláció
- **US-TXN-19** — A userA workspace-ben lévő tranzakciók nem láthatók userB workspace contextusában (404).

---

## 8. Recurring Transaction Flow

- **US-REC-01** — POST /transactions/recurring DAILY frequenciával, UNTIL_DATE end conditionnel, jövőbeni endDate-tel: HTTP 201.
- **US-REC-02** — POST /transactions/recurring WEEKLY frequenciával, AFTER_OCCURRENCES end conditionnel, maxOccurrences=10: HTTP 201.
- **US-REC-03** — POST /transactions/recurring MONTHLY frequenciával, dayOfMonth=15: nextExecutionDate a hónap 15-e.
- **US-REC-04** — POST /transactions/recurring UNTIL_DATE nélkül, ha endCondition=UNTIL_DATE: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-REC-05** — POST /transactions/recurring AFTER_OCCURRENCES nélkül maxOccurrences, ha endCondition=AFTER_OCCURRENCES: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-REC-06** — POST /transactions/recurring nem létező categoryId-vel: HTTP 404, hibakód `CATEGORY_NOT_FOUND`.
- **US-REC-07** — GET /transactions/recurring visszaadja az összes recurring tranzakciót, alapból nextExecutionDate asc sorrendben.
- **US-REC-08** — GET /transactions/recurring?type=EXPENSE csak expense típusúakat ad vissza.
- **US-REC-09** — GET /transactions/recurring/{id} visszaadja az összes mezőt.
- **US-REC-10** — PATCH /transactions/recurring/{id} title frissítéssel: az új title megjelenik a GET válaszban.
- **US-REC-11** — DELETE /transactions/recurring/{id}: HTTP 204, GET /transactions/recurring/{id} utána 404.
- **US-REC-12** — Nem létező ID-vel GET/PATCH/DELETE: HTTP 404, hibakód `RECURRING_TRANSACTION_NOT_FOUND`.

---

## 9. Goal Flow

### Alapműveletek (email verifikáció szükséges)
- **US-GOAL-01** — POST /goals érvényes adatokkal: HTTP 201, status=ACTIVE, response tartalmaz id-t és baseCurrencyTargetAmount-ot.
- **US-GOAL-02** — POST /goals ahol initialAmount >= targetAmount: a goal azonnal COMPLETED státuszba kerül.
- **US-GOAL-03** — POST /goals nem létező categoryId-vel: HTTP 404, hibakód `CATEGORY_NOT_FOUND`.
- **US-GOAL-04** — POST /goals 0-s targetAmount-tal: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-GOAL-05** — GET /goals visszaadja az összes goal-t az aktív workspace-ben.
- **US-GOAL-06** — GET /goals?statuses=ACTIVE csak aktív goal-okat ad vissza.
- **US-GOAL-07** — GET /goals?statuses=COMPLETED csak befejezett goal-okat ad vissza.
- **US-GOAL-08** — GET /goals/{id} visszaadja az összes mezőt.
- **US-GOAL-09** — PATCH /goals/{id} currentAmount frissítéssel ahol currentAmount < targetAmount: status marad ACTIVE.
- **US-GOAL-10** — PATCH /goals/{id} currentAmount = targetAmount-ra állítva: status automatikusan COMPLETED-re vált.
- **US-GOAL-11** — PATCH /goals/{id} status=PAUSED: status megváltozik.
- **US-GOAL-12** — DELETE /goals/{id}: HTTP 204, GET /goals/{id} utána 404.
- **US-GOAL-13** — Nem létező goal-hoz GET/PATCH/DELETE: HTTP 404, hibakód `GOAL_NOT_FOUND`.

### Email verifikációs barrier
- **US-GOAL-14** — Nem verifikált felhasználó bármely /goals endpoint hívása: HTTP 403, hibakód `EMAIL_VERIFICATION_REQUIRED`.

---

## 10. Debt Flow

### Alapműveletek (email verifikáció szükséges)
- **US-DEBT-01** — POST /debts LENT típussal érvényes adatokkal: HTTP 201, status=ACTIVE, remainingAmount = originalAmount.
- **US-DEBT-02** — POST /debts BORROWED típussal érvényes adatokkal: HTTP 201.
- **US-DEBT-03** — POST /debts nem létező categoryId-vel: HTTP 404, hibakód `CATEGORY_NOT_FOUND`.
- **US-DEBT-04** — POST /debts 0-s originalAmount-tal: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-DEBT-05** — GET /debts visszaadja az összes adósságot.
- **US-DEBT-06** — GET /debts?type=LENT csak LENT típusúakat ad vissza.
- **US-DEBT-07** — GET /debts?statuses=ACTIVE csak aktív adósságokat ad vissza.
- **US-DEBT-08** — GET /debts/{id} visszaadja az összes mezőt.
- **US-DEBT-09** — PATCH /debts/{id}/payment részösszeg kifizetésével: remainingAmount csökken, status marad ACTIVE.
- **US-DEBT-10** — PATCH /debts/{id}/payment teljes remainingAmount kifizetésével: status automatikusan SETTLED-re vált.
- **US-DEBT-11** — PATCH /debts/{id}/payment remainingAmount-nál nagyobb összeggel: HTTP 400, hibakód `DEBT_PAYMENT_EXCEEDS_REMAINING`.
- **US-DEBT-12** — PATCH /debts/{id}/payment 0-s összeggel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-DEBT-13** — PATCH /debts/{id} title és deadline frissítésével: az új értékek megjelennek a GET válaszban.
- **US-DEBT-14** — DELETE /debts/{id}: HTTP 204, GET /debts/{id} utána 404.
- **US-DEBT-15** — Nem létező debt-hez GET/PATCH/DELETE: HTTP 404, hibakód `DEBT_NOT_FOUND`.

### Email verifikációs barrier
- **US-DEBT-16** — Nem verifikált felhasználó bármely /debts endpoint hívása: HTTP 403, hibakód `EMAIL_VERIFICATION_REQUIRED`.

### Widget adatok
- **US-DEBT-17** — GET /debts/widget-data?type=... érvényes widget type-szal visszaad adatot.
- **US-DEBT-18** — GET /debts/widget-data nem létező widget type-szal: HTTP 400, hibakód `DEBT_WIDGET_TYPE_NOT_SUPPORTED`.

---

## 11. Investment Flow

- **US-INV-01** — POST /investments érvényes adatokkal (asset, purchaseDate, type, amount, currency): HTTP 201.
- **US-INV-02** — POST /investments negatív/nulla összeggel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-INV-03** — POST /investments üres asset névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-INV-04** — POST /investments 101 karakteres asset névvel: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-INV-05** — GET /investments visszaadja az összes befektetést.
- **US-INV-06** — GET /investments/grouped visszaad eszköz szerint csoportosított adatot (aggregált összegek, darabszám, napok száma utolsó tranzakció óta).
- **US-INV-07** — GET /investments/grouped után új befektetés hozzáadásával azonos asset névvel: az összeg növekszik a csoportban.
- **US-INV-08** — PATCH /investments/{id} asset névfrissítéssel: az új név megjelenik a GET válaszban.
- **US-INV-09** — DELETE /investments/{id}: HTTP 204, a törölt elem nem szerepel a GET /investments listában.
- **US-INV-10** — Nem létező befektetéshez PATCH/DELETE: HTTP 404, hibakód `INVESTMENT_NOT_FOUND`.
- **US-INV-11** — GET /investments/widget-data érvényes type paraméterrel visszaad adatot.
- **US-INV-12** — GET /investments/widget-data érvénytelen type paraméterrel: HTTP 400, hibakód `INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED`.

---

## 12. Achievement Flow

- **US-ACH-01** — GET /achievements visszaadja az összes achievement-et (name, description, criteria), akkor is, ha egyikük sem lett feloldva.
- **US-ACH-02** — GET /achievements/unlocked üres listát ad vissza új workspace-ben (nincs még feloldott achievement).
- **US-ACH-03** — GET /achievements/unlocked tartalmaz unlockedAt mezőt a feloldott achievement-eknél.
- **US-ACH-04** — Nem verifikált felhasználó GET /achievements: HTTP 403, hibakód `EMAIL_VERIFICATION_REQUIRED`.

---

## 13. Statistics / Widget Flow

- **US-WIDGET-01** — GET /statistics/widgets/layout verifikált felhasználónak visszaadja a statCardWidgets és chartWidgets listákat.
- **US-WIDGET-02** — GET /statistics/widgets/{id}/data érvényes timeframe paraméterrel visszaad adatot.
- **US-WIDGET-03** — GET /statistics/widgets/{id}/data nem létező widget ID-vel: HTTP 404, hibakód `WIDGET_NOT_FOUND`.
- **US-WIDGET-04** — GET /statistics/widgets/dashboard visszaadja a balance trend adatot.
- **US-WIDGET-05** — POST /statistics/widgets érvényes widget CreateDTO-val: HTTP 201, a GET /layout a új elemet tartalmazza.
- **US-WIDGET-06** — PUT /statistics/widgets/layout az egész layout lecseréli; a requestben nem szereplő widget-ek törlődnek.
- **US-WIDGET-07** — Nem verifikált felhasználó bármely /statistics/widgets endpoint hívása: HTTP 403, hibakód `EMAIL_VERIFICATION_REQUIRED`.
- **US-WIDGET-08** — GET /statistics/widgets/{id}/data érvénytelen timeframe értékkel: HTTP 400, hibakód `VALIDATION_ERROR`.

---

## 14. Audit Log Flow

- **US-AUDIT-01** — GET /audit-logs workspace owner-ként visszaad egy lapozott listát.
- **US-AUDIT-02** — GET /audit-logs MEMBER szerepkörű felhasználóként: HTTP 403 (owner-only endpoint).
- **US-AUDIT-03** — GET /audit-logs?entityType=TRANSACTION csak tranzakció változásokat ad vissza.
- **US-AUDIT-04** — GET /audit-logs?dateFrom=...&dateTo=... az adott időintervallumba eső bejegyzéseket adja vissza.
- **US-AUDIT-05** — Nem autentikált hívás GET /audit-logs: HTTP 401.

---

## 15. Exchange Rate Flow

- **US-FX-01** — GET /exchange-rates?from=USD&to=EUR&date=2024-01-15 visszaad egy BigDecimal értéket.
- **US-FX-02** — GET /exchange-rates?from=USD&to=USD&date=... visszaad 1.0 értéket (azonos deviza).
- **US-FX-03** — GET /exchange-rates érvénytelen currency kóddal: HTTP 400, hibakód `VALIDATION_ERROR`.
- **US-FX-04** — Nem autentikált hívás GET /exchange-rates: HTTP 401.

---

## 16. Kereszt-vágó / Biztonsági Flow-k

### Workspace izoláció
- **US-ISO-01** — Felhasználó nem érheti el más workspace kategóriáit (másik workspace X-Workspace-ID headerrel): 404 vagy üres lista.
- **US-ISO-02** — Felhasználó nem érheti el más workspace tranzakcióit: 404 vagy üres lista.
- **US-ISO-03** — Felhasználó nem érheti el olyan workspace-t amelynek nem tagja: 403 vagy 404.

### Autentikáció
- **US-AUTH-SEC-01** — Bármely védett endpoint hívása access_token cookie nélkül: HTTP 401.
- **US-AUTH-SEC-02** — Lejárt access_token-nel védett endpoint hívása: HTTP 401.
- **US-AUTH-SEC-03** — Manipulált (tampered) JWT token-nel védett endpoint hívása: HTTP 401.

### Admin jogosultság
- **US-ADMIN-01** — USER szerepkörű felhasználó hívja a POST /admin/auth/register endpointot: HTTP 403.
- **US-ADMIN-02** — USER szerepkörű felhasználó hívja a GET /admin/statistics/widgets/data endpointot: HTTP 403.
- **US-ADMIN-03** — USER szerepkörű felhasználó hívja a GET /admin/audit-logs endpointot: HTTP 403.
- **US-ADMIN-04** — ADMIN felhasználó sikeresen hívja a GET /admin/statistics/widgets/data endpointot.

### X-Workspace-ID header
- **US-WS-HDR-01** — Workspace-scoped endpoint hívása X-Workspace-ID header nélkül: HTTP 400.
- **US-WS-HDR-02** — Workspace-scoped endpoint hívása nem létező workspace ID-vel: HTTP 404, hibakód `WORKSPACE_NOT_FOUND`.
- **US-WS-HDR-03** — Workspace-scoped endpoint hívása olyan workspace ID-vel amelynek a user nem tagja: HTTP 403 vagy 404.

---

## 17. Összetett / End-to-End Flow-k

- **US-E2E-01** — Teljes onboarding: regisztrálás → email verifikáció → bejelentkezés → workspace létrehozás → kategória hozzáadás → tranzakció rögzítés → widget adat lekérés.
- **US-E2E-02** — Közös workspace flow: userA létrehoz egy workspace-t → meghívja userB-t MEMBER-ként → userB bejelentkezik, létrehoz tranzakciót → userA látja userB tranzakcióját.
- **US-E2E-03** — Jelszóváltoztatás + re-login: POST /user/change-password → régi session 401 → bejelentkezés új jelszóval → sikeres.
- **US-E2E-04** — Goal teljesítési flow: POST /goals → PATCH /goals/{id} currentAmount=targetAmount → status COMPLETED, achievement esemény.
- **US-E2E-05** — Debt kifizetési flow: POST /debts → PATCH /debts/{id}/payment (részleges) → ACTIVE → PATCH /debts/{id}/payment (maradék) → SETTLED.
- **US-E2E-06** — Kategória-törlési blokk: POST /categories → POST /transactions (az új kategóriával) → DELETE /categories/{id} → 409 CATEGORY_IN_USE → DELETE /transactions/{id} → DELETE /categories/{id} → 204.
- **US-E2E-07** — Workspace törlési korlát: felhasználónak 1 workspace-e van → DELETE /workspaces/{id} → 409 WORKSPACE_CANNOT_DELETE_LAST → POST /workspaces → DELETE /workspaces/{eredeti_id} → 204.
- **US-E2E-08** — Multi-currency tranzakció: workspace baseCurrency=HUF, tranzakció currency=USD → baseCurrencyAmount automatikusan kalkulálva a lekért exchange rate alapján.
- **US-E2E-09** — Fiók törlés cascade: DELETE /user → bejelentkezési kísérlet ugyanazzal a userrel → 401.
- **US-E2E-10** — Widget layout update: GET /layout → layout módosítás (elem eltávolítása) → PUT /layout → GET /layout → az eltávolított widget nem szerepel a válaszban.
