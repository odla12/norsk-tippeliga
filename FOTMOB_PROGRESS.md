# Ekte tropper – fremdrift

Arbeidsnotat for ekte spillere i `REAL_SQUADS` (game.js).
Kilder: Transfermarkt (`/kader/verein/<id>`), FotMob (`/teams/<id>/squad/<slug>`), fotball.no (Min Fotball).
FotMob rate-limiter etter mange forespørsler (HTTP 500) – ta pauser, eller bruk Transfermarkt.

## Status (oppdatert 10. aug 2026)
- ✅ Eliteserien (16) + OBOS (16) – ekte navn, posisjon og alder (Transfermarkt)
- ✅ **2. divisjon** – 28/28 lag (Avd 1 + Avd 2)
- ✅ **3. divisjon** – KOMPLETT! Alle 6 avdelinger (84 lag), inkl. Kvik (TM verein 66144) og Sogndal 2 (TM «Sogndal IL II») som lenge manglet.
- ✅ **4. divisjon** – 62/72 lag. Mangler (upålitelig/ingen kilde, beholder genererte navn):
  - Avd 2: Gjesdal, Kvernaland, Tananger, Vikeså
  - Avd 3: Vennesla, Flekkerøy (agent traff FK Fløy-troppen – samme øy; forkastet)
  - Avd 4: Øygarden (klubben ble oppløst/konkurs i 2022)
  - Avd 5: Tornado Måløy, Jotun, Bjørnar
- ✅ 5. divisjon Avd 2 (Pol Tastas serie) – fra før (fotball.no)
- ⏭️ 5.–7. divisjon ellers: genererte navn. Kildene publiserer i praksis ikke tropper på dette
  nivået (mange klubber finnes ikke på TM/FotMob). 7. div Avd 3–4 er dessuten auto-genererte
  klubbnavn i spillet – ingen ekte tropp finnes.
- Totalt **215 klubber** med ekte tropper i spillet.

## Teknisk
- Små ekte tropper (<16 navn) fylles automatisk opp til 16 med genererte spillere
  (buildSquad, «pad»-løkken) – alle klubber er spillbare med benk.
- Stjerneratinger for Eliteserien ligger i `STAR_RATINGS` (Tripić 94 på topp);
  øvrige genererte ratinger cappes på klubbnivå+3 (maks 90).
- Ved duplikatnavn på tvers av klubber (f.eks. reservelag som lister A-spillere)
  er navnet beholdt kun i den første/øverste klubben.
