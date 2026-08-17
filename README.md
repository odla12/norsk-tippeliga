# ⚽ Norsk Tippeliga

**🌐 Spill i nettleseren: https://odla12.github.io/norsk-tippeliga/**

Et fotball-manager-spill der du velger manager-navn og klubb fra hele den norske
ligapyramiden – fra Eliteserien ned til 7. divisjon med avdelinger – og spiller
deg gjennom sesongene med opp- og nedrykk.

## Slik spiller du
1. Åpne `index.html` i en nettleser (dobbeltklikk), **eller** kjør en lokal server
   og gå til `http://localhost:5176`.
2. Skriv manager-navn, velg divisjon → avdeling → lag (eller bruk søkefeltet).
3. Velg taktikk og trykk **Spill kamp (live)** – kampen spilles minutt for minutt
   (1 minutt = 1 sekund) med målscorere, assist og kort. 5× og «Hopp til slutt» finnes.
4. Topp i tabellen = opprykk, bunn = nedrykk. Karrieren lagres automatisk i nettleseren.

## Funksjoner
- **📖 Guide i appen** – hele denne spillguiden finnes inne i spillet: trykk
  **«📖 Slik spiller du – guide»** på startskjermen, eller **«📖 Guide»**-knappen
  i toppmenyen når du er i gang med en karriere.
- **Kalender** – sesongen starter **1. januar**. Eliteserien sparkes i gang ~15. mars,
  lavere divisjoner i april. Du trykker **«Neste dag»** eller **«Hopp til neste kamp»**
  for å bevege deg gjennom året – det er ikke kamp hele tiden.
- **Overgangsvindu** – du kan kun signere spillere i **januar, juni, juli og august**.
  Utenom vinduet er markedet stengt.
- **Lag egne spillere** – under Tropp kan du lage egne spillere (f.eks. eget talent).
  De starter på **30 i styrke**, og du velger alder fra **14 år** og oppover.
- **Live kampsimulering** – 1 minutt = 1 sekund, med hendelser («⚽ 55' Ullrik
  Gullihansen», «🟨 Ole Pålsen») i en levende kampfeed.
- **📺 TV-visning** – kampen tegnes på en 2,5D-bane i TV-kameravinkel: spillerne
  løper i formasjonen din, ballen spilles rundt med pasninger og dueller, mål og
  sjanser utspiller seg mot målet med jubel og «MÅL!»-banner, kort vises over
  spilleren, og straffer/VAR stopper spillet i eget tablå. Kamera følger ballen,
  publikum på tribunen. Slå av/på med TV-knappen under kampen.
- **Tropp** – hvert lag har en spillerstall (posisjon, alder, styrke). ★ = på laget.
  - **Ekte spillere** for alle 16 **Eliteserien**-lag og alle 16 **OBOS-ligaen**-lag
    (hentet fra Wikipedia).
  - **Ekte spillere fra fotball.no** for Pol Tastas serie (5. divisjon avd 2):
    Pol Tasta, Bogafjell, Siddis, Stavanger, Austrått, Mastra, Jarl, Vaulen og Fiskå.
    (Havørn, Sola 2 og Staal Jørpeland 2 har genererte navn – uklare/reservelag-sider.)
  - **Eliteserien + OBOS-ligaen (alle 32 lag)** har nå EKTE posisjon og alder per spiller
    (hentet fra Transfermarkt, 2026-sesongen) – ikke bare navn. Styrke settes fortsatt automatisk.
  - **Stjerneratinger** – Eliteseriens beste spillere har håndsatte, realistiske ratinger
    (`STAR_RATINGS` i `game.js`): Zlatko Tripić er ligaens beste med **94**, foran Patrick
    Berg (93) og Jens Petter Hauge (92). Øvrige genererte ratinger går aldri over 90, så
    stjernene er alltid på topp. Lett å legge til flere navn i tabellen.
  - For lavere divisjoner er spillernavnene ekte, men posisjon/alder settes automatisk (kildene
    publiserer ikke posisjon/alder for disse nivåene).
  - **Hele 2. og 3. divisjon** (alle avdelinger) og **62 av 72 klubber i 4. divisjon** har
    ekte tropper (Transfermarkt/FotMob/fotball.no) – totalt **215 klubber med ekte spillere**.
    Se `FOTMOB_PROGRESS.md` for hvilke få klubber som mangler kilde.
  - Øvrige lag i landet har genererte norske spillernavn. Legg til flere ekte tropper
    i `REAL_SQUADS` øverst i `game.js`.
- **Overgangsmarked med bud** – søk i ALLE klubber og by på hvem som helst. Selgende
  klubb sier ja eller nei (høyt bud = større sjanse), men spillere i en bedre divisjon
  sier som regel nei med mindre du overbyr kraftig. Legger du en egen spiller ut for
  salg, kommer det bud fra andre lag som du kan godta eller avslå. Maks 32, minst 14.
