# Ekte tropper – fremdrift (FotMob)

Arbeidsnotat for å legge inn ekte spillere i `REAL_SQUADS` (game.js).
Kilde: FotMob `https://www.fotmob.com/teams/{id}/squad/{slug}`. Tropp trimmes til ~22 i
keeper→spiss-rekkefølge. FotMob rate-limiter etter mange forespørsler (HTTP 500) – ta pauser.

## Status
- ✅ Eliteserien (16) + OBOS (16) + Pol Tastas serie – fra før
- ✅ **2. divisjon** – 28/28 lag (Avd 1 + Avd 2) ferdig (FotMob)
- ✅ **3. divisjon Avd 1** – 14/14 lag ferdig (Transfermarkt)
- ✅ **3. divisjon Avd 2** – 13/14 ferdig. MANGLER: Kvik (Trondheim, FotMob 4332) – ingen TM-side.
- ✅ **3. divisjon Avd 3** – 13/14 ferdig. MANGLER: Sogndal 2 – ingen TM-side.
- ⏭️ 3. divisjon Avd 4–6 – pågår (42 lag igjen)
- Totalt 109 lag med ekte tropper.
- MERK: FotMob rate-limiter (HTTP 500). Bytt til Transfermarkt: søk «<lag> transfermarkt kader verein»,
  hent `https://www.transfermarkt.us/<slug>/kader/verein/<id>`. Maks ~5 hentinger om gangen.

## 3. divisjon Avd 1 – FotMob team-IDer (klar til henting)
| Lag | FotMob ID | Tropp lagt inn? |
|---|---|---|
| Asker | 6540 | nei |
| Bærum | 8137 | nei |
| Frigg | 4621 | nei |
| Gamle Oslo | 1352625 | nei |
| Grei | 4206 | nei |
| Heming | 46909 | nei |
| KFUM Oslo 2 | 161348 | nei |
| Lokomotiv Oslo | 428157 | nei |
| Nordstrand | 8125 | nei |
| Ready | 608816 | nei |
| Ullern | 2324 | nei |
| Union Carl Berner | 1609449 | nei |
| Vålerenga 2 | 8136 | nei |
| Konnerud | 6542 | nei |

## 3. divisjon resterende avdelinger (lag – se DIVISIONS D3 i game.js)
- Avd 2: Byåsen, Herd, Kvik, Melhus, Molde 2, Nardo, NTNUI, Orkla, Ranheim 2, Rosenborg 2, Spjelkavik, Strindheim, Volda, Aalesund 2
- Avd 3: Askøy, Austevoll, Brann 2, Djerv 1919, Fana, Fyllingsdalen, Førde, Gneist, Os, Sogndal 2, Stord, Vard Haugesund, Varegg, Åsane 2
- Avd 4: Brodd, Fløy, Haugesund 2, Hinna, Madla, Mandalskameratene, Odd 2, Stabæk 2, Staal Jørpeland, Varhaug, Viking 2, Vindbjart, Våg, Åkra
- Avd 5: Skedsmo, Fauske/Sprint, Finnsnes, Fløya, Alta, Lillestrøm 2, Kongsvinger 2, Strømsgodset 2, Skjervøy, Harstad, Tromsø 2, Skjetten, Ulfstind, Bossekop
- Avd 6: Lillehammer, Gjøvik-Lyn, Råde, Sandefjord 2, Elverum, Ørn-Horten, Oppsal, Drøbak/Frogn, Rælingen, Lyn 2, Fram, Sarpsborg 08 2, Brumunddal, Bjørkelangen