- **Lagledelse** – velg formasjon (4-4-2, 4-3-3, 4-5-1, 3-5-2, 5-3-2) og bestem hvor
  hver spiller skal spille: høyreback, midtstopper, venstreback, spiss osv. Spillere på
  feil plass svekkes (−10, keeper-bytter −20), og de som ikke er på banen sitter på
  benken. Påvirker lagstyrke og scorere. Velg også **fast straffetaker** – han tar
  straffene i kamp så lenge han er på banen.
- **Bytter i kamp** – under live-kampen kan du bytte inn spillere fra benken, eller slå
  på **auto-bytte** så spillet bytter selv (rundt 64' og 74').
- **Kamprating (keeper → spiss)** – begge lag får rating på hver sin side av kampfeeden:
  **ditt lag til høyre** (enten du spiller hjemme eller borte), **motstanderen til venstre**.
  Alle starter på **6,0** og endrer seg live: mål (+1,0), assist (+0,7), nestenmål (+0,1),
  gult kort (−0,5), rødt (−1,5), og keeperen mister litt for hvert baklengsmål. Etter kampen
  justeres alt etter resultatet – seier løfter, tap senker, og clean sheet gir keeper/forsvar
  et ekstra løft. Ratingen oppdaterer seg minutt for minutt under kampen og som sluttrating
  etterpå (gjelder både A-laget og ungdomskampene).
- **Live-hendelser** – straffe, VAR, nesten-mål, røde kort, og rødt ved to gule.
- **Statistikk** – toppscorerliste, flest assist, gule/røde kort og keepernes redninger.
  Øverst ser du **toppscorerne på dine egne lag** (A-laget og hvert ungdomslag), og du kan
  **velge aldersgruppe** (G6–U21) og se mål, assist, gule/røde kort og keeper med flest
  redninger for den gruppa. Ungdomsstatistikken genereres automatisk – ingen kamp nødvendig.
  Du kan også **velge hvilken som helst liga** (divisjon + avdeling) og se sesongstatistikken
  der – din egen serie viser faktiske kamper, øvrige ligaer får simulert sesongstatistikk.
- **Flere lagringer** – på startskjermen ser du alle lagrede spill (manager, klubb, sesong)
  og kan fortsette eller slette dem. Hver nye karriere får sin egen lagringsplass.
- **Spillerutvikling** – etter hver sesong går spillere litt opp/ned/likt; unge stiger,
  eldre synker, og de som presterte godt får et løft. **Spillere på alle andre lag** blir
  også eldre og kan få bedre eller dårligere rating fra sesong til sesong (hver klubb har en
  egen «sesongform»), og når en spiller blir for gammel legger han opp og en ung nykommer
  overtar plassen – så hele ligaen utvikler seg over tid, ikke bare ditt eget lag.
- **Markedsfiltre** – filtrer søket på posisjon, maks alder, maks pris og klubb.
- **Speider** – send ut en speider i 3, 6 eller 9 måneder (koster penger ut fra klubben din).
  Han finner unge talenter (10–17 år) som havner i akademi-poolen din – derfra setter du
  dem selv på ungdomslagene (de avvises hvis de er for gamle for laget).
- **Spillerdetalj** – trykk på en spiller i troppen for å se fødselsår, kontraktslengde og
  ukelønn. Kontrakter går ut, og du må fornye dem (koster ut fra rating og alder).
- **Ungdomsakademi** – klubben har lag G6–G20 og U21. Du kan se troppene, opprette ekstra
  lag (f.eks. «G12 2»), lage egne spillere (for gamle blir avvist) og sette akademi-talenter
  på lagene. Trykk på en ungdomsspiller for å **flytte** ham til et annet lag, **ta ham opp
  til A-laget** (kun 14 år eller eldre) eller **fjerne** ham. Spillerne rykker opp et trinn
  hver sesong, og hver sesong kommer det 1–3 nye spillere. Ungdomslagenes styrke avhenger av
  hvor god klubben er (Viking har gode talenter, et 6.-divisjonslag svakere), og kampene
  spilles mot lokale lag fra samme område (f.eks. «Stavanger G15»). Lagene fra G13 til U21
  spiller i **ungdomsligaer med tabell** (synlig før du har spilt en eneste kamp), og
  statistikken genereres automatisk hver sesong. Kamplengde følger alder: under 13 = 30 min,
  13–16 = 75 min, 17–21 = 90 min. Ungdomsspillere har posisjon – når du lager en egen spiller
  velger du posisjon, og du kan **bytte posisjon** senere ved å trykke på spilleren.
- **Chat med spillerne (AI)** – trykk på en spiller (A-lag eller ungdom) og skriv en melding;
  spilleren svarer i karakter. Med AI slått på (se under) svarer en ekte Claude-modell på det
  du faktisk skriver; uten oppsett brukes enkle innebygde svar.

## Slå på AI-chat (så spillerne svarer med ekte AI)
Spillerne svarer med ekte AI (Claude) via en liten lokal server (`server.js`). API-nøkkelen
kan ikke ligge i nettleseren (sikkerhet), derfor trengs serveren. `@anthropic-ai/sdk` er
allerede installert. Slik slår du den PÅ – gjør det **én gang**:
1. Lag en fil som heter **`apikey.txt`** i mappa `norsk-tippeliga`, og lim inn Anthropic-nøkkelen
   din (bare nøkkelen, `sk-ant-...`, på én linje). *(Alternativt: sett miljøvariabel
   `ANTHROPIC_API_KEY`.)*
2. Start serveren på nytt: `node server.js` (eller `npm start`). Står det **«AI-chat PÅ ✅»** i
   konsollen, er den klar.
3. Åpne `http://localhost:5176`, trykk på en spiller og skriv en melding – nå svarer Claude i karakter.

Modellen er `claude-opus-4-8` (bytt til `claude-haiku-4-5` i `server.js` for raskere/billigere svar).
Hver melding koster litt på Anthropic-kontoen din. Uten nøkkel kjører spillet helt fint – chatten
faller bare tilbake til enkle innebygde svar.
- **Ungdomskamper på kalenderen** – på faste dager spiller noen av lagene (f.eks. «G6 og G14
  spiller i dag»). Da får du et varsel, og kan gå inn på laget og **se kampen live** minutt
  for minutt – eller spille en treningskamp når som helst.
- **Egne spillere** – en 14-åring starter på 15 i styrke, +5 per år opp til 18 (=35).
- **Straffekonkurranse i NM** – blir det uavgjort, velger du selv hvem som tar hver
  straffe (best av 5, så sudden death).
- **Aldre**: Eliteserien + OBOS bruker EKTE aldre (Transfermarkt, 2026). Øvrige divisjoner har
  generert alder (realistisk fordeling), ikke ekte fødselsdatoer.
- **NM-cupen på kalenderen** – NM-kampene spilles på faste datoer gjennom sesongen
  (1. runde 8. mai, 3. runde 5. juni … finale 31. juli), mot lag fra hele pyramiden,
  med straffer ved uavgjort. De dukker opp som kampdager når datoen kommer.
- **Aldring og pensjon** – spillerne blir ett år eldre hver sesong og legger opp
  når de er 33–43. Akademiet henter inn ungdom (16–18 år) hvert år.
- **Trenerkarriere** – etter 25 sesonger legger du opp som trener, og kan fortsette
  med din sønn/datter (du velger navnet) eller en tilfeldig person.
- **Sparken** – gjør du det dårlig og rykker ned, kan du få sparken og må finne ny klubb.
  Egenlagde og signerte spillere blir igjen i den gamle klubben – søk dem opp i
  overgangsmarkedet for å hente dem tilbake (du får varsel om hvem som ble igjen).
- **Budsjett** – varierer med divisjon; du tjener mer jo høyere du spiller.
- **⚙️ Innstillinger** – skru av/på kontrakter (slipp å fornye), ungdomskamper, skader,
  overgangsvindu alltid åpent og sparken – per karriere. Egen **juksekode-modus** med
  sett penger, helbred alle og superlag (+5 styrke).
- **🎰 Klubbcasino** – vedd klubbkassa på **Plinko**, **kron eller mynt** og **Mines**
  (finn 💎, unngå minene, ta ut før det smeller). Gevinst og tap går rett i budsjettet.

## Lagdata (2026-sesongen)
- **Eliteserien, 1., 2. og 3. divisjon** bruker de EKTE 2026-oppsettene (hentet fra
  Wikipedia / fotball.no / Norsk Tipping-ligaen-oversikten).
- **5. divisjon avd 2** er Pol Tastas EKTE Rogaland-gruppe (Bogafjell, Siddis,
  Stavanger, Austrått, Mastra, Sola 2, Staal Jørpeland 2, Jarl, Vaulen, Havørn, Fiskå).
- **Øvrige avdelinger i 4.–7. divisjon** fylles med ekte norske klubber, men med
  *omtrentlig* avdelingsinndeling – Norge har tusenvis av lag på disse nivåene, og
  hele landets inndeling er ikke mulig å gjengi 100 % korrekt. Lett å rette under.

### Legge til / rette lag
Alt ligger i `game.js`, øverst i `DIVISIONS`-listen. Hver divisjon har `groups`
(avdelinger), og hver avdeling har en `teams`-liste. Eksempel:

```js
{ name:"2. divisjon", level:3, promote:2, relegate:2, groups:[
  { name:"Avd 1", teams:[ "Lyn", "Moss", "Kjelsås", /* ... */ ] },
] }
```

Vil du gi et lag en bestemt styrke (1–99), legg det inn i `OVERRIDE`-objektet.
Ellers regnes styrken ut fra divisjonsnivået automatisk.
