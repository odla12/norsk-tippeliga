const GAME_VERSION="0.0.2"; // bumpes ved hver utgivelse (vises i nettleserfanen)
/* =====================================================================
   NORSK TIPPELIGA  -  fotball-manager  (2026-sesongen)
   ---------------------------------------------------------------------
   - Nivå 1-4 har EKTE 2026-oppsett. 5. div avd 2 = Pol Tastas ekte gruppe.
   - Live kampsimulering: 1 minutt = 1 sekund, med målscorere og kort.
   - Alle lag har spillertropper (genererte norske spillere).
   - Overgangsmarked: kjøp og selg spillere.
   - NM-cupen: spill deg fram mot finalen.
   ===================================================================== */

/* Deterministisk hash */
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- EKTE 2026-OPPSETT, nivå 1-4 ---------- */
const ELITE = [ "Bodø/Glimt","Viking","Brann","Molde","Rosenborg","Tromsø","Vålerenga",
  "Lillestrøm","Fredrikstad","Sarpsborg 08","KFUM Oslo","HamKam","Kristiansund",
  "Sandefjord","Start","Aalesund" ];
const OBOS = [ "Åsane","Bryne","Egersund","Haugesund","Hødd","Kongsvinger","Lyn","Moss",
  "Odd","Ranheim","Raufoss","Sandnes Ulf","Sogndal","Stabæk","Strømmen","Strømsgodset" ];
const D2 = [
  { name:"Avd 1", teams:["Lysekloster","Skeid","Sotra","Kjelsås","Sandviken","Hønefoss","Pors","Levanger","Notodden","Follo","Jerv","Ull/Kisa","Arendal","Eidsvold Turn","Eik Tønsberg","Rana"]},
  { name:"Avd 2", teams:["Mjøndalen","Stjørdals-Blink","Bjarg","Junkeren","Vidar","Lørenskog","Kvik Halden","Trygg/Lade","Brattvåg","Tromsdalen","Træff","Grorud"]}
];
const D3 = [
  { name:"Avd 1", teams:["Asker","Bærum","Frigg","Gamle Oslo","Grei","Heming","KFUM Oslo 2","Konnerud","Lokomotiv Oslo","Nordstrand","Ready","Ullern","Union Carl Berner","Vålerenga 2"]},
  { name:"Avd 2", teams:["Byåsen","Herd","Kvik","Melhus","Molde 2","Nardo","NTNUI","Orkla","Ranheim 2","Rosenborg 2","Spjelkavik","Strindheim","Volda","Aalesund 2"]},
  { name:"Avd 3", teams:["Askøy","Austevoll","Brann 2","Djerv 1919","Fana","Fyllingsdalen","Førde","Gneist","Os","Sogndal 2","Stord","Vard Haugesund","Varegg","Åsane 2"]},
  { name:"Avd 4", teams:["Brodd","Fløy","Haugesund 2","Hinna","Madla","Mandalskameratene","Odd 2","Stabæk 2","Staal Jørpeland","Varhaug","Viking 2","Vindbjart","Våg","Åkra"]},
  { name:"Avd 5", teams:["Skedsmo","Fauske/Sprint","Finnsnes","Fløya","Alta","Lillestrøm 2","Kongsvinger 2","Strømsgodset 2","Skjervøy","Harstad","Tromsø 2","Skjetten","Ulfstind","Bossekop"]},
  { name:"Avd 6", teams:["Lillehammer","Gjøvik-Lyn","Råde","Sandefjord 2","Elverum","Ørn-Horten","Oppsal","Drøbak/Frogn","Rælingen","Lyn 2","Fram","Sarpsborg 08 2","Brumunddal","Bjørkelangen"]}
];
const POL_GROUP = ["Pol Tasta","Bogafjell","Siddis","Stavanger","Austrått","Mastra","Sola 2","Staal Jørpeland 2","Jarl","Vaulen","Havørn","Fiskå"];

/* ---------- Pool av ekte klubber til 4.-7. divisjon ---------- */
const REAL_POOL = [
  "Sola","Riska","Hana","Ganddal","Frøyland","Klepp","Sunde","Buøy","Hundvåg","Vardeneset","Forus og Gausel","Figgjo","Nærbø","Vigrestad","Ålgård","Gjesdal","Lura","Kvernaland","Orre","Randaberg","Tananger","Vikeså","Sandved","Rosseland","Bryne 2",
  "Donn","Søgne","Flekkerøy","Express","Vigør","Randesund","Gimletroll","Trauma","Birkenes","Lillesand","Vennesla","Hisøy","Start 2","Jerv 2",
  "Smørås","Baune","Loddefjord","Tertnes","Arna-Bjørnar","Nymark","Trio","Nest-Sotra","Øygarden","Lyngbø","Bremnes","Fitjar","Stryn","Eid","Tornado Måløy","Kaupanger","Årdal","Høyang","Jotun","Florø","Bjørnar",
  "Ørsta","Skarbøvik","Bergsøy","Hareid","Langevåg","Rollon","Valder","Surnadal","Sunndal","Clausenengen","Dahle","Tomrefjord","Vestnes Varfjell","Averøykameratene","Eide og Omegn","Hødd 2","Træff 2",
  "Charlottenlund","Kattem","Heimdal","Buvik","Tiller","Sverre","Steinkjer","Verdal","Egge","Vuku","Inderøy","Sparbu","Neset","Namsos","Rørvik","Malm","Vinne","Levanger 2","Rindal","Stadsbygd","Nardo 2","Orkanger",
  "Mjølner","Bossmo & Ytteren","Stålkameratene","Mosjøen","Sandnessjøen","Brønnøysund","Saltdalkameratene","Grand Bodø","Mørkved","Innstranda","Tverlandet","Senja","Skarp","Bardufoss","Storelva","Norild","Hammerfest","Honningsvåg","Kirkenes","Bjørnevatn","Nordkapp","Mo","Sortland","Melbo","Stokmarknes","Svolvær","Leknes",
  "Faaberg","Vind","Reinsvoll","Nybergsund","Moelven","Kapp","Toten","Vardal","Redalen","Storhamar","Ottestad","Stange","Løten","Ringsaker","Nes","Vinstra","Otta","Sel","Dovre","Lom","Tretten","Fåvang","Ringebu","Gjøvik FF","Raufoss 2",
  "Korsvoll","Holmen","Nittedal","Gjelleråsen","Fet","Aurskog/Finstadbru","Jevnaker","Lommedalen","Kolbotn","Hasle-Løren","Røa","Holmlia","Abildsø","Bækkelaget","Manglerud Star","Kjelsås 2","Skeid 2",
  "Flint","Runar","Storm","Larvik Turn","Re","Stag","Borre","Teie","Tjølling","Snøgg","Urædd","Pors 2","Skarphedin","Gvarv","Bø","Heddal","Sauherad","Åssiden","Mjøndalen 2","Skiold","Steinberg","Vestfossen","Drammens BK","Holmestrand","Sande","Svelvik","Eik Tønsberg 2",
  "Sprint-Jeløy","Kråkerøy","Selbak","Ås","Askim","Mysen","Rakkestad","Tune","Tistedalen","Hafslund","Borgen","Fredrikstad 2","Lisleby","Rolvsøy","Greåker","Skjeberg","Trøgstad/Båstad"
];
const PLACES=["Sarpsborg","Skien","Bodø","Harstad","Narvik","Førde","Voss","Odda","Mandal","Flekkefjord","Lyngdal","Farsund","Grimstad","Kragerø","Rena","Tynset","Røros","Oppdal","Namsos","Mosjøen","Fauske","Finnsnes","Alta","Vadsø","Lakselv"];
const SUFFIX=["IL","FK","IF","SK","BK","FL","UIL","Turn"];

/* ---------- Bygging av 4.-7. divisjon fra ekte klubber ---------- */
const _used=new Set(); let _idx=0, _fbk=0;
[ELITE,OBOS,...D2.map(g=>g.teams),...D3.map(g=>g.teams),POL_GROUP].flat().forEach(n=>_used.add(n));
function _nextReal(){ while(_idx<REAL_POOL.length){ const n=REAL_POOL[_idx++]; if(!_used.has(n)){_used.add(n);return n;} } return null; }
function _fallback(){ while(true){ const n=`${PLACES[_fbk%PLACES.length]} ${SUFFIX[(_fbk*7)%SUFFIX.length]}`; _fbk++; if(!_used.has(n)){_used.add(n);return n;} } }
function genGroup(n){ const t=[]; while(t.length<n) t.push(_nextReal()||_fallback()); return t; }
function genDivision(numGroups, perGroup){ const gs=[]; for(let g=0;g<numGroups;g++) gs.push({name:`Avd ${g+1}`, teams:genGroup(perGroup)}); return gs; }
function buildDiv5(){ const gs=[{name:"Avd 1", teams:genGroup(12)}, {name:"Avd 2", teams:POL_GROUP.slice()}];
  for(let g=2; g<6; g++) gs.push({name:`Avd ${g+1}`, teams:genGroup(12)}); return gs; }

const DIVISIONS = [
  { name:"Eliteserien", level:1, promote:0, relegate:2, groups:[{name:null, teams:ELITE}] },
  { name:"1. divisjon (OBOS-ligaen)", level:2, promote:2, relegate:2, groups:[{name:null, teams:OBOS}] },
  { name:"2. divisjon", level:3, promote:2, relegate:2, groups:D2 },
  { name:"3. divisjon", level:4, promote:2, relegate:2, groups:D3 },
  { name:"4. divisjon", level:5, promote:1, relegate:2, groups: genDivision(6,12) },
  { name:"5. divisjon", level:6, promote:1, relegate:2, groups: buildDiv5() },
  { name:"6. divisjon", level:7, promote:1, relegate:2, groups: genDivision(5,12) },
  { name:"7. divisjon", level:8, promote:1, relegate:0, groups: genDivision(4,10) },
];

/* ---------- Klubbstyrke ---------- */
const BASE = [80,70,61,52,44,37,31,26];
const OVERRIDE = {
  "Bodø/Glimt":91,"Viking":86,"Brann":85,"Molde":85,"Rosenborg":83,"Tromsø":80,
  "Vålerenga":78,"Lillestrøm":78,"Fredrikstad":77,"Sarpsborg 08":76,"Start":75,
  "KFUM Oslo":74,"HamKam":74,"Kristiansund":74,"Aalesund":73,"Sandefjord":73,
  "Strømsgodset":73,"Haugesund":73,"Odd":72,"Bryne":71,"Sogndal":70,"Lyn":70,
  "Stabæk":70,"Ranheim":69,"Hødd":69,"Egersund":68,"Åsane":68,"Sandnes Ulf":68,
  "Raufoss":68,"Kongsvinger":67,"Moss":67,"Strømmen":66
};
function strength(name, divIndex){
  if(OVERRIDE[name]!=null) return OVERRIDE[name];
  return BASE[Math.min(divIndex, BASE.length-1)] + (hash(name)%13 - 6);
}

/* Håndsatte, realistiske ratinger for stjernene i Eliteserien (2026).
   Navnet må stemme EKSAKT med REAL_SQUADS. Tripić er ligaens beste (94).
   Spillere som ikke står her, får generert rating (aldri over 90) – så
   stjernene er alltid best. Legg gjerne til flere! */
const STAR_RATINGS = {
  // Viking
  "Zlatko Tripić":94, "Veton Berisha":90, "Kristoffer Askildsen":88, "Joe Bell":88,
  "Jesper Daland":87, "Edvin Austbø":87, "Henrik Heggheim":86,
  // Bodø/Glimt
  "Patrick Berg":93, "Jens Petter Hauge":92, "Ulrik Saltnes":91, "Nikita Haikin":91,
  "Fredrik André Bjørkan":90, "Andreas Helmersen":90, "Ola Brynhildsen":89, "Håkon Evjen":89,
  "Sondre Auklend":88, "Joshua Kitolano":88,
  // Brann
  "Bård Finne":89, "Noah Holm":88, "Rabbi Matondo":88, "Mathias Dyngeland":87,
  "Jacob Lungi Sørensen":86, "Sakarias Opsahl":86,
  // Molde
  "Mats Møller Dæhli":89, "Emil Breivik":88, "Eirik Haugan":86, "Martin Linnes":85,
  "Eirik Hestad":85, "Daniel Daga":84,
  // Rosenborg
  "Ole Selnæs":87, "Iver Fossum":87, "Dino Islamović":86, "Jonas Svensson":86,
  "Leopold Wahlstedt":85, "Emil Konradsen Ceïde":84,
  // Tromsø
  "Lars Olden Larsen":85, "Leo Cornic":84, "Jakob Haugaard":83, "Ruben Yttergård Jenssen":81,
  // Vålerenga
  "Ole Sæter":86, "Odin Thiago Holm":84, "Mohamed Ofkir":83, "Henrik Bjørdal":82, "Oscar Hedvall":82,
  // Lillestrøm
  "Thomas Lehne Olsen":84, "Fredrik Gulbrandsen":82, "Ylldren Ibrahimaj":82,
  "Kevin Martin Krygård":82, "Ruben Gabrielsen":81,
  // Fredrikstad
  "Sondre Sørløkk":82, "Leonard Owusu":81, "Simen Rafn":80, "Øystein Øvretveit":80,
  // Sarpsborg 08
  "Sigurd Rosted":82, "Sondre Sørli":81, "Jo Inge Berget":80, "Aimar Sher":80,
  // KFUM Oslo
  "Magnus Wolff Eikrem":81, "Robin Rasch":79, "Moussa Njie":78, "Bjørn Martin Kristensen":78,
  // HamKam
  "Henrik Udahl":80, "Anders Trondsen":78, "Marcus Sandberg":77,
  // Kristiansund
  "Sander Svendsen":79, "Michael Lansing":77, "Tobias Svendsen":76,
  // Sandefjord
  "Evangelos Patoulidis":79, "Nikolaj Möller":77, "Sander Risan Mørk":76,
  // Start
  "Håkon Lorentzen":80, "Stève Mvoué":79, "Markus Soomets":77, "Eirik Schulze":77,
  // Aalesund
  "Elias Hagen":78, "Kristoffer Nessø":76, "Paul Ngongo":76,
};

/* =====================================================================
   SPILLERE OG TROPPER
   ===================================================================== */
const FIRST=["Ole","Lars","Magnus","Henrik","Markus","Mathias","Kristian","Sander","Jonas",
  "Andreas","Martin","Fredrik","Tobias","Emil","Sondre","Håkon","Even","Vetle","Ullrik",
  "Sindre","Eirik","Jørgen","Aksel","Filip","Oliver","William","Noah","Jakob","Theodor",
  "Isak","Johannes","Daniel","Adrian","Petter","Bjørn","Erling","Kasper","Brede","Ola",
  "Knut","Trygve","Gard","Vegard","Steffen","Robin","Mats","Simen","Herman","Elias","Leon"];
const LAST=["Hansen","Johansen","Olsen","Larsen","Andersen","Pedersen","Nilsen","Kristiansen",
  "Jensen","Karlsen","Johnsen","Pettersen","Eriksen","Berg","Haugen","Hagen","Johannessen",
  "Andreassen","Jacobsen","Dahl","Jørgensen","Halvorsen","Lund","Solberg","Moen","Strand",
  "Gullihansen","Pålsen","Bakke","Rød","Tangen","Aas","Fjeld","Lie","Moe","Vik","Ness",
  "Sæther","Eide","Holm","Bø","Riise","Nordtveit","Selnæs","Ødegaard","Sørloth","Aursnes","Bobb"];
const POSORDER=["MV","FOR","MID","ANG"];
const POSNAME={MV:"Keeper",FOR:"Forsvar",MID:"Midtbane",ANG:"Angrep"};

/* Formasjoner: 11 plasser i rekkefølge keeper → spiss */
const FORMATIONS={
  "4-4-2":["MV","HB","MS","MS","VB","HM","SM","SM","VM","SP","SP"],
  "4-3-3":["MV","HB","MS","MS","VB","SM","SM","SM","HV","SP","VV"],
  "4-5-1":["MV","HB","MS","MS","VB","HM","SM","SM","SM","VM","SP"],
  "3-5-2":["MV","MS","MS","MS","HVB","SM","SM","SM","VVB","SP","SP"],
  "5-3-2":["MV","HVB","MS","MS","MS","VVB","SM","SM","SM","SP","SP"],
};
const ROLENAME={MV:"Keeper",HB:"Høyreback",VB:"Venstreback",MS:"Midtstopper",HVB:"Høyre vingback",
  VVB:"Venstre vingback",HM:"Høyre midtbane",VM:"Venstre midtbane",SM:"Sentral midtbane",
  HV:"Høyreving",VV:"Venstreving",SP:"Spiss"};
/* Hvilke naturlige posisjoner som passer på hver plass (uten styrketap) */
const ROLE_ALLOWED={MV:["MV"],HB:["FOR"],VB:["FOR"],MS:["FOR"],HVB:["FOR","MID"],VVB:["FOR","MID"],
  HM:["MID"],VM:["MID"],SM:["MID"],HV:["MID","ANG"],VV:["MID","ANG"],SP:["ANG"]};
const ROLE_GROUP={MV:"MV",HB:"FOR",VB:"FOR",MS:"FOR",HVB:"FOR",VVB:"FOR",HM:"MID",VM:"MID",SM:"MID",HV:"ANG",VV:"ANG",SP:"ANG"};

function playerValue(r){ return Math.round(Math.max(1,(r-25))**3 * 8); }
function genName(team,i){ const s=hash(team+'#'+i); return FIRST[s%FIRST.length]+' '+LAST[(s>>>9)%LAST.length]; }
function randName(){ return FIRST[(Math.random()*FIRST.length)|0]+' '+LAST[(Math.random()*LAST.length)|0]; }
function randNameSeeded(s){ return FIRST[s%FIRST.length]+' '+LAST[(s>>>9)%LAST.length]; }

/* EKTE tropper hentet fra fotball.no (Min Fotball). Posisjon/styrke settes i
   spillet ut fra klubbnivå, men spillernavnene er ekte. Legg til flere lag her. */
const REAL_SQUADS = {
  // 5. divisjon avd 2 (Rogaland) – Pol Tastas serie. Hentet fra fotball.no.
  "Pol Tasta": ["Henrik Vanebo","Chris Vasiliou","Sebastian Rinaldo Pedersen","Haakon Trengereid",
    "Mustafa Nasir Hassan Behi","Snorre Hol Djupvik","Stian Endregaard Sigvaldsen","Petter Tajet",
    "Bendik Sikveland","Sebastian Andrés Pedraza Canizalez","Jørgen Johansen","Marius Kambo Hafnor",
    "Jon Christian Harestad","Julian Veen Uldal","Erlend Usken Nevestveit","Brim Simen Eskeland",
    "Jesper Tangen","Andreas Kårtveit","Matias Kvernenes","Nicolai Rohde Garder"],
  "Bogafjell": ["Thomas Stangeland","Johannes Øen Grova","Halvor Homdrom Helleland","Håvard Ravndal",
    "Benjamin Nygaard Svendsen","Gaute Tønnessen","Morten Nybak Urdal","Knut Roald Bøe","Hans Christian Flåto",
    "Thomas Kjosavik","Ole Sandve","Andreas Eikeskog","Pelle Høie-Holgersen","Daniel Høllesli",
    "Kristoffer Hunshamar Frafjord","Svein Olav Mosvold","William Langeland","Jonas Østvold",
    "Jonas Duff Gausdal","Stian Frafjord"],
  "Austrått": ["John Kåre S. Fiskå","Petter Lind Sæbbe","Bård Moldekleiv Dalen","Morten Auestad Svendsen",
    "Mats Steinsvåg Sætre","Fredrik Selsås","Mikkel Nordgård Lunde","Mads Aanestad","Bennett Osei Kwame Blay",
    "Sondre Boseth Johansen","Jacob Emanuel Aanonsen","Andreas Egeland","Andreas Svela",
    "Halldor Broddi Thorsteinsson","Sigurd Scandellari Risdal","Tobias Frøiland","Brede Vedø Saunders",
    "Dia Undheim","Birk Tuen Aasland","Erik Tengs-Pedersen"],
  "Mastra": ["Bjørnar Aske","Sondre Grande Einertsen","Mathias Risa Håvarstein","Roar Austbø",
    "Vegard Håvarstein","Nils Mandius Aksdal","Emil Hodnefjell","Leif Halvor Torsen","Erik Brix Austerheim",
    "Hans Reianes Sørbø","Geir Gudmestad","Eilert Schanche Gudmestad","Tobias Lunde","Markus Risa Håvarstein",
    "Gabriel Ulvik Hagen","Truls Østbø","Mats Marius Hagelund Ueland","Tom Erik Aske","Erling Håvarstein",
    "Kjetil Berg Jåtten"],
  "Siddis": ["Daniel Torvaldsen Garip","Kristian Holmvik Malmo","Patrick Kirkerød","Alexander Mitesh Aloyseus",
    "Anders Bårdsen","Chris Formo","Morten Eide","Isak Tobias Hamre Asheim","Pedro Canedo Mesquita",
    "Danis Bajrovic","Jakob Bomo","Adrian Fosse Årthun","Christian Søndenå Hauge","Jostein Gloppen Holmsnes",
    "Mohammed Jawad Kadhim Al-Zeini","Karl Erik Ellingsen","Aksel Dymbe","Robin H. Stensbø"],
  "Stavanger": ["Nils Michauck","Nikolai Lilledal Bjerklund","Nils Marius Vikman Skjæveland",
    "Jonas Olsen Paulsrud","Simen Karlsen","Daniel Ekeland Osestad","Georg Rein","Ole Christer Høyer Mathiassen",
    "Oliver Aamodt Grapes","Aleksandar Georgije Cvetkovic","Ruben Laamanen Horsfjord","Nikolai Knoph-Rødseth",
    "Elias Belbo Lagestad","Henrik Simonsen","Peter Thien Hoang Tran","Matias Seglem Aasen","Sennay Mebrahtu",
    "Tor Andre Eskevik","Lasse Larsen","Vegard Marteng Staurland"],
  "Jarl": ["Henrik Ørke Wendelborg","Sigurd Grøvdal Hansen","Bjørnar Gabrielsen","Erik Mikal Midelfart Hoff",
    "Magnus Thornes Moen","Christian Lanojan Rosenborg","Felix Batt Lægreid","Lars Skjervheim Lunde",
    "Tomasz Dworak","Biak Vung Hlawn Ceu","Armin Colic","Daniil Vitalievich Slobozhanin","Hamsa Mohamed Ahmed",
    "Sondre Helgesen Fiskå","Vetle Haug Espevoll","Jacob Langseth","Mathias Rønsberg","Jonatan Bakkene Pedersen",
    "Aram Ali Azad","Noah Lessanu Beyene"],
  "Vaulen": ["Roy Andre Dyrdal","Vegard Eikevik","Aleksander Nordbø Idland","Ørjan Nesbø Røstøen",
    "Patrick Onyina Kofi Osei","Elias Myklebust Mathiesen","Audrius Mirauskas","Ekene Ramos Gonzalez",
    "Theodor Høksaas Gabrielsen"],
  "Fiskå": ["Thomas Rønneberg","Helge Bjørheim","John Erling Gabrielsen","Mads Bjelland","Even Tytlandsvik",
    "Frank Barka","Arild Lekvam","Grannt Havrevold","Mariusz Leszek Czapla","Fredrik Krumsvik",
    "Ola Alexander Fall Eie","Jarand Soppeland Jacobsen","Eirik Lerang","Tore Nordbø Jøssang","Morten Nag",
    "Gøran Helgesen","Iver Jensen","Markus Emile Storevik Sandvik","Trym Jørgensen","Jonas Kåsen"],
  // ---- Eliteserien 2026 – ekte tropper hentet fra Wikipedia ----
  // Bodø/Glimt – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Bodø/Glimt": [{name:"Julian Faye Lund",pos:"MV",age:27},{name:"Nikita Haikin",pos:"MV",age:31},{name:"Isak Sjong",pos:"MV",age:19},
    {name:"Fredrik Sjøvold",pos:"FOR",age:22},{name:"Kasper Johansen Solhaug",pos:"FOR",age:19},{name:"Villads Nielsen",pos:"FOR",age:21},
    {name:"Odin Lurås Bjørtuft",pos:"FOR",age:27},{name:"Haitam Aleesami",pos:"FOR",age:35},{name:"Jostein Gundersen",pos:"FOR",age:30},
    {name:"Fredrik André Bjørkan",pos:"FOR",age:27},{name:"Magnus Bech Riisnæs",pos:"FOR",age:21},{name:"Isak Dybvik Määttä",pos:"FOR",age:24},
    {name:"Joshua Kitolano",pos:"MID",age:25},{name:"Patrick Berg",pos:"MID",age:28},{name:"Sondre Auklend",pos:"MID",age:23},
    {name:"Ulrik Saltnes",pos:"MID",age:33},{name:"Sondre Brunstad Fet",pos:"MID",age:29},{name:"Håkon Evjen",pos:"MID",age:26},
    {name:"Ole Didrik Blomberg",pos:"ANG",age:26},{name:"Jens Petter Hauge",pos:"ANG",age:26},{name:"Daniel Bassi",pos:"ANG",age:21},
    {name:"Ola Brynhildsen",pos:"ANG",age:27},{name:"Andreas Helmersen",pos:"ANG",age:28},{name:"Mikkel Bro Hansen",pos:"ANG",age:17},{name:"August Mikkelsen",pos:"ANG",age:25}],
  // Viking – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Viking": [{name:"Erlend Jacobsen",pos:"MV",age:27},{name:"Arild Østbø",pos:"MV",age:35},{name:"Ľubomír Belko",pos:"MV",age:24},
    {name:"Viljar Vevatne",pos:"FOR",age:31},{name:"Martin Ove Roseth",pos:"FOR",age:28},{name:"Henrik Heggheim",pos:"FOR",age:25},
    {name:"Gianni Stensness",pos:"FOR",age:27},{name:"Sondre Bjørshol",pos:"FOR",age:32},{name:"Anders Bærtelsen",pos:"FOR",age:26},
    {name:"Franco Lino",pos:"FOR",age:20},{name:"Vetle Auklend",pos:"FOR",age:21},{name:"Henrik Falchener",pos:"FOR",age:23},
    {name:"Jesper Daland",pos:"FOR",age:26},{name:"Kristoffer Haugen",pos:"FOR",age:32},{name:"Fillip Voster Botnen",pos:"FOR",age:20},
    {name:"Kristoffer Askildsen",pos:"MID",age:25},{name:"Joe Bell",pos:"MID",age:27},{name:"Ola Visted",pos:"MID",age:21},
    {name:"Ruben Alte",pos:"MID",age:26},{name:"Simen Kvia-Egeskog",pos:"MID",age:23},{name:"Tobias Moi",pos:"MID",age:20},
    {name:"Jakob Segadal Hansen",pos:"MID",age:21},
    {name:"Herman Haugen",pos:"ANG",age:26},{name:"Nicholas D'Agostino",pos:"ANG",age:28},{name:"Zlatko Tripić",pos:"ANG",age:33},
    {name:"Romano Postema",pos:"ANG",age:24},{name:"Veton Berisha",pos:"ANG",age:32},{name:"Edvin Austbø",pos:"ANG",age:21},
    {name:"Amin Cosic",pos:"ANG",age:20},{name:"Peter Christiansen",pos:"ANG",age:26},{name:"Niklas Fuglestad",pos:"ANG",age:20},{name:"Kelvin Frimpong",pos:"ANG",age:18}],
  // Brann – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Brann": [{name:"Tom Bramel",pos:"MV",age:21},{name:"Mathias Dyngeland",pos:"MV",age:30},{name:"Simen Vidtun Nilsen",pos:"MV",age:26},
    {name:"Fredrik Pallesen Knudsen",pos:"FOR",age:29},{name:"Nana Kwame Boakye",pos:"FOR",age:20},{name:"Cheikh Mbacké Diop",pos:"FOR",age:20},
    {name:"Thore Pedersen",pos:"FOR",age:29},{name:"Jonas Torsvik",pos:"FOR",age:21},{name:"Joachim Soltvedt",pos:"FOR",age:30},
    {name:"Vetle Dragsnes",pos:"FOR",age:32},{name:"Denzel De Roeve",pos:"FOR",age:22},
    {name:"Sakarias Opsahl",pos:"MID",age:27},{name:"Kristall Máni Ingason",pos:"MID",age:24},{name:"Jacob Lungi Sørensen",pos:"MID",age:28},
    {name:"Eggert Aron Guðmundsson",pos:"MID",age:22},{name:"Niklas Jensen Wassberg",pos:"MID",age:22},{name:"Rabbi Matondo",pos:"MID",age:25},
    {name:"Chinedu Ononogbo",pos:"ANG",age:19},{name:"Niklas Castro",pos:"ANG",age:30},{name:"Bård Finne",pos:"ANG",age:31},
    {name:"Ulrik Mathisen",pos:"ANG",age:27},{name:"Kristian Eriksen",pos:"ANG",age:31},{name:"Sævar Atli Magnússon",pos:"ANG",age:26},{name:"Noah Holm",pos:"ANG",age:25},{name:"Markus Haaland",pos:"ANG",age:21}],
  // Molde – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Molde": [{name:"Mads Kikkenborg",pos:"MV",age:26},{name:"Peder Hoel Lervik",pos:"MV",age:21},{name:"Albert Posiadała",pos:"MV",age:23},
    {name:"Sivert Sira Hansen",pos:"FOR",age:24},{name:"Mathias Fjørtoft Løvik",pos:"FOR",age:22},{name:"Halldor Stenevik",pos:"FOR",age:26},
    {name:"Eirik Haugan",pos:"FOR",age:28},{name:"Martin Linnes",pos:"FOR",age:34},{name:"Samukele Kabini",pos:"FOR",age:22},
    {name:"Fredrik Kristensen Dahl",pos:"FOR",age:27},{name:"Birk Risa",pos:"FOR",age:28},
    {name:"Niklas Ødegård",pos:"MID",age:22},{name:"Emil Breivik",pos:"MID",age:26},{name:"Jacob Steen Christensen",pos:"MID",age:25},
    {name:"Vebjørn Hoff",pos:"MID",age:30},{name:"Mats Møller Dæhli",pos:"MID",age:31},{name:"Mads Enggård",pos:"MID",age:22},
    {name:"Sondre Granaas",pos:"MID",age:19},{name:"Viktor Bender",pos:"MID",age:19},{name:"Daniel Daga",pos:"MID",age:19},
    {name:"Jonathan Fugelsnes",pos:"ANG",age:18},{name:"Eirik Hestad",pos:"ANG",age:31},{name:"Jalal Abdullai",pos:"ANG",age:21},
    {name:"Caleb Zady Sery",pos:"ANG",age:26},{name:"Oskar Spiten-Nysæter",pos:"ANG",age:18},{name:"Trent Koné-Doherty",pos:"ANG",age:20},{name:"Seydina Diop",pos:"ANG",age:21}],
  // Rosenborg – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Rosenborg": [{name:"Leopold Wahlstedt",pos:"MV",age:27},{name:"Rasmus Sandberg",pos:"MV",age:25},{name:"Haakon Sørum",pos:"MV",age:20},
    {name:"Mark Mampassi",pos:"FOR",age:23},{name:"Håkon Røsten",pos:"FOR",age:21},{name:"Tobias Solheim Dahl",pos:"FOR",age:21},
    {name:"Mikkel Konradsen Ceïde",pos:"FOR",age:24},{name:"Håkon Singsdal Volden",pos:"FOR",age:19},{name:"Jonas Mortensen",pos:"FOR",age:25},
    {name:"Aslak Fonn Witry",pos:"FOR",age:30},{name:"Adrian Pereira",pos:"FOR",age:26},{name:"Tomáš Nemčík",pos:"FOR",age:25},
    {name:"Jonas Svensson",pos:"FOR",age:33},{name:"Ulrik Hald-Hernes",pos:"FOR",age:17},{name:"Elias Slørdal",pos:"FOR",age:17},
    {name:"Simen Bolkan Nordli",pos:"MID",age:26},{name:"Iver Fossum",pos:"MID",age:30},{name:"Ole Selnæs",pos:"MID",age:32},
    {name:"Mads Bomholt",pos:"MID",age:20},{name:"Aleksander Borgersen",pos:"MID",age:17},{name:"Johan Bakke",pos:"MID",age:22},
    {name:"Dino Islamović",pos:"ANG",age:32},{name:"Noah Sahsah",pos:"ANG",age:21},{name:"Jesper Reitan-Sunde",pos:"ANG",age:20},
    {name:"Amin Chiakha",pos:"ANG",age:20},{name:"David Duris",pos:"ANG",age:27},{name:"Emil Konradsen Ceïde",pos:"ANG",age:24},{name:"Daniel Thorstensen",pos:"ANG",age:19}],
  // Tromsø – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Tromsø": [{name:"Jakob Haugaard",pos:"MV",age:34},{name:"Ole Kristian Gjefle Lauvli",pos:"MV",age:32},{name:"Abderrahmane Sarr",pos:"MV",age:21},
    {name:"Mathias Tønnessen",pos:"FOR",age:22},{name:"Vetle Skjærvik",pos:"FOR",age:25},{name:"Benjamin Myrvold",pos:"FOR",age:16},
    {name:"Leon Hien",pos:"FOR",age:25},{name:"Casper Øyvann",pos:"FOR",age:26},{name:"Mads Mikkelsen",pos:"FOR",age:17},{name:"Isak Vådebu",pos:"FOR",age:23},
    {name:"David Edvardsson",pos:"MID",age:24},{name:"Jesper Grundt",pos:"MID",age:23},{name:"Ruben Yttergård Jenssen",pos:"MID",age:38},
    {name:"Leo Cornic",pos:"MID",age:25},{name:"Alexander Warneryd",pos:"MID",age:20},{name:"Sander Håvik Innvær",pos:"MID",age:21},{name:"Isak Dahlqvist",pos:"MID",age:24},
    {name:"Troy Nyhammer",pos:"ANG",age:19},{name:"Aleksander Lilletun Elvebu",pos:"ANG",age:17},{name:"Frederik Christensen",pos:"ANG",age:25},
    {name:"Lars Olden Larsen",pos:"ANG",age:27},{name:"Daniel Braut",pos:"ANG",age:21},{name:"Viktor Ekblom",pos:"ANG",age:28},{name:"Ieltsin Camões",pos:"ANG",age:27},{name:"Heine Åsen Larsen",pos:"ANG",age:24}],
  // Vålerenga – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Vålerenga": [{name:"Oscar Hedvall",pos:"MV",age:28},{name:"Sander Lønning",pos:"MV",age:23},{name:"Magnus Sjøeng",pos:"MV",age:24},{name:"Alexander Svensen Ordal",pos:"MV",age:18},
    {name:"Kolbeinn Finnsson",pos:"FOR",age:26},{name:"Håkon Sjåtil",pos:"FOR",age:23},{name:"Aaron Kiil Olsen",pos:"FOR",age:25},
    {name:"Kevin Tshiembe",pos:"FOR",age:29},{name:"Vegar Eggen Hedenstad",pos:"FOR",age:35},{name:"Mario Gomes",pos:"FOR",age:19},
    {name:"Ivan Näsberg",pos:"FOR",age:30},{name:"Sebastian Jarl",pos:"FOR",age:26},
    {name:"Henrik Bjørdal",pos:"MID",age:29},{name:"Carl Lange",pos:"MID",age:27},{name:"Odin Thiago Holm",pos:"MID",age:23},
    {name:"Magnus Westergaard",pos:"MID",age:28},{name:"Fidel Brice Ambina",pos:"MID",age:24},
    {name:"Mohamed Ofkir",pos:"ANG",age:30},{name:"Gabriel Larsen Rajkovic",pos:"ANG",age:15},{name:"Mathias Grundetjern",pos:"ANG",age:26},
    {name:"Even Forcha",pos:"ANG",age:17},{name:"Promise Meliga",pos:"ANG",age:18},{name:"Petter Strand",pos:"ANG",age:31},{name:"Filip Thorvaldsen",pos:"ANG",age:20},
    {name:"Lucas Haren",pos:"ANG",age:28},{name:"Ole Sæter",pos:"ANG",age:30},{name:"Omar Bully Drammeh",pos:"ANG",age:23}],
  // Lillestrøm – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Lillestrøm": [{name:"Stefan Hagerup",pos:"MV",age:32},{name:"Pontus Dahlberg",pos:"MV",age:27},
    {name:"Lars Ranger",pos:"FOR",age:27},{name:"Sturla Ottesen",pos:"FOR",age:25},{name:"Espen Garnås",pos:"FOR",age:31},
    {name:"Sander Moen Foss",pos:"FOR",age:27},{name:"Frederik Elkær",pos:"FOR",age:24},{name:"John Kitolano",pos:"FOR",age:26},
    {name:"Ruben Gabrielsen",pos:"FOR",age:34},{name:"Stian Kristiansen",pos:"FOR",age:27},
    {name:"Harald Woxen",pos:"MID",age:18},{name:"Gustav Nyheim",pos:"MID",age:20},{name:"Gustav Nordh",pos:"MID",age:26},
    {name:"Eric Kitolano",pos:"MID",age:28},{name:"Kevin Martin Krygård",pos:"MID",age:26},{name:"Efe Lucky",pos:"MID",age:20},
    {name:"Ylldren Ibrahimaj",pos:"MID",age:30},{name:"Filip Vuyani Reshane",pos:"MID",age:18},{name:"Isa Jallow",pos:"MID",age:17},
    {name:"Linus Alperud",pos:"ANG",age:20},{name:"Kparobo Arierhi",pos:"ANG",age:19},{name:"Thomas Lehne Olsen",pos:"ANG",age:35},
    {name:"Camil Jebara",pos:"ANG",age:23},{name:"Felix Vá",pos:"ANG",age:27},{name:"Oluwaseun Ayoola Akanji",pos:"ANG",age:25},{name:"Yaw Paintsil",pos:"ANG",age:26},{name:"Ivar Winje",pos:"ANG",age:19},{name:"Fredrik Gulbrandsen",pos:"ANG",age:33}],
  // Fredrikstad – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Fredrikstad": [{name:"Øystein Øvretveit",pos:"MV",age:32},{name:"Ole Langbråten",pos:"MV",age:23},{name:"Martin Børsheim",pos:"MV",age:21},
    {name:"Kennedy Okpaleke",pos:"FOR",age:17},{name:"Fredrik Holmé",pos:"FOR",age:25},{name:"Ulrik Fredriksen",pos:"FOR",age:27},
    {name:"Sigurd Kvile",pos:"FOR",age:26},{name:"Jonathan Norbye",pos:"FOR",age:19},{name:"Chris Pondy",pos:"FOR",age:18},
    {name:"Solomon Owusu",pos:"FOR",age:30},{name:"Elias Toft Nordrum",pos:"FOR",age:19},{name:"Isak Helstad Amundsen",pos:"FOR",age:26},
    {name:"Simen Rafn",pos:"FOR",age:34},{name:"Joachim Nysveen",pos:"FOR",age:20},
    {name:"Jakub Jezierski",pos:"MID",age:22},{name:"Samuel Leach Holm",pos:"MID",age:28},{name:"Salim Laghzaoui",pos:"MID",age:20},
    {name:"Max Nilsson",pos:"MID",age:21},{name:"Oskar Øhlenschlæger",pos:"MID",age:22},{name:"Leonard Owusu",pos:"MID",age:29},
    {name:"Daniel Eid",pos:"MID",age:27},{name:"Sondre Sørløkk",pos:"MID",age:29},{name:"Fanuel Yrga-Alem",pos:"MID",age:19},
    {name:"Benjamin Faraas",pos:"ANG",age:20},{name:"Gabriel Wesseh",pos:"ANG",age:18},{name:"Johannes Nuñez",pos:"ANG",age:29},{name:"Henrik Skogvold",pos:"ANG",age:22}],
  // Sarpsborg 08 – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Sarpsborg 08": [{name:"Carljohan Eriksson",pos:"MV",age:31},{name:"Jesper Holter Skjoeren",pos:"MV",age:18},{name:"Leander Øy",pos:"MV",age:22},
    {name:"Luca Høyland",pos:"FOR",age:20},{name:"Claus Niyukuri",pos:"FOR",age:26},{name:"Eirik Wichne",pos:"FOR",age:29},
    {name:"Marius Lode",pos:"FOR",age:33},{name:"Bjørn Inge Utvik",pos:"FOR",age:30},{name:"Magnar Ødegaard",pos:"FOR",age:33},
    {name:"Sigurd Rosted",pos:"FOR",age:32},{name:"Magnus Mevik Eidal",pos:"FOR",age:18},{name:"Chris Kouakou",pos:"FOR",age:26},
    {name:"Peter Reinhardsen",pos:"FOR",age:27},{name:"Anders Hiim",pos:"FOR",age:23},
    {name:"Aimar Sher",pos:"MID",age:23},{name:"Sander Christiansen",pos:"MID",age:25},{name:"Victor Halvorsen",pos:"MID",age:22},
    {name:"Mathias Svenningsen-Grønn",pos:"MID",age:17},{name:"Harald Tangen",pos:"MID",age:25},{name:"Jo Inge Berget",pos:"MID",age:35},
    {name:"Bop Gueye",pos:"MID",age:19},{name:"Andreas Nibe",pos:"MID",age:23},
    {name:"Sondre Sørli",pos:"ANG",age:30},{name:"Michael Opoku",pos:"ANG",age:21},{name:"Frederik Carstensen",pos:"ANG",age:24},
    {name:"Noa Williams",pos:"ANG",age:24},{name:"Olaus Skarsem",pos:"ANG",age:28},{name:"Camil Mmaee",pos:"ANG",age:22},{name:"Daniel Karlsbakk",pos:"ANG",age:23}],
  // KFUM Oslo – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "KFUM Oslo": [{name:"Emil Ødegaard",pos:"MV",age:27},{name:"Håvar Jenssen",pos:"MV",age:30},{name:"Darian Weber Mink",pos:"MV",age:19},
    {name:"Daniel Schneider",pos:"FOR",age:24},{name:"Ayoub Aleesami",pos:"FOR",age:30},{name:"Momodou Lion Njie",pos:"FOR",age:24},
    {name:"Fredrik Berglie",pos:"FOR",age:29},{name:"Brage Skaret",pos:"FOR",age:24},{name:"Eirik Saunes",pos:"FOR",age:27},
    {name:"Brage Tobiassen",pos:"MID",age:19},{name:"Robin Rasch",pos:"MID",age:32},{name:"Mostafa Najafzadeh",pos:"MID",age:18},
    {name:"Tore André Sørås",pos:"MID",age:28},{name:"Marko Vuckovic",pos:"MID",age:16},{name:"Håkon Helland Hoseth",pos:"MID",age:27},
    {name:"Sander Sjøkvist",pos:"MID",age:27},{name:"Amin Nouri",pos:"MID",age:36},{name:"Jonas Lange Hjorth",pos:"MID",age:25},{name:"Magnus Wolff Eikrem",pos:"MID",age:36},
    {name:"Martin Tangen Vinjor",pos:"ANG",age:26},{name:"Bilal Njie",pos:"ANG",age:28},{name:"Moussa Njie",pos:"ANG",age:30},
    {name:"Rasmus Eggen Vinge",pos:"ANG",age:25},{name:"Bjørn Martin Kristensen",pos:"ANG",age:24},{name:"Magnus Grødem",pos:"ANG",age:27},{name:"David Hickson Gyedu",pos:"ANG",age:29}],
  // HamKam – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "HamKam": [{name:"Marcus Sandberg",pos:"MV",age:35},{name:"Sander Østraat",pos:"MV",age:21},{name:"Simon Rusen",pos:"MV",age:18},
    {name:"Martin Gjone",pos:"FOR",age:21},{name:"Ethan Amundsen-Day",pos:"FOR",age:21},{name:"Halvor Rødølen Opsahl",pos:"FOR",age:23},
    {name:"Snorre Strand Nilsen",pos:"FOR",age:29},{name:"Fredrik Sjølstad",pos:"FOR",age:32},{name:"Ola Nikolai Rye",pos:"FOR",age:21},
    {name:"Aleksander Andresen",pos:"MID",age:21},{name:"William Osnes-Ringen",pos:"MID",age:19},{name:"Viðar Ari Jónsson",pos:"MID",age:32},
    {name:"Markus Johnsgård",pos:"MID",age:27},{name:"Loris Mettler",pos:"MID",age:27},{name:"Luc Mares",pos:"MID",age:29},
    {name:"Anders Trondsen",pos:"MID",age:31},{name:"Aksel Baran Potur",pos:"MID",age:23},{name:"Noah Alexandersson",pos:"MID",age:24},
    {name:"Patrick Metcalfe",pos:"MID",age:27},{name:"Blerton Isufi",pos:"MID",age:20},
    {name:"Henrik Udahl",pos:"ANG",age:29},{name:"Julian Gonstad",pos:"ANG",age:20},{name:"Danilo Al-Saed",pos:"ANG",age:27},{name:"David Benjamin",pos:"ANG",age:18}],
  // Kristiansund – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Kristiansund": [{name:"Michael Lansing",pos:"MV",age:32},{name:"Adrian Sæther",pos:"MV",age:25},
    {name:"Anders Børset",pos:"FOR",age:20},{name:"Frederik Flex",pos:"FOR",age:22},{name:"Júlíus Mar Júlíusson",pos:"FOR",age:22},
    {name:"Dan Peter Ulvestad",pos:"FOR",age:37},{name:"Alexander Munksgaard",pos:"FOR",age:28},{name:"Max Normann Williamsen",pos:"FOR",age:23},
    {name:"Igor Jelicic",pos:"FOR",age:26},{name:"Isak Hagen Aalberg",pos:"FOR",age:21},
    {name:"Jesper Isaksen",pos:"MID",age:26},{name:"Heine Gikling Bruseth",pos:"MID",age:22},{name:"Syver Skeide",pos:"MID",age:21},
    {name:"Wilfred George Igor",pos:"MID",age:21},{name:"Tobias Svendsen",pos:"MID",age:26},{name:"Adrian Kurd Rønning",pos:"MID",age:20},
    {name:"Sander Svendsen",pos:"ANG",age:29},{name:"Sander Kilen",pos:"ANG",age:21},{name:"David Tufekcic",pos:"ANG",age:22},
    {name:"Leander Næss Alvheim",pos:"ANG",age:21},{name:"Haakon Haugen",pos:"ANG",age:19},{name:"Hrannar Snær Magnússon",pos:"ANG",age:24}],
  // Sandefjord – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Sandefjord": [{name:"Alf Lukas Grønneberg",pos:"MV",age:22},{name:"Elias Hadaya",pos:"MV",age:27},
    {name:"Fredrik Carson Pedersen",pos:"FOR",age:23},{name:"Filip Loftesnes-Bjune",pos:"FOR",age:21},{name:"Rasmus Holten",pos:"FOR",age:21},
    {name:"Håkon Krogelien",pos:"FOR",age:22},{name:"Devon Koswal",pos:"FOR",age:22},{name:"Henrik Barstad Skretteberg",pos:"FOR",age:18},
    {name:"Xander Lambrix",pos:"FOR",age:26},{name:"Vetle Walle Egeli",pos:"FOR",age:22},{name:"Gustav Højbjerg",pos:"FOR",age:22},{name:"Martin Hellan",pos:"FOR",age:22},
    {name:"Sander Risan Mørk",pos:"MID",age:25},{name:"Edvard Sundbø Pettersen",pos:"MID",age:20},{name:"Marcus Melchior",pos:"MID",age:25},
    {name:"Jakob Jakobsen Swift",pos:"MID",age:19},{name:"Jakob Vester",pos:"MID",age:21},{name:"Daniel Skaarud",pos:"MID",age:19},{name:"Alexander Blomdahl",pos:"MID",age:19},
    {name:"Evangelos Patoulidis",pos:"ANG",age:24},{name:"Mathias Sauer",pos:"ANG",age:22},{name:"Foster Apetorgbor",pos:"ANG",age:18},
    {name:"Bendik Berntsen",pos:"ANG",age:19},{name:"Jakob Dunsby",pos:"ANG",age:26},{name:"Oscar Kapskarmo",pos:"ANG",age:26},{name:"Nikolaj Möller",pos:"ANG",age:24},{name:"Sebastian Holm Mathisen",pos:"ANG",age:21}],
  // Start – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Start": [{name:"Jacob Pryts",pos:"MV",age:28},{name:"Jasper Silva Torkildsen",pos:"MV",age:22},{name:"Filip Manojlovic",pos:"MV",age:30},
    {name:"Altin Ujkani",pos:"FOR",age:26},{name:"Johan Meyer",pos:"FOR",age:22},{name:"John Olav Norheim",pos:"FOR",age:31},
    {name:"Sebastian Griesbeck",pos:"FOR",age:35},{name:"Kristoffer Tønnessen",pos:"FOR",age:28},{name:"Jens Husebø",pos:"FOR",age:27},
    {name:"Erlend Dahl Reitan",pos:"FOR",age:28},
    {name:"Fredrik Pålerud",pos:"MID",age:32},{name:"Stève Mvoué",pos:"MID",age:24},{name:"Deni Dashaev",pos:"MID",age:21},
    {name:"Markus Soomets",pos:"MID",age:26},{name:"Tom Strannegård",pos:"MID",age:24},{name:"Mikael Ugland",pos:"MID",age:26},
    {name:"Erlend Segberg",pos:"MID",age:29},{name:"Ousmane Toure",pos:"MID",age:23},{name:"Lukas Hjelleset Gausdal",pos:"MID",age:19},{name:"Filip Lien",pos:"MID",age:17},
    {name:"Eirik Schulze",pos:"ANG",age:33},{name:"Marius Nordal",pos:"ANG",age:19},{name:"Jesper Cornelius",pos:"ANG",age:25},
    {name:"Håkon Lorentzen",pos:"ANG",age:29},{name:"James Ampofo",pos:"ANG",age:22},{name:"Terry Benjamin",pos:"ANG",age:21},{name:"Santino Samuyiwa",pos:"ANG",age:20}],
  // Aalesund – EKTE posisjon + alder (FotMob, 2026) – full tropp
  "Aalesund": [{name:"Luca Podlech",pos:"MV",age:21},{name:"Tor Erik Larsen",pos:"MV",age:27},{name:"Philip Storås",pos:"MV",age:19},
    {name:"Ólafur Guðmundsson",pos:"FOR",age:24},{name:"Simen Vatne Haram",pos:"FOR",age:21},{name:"Aleksander Hammer Kjelsen",pos:"FOR",age:20},
    {name:"Emil Engqvist",pos:"FOR",age:27},{name:"Ulrik Syversen",pos:"FOR",age:23},{name:"Philip Aukland",pos:"FOR",age:27},
    {name:"Marius Andresen",pos:"MID",age:26},{name:"Håkon Butli Hammer",pos:"MID",age:26},{name:"Kristoffer Nessø",pos:"MID",age:33},
    {name:"Henrik Melland",pos:"MID",age:21},{name:"Mathias Kristensen",pos:"MID",age:29},{name:"Davíð Jóhannsson",pos:"MID",age:24},
    {name:"Uba Charles",pos:"MID",age:23},{name:"Jakob Nyland Ørsahl",pos:"MID",age:25},{name:"Elias Hagen",pos:"MID",age:26},
    {name:"Mathias Christensen",pos:"MID",age:24},{name:"Janus Seehusen",pos:"MID",age:23},
    {name:"Paul Ngongo",pos:"ANG",age:26},{name:"Endre Osenbroch",pos:"ANG",age:22},{name:"Elias Myrlid",pos:"ANG",age:24},
    {name:"Ivan Djantou",pos:"ANG",age:24},{name:"Marcus Reed",pos:"ANG",age:18},{name:"Storm Karlsson Knutsen",pos:"ANG",age:18},{name:"Kristoffer Hoddevik",pos:"ANG",age:18},{name:"Kristian Lonebu",pos:"ANG",age:20}],
  // ---- 1. divisjon (OBOS-ligaen) 2026 – ekte tropper fra Wikipedia ----
  // Åsane – EKTE posisjon + alder (Transfermarkt, 2026)
  "Åsane": [{name:"Sebastian Selin",pos:"MV",age:23},{name:"Storm Strand-Kolbjørnsen",pos:"MV",age:22},
    {name:"Hassou Diaby",pos:"FOR",age:24},{name:"Kristoffer Barmen",pos:"FOR",age:32},{name:"Malvin Ingebrigtsen",pos:"FOR",age:27},
    {name:"Sebastian Brudvik",pos:"FOR",age:25},{name:"Snorre Stavseth Furnes",pos:"FOR",age:20},{name:"Filip Oprea",pos:"FOR",age:20},
    {name:"Knut Haga",pos:"FOR",age:27},{name:"Dennis Møller Wolfe",pos:"FOR",age:26},
    {name:"Tobias Luggenes Furebotn",pos:"MID",age:21},{name:"Einar Iversen",pos:"MID",age:25},{name:"Breki Baldursson",pos:"MID",age:19},
    {name:"Thomas Lotsberg",pos:"MID",age:20},{name:"Herman Geelmuyden",pos:"MID",age:24},{name:"Jesper Eikrem",pos:"MID",age:19},
    {name:"Magnus Spangelo Haga",pos:"ANG",age:19},{name:"Emanuel Grønner",pos:"ANG",age:25},{name:"Leonardo Rossi",pos:"ANG",age:22},
    {name:"Stian Nygard",pos:"ANG",age:31},{name:"Malte Fismen",pos:"ANG",age:16}],
  // Bryne – EKTE posisjon + alder (Transfermarkt, 2026)
  "Bryne": [{name:"Magnus Rugland Ree",pos:"MV",age:22},{name:"Jan de Boer",pos:"MV",age:26},
    {name:"Patrick André Wik",pos:"FOR",age:21},{name:"Jacob Haahr Steffensen",pos:"FOR",age:24},{name:"Adrian Røragen Hermansen",pos:"FOR",age:20},
    {name:"Kristoffer Hay",pos:"FOR",age:27},{name:"Fabian Jeppestøl Engedal",pos:"FOR",age:21},{name:"Anders Molund",pos:"FOR",age:22},
    {name:"Lasse Qvigstad",pos:"FOR",age:22},{name:"Dadi Gaye",pos:"FOR",age:31},
    {name:"Nicklas Strunck",pos:"MID",age:26},{name:"Lars Erik Sødal",pos:"MID",age:24},{name:"Martin Åmot Lye",pos:"MID",age:18},
    {name:"Paya Pichkah",pos:"MID",age:26},{name:"Mats Thornes",pos:"MID",age:23},
    {name:"Kristian Skurve Håland",pos:"ANG",age:19},{name:"Remi-André Svindland",pos:"ANG",age:28},{name:"Duarte Moreira",pos:"ANG",age:24},
    {name:"Alfred Scriven",pos:"ANG",age:28},{name:"Sjur Jonassen",pos:"ANG",age:21},{name:"Jaran Eike Østrem",pos:"ANG",age:18}],
  // Egersund – EKTE posisjon + alder (Transfermarkt, 2026)
  "Egersund": [{name:"Marcel Zapytowski",pos:"MV",age:25},{name:"Mads Eriksen",pos:"MV",age:22},
    {name:"Ali Suljic",pos:"FOR",age:28},{name:"Isak Jönsson",pos:"FOR",age:27},{name:"Nicolas Pignatel Jenssen",pos:"FOR",age:24},
    {name:"Bjørn Mæland",pos:"FOR",age:25},{name:"Sammi Davis",pos:"FOR",age:21},{name:"Sivert Westerlund",pos:"FOR",age:27},
    {name:"Kristian Kjeverud Eggen",pos:"FOR",age:27},{name:"Herman Kleppa",pos:"FOR",age:29},
    {name:"Kasper Sætherbø",pos:"MID",age:21},{name:"Jesper Gregersen",pos:"MID",age:21},{name:"Scott Vatne",pos:"MID",age:26},
    {name:"Chris Sleveland",pos:"MID",age:29},{name:"Jan Inge Lynum",pos:"MID",age:26},{name:"Horenus Tadesse",pos:"MID",age:28},
    {name:"Stian Michalsen",pos:"ANG",age:29},{name:"Jostein Ekeland",pos:"ANG",age:29},{name:"Paweł Chrupałła",pos:"ANG",age:23},
    {name:"Nicolaj Tornvig Hansen",pos:"ANG",age:19},{name:"Hinrik Hardarson",pos:"ANG",age:22}],
  // Haugesund – EKTE posisjon + alder (Transfermarkt, 2026)
  "Haugesund": [{name:"Per Kristian Bråtveit",pos:"MV",age:30},{name:"Frank Stople",pos:"MV",age:24},
    {name:"Miika Koskela",pos:"FOR",age:23},{name:"Rasmus Møller",pos:"FOR",age:26},{name:"Martin Bjørnbak",pos:"FOR",age:34},
    {name:"Stian Molde",pos:"FOR",age:29},{name:"Anders Bondhus",pos:"FOR",age:21},{name:"Pål Engseth Lie",pos:"FOR",age:19},
    {name:"Mikkel Hope",pos:"FOR",age:20},{name:"Vegard Solheim",pos:"FOR",age:21},
    {name:"Emir Derviskadic",pos:"MID",age:22},{name:"Sivert Heltne Nilsen",pos:"MID",age:34},{name:"Lars Remmem",pos:"MID",age:20},
    {name:"Pyry Hannola",pos:"MID",age:24},{name:"Almar Grindhaug",pos:"MID",age:20},{name:"Bruno Leite",pos:"MID",age:31},
    {name:"Eirik Viland Andersen",pos:"ANG",age:23},{name:"Niklas Sandberg",pos:"ANG",age:31},{name:"Emil Rohd",pos:"ANG",age:21},
    {name:"Sory Ibrahim Diarra",pos:"ANG",age:26},{name:"Ismaël Seone",pos:"ANG",age:21},{name:"Håvard Vatland Karlsen",pos:"ANG",age:24}],
  // Hødd – EKTE posisjon + alder (Transfermarkt, 2026)
  "Hødd": [{name:"Thomas Kinn",pos:"MV",age:27},{name:"Oscar Buur",pos:"MV",age:19},
    {name:"Mirza Mulac",pos:"FOR",age:20},{name:"Sondre Fosnæss Hanssen",pos:"FOR",age:25},{name:"Eirik Blikstad",pos:"FOR",age:22},
    {name:"Tage Johansen",pos:"FOR",age:23},{name:"Marcus Mikhail",pos:"FOR",age:26},{name:"Åsmund Roppen",pos:"FOR",age:19},
    {name:"Jesper Robertsen",pos:"FOR",age:22},{name:"Gudmund Andresen",pos:"FOR",age:20},
    {name:"Matthew Scarcella",pos:"MID",age:22},{name:"Halvard Urnes",pos:"MID",age:24},{name:"Torbjørn Kallevåg",pos:"MID",age:32},
    {name:"Fredrik Dimmen Gjerde",pos:"MID",age:22},
    {name:"Vegard Håheim-Elveseter",pos:"ANG",age:22},{name:"Martin Håheim-Elveseter",pos:"ANG",age:20},{name:"Isak Gabriel Skotheim",pos:"ANG",age:25},
    {name:"Cameron Streete",pos:"ANG",age:27},{name:"Jon Berisha",pos:"ANG",age:21},{name:"Manaf Rawufu",pos:"ANG",age:21}],
  // Kongsvinger – EKTE posisjon + alder (Transfermarkt, 2026)
  "Kongsvinger": [{name:"Aleksey Gorodovoy",pos:"MV",age:32},{name:"William Da Rocha",pos:"MV",age:24},
    {name:"Mapenda Mbow",pos:"FOR",age:22},{name:"Sondre Norheim",pos:"FOR",age:29},{name:"Adrian Aleksander Hansen",pos:"FOR",age:24},
    {name:"Daniel Lysgård",pos:"FOR",age:27},{name:"Victor Fors",pos:"FOR",age:27},{name:"Emil Nielsen",pos:"FOR",age:26},
    {name:"Saadiq Elmi",pos:"FOR",age:25},{name:"Herman Udnæs",pos:"FOR",age:21},
    {name:"Frederik Christensen",pos:"MID",age:26},{name:"Andreas Dybevik",pos:"MID",age:28},{name:"Mathias Gjerstrøm",pos:"MID",age:29},
    {name:"Daniel Job",pos:"ANG",age:20},{name:"Mads Sande",pos:"ANG",age:28},{name:"Rasmus Christiansen",pos:"ANG",age:22},
    {name:"Markus Flores",pos:"ANG",age:20},{name:"Leon Hovland",pos:"ANG",age:22},{name:"Ludvig Langrekken",pos:"ANG",age:27},
    {name:"Gabriel Johnson",pos:"ANG",age:24}],
  // Lyn – EKTE posisjon + alder (Transfermarkt, 2026)
  "Lyn": [{name:"Alexander Pedersen",pos:"MV",age:31},{name:"Marcus Andersen",pos:"MV",age:25},
    {name:"William Sell",pos:"FOR",age:27},{name:"Ådne Midtskogen",pos:"FOR",age:27},{name:"Edvard Race",pos:"FOR",age:29},
    {name:"Seydina Ousmane Gueye",pos:"FOR",age:19},{name:"Herman Solberg Nilsen",pos:"FOR",age:27},{name:"Isaac Barnett",pos:"FOR",age:20},
    {name:"Sander Amble Haugen",pos:"FOR",age:26},
    {name:"Mathias Emilsen",pos:"MID",age:23},{name:"William Kurtovic",pos:"MID",age:30},{name:"Johan Solstad-Nøis",pos:"MID",age:18},
    {name:"Isaac Monglo",pos:"MID",age:18},{name:"Didrik Fredriksen",pos:"MID",age:27},{name:"Ole Kallevåg",pos:"MID",age:25},{name:"Julius Skaug",pos:"MID",age:28},
    {name:"Mathias Johansen",pos:"ANG",age:30},{name:"Anders Bjørntvedt Olsen",pos:"ANG",age:26},{name:"Artan Memedov",pos:"ANG",age:21},
    {name:"Andreas Hellum",pos:"ANG",age:28},{name:"Fallou Sock",pos:"ANG",age:19}],
  // Moss – EKTE posisjon + alder (Transfermarkt, 2026)
  "Moss": [{name:"Mathias Enger Eriksen",pos:"MV",age:30},{name:"Mads Nymark Rylandsholm",pos:"MV",age:20},
    {name:"Omar Jebali",pos:"FOR",age:26},{name:"Patrik Andersen",pos:"FOR",age:21},{name:"Kristoffer Lassen Harrison",pos:"FOR",age:24},
    {name:"Kristian Strande",pos:"FOR",age:28},{name:"Emmanuel Chidi",pos:"FOR",age:19},{name:"William Kvale",pos:"FOR",age:20},
    {name:"Mikkel Lassen",pos:"FOR",age:25},{name:"Marius Cassidy",pos:"FOR",age:22},
    {name:"Jamiu Musbaudeen",pos:"MID",age:22},{name:"Lasse Overgaard",pos:"MID",age:20},{name:"Håkon Vold Krohg",pos:"MID",age:19},
    {name:"Jonas Selnæs",pos:"MID",age:21},{name:"Robert Marcus",pos:"MID",age:22},{name:"Aksel Aasheim Engesvik",pos:"MID",age:22},{name:"Sigurd Grønli",pos:"MID",age:25},
    {name:"Julian Lægreid",pos:"ANG",age:19},{name:"Robin Hermanstad",pos:"ANG",age:26},{name:"Jerry Ogbole",pos:"ANG",age:19},
    {name:"Oscar Aga",pos:"ANG",age:25},{name:"Niclas Schjøth Semmen",pos:"ANG",age:23}],
  // Odd – EKTE posisjon + alder (Transfermarkt, 2026)
  "Odd": [{name:"Sebastian Hansen",pos:"MV",age:19},{name:"Idar Lysgård",pos:"MV",age:31},
    {name:"Hans Christian Bonnesen",pos:"FOR",age:25},{name:"Jakob Vadstrup",pos:"FOR",age:23},{name:"Godwill Ambrose",pos:"FOR",age:20},
    {name:"Oliver Svenungsen Skau",pos:"FOR",age:20},{name:"Samuel Skree Skjeldal",pos:"FOR",age:22},{name:"Josef Baccay",pos:"FOR",age:25},
    {name:"Nikolas Walstad",pos:"FOR",age:29},{name:"Jacob Buus",pos:"FOR",age:29},
    {name:"Mukhtar Adamu",pos:"MID",age:19},{name:"Daniel Söderberg",pos:"MID",age:29},{name:"Filip Rønningen Jørgensen",pos:"MID",age:24},
    {name:"Noah Kojo",pos:"MID",age:20},{name:"Gard Simenstad",pos:"MID",age:27},{name:"Syver Aas",pos:"MID",age:22},
    {name:"Faniel Tewelde",pos:"ANG",age:19},{name:"Villads Rasmussen",pos:"ANG",age:24},{name:"Abduljeleel Abdulateef",pos:"ANG",age:20},
    {name:"Sanel Bojadzic",pos:"ANG",age:27},{name:"Kasper Andersen",pos:"ANG",age:28},{name:"Zakaria Mugeese",pos:"ANG",age:24}],
  // Ranheim – EKTE posisjon + alder (Transfermarkt, 2026)
  "Ranheim": [{name:"Jacob Storevik",pos:"MV",age:30},{name:"Oliver Madsen",pos:"MV",age:23},
    {name:"Philip Slørdahl",pos:"FOR",age:25},{name:"Thomas Eeg Kongerud",pos:"FOR",age:25},{name:"Mamadou Diang",pos:"FOR",age:22},
    {name:"Noah Pallas",pos:"FOR",age:25},{name:"Christoffer Aasbak",pos:"FOR",age:33},{name:"Håkon Gangstad",pos:"FOR",age:24},
    {name:"Jonas Pereira",pos:"FOR",age:28},{name:"Tage Haukeberg",pos:"FOR",age:25},
    {name:"Stian Sjøvold",pos:"MID",age:20},{name:"Oliver Holden",pos:"MID",age:21},{name:"Elias Johnsson Solberg",pos:"MID",age:18},
    {name:"Gjermund Åsen",pos:"MID",age:35},
    {name:"Maill Lundgren",pos:"ANG",age:25},{name:"Maurice Sylva",pos:"ANG",age:18},{name:"Mikael Tørset Johnsen",pos:"ANG",age:26},
    {name:"Andreas Fossli",pos:"ANG",age:29},{name:"Sebastian Haugland",pos:"ANG",age:30},{name:"Gustav Mogensen",pos:"ANG",age:25}],
  // Raufoss – EKTE posisjon + alder (Transfermarkt, 2026)
  "Raufoss": [{name:"Anders Klemensson",pos:"MV",age:29},{name:"David Synstelien",pos:"MV",age:24},
    {name:"Eskil Furre Gjerde",pos:"FOR",age:23},{name:"Alexander Achinioti-Jönsson",pos:"FOR",age:30},{name:"Sebastian Gjelsvik",pos:"FOR",age:24},
    {name:"Nicolai Fremstad",pos:"FOR",age:28},{name:"Mads Orrhaug Larsen",pos:"FOR",age:20},{name:"João Barros",pos:"FOR",age:25},
    {name:"Eirik Dahl Åsvestad",pos:"FOR",age:25},{name:"Jørgen Vedal Sjøl",pos:"FOR",age:25},{name:"Erik Ansok Frøysa",pos:"FOR",age:25},
    {name:"Torjus Engebakken",pos:"MID",age:19},{name:"Harald Holter",pos:"MID",age:30},{name:"Kristian Lønstad Onsrud",pos:"MID",age:32},
    {name:"Emil Sildnes",pos:"MID",age:33},
    {name:"Rafik Zekhnini",pos:"ANG",age:28},{name:"Markus Aanesland",pos:"ANG",age:28},{name:"Yaw Agyeman",pos:"ANG",age:23},
    {name:"Adrian Rogulj",pos:"ANG",age:27}],
  // Sandnes Ulf – EKTE posisjon + alder (Transfermarkt, 2026)
  "Sandnes Ulf": [{name:"Tord Flolid",pos:"MV",age:21},{name:"Aslak Falch",pos:"MV",age:34},
    {name:"Jamal Deen Haruna",pos:"FOR",age:26},{name:"Gullbrandur Øregaard",pos:"FOR",age:24},{name:"Andreas Rosendal Nyhagen",pos:"FOR",age:27},
    {name:"Erik Berland",pos:"FOR",age:21},{name:"Axel Kryger",pos:"FOR",age:28},{name:"Kevin Egell-Johnsen",pos:"FOR",age:26},
    {name:"Kevin Nilsen Pereira",pos:"FOR",age:24},
    {name:"Sander Saugestad",pos:"MID",age:25},{name:"Zifarlino Nsoni",pos:"MID",age:24},{name:"Daniel Arifagic",pos:"MID",age:20},
    {name:"Kaloyan Kostadinov",pos:"MID",age:24},{name:"Yann-Erik de Lanlay",pos:"MID",age:34},
    {name:"Olaf Bárdarson",pos:"ANG",age:22},{name:"Ådne Gikling Bruseth",pos:"ANG",age:27},{name:"Peder Brekke",pos:"ANG",age:21},
    {name:"Jonas Aune",pos:"ANG",age:22},{name:"Ole Sebastian Sundgot",pos:"ANG",age:25},{name:"Mathias Sundberg",pos:"ANG",age:24}],
  // Sogndal – EKTE posisjon + alder (Transfermarkt, 2026)
  "Sogndal": [{name:"Lars Jendal",pos:"MV",age:27},{name:"Kacper Bieszczad",pos:"MV",age:23},
    {name:"Sander Aske Granheim",pos:"FOR",age:18},{name:"Mathias Øren",pos:"FOR",age:20},{name:"Even Hovland",pos:"FOR",age:37},
    {name:"Atli Barkarson",pos:"FOR",age:25},{name:"Diogo Brás",pos:"FOR",age:26},{name:"Ronney Onyango",pos:"FOR",age:25},
    {name:"Martin Høyland",pos:"MID",age:30},{name:"Kasper Skaanes",pos:"MID",age:31},{name:"Marius Årøy",pos:"MID",age:21},
    {name:"Vegard Haugerud Hagen",pos:"MID",age:24},{name:"Lūkass Vapne",pos:"MID",age:22},{name:"Tuomas Pippola",pos:"MID",age:21},{name:"Elias Flo",pos:"MID",age:18},
    {name:"Emmanuel Mensah",pos:"ANG",age:21},{name:"Fábio Sturgeon",pos:"ANG",age:32},{name:"Onni Helén",pos:"ANG",age:20},
    {name:"Preben Asp",pos:"ANG",age:24}],
  // Stabæk – EKTE posisjon + alder (Transfermarkt, 2026)
  "Stabæk": [{name:"Marius Ulla",pos:"MV",age:24},{name:"Kimi Løkkevik",pos:"MV",age:22},
    {name:"Olav Lilleøren Veum",pos:"FOR",age:22},{name:"Nicolai Næss",pos:"FOR",age:33},{name:"Eirik Lereng",pos:"FOR",age:25},
    {name:"Karsten Ekorness",pos:"FOR",age:20},{name:"Jørgen Skjelvik",pos:"FOR",age:35},{name:"Fillip Jenssen Riise",pos:"FOR",age:19},
    {name:"Andreas Hoven",pos:"FOR",age:28},
    {name:"Oscar Solnørdal",pos:"MID",age:23},{name:"Marius Lundemo",pos:"MID",age:32},{name:"Gaute Vetti",pos:"MID",age:27},
    {name:"Danilo dos Santos Jonker",pos:"MID",age:22},{name:"Aleksa Matić",pos:"MID",age:23},{name:"William Wendt",pos:"MID",age:20},
    {name:"Sebastian Olderheim",pos:"MID",age:19},
    {name:"Gottfrid Rapp",pos:"ANG",age:20},{name:"Jacob Hanstad",pos:"ANG",age:23},{name:"Alagie Sanyang",pos:"ANG",age:29},
    {name:"Frederik Ellegaard",pos:"ANG",age:26},{name:"Bossman Debrah",pos:"ANG",age:19},{name:"Magnus Lankhof Dahlby",pos:"ANG",age:27}],
  // Strømmen – EKTE posisjon + alder (Transfermarkt, 2026)
  "Strømmen": [{name:"Knut André Skjærstein",pos:"MV",age:31},{name:"Daniel Skretteberg",pos:"MV",age:24},
    {name:"Pontus Lindgren",pos:"FOR",age:25},{name:"Maximilian Balatoni",pos:"FOR",age:21},{name:"Sindre Rindal",pos:"FOR",age:26},
    {name:"Tochukwu Joseph Ogboji",pos:"FOR",age:19},{name:"Thomas Lillo",pos:"FOR",age:28},{name:"Adrian Solberg",pos:"FOR",age:26},
    {name:"Simon Peter Friis Sharif",pos:"FOR",age:28},{name:"Marcus Paulsen",pos:"FOR",age:20},
    {name:"Cameron Crestani",pos:"MID",age:30},{name:"Simen Beck",pos:"MID",age:23},{name:"Kodjo Somesi",pos:"MID",age:25},
    {name:"Even Rogne",pos:"MID",age:22},{name:"Henrik Kristiansen",pos:"MID",age:27},{name:"Anders Johannessen Nord",pos:"MID",age:25},
    {name:"Nikolai Hristov",pos:"ANG",age:26},{name:"Markus Wæhler",pos:"ANG",age:18},{name:"Luka Fajfric",pos:"ANG",age:27},
    {name:"Julian Kristengård",pos:"ANG",age:23}],
  // Strømsgodset – EKTE posisjon + alder (Transfermarkt, 2026)
  "Strømsgodset": [{name:"Mattias Lamhauge",pos:"MV",age:27},{name:"Simo Lampinen-Skaug",pos:"MV",age:21},
    {name:"Jesper Taaje",pos:"FOR",age:28},{name:"Gustav Valsvik",pos:"FOR",age:33},{name:"Aleksander van der Spa",pos:"FOR",age:21},
    {name:"Victor Dedes",pos:"FOR",age:23},{name:"Bent Sørmo",pos:"FOR",age:29},{name:"Lars Christopher Vilsvik",pos:"FOR",age:37},
    {name:"Andreas Heredia-Randen",pos:"MID",age:20},{name:"André Stavås Skistad",pos:"MID",age:19},{name:"Herman Stengel",pos:"MID",age:30},
    {name:"Kent-Are Antonsen",pos:"MID",age:31},{name:"Kreshnik Krasniqi",pos:"MID",age:25},{name:"Fredrik Ardraa",pos:"MID",age:19},{name:"Samuel Silalahi",pos:"MID",age:21},
    {name:"Gustav Wikheim",pos:"ANG",age:33},{name:"Ole Enersen",pos:"ANG",age:23},{name:"Marcus Mehnert",pos:"ANG",age:28},
    {name:"Elias Hoff Melkersen",pos:"ANG",age:23},{name:"Sebastian Pingel",pos:"ANG",age:33}],
  // ---- 2. divisjon 2026 – ekte tropper fra FotMob ----
  // Skeid – EKTE posisjon + alder (Transfermarkt, 2026)
  "Skeid": [{name:"Mikkel Markdal",pos:"MV",age:20},
    {name:"Sigurd Hovet Ekornes",pos:"FOR",age:20},{name:"Lucas Svenningsen",pos:"FOR",age:19},{name:"Hayder Altai",pos:"FOR",age:28},
    {name:"Akinsola Akinyemi",pos:"FOR",age:33},{name:"Samuel Ekroll",pos:"FOR",age:21},{name:"Boubacar Ba",pos:"FOR",age:20},
    {name:"Keivan Ghaedamini",pos:"FOR",age:30},{name:"Sulayman Bojang",pos:"FOR",age:28},
    {name:"Adnan Hadzic",pos:"MID",age:27},{name:"Kasander Getz",pos:"MID",age:25},{name:"Filip Stensland",pos:"MID",age:22},
    {name:"Mikkel Wennberg Lindbäck",pos:"MID",age:19},{name:"Tobias Myhre",pos:"MID",age:24},{name:"Jarmund Kvernstuen",pos:"MID",age:26},
    {name:"Almas Ayman Samrat",pos:"MID",age:20},
    {name:"Filip Møller Delaveris",pos:"ANG",age:25},{name:"Musa Joof Dubois",pos:"ANG",age:26},{name:"Kristoffer Ødemarksbakken",pos:"ANG",age:30},
    {name:"Lorents Apold-Aasen",pos:"ANG",age:19},{name:"Jesper Fiksdal",pos:"ANG",age:22},{name:"Amadou Moustapha Badiane",pos:"ANG",age:18}],
  // Lysekloster – EKTE posisjon + alder (Transfermarkt, 2026)
  "Lysekloster": [{name:"Daniel Gjerde Sætren",pos:"MV",age:20},{name:"Fredrik Sivertsen Bergslid",pos:"MV",age:24},
    {name:"Tommy Rivaldo Svendsen",pos:"FOR",age:23},{name:"Marius Mattingsdal",pos:"FOR",age:21},{name:"Jonas Valland",pos:"FOR",age:22},
    {name:"Johannes Konstali-Lødemel",pos:"FOR",age:20},{name:"Jonas Vågen",pos:"FOR",age:26},{name:"Trym Vatn Øvreberg",pos:"FOR",age:23},
    {name:"Jørgen Nordvold Lunde",pos:"FOR",age:24},
    {name:"Ola Lerheim Olsen",pos:"MID",age:20},{name:"Jacob Skjerven Valland",pos:"MID",age:18},{name:"Vebjørn Nakken",pos:"MID",age:21},
    {name:"Jacob Jacobsen Bolsø",pos:"MID",age:24},{name:"Kristian Kongelf",pos:"MID",age:20},{name:"Lloyd Adrian Dahle Fagerlie",pos:"MID",age:24},
    {name:"Beltran Mvuka",pos:"ANG",age:27},{name:"Ole Marius Håbestad",pos:"ANG",age:29},{name:"David Tufta",pos:"ANG",age:25},
    {name:"Torpal Salamov",pos:"ANG",age:23},{name:"Thorstein Horneland Hildal",pos:"ANG",age:24},{name:"Kriss Havila Bonabandi",pos:"ANG",age:19}],
  // Sotra – EKTE posisjon + alder (Transfermarkt, 2026)
  "Sotra": [{name:"Sander Endresen Thorsen",pos:"MV",age:22},{name:"Morten Grasmo",pos:"MV",age:30},
    {name:"Anders Johan Johansen",pos:"FOR",age:27},{name:"Mats Gresvik Lunde",pos:"FOR",age:23},{name:"Olav Aarre Hånes",pos:"FOR",age:23},
    {name:"Kristian Skjørli Ree",pos:"FOR",age:26},{name:"Håvard Foldnes",pos:"FOR",age:27},{name:"Jakob Tveit",pos:"FOR",age:21},
    {name:"Erlend Larsen",pos:"FOR",age:30},{name:"Daniel Tørum",pos:"FOR",age:27},
    {name:"Isak Hjorteseth",pos:"MID",age:22},{name:"Henrik Nyland",pos:"MID",age:32},{name:"Teodor Håland",pos:"MID",age:21},
    {name:"Lars Kristian Lie Osa",pos:"MID",age:19},{name:"Ole Martin Dåvøy Skår",pos:"MID",age:21},{name:"Sander Wik",pos:"MID",age:24},
    {name:"Per-Christian Pedersen",pos:"MID",age:31},
    {name:"Lars Kilen",pos:"ANG",age:28},{name:"Joar Høviskeland",pos:"ANG",age:27},{name:"Frederic Falck",pos:"ANG",age:31}],
  // Kjelsås – EKTE posisjon + alder (Transfermarkt, 2026)
  "Kjelsås": [{name:"Jesper Nesbakk Wold",pos:"MV",age:24},{name:"Justin Knutsson",pos:"MV",age:24},
    {name:"Elliot Sørvoll Anthonsen",pos:"FOR",age:18},{name:"Sindre Græsdahl",pos:"FOR",age:19},{name:"Simen Olafsen",pos:"FOR",age:30},
    {name:"Martin Helmer Rusten",pos:"FOR",age:25},{name:"Sigurd Martinussen",pos:"FOR",age:27},{name:"Philip Halvorsen",pos:"FOR",age:23},
    {name:"Edvard Vestby",pos:"FOR",age:27},{name:"Håvard Meinseth",pos:"FOR",age:27},
    {name:"Thomas Rekdal",pos:"MID",age:25},{name:"Kebba Lamin",pos:"MID",age:25},{name:"Christyan-Teamrat Weldu Petros",pos:"MID",age:20},
    {name:"Ahmad Adil Abbas",pos:"MID",age:27},
    {name:"Leo Bech Hermansen",pos:"ANG",age:23},{name:"Magnus Tomren Solheim",pos:"ANG",age:21},{name:"Eivind Willumsen",pos:"ANG",age:25},
    {name:"Ole Erik Midtskogen",pos:"ANG",age:31},{name:"Marius Berg Fossum",pos:"ANG",age:22},{name:"Aleksandar Vukicevic",pos:"ANG",age:19}],
  // Levanger – EKTE posisjon + alder (Transfermarkt, 2026)
  "Levanger": [{name:"Steingrímur Ingi Gunnarsson",pos:"MV",age:25},{name:"Kristian Melting",pos:"MV",age:26},
    {name:"Daniel Pollen",pos:"FOR",age:26},{name:"Håvard Kleven Lorentsen",pos:"FOR",age:27},{name:"Sander Munkeby Sundnes",pos:"FOR",age:26},
    {name:"Oliver Bjørnli",pos:"FOR",age:19},{name:"Jesper Myklebust",pos:"FOR",age:23},
    {name:"Isak Holmen",pos:"MID",age:19},{name:"Kjartan Ulstad",pos:"MID",age:28},{name:"Marius Høstland",pos:"MID",age:23},{name:"Shan Beyene",pos:"MID",age:22},
    {name:"Ermal Hajdari",pos:"ANG",age:33},{name:"Magnus Sandvik Høiseth",pos:"ANG",age:24},{name:"Haakon Rusten Berge",pos:"ANG",age:25},
    {name:"Edward Tøgersen",pos:"ANG",age:23},{name:"Magnus Fagernes",pos:"ANG",age:25},{name:"Patrick Singstad Johansen",pos:"ANG",age:24},
    {name:"Jonas Lian Horten",pos:"ANG",age:26}],
  // Hønefoss – EKTE posisjon + alder (Transfermarkt, 2026)
  "Hønefoss": [{name:"Jonatan Strand Byttingsvik",pos:"MV",age:27},{name:"Martin Kjeverud Eggen",pos:"MV",age:23},
    {name:"Kristian Nøkleby-Karlsrud",pos:"FOR",age:19},{name:"Stian Aarønes Holte",pos:"FOR",age:23},{name:"Ola Heltne Nilsen",pos:"FOR",age:25},
    {name:"Leo Kyvik",pos:"FOR",age:22},{name:"Oskar Elias Wang",pos:"FOR",age:27},{name:"Lars Rydje",pos:"FOR",age:29},
    {name:"Trace Murray",pos:"FOR",age:33},{name:"August Randers",pos:"FOR",age:25},
    {name:"Jon Haukvik Øya",pos:"MID",age:22},{name:"Torje Naustdal",pos:"MID",age:26},{name:"Martin Bergum",pos:"MID",age:24},
    {name:"Andreas Frøhaug",pos:"MID",age:21},{name:"Simen Egge Nestaker",pos:"MID",age:23},{name:"Sivert Bukten",pos:"MID",age:28},
    {name:"Henrik Elvevold",pos:"MID",age:26},
    {name:"Alexander Gurendal",pos:"ANG",age:21},{name:"Willian Pozo",pos:"ANG",age:28},{name:"Ebrima Sawaneh",pos:"ANG",age:25},
    {name:"Hugo Svensson",pos:"ANG",age:28},{name:"Kristoffer Hoven",pos:"ANG",age:29},{name:"Emil Øverby",pos:"ANG",age:20}],
  // Pors – EKTE posisjon + alder (Transfermarkt, 2026)
  "Pors": [{name:"Petter Hagen",pos:"MV",age:25},{name:"Sebastian Eiris Vassend",pos:"MV",age:20},
    {name:"Kristoffer Reiersen Risnes",pos:"FOR",age:26},{name:"Eirik Asante Gayi",pos:"FOR",age:25},{name:"Simen Østby",pos:"FOR",age:21},
    {name:"Tobias Bless Garstad",pos:"FOR",age:27},{name:"Alexander Bjørnhaug",pos:"FOR",age:24},{name:"Noah Riise",pos:"FOR",age:21},
    {name:"Emmanuel Baru Gisa",pos:"FOR",age:23},{name:"Johannes Holstad Dahlby",pos:"FOR",age:25},
    {name:"Kjetil Svarteberg",pos:"MID",age:32},{name:"Filip Sæther Kimerud",pos:"MID",age:20},{name:"Mats Kristian Kämpfe Mauset",pos:"MID",age:23},
    {name:"Jarl-Emil Drange Nesland",pos:"MID",age:21},{name:"Andreas Bakeng-Rogne",pos:"MID",age:21},{name:"Viktor Namløs",pos:"MID",age:26},
    {name:"Redon Pllana",pos:"MID",age:23},
    {name:"Stefan Mladenovic",pos:"ANG",age:32},{name:"Kachi",pos:"ANG",age:29},{name:"Oliver Henriksrud",pos:"ANG",age:21},
    {name:"Truls Kristian Meen",pos:"ANG",age:21},{name:"Cayetano Gutiérrez",pos:"ANG",age:22},{name:"Christian Arne Dankwah",pos:"ANG",age:23}],
  // Notodden – EKTE posisjon + alder (Transfermarkt, 2026)
  "Notodden": [{name:"Sondre Solås",pos:"MV",age:24},{name:"Jan Bergesen",pos:"MV",age:22},
    {name:"Casper Bottolfs Svendby",pos:"FOR",age:23},{name:"Noah Jacobsen",pos:"FOR",age:22},{name:"Henrik Hatlen Osen",pos:"FOR",age:25},
    {name:"Joakim Andersen",pos:"FOR",age:23},{name:"Mahmud Mustafa Ahmed",pos:"FOR",age:26},{name:"Noah Umbach Bertelsen",pos:"FOR",age:20},
    {name:"Jone Bjerkan Hammerli",pos:"FOR",age:28},
    {name:"Siver Haugen Murtnes",pos:"MID",age:20},{name:"Sondre Lindgren Larsen",pos:"MID",age:30},{name:"Andreas Kalstad",pos:"MID",age:20},
    {name:"Sebastian Rønningen Jørgensen",pos:"MID",age:22},{name:"Andreas Pettersen",pos:"MID",age:24},{name:"Marcus Solhaug Wenneberg",pos:"MID",age:24},
    {name:"Tor André Nordbø",pos:"MID",age:20},
    {name:"Trym Foss-Erstad",pos:"ANG",age:19},{name:"Anders Ryste",pos:"ANG",age:21},{name:"Andreas Sersland",pos:"ANG",age:28},
    {name:"Erik Leandersson",pos:"ANG",age:22},{name:"Hans Torjus Gampedalen",pos:"ANG",age:18},{name:"Balder Bjerkan",pos:"ANG",age:20}],
  // Follo – EKTE posisjon + alder (Transfermarkt, 2026)
  "Follo": [{name:"Sander Rød",pos:"MV",age:21},{name:"Erik Østbye",pos:"MV",age:23},
    {name:"Henrik Hagen",pos:"FOR",age:22},{name:"Haakon Ludvigsen",pos:"FOR",age:20},{name:"André Nysted",pos:"FOR",age:22},
    {name:"Fabian Røed Özyilmaz",pos:"FOR",age:19},{name:"Jonas Aune Jorde",pos:"FOR",age:25},{name:"Jabes Niyosoko Maturire",pos:"FOR",age:23},
    {name:"Shahram Jabari",pos:"FOR",age:23},{name:"Almin Hrustic",pos:"FOR",age:30},
    {name:"Florind Lokaj",pos:"MID",age:24},{name:"Øyvind Rishaug",pos:"MID",age:26},{name:"Noah Mathias Josefsson",pos:"MID",age:20},
    {name:"Niklas Schmidt-Løvlund",pos:"MID",age:21},{name:"Mathias Øfsti Bråten",pos:"MID",age:25},{name:"Emil Tjøstheim",pos:"MID",age:24},
    {name:"Nicolai Skoglund",pos:"ANG",age:23},{name:"Junior Heier",pos:"ANG",age:22},{name:"Habib Diallo",pos:"ANG",age:22},
    {name:"El Schaddai Furaha",pos:"ANG",age:19},{name:"Fredrik Leren Hoel",pos:"ANG",age:21},{name:"Maximilian Dahl",pos:"ANG",age:24}],
  // Jerv – EKTE posisjon + alder (Transfermarkt, 2026)
  "Jerv": [{name:"Daniel Gadegaard",pos:"MV",age:25},{name:"Anders Skiftenes",pos:"MV",age:17},
    {name:"Storm Arbøll Karlsen",pos:"FOR",age:21},{name:"Daniel Hultqvist",pos:"FOR",age:28},{name:"Mikael Almén",pos:"FOR",age:26},
    {name:"Javier Sánchez",pos:"FOR",age:25},{name:"Felix Lillehammer",pos:"FOR",age:21},{name:"Theodor Martin Agelin",pos:"FOR",age:22},
    {name:"Helge Strand",pos:"FOR",age:21},{name:"Jo Stålesen",pos:"FOR",age:26},
    {name:"Sander Nordbø",pos:"MID",age:22},{name:"Sivert Strangstad",pos:"MID",age:29},{name:"Eivind Kolve",pos:"MID",age:21},
    {name:"Brage Naustdal",pos:"MID",age:23},{name:"Fritiof Hellichius",pos:"MID",age:23},{name:"Isak Andersen Abusdal",pos:"MID",age:19},
    {name:"André Rosmer Richstad",pos:"MID",age:26},
    {name:"Vetle Wenaas",pos:"ANG",age:24},{name:"Kebba Badjie",pos:"ANG",age:26},{name:"Samu Alanko",pos:"ANG",age:28},
    {name:"Phillip Syvertsen",pos:"ANG",age:21},{name:"Pascal Simba",pos:"ANG",age:26},{name:"Markus Syvertsen",pos:"ANG",age:18}],
  // Ull/Kisa – EKTE posisjon + alder (Transfermarkt, 2026)
  "Ull/Kisa": [{name:"Clement Twizere",pos:"MV",age:30},{name:"Jørgen Sveinhaug",pos:"MV",age:23},
    {name:"Joachim Prent-Eckbo",pos:"FOR",age:19},{name:"Patrick Alfei Sæbø",pos:"FOR",age:26},{name:"Emil Bramsen",pos:"FOR",age:18},
    {name:"Jesse Boateng",pos:"FOR",age:22},{name:"Eirik Soleim Brennhaugen",pos:"FOR",age:25},{name:"Sverre Bjørkkjær",pos:"FOR",age:30},
    {name:"Akenaton Empa",pos:"MID",age:23},{name:"Daniel Lyngstad",pos:"MID",age:20},{name:"Nicolas Aanensen Karlsen",pos:"MID",age:23},
    {name:"Enok Naustdal",pos:"MID",age:20},{name:"Uros Ignjic",pos:"MID",age:22},{name:"Nidal Loulanti",pos:"MID",age:29},{name:"Zaydan Bello",pos:"MID",age:24},
    {name:"Elias Solberg",pos:"ANG",age:22},{name:"Lansana Sesay",pos:"ANG",age:22},{name:"Stian Barane",pos:"ANG",age:27},
    {name:"Felix Kutsche Eriksen",pos:"ANG",age:20},{name:"Cherif Issifou Lamkoudjo",pos:"ANG",age:24},{name:"Elias Oulad el Arbi",pos:"ANG",age:20}],
  // Arendal – EKTE posisjon + alder (Transfermarkt, 2026)
  "Arendal": [{name:"Andreas Smedplass",pos:"MV",age:25},{name:"Sindre Østbø",pos:"MV",age:26},
    {name:"Piotr Chodziutko",pos:"FOR",age:28},{name:"Kevin Rodeblad Lowe",pos:"FOR",age:25},{name:"Antony Curic",pos:"FOR",age:25},
    {name:"Henrik Osnes",pos:"FOR",age:20},{name:"Tim Olsson",pos:"FOR",age:22},{name:"Marius Trengereid",pos:"FOR",age:22},
    {name:"Syver Skaar Eriksen",pos:"FOR",age:25},{name:"Eivind Helgesen",pos:"FOR",age:25},
    {name:"Adrian Eftestad Nilsen",pos:"MID",age:22},{name:"Filip Mang-Thang",pos:"MID",age:22},{name:"Håkon Suggelia",pos:"MID",age:27},
    {name:"Simen Nygaard",pos:"MID",age:25},{name:"Andreas Skjold",pos:"MID",age:23},
    {name:"Mikal Berg Kvinge",pos:"ANG",age:23},{name:"Marcus Victorio",pos:"ANG",age:26},{name:"Torben Dvergsdal",pos:"ANG",age:25},
    {name:"Andreas Østerud",pos:"ANG",age:26},{name:"Daouda Bamba",pos:"ANG",age:31},{name:"Marco Scheffler",pos:"ANG",age:29}],
  // Eidsvold Turn – EKTE posisjon + alder (Transfermarkt, 2026)
  "Eidsvold Turn": [{name:"Simen Lillevik Kjellevold",pos:"MV",age:31},{name:"Mehmet Rrahmani",pos:"MV",age:23},
    {name:"Heine Wiik Stigersand",pos:"FOR",age:19},{name:"Christopher Notoane",pos:"FOR",age:22},{name:"Kristian Bjerkenes Håkenstad",pos:"FOR",age:23},
    {name:"Sebastian Stokke",pos:"FOR",age:22},{name:"Edonis Mulaj",pos:"FOR",age:24},{name:"Henrik Thorkildsen",pos:"FOR",age:25},
    {name:"Erik Ruud",pos:"FOR",age:25},
    {name:"Lucas Kolstad",pos:"MID",age:21},{name:"Edin Øy",pos:"MID",age:29},{name:"Johan Andersson",pos:"MID",age:42},
    {name:"Oliver Stenseth",pos:"MID",age:28},{name:"Runar Frøhaug Johnsen",pos:"MID",age:22},{name:"Tengel Lia Fredriksen",pos:"MID",age:23},
    {name:"Jørgen Kolstad",pos:"MID",age:30},
    {name:"Filip Da Silva",pos:"ANG",age:22},{name:"Lars Julian Fjeld",pos:"ANG",age:20},{name:"Benedict Lethabo Notoane",pos:"ANG",age:26},
    {name:"Olav Dobloug Mengshoel",pos:"ANG",age:18},{name:"Herman Henriksen",pos:"ANG",age:29},{name:"Martin Dencker Opsahl",pos:"ANG",age:20}],
  // Eik Tønsberg – EKTE posisjon + alder (Transfermarkt, 2026)
  "Eik Tønsberg": [{name:"Leander Larona Gunnerød",pos:"MV",age:19},{name:"Daniel Rahlew Rønning",pos:"MV",age:18},
    {name:"Kristian Mathias Pangilinan Lillevik",pos:"FOR",age:18},{name:"Joachim Lundhagebakken",pos:"FOR",age:23},{name:"Christer Reppesgård Hansen",pos:"FOR",age:33},
    {name:"Mohammed Hopsdal Abbas",pos:"FOR",age:26},{name:"Vemund Skar Roberg",pos:"FOR",age:30},{name:"Harald Danielsen",pos:"FOR",age:30},
    {name:"Anders Nygaard",pos:"MID",age:32},{name:"Luis Brendsrød",pos:"MID",age:23},{name:"Wilhelm Schmidt Godø",pos:"MID",age:20},
    {name:"Andreas Larsen",pos:"MID",age:23},{name:"Erik Muhle",pos:"MID",age:22},{name:"Benjamin Hellum Andersen",pos:"MID",age:21},{name:"Mads Volden",pos:"MID",age:23},
    {name:"Youssef Chaib",pos:"ANG",age:29},{name:"Sander Aamelfot",pos:"ANG",age:25},{name:"Benjamin Stokke",pos:"ANG",age:35},
    {name:"Thomas Nygaard",pos:"ANG",age:29},{name:"Mohamed Moussa Srour",pos:"ANG",age:21},{name:"Martin Solli",pos:"ANG",age:20}],
  // Rana – EKTE posisjon + alder (Transfermarkt, 2026)
  "Rana": [{name:"Sondre André Romslo",pos:"MV",age:19},{name:"Adam Håkonsen",pos:"MV",age:20},
    {name:"Sander Elias Fjelldalselv",pos:"FOR",age:19},{name:"Nikolai Aas",pos:"FOR",age:27},{name:"Adrian Selliah",pos:"FOR",age:21},
    {name:"Hannes Bordal",pos:"FOR",age:23},{name:"Sevald Andreassen",pos:"FOR",age:23},{name:"Arve Ekroll Hauknes",pos:"FOR",age:26},
    {name:"Sakarias Amandus Hagen",pos:"MID",age:19},{name:"Jacob-Leander Thuv",pos:"MID",age:20},{name:"Dharmesh Navaratnam",pos:"MID",age:20},
    {name:"Emilian Falstad",pos:"MID",age:20},{name:"Theo Aksnes Olsen",pos:"MID",age:21},{name:"Adrian Teigen",pos:"MID",age:26},
    {name:"Joachim Olufsen",pos:"ANG",age:31},{name:"Marco Cheng",pos:"ANG",age:22},{name:"Yasir Sa'Ad",pos:"ANG",age:24},
    {name:"Sander Bratvold",pos:"ANG",age:20},{name:"Brede Frøysa",pos:"ANG",age:25},{name:"Gabriel Gjesbakk Valla",pos:"ANG",age:20}],
  // Sandviken – EKTE posisjon + alder (Transfermarkt, 2026)
  "Sandviken": [{name:"Henrik Bakke",pos:"MV",age:33},{name:"Elias Ingebrethsen",pos:"MV",age:29},
    {name:"Magnus Bruun-Hanssen",pos:"FOR",age:29},{name:"Nicholas Marthinussen",pos:"FOR",age:26},{name:"Sindre Lie",pos:"FOR",age:31},
    {name:"Tom-Rune Sæle",pos:"FOR",age:23},{name:"Markus Helland Tislevoll",pos:"FOR",age:26},{name:"Storm Leiren",pos:"FOR",age:20},
    {name:"Henrik Flagtvedt",pos:"FOR",age:22},{name:"Bongani Lionel Kamanzi",pos:"FOR",age:29},
    {name:"Andreas Ekanger",pos:"MID",age:22},{name:"Samuel Villalta",pos:"MID",age:25},{name:"Henrik Bjelland Østrått",pos:"MID",age:21},
    {name:"Fredrik Greve-Veland",pos:"MID",age:21},{name:"Marcus Berg Devik",pos:"MID",age:20},{name:"Lars Dalstø",pos:"MID",age:28},
    {name:"Sebastian Skåre Tune",pos:"MID",age:32},
    {name:"Bendik August Engen",pos:"ANG",age:24},{name:"Kristoffer Aasen Garmann",pos:"ANG",age:22},{name:"Oscar Bakke Hodne",pos:"ANG",age:23},
    {name:"Herman Stang Stakset",pos:"ANG",age:25},{name:"Vebjørn Høynes",pos:"ANG",age:28},{name:"David Sissoko",pos:"ANG",age:23}],
  // Mjøndalen – EKTE posisjon + alder (Transfermarkt, 2026)
  "Mjøndalen": [{name:"Peder Klausen",pos:"MV",age:23},{name:"Philip Sørlie Bro",pos:"MV",age:19},
    {name:"Isak Vik",pos:"FOR",age:23},{name:"Kweku Kekeli",pos:"FOR",age:20},{name:"Benjamin Sundo",pos:"FOR",age:25},
    {name:"Christian Mork Breivik",pos:"FOR",age:22},{name:"Erik Kristiansen",pos:"FOR",age:22},{name:"Oliver Rotihaug",pos:"FOR",age:29},
    {name:"Jesper Johnsson Solberg",pos:"FOR",age:18},
    {name:"Sander Marthinussen",pos:"MID",age:26},{name:"Emin Pajic",pos:"MID",age:18},{name:"Kristoffer Steinset",pos:"MID",age:20},
    {name:"Tobias Bjørnebye",pos:"MID",age:27},{name:"Jonas Bruusgaard",pos:"MID",age:25},{name:"Tobias Flem",pos:"MID",age:24},{name:"Linus Ween",pos:"MID",age:18},
    {name:"Nickolay Årsbog",pos:"ANG",age:22},{name:"Markus Ottesen",pos:"ANG",age:24},{name:"Keerat Singh",pos:"ANG",age:23},
    {name:"Valdemar Schmølker",pos:"ANG",age:19},{name:"Oliver Midtgård",pos:"ANG",age:25},{name:"Mathias Bringaker",pos:"ANG",age:29}],
  // Stjørdals-Blink – EKTE posisjon + alder (Transfermarkt, 2026)
  "Stjørdals-Blink": [{name:"Lars Hilstad",pos:"MV",age:19},{name:"Erik Hansen Meidal",pos:"MV",age:27},
    {name:"Marius Fagerhaug",pos:"FOR",age:20},{name:"Nils Gunnar Barstad Eggen",pos:"FOR",age:25},{name:"Jørgen Sønstebø",pos:"FOR",age:19},
    {name:"Adrian Viken",pos:"FOR",age:21},{name:"Adrian Bartel",pos:"FOR",age:24},{name:"Vemund Thue Gabrielsen",pos:"FOR",age:20},
    {name:"Thomas Pedersen",pos:"FOR",age:24},
    {name:"Dennis Torp-Helland",pos:"MID",age:20},{name:"Mathias Holm",pos:"MID",age:23},{name:"Sondre Kvikstad Stuen",pos:"MID",age:21},
    {name:"Leo Haug Utkilen",pos:"MID",age:21},{name:"Elias Sandrød",pos:"MID",age:19},{name:"Petter Nilssen Einarson",pos:"MID",age:24},{name:"Noah Solskjær",pos:"MID",age:26},
    {name:"George Lewis",pos:"ANG",age:26},{name:"Elias Sandøy Myrvågnes",pos:"ANG",age:20},{name:"Benjamin Feldt",pos:"ANG",age:23},
    {name:"Marius Weidel",pos:"ANG",age:21},{name:"Linton Ulloa Niinivirta",pos:"ANG",age:21},{name:"Viljar Fiske Kvande",pos:"ANG",age:23}],
  // Bjarg – EKTE posisjon + alder (Transfermarkt, 2026)
  "Bjarg": [{name:"Jørgen Johnsen",pos:"MV",age:25},{name:"Elias Refsahl Iversen",pos:"MV",age:21},
    {name:"Edvin Dvergsdal Brattreit",pos:"FOR",age:22},{name:"Henrik Toska Madsen",pos:"FOR",age:18},{name:"Morgan Ahmer",pos:"FOR",age:22},
    {name:"Henrik Mildestveit",pos:"FOR",age:26},{name:"Sindre Strønstad-Løseth",pos:"FOR",age:20},{name:"Simen Hopsdal",pos:"FOR",age:32},
    {name:"Simen Aanonsen",pos:"FOR",age:26},
    {name:"Hermann Svendsen",pos:"MID",age:27},{name:"Sander Johannesen",pos:"MID",age:21},{name:"Vegard Halset",pos:"MID",age:24},
    {name:"Sander Hopsdal",pos:"MID",age:25},{name:"Jacob Jørgensen",pos:"MID",age:26},{name:"Mads Christophersen",pos:"MID",age:26},{name:"Kristoffer Stephensen",pos:"MID",age:35},
    {name:"Axel Ahlander",pos:"ANG",age:25},{name:"Moutaz Ali Alzubi",pos:"ANG",age:22},{name:"Markus Eiane",pos:"ANG",age:25},
    {name:"Mathias Skrede Kallmyr",pos:"ANG",age:20},{name:"Alexander Alnæs Pedersen",pos:"ANG",age:20},{name:"Christian Dahl",pos:"ANG",age:27}],
  // Junkeren – EKTE posisjon + alder (Transfermarkt, 2026)
  "Junkeren": [{name:"Jakob Trælnes Rebtun",pos:"MV",age:19},{name:"Jonas Berentzen Finseth",pos:"MV",age:27},
    {name:"Einar Kornelius Almendingen",pos:"FOR",age:24},{name:"Martin Johan Lauritzen",pos:"FOR",age:22},{name:"Jørgen Steffensen Lamark",pos:"FOR",age:24},
    {name:"Eskil Mattias Melstein",pos:"FOR",age:25},{name:"Adan Hussein",pos:"FOR",age:23},{name:"Magnus Hansen",pos:"FOR",age:28},
    {name:"Magnus Fagervik Antonsen",pos:"FOR",age:20},{name:"Håkon Elias Myrseth",pos:"FOR",age:26},
    {name:"Herman Wisth",pos:"MID",age:20},{name:"Jonas Esten Skårn-Johansen",pos:"MID",age:22},{name:"Isak Sebastian Helbostad",pos:"MID",age:23},
    {name:"Sidad Najah Chooly",pos:"MID",age:29},{name:"Isak Wiik Lekang",pos:"MID",age:25},{name:"Sondre Johansen Solhaug",pos:"MID",age:22},{name:"Alexander Winther Jakobsen",pos:"MID",age:22},
    {name:"Mads Fagerli Halsøy",pos:"ANG",age:24},{name:"Ivar Unhjem",pos:"ANG",age:35},{name:"David Mkrtchyan",pos:"ANG",age:27},
    {name:"Per Kristian Helle Hildre",pos:"ANG",age:24},{name:"Adrian Sørensen",pos:"ANG",age:25},{name:"Teodor Kristiansen",pos:"ANG",age:27}],
  // Vidar – EKTE posisjon + alder (Transfermarkt, 2026)
  "Vidar": [{name:"Sondre Svanes Strand",pos:"MV",age:24},{name:"Kristian Døble",pos:"MV",age:34},
    {name:"Christian Finnesand Vaaland",pos:"FOR",age:25},{name:"Sander Landa Vik",pos:"FOR",age:25},{name:"Andreas Søraas Sebulonsen",pos:"FOR",age:23},
    {name:"Sebastian Sørlie Henriksen",pos:"FOR",age:24},{name:"William Schjølberg Husebø",pos:"FOR",age:26},{name:"Marton Søyland",pos:"FOR",age:19},
    {name:"Maxmillian Taraldset Hæstad",pos:"MID",age:26},{name:"Sune Haug Espevoll",pos:"MID",age:20},{name:"Sander Remme",pos:"MID",age:27},
    {name:"Kristian Thorsheim Selmer",pos:"MID",age:23},{name:"Kujtim Ismaili",pos:"MID",age:24},{name:"Frede Åsen Larsen",pos:"MID",age:20},{name:"Mathias Fister Andersen",pos:"MID",age:20},
    {name:"Adrian Amundsen Bergersen",pos:"ANG",age:25},{name:"Isak Jenssen Østrem",pos:"ANG",age:28},{name:"Henrik Jensen",pos:"ANG",age:25},
    {name:"Mathias Tjoland",pos:"ANG",age:21},{name:"Simen Haughom",pos:"ANG",age:27},{name:"Lewi Brandser",pos:"ANG",age:21}],
  // Lørenskog – EKTE posisjon + alder (Transfermarkt, 2026)
  "Lørenskog": [{name:"Jonathan Reiersen",pos:"MV",age:23},{name:"Ole Martin Drevland",pos:"MV",age:28},
    {name:"Tommy Aandewiel",pos:"FOR",age:24},{name:"Erlend Berg Farstad",pos:"FOR",age:29},{name:"Matheo Minh-Khang Hoang",pos:"FOR",age:23},
    {name:"Drilon Zeneli",pos:"FOR",age:25},{name:"Matias Aadnøy",pos:"FOR",age:26},{name:"Henrik Navarsete",pos:"FOR",age:29},
    {name:"Miran Kuci",pos:"FOR",age:22},{name:"Aiden Harvey",pos:"FOR",age:28},
    {name:"Leon Dahlstrøm",pos:"MID",age:18},{name:"Vegard Holsæther",pos:"MID",age:23},{name:"Tollef Kvello Etholm",pos:"MID",age:20},
    {name:"Besian Kadri",pos:"MID",age:28},{name:"Kacper Serafin",pos:"MID",age:22},{name:"Lars Følstad",pos:"MID",age:30},{name:"Julian Jappée Henriksen",pos:"MID",age:24},
    {name:"Brage Williamsen Hylen",pos:"ANG",age:20},{name:"Sander Werni",pos:"ANG",age:26},{name:"Michael Singh",pos:"ANG",age:27},
    {name:"Daniel Brandal",pos:"ANG",age:23},{name:"Sean Nilsen-Modebe",pos:"ANG",age:19},{name:"Sheikh Omar Mbye",pos:"ANG",age:23}],
  // Kvik Halden – EKTE posisjon + alder (Transfermarkt, 2026)
  "Kvik Halden": [{name:"Sander Lund",pos:"MV",age:18},{name:"Petter Bønøgård",pos:"MV",age:23},
    {name:"Markus Grimstad",pos:"FOR",age:20},{name:"Fredrik Steinsnes-Åsbø",pos:"FOR",age:20},{name:"Ole Viktor Skjønberg-Nymo",pos:"FOR",age:20},
    {name:"Erlind Krasniqi",pos:"FOR",age:23},{name:"Kalle Bjerregaard",pos:"FOR",age:20},{name:"Selius Gindeberg",pos:"FOR",age:20},
    {name:"Dardan Mehmeti",pos:"FOR",age:37},{name:"Adhurim Mjekiqi",pos:"FOR",age:21},
    {name:"Mathias Engebretsen",pos:"MID",age:33},{name:"Timur Ayub",pos:"MID",age:19},{name:"Alexander Puck",pos:"MID",age:18},
    {name:"Nikolai Solberg",pos:"MID",age:23},{name:"Kristian Lorentzen",pos:"MID",age:20},{name:"Mamadou Ba",pos:"MID",age:22},{name:"Marcus Moberg",pos:"MID",age:28},
    {name:"Uranik Seferi",pos:"ANG",age:23},{name:"Jesper Wichstrøm Johansen",pos:"ANG",age:23},{name:"Øystein Næsheim",pos:"ANG",age:37},
    {name:"Markus Brandon Manirakiza",pos:"ANG",age:21},{name:"Erikas Adukonis",pos:"ANG",age:24}],
  // Trygg/Lade – EKTE posisjon + alder (Transfermarkt, 2026)
  "Trygg/Lade": [{name:"Simen Rekstad-Johnsen",pos:"MV",age:20},{name:"Christian Funderud Wedum",pos:"MV",age:22},
    {name:"Sindre Greiff",pos:"FOR",age:24},{name:"Victor Ferner Bergersen",pos:"FOR",age:22},{name:"Gustav Hasle Juliebø",pos:"FOR",age:23},
    {name:"Sander Hoel Kjørstad",pos:"FOR",age:25},{name:"Sander Kleppe Halgunset",pos:"FOR",age:26},{name:"Brage Kvithyld",pos:"FOR",age:22},
    {name:"Torgeir Fredriksen",pos:"FOR",age:32},
    {name:"Kristoffer Flo Mørkved",pos:"MID",age:21},{name:"Thomas Bjørgve",pos:"MID",age:23},{name:"Jørgen Bøhle",pos:"MID",age:19},
    {name:"Heine Enger Kleiven",pos:"MID",age:25},{name:"Andre Ekseth",pos:"MID",age:22},{name:"Ola Johannes Elvedahl",pos:"MID",age:27},{name:"Julian Rygh",pos:"MID",age:30},
    {name:"Yafet Bahta Kahsay",pos:"ANG",age:21},{name:"Eskil Fossum Vik",pos:"ANG",age:23},{name:"Martin André Elverum Engvik",pos:"ANG",age:26},
    {name:"Felix Brattbakk",pos:"ANG",age:19},{name:"Simon Einarsen Hansen",pos:"ANG",age:22},{name:"Magnus Vollan",pos:"ANG",age:25}],
  // Brattvåg – EKTE posisjon + alder (Transfermarkt, 2026)
  "Brattvåg": [{name:"Erlend Henriksen",pos:"MV",age:28},{name:"Kieran Baskett",pos:"MV",age:24},
    {name:"Oskar Stølan",pos:"FOR",age:26},{name:"Ruben Kolseth Myers",pos:"FOR",age:20},{name:"Diedrick Bubahe",pos:"FOR",age:21},
    {name:"Sam Tattum",pos:"FOR",age:29},{name:"Iver Krogh Hagen",pos:"FOR",age:22},
    {name:"Fredrik Vinje",pos:"MID",age:28},{name:"Filip Stankovic",pos:"MID",age:27},{name:"Gard Sæterøy Rogne",pos:"MID",age:25},
    {name:"Kevin Anders Brusethaug",pos:"MID",age:25},{name:"Karim Bata",pos:"MID",age:22},{name:"Andreas Myklebust",pos:"MID",age:21},
    {name:"Jørgen Havig",pos:"MID",age:23},{name:"Leandro Elvestad Neto",pos:"MID",age:21},
    {name:"Andreas Tveiten",pos:"ANG",age:20},{name:"Rasmus Løvseth",pos:"ANG",age:27},{name:"Jørgen Galta",pos:"ANG",age:20},
    {name:"Sivert Solli",pos:"ANG",age:29},{name:"Martin Fylling Koch",pos:"ANG",age:23}],
  // Tromsdalen – EKTE posisjon + alder (Transfermarkt, 2026)
  "Tromsdalen": [{name:"Simon Thomas",pos:"MV",age:36},{name:"Marius Tollefsen",pos:"MV",age:26},
    {name:"Ola Holm Jacobsen",pos:"FOR",age:19},{name:"Ruben Kristiansen",pos:"FOR",age:38},{name:"Sondre Laugsand",pos:"FOR",age:31},
    {name:"Morten Lysakerrud",pos:"FOR",age:19},{name:"Magnus Kiperberg Mehl",pos:"FOR",age:21},{name:"Iver Koht Selnes",pos:"FOR",age:21},
    {name:"Casper Andreas Kleiva",pos:"MID",age:20},{name:"Asgeir Eliassen",pos:"MID",age:25},{name:"Ola Kristoffersen",pos:"MID",age:21},
    {name:"Peder Meen Johansen",pos:"MID",age:22},{name:"Tobias Hafstad",pos:"MID",age:24},{name:"Lasse Nilsen",pos:"MID",age:31},{name:"Einar Hauglann Ness",pos:"MID",age:22},
    {name:"Elias Skogvoll",pos:"ANG",age:30},{name:"Sondre Halvorsen",pos:"ANG",age:22},{name:"Kent Malic Swaleh",pos:"ANG",age:23},
    {name:"Didrik Hafstad",pos:"ANG",age:22},{name:"Mads Bådsvik",pos:"ANG",age:25},{name:"Isak Eknes Adolfsen",pos:"ANG",age:21}],
  // Træff – EKTE posisjon + alder (Transfermarkt, 2026)
  "Træff": [{name:"Petter Eichler Jensen",pos:"MV",age:22},{name:"Leander Sæther Tusa",pos:"MV",age:21},
    {name:"Vegard Forren",pos:"FOR",age:38},{name:"Sondre Eide Blikås",pos:"FOR",age:25},{name:"Sindre Heggstad",pos:"FOR",age:23},
    {name:"Iver Flønes",pos:"FOR",age:24},{name:"Sander Svorkmo Finnøy",pos:"FOR",age:21},{name:"Jørgen Bøe",pos:"FOR",age:24},
    {name:"Alex Bugaj",pos:"FOR",age:20},{name:"Nikolai Eide Ohr",pos:"FOR",age:21},
    {name:"Filip Heggdal Kristoffersen",pos:"MID",age:22},{name:"Sivert Røberg",pos:"MID",age:20},{name:"Emil Visnes Silseth",pos:"MID",age:20},
    {name:"Markus Hammerbekk Lewis",pos:"MID",age:22},{name:"Vegard Skuseth Myklebust",pos:"MID",age:21},{name:"Mathias Silseth Mork",pos:"MID",age:19},{name:"Henrik Bøe",pos:"MID",age:21},
    {name:"Kjetil Holand Tøsse",pos:"ANG",age:29},{name:"Sivert Gussiås",pos:"ANG",age:26},{name:"Erik Romero",pos:"ANG",age:22},
    {name:"Dino Okanovic",pos:"ANG",age:23},{name:"Ruben Slutås Toven",pos:"ANG",age:24},{name:"Agwa Okuot Obiech",pos:"ANG",age:30}],
  // Grorud – EKTE posisjon + alder (Transfermarkt, 2026)
  "Grorud": [{name:"Simon Andersson",pos:"MV",age:25},{name:"Lars Kvarekvål",pos:"MV",age:26},
    {name:"Tamsir Baboucarr Sosseh",pos:"FOR",age:19},{name:"William Fredriksen Bjeglerud",pos:"FOR",age:23},{name:"Tarik Mraković",pos:"FOR",age:21},
    {name:"Bendik Brevik",pos:"FOR",age:23},{name:"Simen Hagbø",pos:"FOR",age:27},{name:"Mathusan Sandrakumar",pos:"FOR",age:28},
    {name:"William Silfver-Ramage",pos:"FOR",age:20},
    {name:"Mohammed Mahnin",pos:"MID",age:33},{name:"John Phillipe Koko",pos:"MID",age:27},{name:"Abel Tjomsland",pos:"MID",age:25},{name:"Adrian Berntsen",pos:"MID",age:27},
    {name:"Marius Larsen",pos:"ANG",age:26},{name:"Awet Alemseged",pos:"ANG",age:22},{name:"Jonas Dobloug Rasen",pos:"ANG",age:21},
    {name:"Mikael Harbosen Haga",pos:"ANG",age:26},{name:"Emil Ringstad Kalnæs",pos:"ANG",age:18},{name:"Jakub Mariusz Sudolski",pos:"ANG",age:19}],
  // ---- 3. divisjon 2026 – ekte tropper (FotMob / Transfermarkt) ----
  "Asker": ["Erik Hejer","Oskar Slotta Karlsen","Anders Markus Tveit Heggset","Viktor Gulliksen","Jonas Skulstad","Stian Trollebø Jørgensen","Eirik Soleim Brennhaugen","Yonas Larsen","Daniel Pettersen Mandel","Jørgen Nilsen Bukten","Gustav Severinsen","Eskild Braathen Fredriksen","Herman Jorang Ugelstad","Aksel Waage Alstad","Andreas Walstad","Jakob Vassbotn Brath","Kristoffer Syvertsen","Matias Spiten-Nysæter","Roman Fazi","Magnus Bækken","Jens-Erik Johansen","Oliver Blymke Mogensen"],
  "Bærum": ["Nikolai Nordback Reinertsen","Elias Austgulen Sørum","Eirik Holm","Olof Viktor Thoresen","Jacob Iversen","Oscar Jansson","Almin Dacić","Henrik Hafskjold","Samuel Gray","Nicolay Grimstad","Lukas Faltin Ørbeck","Fabian Mikolaj Gluch","Kristoffer Aarflot","Balder Kveim Hanke","Julian Alberto Skaret","Kristijan Musovic Coric","Omar Markovic","Eduard Hjelde","Mathias Fjeld Gulliksen","Lasse Bransdal","Andreas Victorio","Brede Bransdal"],
  "Frigg": ["Egil Evensen","David Nikolaisen Kanck","Mugula Chris Safari","Jakob Jørgensen","Max Holte Hofbauer","Mikkel Kvinnesland","Edi Hockic","Erlend Haukvik Øya","Steven Danh-Nguyen Nguyen","Kristoffer Haugen","Varg Støvland","Joakim Holmedahl","Christian Halfstad Aagesen","Benjamin Rio-Moe","Jonas Knutsen Breen","Lars Nestaas Evensen","Brage Birkelund Eie","Adonai Mehary Kidane","Iker Carew","Ola Johan Antonsen-Meløy","Emil Tømt Bie","Eric Kanebog"],
  "Gamle Oslo": ["Lars Herlofsen","Vegard Storsve","Eirik Aalstad Bækkelund","Nabil el Hor","Musa Sanyang","Ivar Furu","Henrik Bredeli","Erik Stafford Germundsson","Arnar Thór Gudjónsson","Osama Housni","Felix Anthonessen","David Bruk Mæhlum","Sebastian Mugaas Salgueiro","Daniel Tavakoli","Thomas Reinfjord","Pa-Madou Jatta","Ebrima Jammeh","Erik Eikeng","Ola Kamara","Chimaobi Ifejilika","Fredrik Graham Hansen","Bleron Moralija"],
  "Grei": ["Kai Gunnar Danby Kamsvåg","Konrad Solhjell Frøystein","Erlend Bergwitz Saur","Ian Barobe","Immanuel Ntare Kirya","Ali Khris","Arselan Rasoul","Nikolas Peter Tsiolas","Tobias Stien","Gift Marcel Kaba","Armin Penava","Erik Eck Jørgensen","Eirik Holt Løw","Magnus Hagelien Mikkelsen","Omar Mahmoud Moftah","Isak Lysfoss Løvlund","Ali Salam Qzaibri","Ibba Laajab","Thomas Elsebutangen","Mesut Can","Nicolai Arun Jacobsen","Erlend Knutsen Storseth"],
  "Konnerud": ["Jonas Nicolai Simensen Hansen","Filip Artykiewicz","Lars Holmen","Samuel Alsaker-Nøstdahl","John Elias Amundsen","Aleksander Kristiansen Petricko","Nikolai Grøndahl Jagland","Benjamin Borge Karlsen","Sam Snellman","Philip Hennie Kristiansen","Tobias Stenerud","Marvin Nak-In","Mathias Deinboll Moldjord","Aleksander Grøndahl Jagland","Daniel Bjørge Jørgensen","Jonas Holthe","Erik Stavås Skistad","Ole-Christian Aarvik Larsen","Vegard Thomasrud","Savas Tug","Omid Nabi","Mohamed Abdullahi Mohamed"],
  "KFUM Oslo 2": ["Herman Randgaard Broen","Darian Weber Mink","Henrik Thoresen Bratteberg","Edvard Gullaksen Slinde","Lasse Nygård","Kristian Marhaug","Matthew Nicolai Cummings","Jens Olden Larsen","Ola Nessheim","King Wesley Williams","Even Di Bernardo","Thomas Ekroll","Ans Ahmed","Anders Aarseth","Vetle Hartberg","Herman Kvello Etholm","Ersin Kocacenk","Alvin Kristofer Wallmo","Peter Nygård Degnes","Marius Skallerud","Isak Bahtijaragic","Daniel Valan"],
  "Lokomotiv Oslo": ["Sivert Pieroth","Sebastian Gustavsen Bern","Jørgen Myhre","Eskil Fugllien Hauge","Kristian Nås Kristiansen","Magnus Helland Kjølsrud","Mads Bertelsen Sveindal","Trym Haakon Andenes Blaauw","Andrius Dolzenko","Daniel Valderhaug Molnes","Mathias Trondal","Mathias Nordby Sørensen","Ola Aga Ljoså","Aksel Bay-Larsen","Kristoffer Sjevelås Linnerud","Nikolai Holmqvist Bjørgo","Ulrik Bjerke","Jakob Ugland","Peter Saunes Hasund","Sondre Nordgaard Meløe","Christiaan Wielens","Ole Løkken"],
  "Nordstrand": ["Christopher Tobiassen","Franciszek Leon Szamotulski","Edvard Orseth","Harvir Singh","Ludvig Hedqvist Werner","Jan Marius Nøring Gøbel","Christian Leiknes Lind","Daniel Russom Ghebrenegus","Henrik Emaus Holm","Jørgen Haugsvær","Berry Gerezgi","Ari Bewianberg","Alan Abdulsalam Abdulgani","Amin Mohamed Chikh","Omar Madrane Ouahabi","Kasper Emilsen Krokan","Sander Fredheim Barbosa","Markus Norheim Cham","Markus Woldsund","Leander Thelle","Jonas Berge Jacobsen","Mathias Asphjell"],
  "Ullern": ["Jonas Vatne Brauti","Christopher David Varcoe","Anton Foss","Marius Lund Stensland","Tomas Lopez Borgersen","Mathias Farnes Gabrielsen","Sigurd Giskegjerde Rørstad","Dech Lul Gach","Francklyn Wollum-Goulehi","Thomas Vold","Sindre Lundh","Ilia Boyadzhiev","Junior Peya Irakoze","Oliver Peter Fitzgerald","Milad Mohasili","Arif Zeneli","Arman Handal Nouri","Espen Tveter Andresen","Sebastian Frost Eckardt Hansen","Daniel Severin Smith","Thomas Støfring","Bendik Foss Evensen"],
  "Union Carl Berner": ["Erik Walcott","Emil Rosén","William Topstad Henriksen","Jørgen Gunnes","Sverre Indrebø Gjønnæss","Theodor Schjenken Strømø","Stian Joannis Tsesmetsis","Filip Fosfjord","Stian Hagbø Olsen","Kasper Ruud Giltvedt","Erik Rosland","Markus Botten","Simen Bjørneboe","Jørgen Sønstevold","Marius Hegelstad","Jakob Emblem-Olsen","Axel Tunsjø","Axel Pedersen","Ole Thomas Skogli","Sindre Mauritz-Hansen","Mathias Kaspersen Ogre","Jens Aslaksrud"],
  "Vålerenga 2": ["Thomas Stavnem","Leopold Langedal Strand","Rasmus Ahlgren","Sikandar Ali Khan","Mario Gomes","Arjan Singh Plaha","Nikola Udovicic","Vilmer Nils Antonsen Brunskog","Maxwell Daddy Kerdoe","Jakob Granli","Gabriel Opsahl","Mathias Mashudu Solberg","Bobby Morrow","Odin Jakobsen Dybvad","Even Forcha","Amir Ahmed Jama","Ulrik Gjøslien Martins","Ahmadou Dioulde Bah","Mohamed el Fezani","Aksel Nordbø Sletten","Taha Usman","Magnus Bjørnstad"],
  "Heming": ["Borger Thomas","Albin Svensson","Tobias Skjelle Paulsen","Benjamin Hansen","Mika Mykkeltvedt","William Berg","Trond Erik Alvarez Oliva","Johan Svenkerud","August Frobenius","Sivert Haugli","Rahul Sharma","Ole-Marius Forsberg","Preben Engen Amundsen","Emil Andreas Sjo Nilsen","Erlend Dreier","Marius Aarøe Hellebust","Theodor Hustad","Benjamin Skulstad Sunde","Peder Dovland","Birk Jonathan Ramstad","Ulrik Ferrer","Severin Sørlie"],
  "Ready": ["Christoffer Gjertsen","Vlas Paljamar","Thomas Nerland","Julius Ernst Krøger","Even Formo Asplin","Lauritz Andresen Skjelle","Henrik Høyby","Fredrik Sundal Ek","Preben Munthe Øren","Fredrik Onsrud Balmforth","Franck Kouta","Fredrik Korssjøen Storløkken","Eero Oskari Nygren","Kevin Bam Wiik","Alexander Wiegels Waage","Jacob Maltun Koefoed","Mathias Ebbesen","Tobias Wangerud","Mads Jacobsen Mørland","Kristoffer Fiskvik Ødven","Anders Engebretsen","Daniel Thomas Steeneveldt"],
  "Byåsen": ["Daniel Hagen","Gard Trollskar","Espen Langørgen","Pål Martin Benum","Thomas Fahy Instanes","Max Nygaard Malheiro Garcia","Even Kristiansen Fagerli","Henrik Simon Jørgensen","Steffen Sæther Strand","Mohamad Walid Aljezawi","Preben Magnus Mohaug","Runar Heggdal Stølen","Dahir Yousuf Habib","Theo Jullumstrø","Leon Rene Hansen","Øyvind Døsvik Haugen","Jørgen Wisth Lie","Souhaib Abdulnasser Araj","Edvard Skogset Haagensen","Josef Gamele Kulego","Martin Oskar Bøe","Lucas Elmgren"],
  "Melhus": ["Øyvind Onsøyen","Håvard Myrstad","Kim Roger Laugsand","Eirik Ramlo","Petter Stadsøy Borgen","Matias Tørset Bjørnbeth","Kristian Blåsmo Haugbjørg","Edvard Stølan","Ola Randen","Sander Østerås Myrvold","Martin Nilsen","Peter Sagen","Tobias Dahl Åbelvold","Christoffer Glesaaen","Ørjan Grøseth","Even Thorsen","Magnus Hammerås","Ingmar Orkelbog Austberg","Jaheel Mikael Sølvhaug","Erik Windseth Bakk","Philip Totland","Anders Wiik Hosen"],
  "Molde 2": ["William Viken","Andreas Beinset","Håvard Lingen","Ole Rindli Sandnes","Noah Ljøen Bye","Ulrik Langlie Skrede","Ognjen Markovic","Sebastian Aleksandersen","Faveur Ndayizeye","Daniel Risan Nakken","Kasper Fagervoll Fylling","Liam Andersen Vangen","Kasper Vatnehagen Råket","Kristian Skuseth","Ioan Alexandru Szamboti","Oliver Berg-Hansen","Mathias Sylthe Moen","Igor Gosik","Aksel Johan Remen","Karl Aksel Kavli Miller","Håkon Dyvik","Petter Berg With"],
  "Nardo": ["Anders Gundersen","Anders Gausen","Sverre Espolin Hals","Henrik Rian","Joakim Blengsli","Adrian Henrik Kojen","Noah Sevaldsen Aarmo","Erik Tønne","Jakob Nordland","Trym Leer Hokstad","Morten Strand","Andreas Bergo Krokbø","Anton Pettersen Nordeng","Martin Nygård Erland","Mats Slyngstad Wiggen","Bo Johannes Bromset Sætran","Johannes Grythe Olden","Bendik Bye","Adrian Tørstad","Oskar Elinas Kvisten","Even-Andre Høyer Valde","August Birkeland"],
  "NTNUI": ["Odin Nordvåg","Even Risvand","Magnus Johansen Pierce","Tron Olav Bjerkreim Kleppa","Eivind Woie Ler","Emil Finsrud Henriksen","Kasper Aleksander Hornnes","Isak Bakkevig Håland","Jonas Flagstad Clements","Håvard Nyheim Grytnes","Petter Ølberg","Jonas Egeberg Gullfjell","Einar Corneliussen Storvik","Stian Aabel","Jacob Fjelberg","Endre Kvitnes","Kristian Garstad Eriksen","Vetle Fiskerstrand","Magnus Austbø Seth","Mathias Dalsmo Gløckner","Marius Føske Danielsen","Emil André Fjeldstad Eriksen"],
  "Herd": ["Sondre Løseth","Martin Kaarbøe","Sivert Stoknes Eikrem","Vegar Fredrik Döving Wenström","Jakob Aga Ljosa","Olav Alexander Hovlid Saetren","Brynjar Flatebø","Kasper Holen Johansson","Thomas Valaas","Magnus Toftnes Kolvik","Marius Ødegaard","Preben Alexander Saetre","Mikkel Damgaard Solli","Trym Andersen Osnes","Daniel Ngongo Mudingaie","Kristian Klokk Flovik","Jonas Kleppe Oksholen","Iver Korsbrekke","Erik Halkjelsvik","Christian Blomvik","Haakon Brandal Sværen","Erlend Nicolai Fjeldstad"],
  "Orkla": ["Even Rønningsbakk","Brage Heggem","Morten Grøset","Sindre Tørset Valø","Lars Dybdahl","Erlend Garberg Solligård","Espen Løfshus Staveli","Emil Eker Haugen","Erik Haegstad Johnsen","Aleksander Tøndel","Jørgen Krogstad","Tobias Forbord Bergsrønning","Ådne Engelsen Aarberg","Victor Wisløff","Sondre Fagerholt","Ola Morten Forren","Emil Rundtom","Emil Solemsløkk Lynum","Håkon Sanden","Tor Egil Johansen","Andreas Jonli","Martin Slupphaug Tallerås"],
  "Ranheim 2": ["Tor Solvoll","Børge Hoff Skaråsen","Marius Fagerhaug","Gabriel Saugestad","Aleksander Norum Sakshaug","Aslak Halvorsen","Magnus Skoglund Hermansen","Joel Benjamin Bratland Hakkebo","Mathias Eriksen Wold","Tarik Smailovic","Famara Camara","Adrian Leistad","Lucas Rode Schanche","Kenneth Wåtland","Emil Kvendbø Holden","Theo Sebastian Nordbotten Mostad","Simen Engdal Aarvåg","Levi Caicedo Rustan","Daniel Ofori Baah","Mikkel Jensen","Kasper Haugerøy","Maurice Sylva"],
  "Rosenborg 2": ["Sander Stokke","Erik Michaelsen Tronesvold","Peder William Krage","Filip Voje Stene","Isak Rekstad-Johnsen","Håkon Volden","Boye Skøre Hedman","Ulrik Hald-Hernes","Fredrik Dørrum Berg","Jonas Mortensen","Robal Mekuria Alemayehu","Henry Brekke Troset","Ole Christopher Gaddass Sand","Fredrik Røsten","Morten Trøen","Håkon Grønbech Austad","Magnus Wik Sylte","Iver Solberg Jacobsen","Daniel Thorstensen","Magnus Qvigstad","Eskil Skoglund Hermansen","Maciej Soboczynski"],
  "Spjelkavik": ["Henrik Hansen","Noah Hessen Øen","Johannes Øvretveit Larsen","Sigurd Hovet Ekornes","Iver Kirkholm Høihjelle","Henrik Hanken","Karl Gangstad","Julian Narancic-Grytten","Magnus Støylen Rødset","Sigurd Vidhammer Tafjord","Teo Amdam Standal","Martin Flo Alnes","Glenn Wetland","Henrik Nedregotten Larsen","Mathias Brusdal Nesvik","Vegar Skulstad","Filip Dubicki","Simon Vågnes","Elias Viddal","Johannes Hanken Tjøstheim","Mathias Gangsøy","Jonas Ottersen"],
  "Strindheim": ["Elias Mossi Misje","Sigurd Skimmeli","Brede Børset Andresen","Henrik Aukan Standal","Marius Mostervik Øien","Sander Arntsberg","Lars Valderhaug","Vegard Dønnem","Ole Melting Brauteset","Ask Reiertsen Angellsen","Fredrik Lund","Mio Jorquera","Niklas Saugestad","August Hynne Drageset","Alexander Gløsen","Mats Christensen","Erdem Kizilirmak","Sigurd Størseth Gjærevoll","Tor-Håkon Amundsen","Filip Davik Fredhall","David Azah Smith","Ola Gikling Bruseth"],
  "Volda": ["Vetle Korsnes Koppernes","Benjamin Opaker Tilseth","Sølve Sæter","Magnus Lien Bischoff","Sander Håvik Holsvik","Marius Olsvik","Olai Bjørdal","Julian Grøvlen Bjørkavåg","Tobias Vassbotn Evebø","Håvard Ervik","Andreas Brandal","Bendik Frøysa","Pijus Marcinkevicius","Andreas Hjellen Tangen","William Bjørke Aarseth","Olav Ervik","Daniel Gravdehaug","Robert Mathias Dahlberg","Isak Sundgot","Evan Dyrhol Aambø","Fredrik Kvalsnes","Thomas-Sander Hole"],
  "Aalesund 2": ["Herman Honningsvåg","Eirik Emblem Storås","Theodor Kvalsund Pedersen","Emil August Standal Eliassen","Severin Paris-Alvestad","Ali Naser","Magnus von Løwensprung","Jakob Rønningen","Tobias Leikanger","Amund Rolland Roth","Filipas Anghel","William Solheim Naalsund","Lukas Suleiman","Melker André Tryggestad","Dani Ramsy Suleiman","Storm Karlsson Knutsen","Kristoffer Hatlelid Hoddevik","Roy Warholm","Daniel Aam Kriken","Nataniel Giske Hjelle"],
  "Askøy": ["Markus Pettersen","Jakob Folkestad","Vegar Valhovd Kalsund","Mats André Johnsen","Krystian Piwowarczyk","Sebastian Hatland Kleppe","August Fredriksen","Henrik Steinseide","Ulrik Edvardsen","Julian Mohn Måkestad","Thomas Juvik","Torjus Mikalsen Pedersen","Sindre Hjartåker Norland","Jonatan Mellingen Haugland","Anders Kjeilen Jakobsen","Martin Toth-Pedersen","Lars Magnus Pedersen","Petter Sørensen","Erlend Tristan Sigvaldsen Soleng","Espen Bjorøy Kjørsvik","Tobias Juvik","Lars Hiis Bergh Solheim"],
  "Brann 2": ["Sverre Fauskanger-Lindberg","Håkon Hellesøy","Matteus Hoan Nguyen","Oliver Persson-Sulen","Sander Sivertsen Aga","Andreas Wilhelmsen","Elias Grimeland","Martin Hellan","Adam Rød El Jabri","Sondre Blumenfeldt Vindenes","Marius Endresen","William Tangen Haugland","Nicholas Wik","David Steinegger","Brage Haugen","Daniel Riihilahti","Filip Jensen Wassberg","Kaspar Lizana Tvedt","Emilien Hagesæter Steinsland","Mats Bendiksen Trengereid"],
  "Djerv 1919": ["Vetle Worre Bråtveit","Alessandro Daniele Balaban","Sune Mokleiv-Johnsen","Christian August Sveen","Donat Morina","Tobias Ekrene Innbjo","Vebjørn Søndenå Rullestad","Halvard Andreas Knutsen Østebøvik","Krystian Kujawa","Håkon Eriksen","Ole Milje Nesheim","Even Tillung Vik","Emil Østenstad","Noah Eriksen Sævereid","Thomas Horneland","André Solstrand","Nikolai Simonsen Nygaard","Sondre Klaussen Øvrebø","Håvard Vihovde Hovland","Minte Kastaljanov","Wilson Gilbert Niyonzima","Mads Solberg Johannesen"],
  "Fana": ["Jakob Johannes Gullbraa","Jeppe Cassim","Nicolai Gjertson","Magnus Ødegaard Lågeide","Kristoffer Bidne","Yevgen Martynenko","Petter Martinsen","Eirik Opheim Moldenes","Mads Håvåg-Eide","Fredrik Fosse-Iversen","Julian Duqaj Sandbakk","Jakob Fosse-Iversen","Simon Midtgaard","Daniel Flydal","Simen Brekkhus","Sondre Rolland Roth","Henrik Ødemark","Joakim Birkeland","Viljar Byrkjeland","Jonas Lygre","Daniel Aarstad","Kristian Isaksen"],
  "Fyllingsdalen": ["Lars Olav Jøsendal","Johannes Urne Haugse","Markus Bolli Austrheim","Oliver Haugsdal","Markus Rise-Grimstad","Simen Fløgstad","Muhammed Hemza Aljenniyat","Magnus Skulstad","Mikkel Erlandsen","Lars Jakobsen Sevilhaug","Adrian Grüner Bygland","Ole Tjelle-Heen","Styrk Hagen Gullaksen","Barasa Thomas Simpson","Sahr Bonga","Matheo Skare Ohnstad","Akash Ramesh","Iver Husø Johansen","Stian Mjelde Haaberg","Jesper Mørk Andreassen","Jonas Stjernberg","Emil Hagen Dyrseth"],
  "Førde": ["Kristoffer Dale Hanssen","Elias Hårvik Tvedt","Eirik Flatjord","Ole Petter Hjelle Larsen","Andreas Tefre","Elias Løkkebø Lekva","Ola Rognebakke","Vegard Otterlei Fløholm","Lasse Aamelfot","Sander Løkkebø Lekva","Kasper Rath Kaaber","Svenn Ove Gjøringbø","Nikolai Hvidsten","Håvard Sunde Sandal","Christian Josefsen","Simen Indrebø","Jonas Frøiland Nistad","Mathias Helgheim","Vegard Savland","Ovar Høyland","Tian Frøiland Nistad","Kim-Christian Liset"],
  "Os": ["Anders Fossen Lunde","Vitalijs Melnicenko","Mathias Aastvedt Dahl","Jason Onsrud Buan","Fredrik Strønen Skeie","Karl Aspevoll Omdahl","Henrik Helland","Eirik Spangelo Haga","Sondre Førde Valle","Vegard Moberg","Torkel Hjertnes","Torgeir Lunde","Petter Hilton","Jonathan Mjanes Lund","Henrik Tysse Sperrevik","Sebastian Plätzer","Albert Sjo Hystad","Thomas Stene Spilde","Niklas Lunde Fosen","Robin Johnsen Vindenes","Nathaniel Overå","Lucas Eide Døsen"],
  "Stord": ["Mads Katla Ellingsen","Tord Nøtland Belt","Aryan Hussein Saleem","Stian Habbestad Ytrøy","Lennart Andal","Jonas Habbestad Gjerde","Odin Andre Lunde Stensletten","Sebastian Hestenes","Kristian Magnussen","Halvor Livastøl Aga","Erlend Grov","Jan Arne Vassnes","Sindre Klingsheim Høgås","Kamil Kupryjanczyk","Heine Nysæther Storevik","Jonas Hilt Stoknes","Håvard Handeland","Roger Blokhus Ekeland","Torbjørn Agdestein","Tobias Grangård","Oliver Huse","Sondre Soma Ersland"],
  "Vard Haugesund": ["Lukas Fauskanger-Olsson","Markus Andreassen Berge","Tolleiv Helgesen","Sivert Helgesen","Jens Jonassen","Jone Jensen","Mathias Bakken Myklebust","André Lønning","Lorik Sadri Osdautaj","Olav Engesæter Crovo","Sebastian Brakedal","Andreas Brakedal Eide","Eirik Torkellsen","Sixten Dalen Jensen","Sebastian Lie Haaland","Mathias Kjær Eikje","Sander Lille-Løvø","Arent-Emil Hauge","Martin Alvsaker","Daniel Karimirouzbehani"],
  "Varegg": ["Alif Nojor Rahman","Marcus Gundersen Borchsenius","Mats Engeberg","Håvard Nødset Rosø","Lars Kallevåg","Heider Abdulridha Khalaf","Andreas Andersen","Christopher Wallem Veland","Aksel Claussen","Marius Sandtorv Bergset","Fredrick Rørstadbotnen","Brage Sandvoll","Nicolai Laberg","Ørjan Langåker Underhaug","Jacob Emil Tornes","Magnus Eidesvik","Oscar André Fanøy Nordal","Sindre Eknes Adolfsen","Johannes Bakke Hagesæter","Ali Qasemi","Andreas Velle Waraas","Kristoffer Saltnes"],
  "Åsane 2": ["Thomas Nielsen","Johannes Kvammen","Vegard Prestnes Jørgensen","Torjus Frøland","Dennis Sennesvik Bjørkestrand","Nils Mathias Elvebakk","Markus Aas Bergstrøm","Fredrik Aasen","Glenn-Ruben Makarewicz","Sondre Eberg Fimreite","Matias Herdlevær Refvik","Isak Øyre Nundal","Joachim Skjold Skålevik","Luka Aaker-Saldanha","Edvin Muhic","Amund Fossum Sundsøy","Malte Fismen","Oddbjørn Ones Dale","Lukas Finnøy","Surafel Ijara Aredo","Johan Flageborg Lie","Adam Anthun Bachmann"],
  "Austevoll": ["Simen Bratten Gjövag","Tor Eirik Nordtveit Tøkje","Henrik Melingen","Öystein Eidsheim","William Veivåg","Steffen Skår","Magnus Skartveit Møgster","Tord Harald Skår","Daniel Hufthammer","Aaron Alvin Ssabunyo","Christian Haugland Mikkelsen","Noah Møgster Heggestad","Joachim Bjånesøy","Nils Andre Bjånesøy Eidsheim","Graham Aleksander Ramsay","Mikkel Østervold Hatlevik","Marcus Dalseide","Steffen Andre Skår","Jesus David Rendon Quinones","Gustav Rabben","Jonathan Skår","Gabriel Alain Ramsay"],
  "Gneist": ["Daniel Tveit","Ryan Schiavetta Horneland","Henrik Bjørge Andersen","Magnus Vikedal","Tobias Nord Arnesen","Tobias Melkevik","Sander Lønne Dyngeland","Sindre Christiansen Aga","Simon Georg Harberg Sele","Jesper Holmøy","Tim Nicholas Ulvik Bjørnset","Even Christopher Thoresen-Rasmussen","Tobias Breivik Sagstad","Sina Rashid","Oliver Majewski","Fredrik Mikal Nyegaard","Jonas Toftesund","Marcus Fandino","Abraham Johnny","Sondre Eide","Hans-Fredrik Brosvik Holst","Mathias Kverhellen"],
  // ---- 3. divisjon Avd 4 (Rogaland/Agder/Telemark) – TM/FotMob 2026 ----
  "Brodd": ["William Heddeland","Adrian Schou-Andreassen","Vetle Dalva Revheim","Nicolai Miljeteig","José Alejandro Valecillos","Isak Mydland Dahlseng","Thomas Hellestø","Sander Halvorsen","Gabriel Rehman Horpestad","Sindre Håland","Viktor Emil Hovland","Martin Sveingard","Casper Aalen Norseng","Martin Mossmann","Bastian Eikeland","Storm Aleksander Kristensen Skandsen","Oscar Sagland","Marius Borsheim Fardan","Liban Ali Abdi","Sindre Haarberg","Isak Hellevik Hebnes","Henrik Westlye Haugvaldstad"],
  "Fløy": ["Markus Kristiansen","Heine Danielsen Møll","Morten Stakkeng Vang","Jakob Sannes Hornnes","Ola Rønningen","Jesper Gravdahl","Johannes Eftevaag","Nikolas Brandal","Drilon Ibishi","Johannes Tønnessen","Rafa Mertens","Mathias Myhre Madsen","William Drange Johnsen","Dirirsa Gamachis","Henrik Andersen","Preben Skeie","Levi Eftevaag","Tobias Kaas Knutsen","Adrian Barosen","Andreas Endresen","Joakim Grude","Aksel Rannestad Kloster"],
  "Haugesund 2": ["Frank Stople","Sebastian Lønning","Mats Hjalmar Næss","Sondre Dybvik Ekrene","Nikolai Mæland","Petter Gismervik Storjordet","William Kaldråstøyl Valenza","Birk Træet","Pål Engseth Lie","Vegard Solheim","Christian Lubingo Inkundji","Robin Erland Lervik","Gustav Olsen Holmen","John Thomas Idehen Kvinnesland","Almar Grindhaug","Fabian André Jakobsen","Ismaël Seone","Sander Hauge Christiansen","Daniel Reine-Haraldseide","Nikolai Tendal","Jone Flakke-Bjørnsen","Sondre Nilsen Nordvik"],
  "Hinna": ["Sondre Naaden Fosså","Ole Markus Wroldsen","Aksel Berg Sandin","Arvin Gergerechi","Lars Remoquin Skogland","Elias Rashidizadeh Dale","Ola Groven Bech","Aldon Sallabegolli","Rasmus Martinsen","Jonas Øvstun Jørgensen","Erlend Drechsler","Mikal Aga-Mæle","Magnus Nyhammer","Fredrik Christian Rugland Thulin","Mats Dale Valvatne","Andreas Eiane","Ola Skjefrås Alsaker","Stian Langeland","Adrian Aas","Matthias Røed Randeberg","Natanael Temesgen","Sebastian Storm Rettore"],
  "Madla": ["Lukas Hjorth Helgeland","Petter Vassenden","Ulrik Torsteinbø","Embrik Aleksander Halvorsen Henriksen","Tom Adrian Abusland","Hossam Samir Ibrahim","Einar Holst-Larsen","Linus Fleischmann Salomonsen","Aydan Stean Scharpf","Ståle Sæthre","Thomas Leidland","Ståle Skårstad Haugen","Aleksander Gundersen","Adam Dahl Assad","Theodor Fiveland Seim","Fredrik Czybulla Marthinussen","Rolf Olav Hesby","Fredrik Osmundsen","Mathias Dessingué","Moses Leonidas","Christoffer Talge","Michael Odongo Sunde"],
  "Mandalskameratene": ["Amund Wichne","Bård Høksaas","Sigve Eskeland Berge","Kjetil Berentsen","Isac Karlsen","Sigurd Larsen","Fredrik Stray Tjaum","Torje Wichne","Tobias Sira Hansen","Jesper Nodland Frajdenrajch","Amaldus Reme Lid","Thomas Aukland","Daniel Folserås Berglund","Alf Marius Melhus Abrahamsen","Daniel Selle-Lauritsen","Ian Håkonsen","Mathias Wiig Hagen","Martin Ramsland","Fredrik Antvort Soteland","Leif Isak Vinsjevik","Espen Walskaar Ramsli","Vetle Kolås"],
  "Odd 2": ["Sebastian Semb","Storm Leander Øines","Eirik Dahl Krugerud","Jonathan Roaas Engen","Lars Riis-Eriksen","Godwill Ambrose","Benjamin Ekre","Carl Ludvig Kapstad-Rambekk","Samuel Skree Skjeldal","Julian Lerato Gunnerød","Mukhtar Adamu","Johnny Dangshing","Magnus Tande Flood","Sebastian Høyer Henriksen","Eirik Riis-Eriksen","Kristian Rodgers Holte","Oscar Yohannes Essayas","Abduljeleel Abdulateef","Elion Krosa","Isak Bae Eikeland","Gabriel Occéan","Sigbjørn Kristoffer Naur"],
  "Stabæk 2": ["Henri Sørlie","Ole Thibault Comtet","Márk Dömötör","Johannes Benestveit Haavik","Oliver Frost Eckardt Hansen","Jakob Hage Løberg","Fredrik Naustvik","Aleo Hatlebrekke-Skjei","Henrik Hytterød","Peder Hanche-Olsen","Fredrik Hoff Birch-Aune","Edvard Varvin-Kvamme","Sebastian Velten-Simonsen","Alfred Gustad Lie","Suleiman Osman","Lucas Myklebust","Oskar Dæhli Oppedal","Sixten Mathisen","Finlay Benjamin Olav Knox","Marcus Isane Kjos","Casper Bachke","Richard Ferrington"],
  "Staal Jørpeland": ["Deniss Korneiciks","Simon Amdal","Samuel Jøssang Spørkel","Sigurd Kleven","Linus Kipperberg Kleppa","Jarand Veland","Eskil Fjelde Sel","Preben Løvås","Bartosz Widejko","Aleksander Hjelmervik Hinna","Eirik Wigdel","Ararat Shareef Omar","Steffen Helgeland","Kristoffer Ramsland","Aklilu Daniel Kubrom","Brage Woie","Adrian Stangvik Holta","David Eie","Lars Edvard Danielsen","Erik Steinsland","Jonatan Halsne","Ruben Mæland"],
  "Varhaug": ["Ruben Dvergsdal","Rune Mjåtveit","Snorre Varhaug","Filip Halvorsen","Jostein Sinnes Tjensvoll","Arian Ødegård","Svein Terje Netland Sinland","Lars-Trygve Madland","Vetle Skjæveland","Tobias Bakken Dalbye","David Aksnes","Imre Ødegård","Are Bø","Rasmus Bøhn Auestad","Sondre Dvergsdal","Andreas Ueland","Narve Bø","Ådne Nærland","Ørjan Bulling Steffensen","Elion Shatri","Alexander Hjelmhaug","Noa Aarrestad"],
  "Viking 2": ["Snorre Nygard Berg","Arn-Sebastian Wiik Escobar","Jens Koll-Frafjord","Mats Sekse Johannesen","Jonathan Debes","Magnus Oftedal","Elias Dahman","Aksel Tveit","Andreas Bjørnsen","Nour Monir Al-Mabhouh","Henrik Kvelvane","Sondre Tveiten","Max Sandåker Hagen","Emil Roland","Jacob Nordbø Middelthon","Elias Samuelsen Arifagic","Andreas Lie-Strand","Christopher Salvesen-Svenning","Ali Abdul Rahim","Sondre Bakken","Rasmus Gjelsvik Steigen"],
  "Vindbjart": ["Elias Noel Dale","Sebastian Heggland","Dennis Lindekleiv","Christian Follerås","Severin Finnestad-Stray","Lars-Georg Henneli Reinlund","Dennis Glatved-Prahl Myrvold","Daniel Tørressen Eikeland","Noah Heggestad","Xiaolong You","William Strandskogen Krogh","Arda Køse","Thomas Ree Jensen","Marius Larsen Alfsen","Elias Lunde Tusvik","Martin Heisel","Emil Lie","Henrik Vatland Heggland","Robert Våge Skårdal","Mustapha Fofana","Sander Svela","Kawsu Jabai"],
  "Våg": ["Michael Crowe","Harald Johannes Mosvold Christophersen","Ron Quranolli","Bendik Kristiansen","Henrik Frustøl","Elias Kjøstvedt","Rolf Daniel Vikstøl","Sebastian Fjellheim","Fredrik Haldorsen","Sedat Ninno Dağ","Marcus Vassnes","Albert Erklev","Salai Ling Om Mahlaw","Daniel Alexander Roppestad","Josef Rahman","Simon Anders Salen Aune","Aleksander Degerstrøm","Brian Stangnes Kjeldsberg","Felix Schröter","Sander Barstad Bergan","Ahmednur Abdirahim Mohamud","Aksel Aamlid"],
  "Åkra": ["Tom Olav Olsen","Vegar Snare Vågen","Kjetil Magne Nilsen","Gabriel Apeland","Eivind Høvring","Erlend Drivenes","Anders Underhaug","Jakob Rasmussen","Jan Anders Langåker","Ruben Rasmussen","Eirik Torkellsen","Jesper Thorsen","Henrik Thorheim Ådland","Gabriel Ferreira Kvilhaug","Theo Idsø","Jonas Gaupås","Sebastian Grindhaug Schnabel","Magnus Joan Pablo Knutsvik","Elias Gaupås","Elias Sirnes","Jakob Simonsen","Sindre Weltzien"],
  // ---- 3. divisjon Avd 5 (Nord-Norge/Østlandet) – TM/FotMob 2026 ----
  "Skedsmo": ["Martin Carnarius Mansaas","Caspar Hemstad","Elias Høines Julsrud","Lars Andresen","Jørgen Olav Sveinall","Birk Kvitting Øian","Vetle Røhne Nilsen","Mathias Storvik","Jonas Fernando Haakonsen","Håkon Gravningen Johannessen","Mohammed Yassir Eldirawi","Alexander Aksnes","Eirik Risberget","Mathias Enge Railo","Eirik Berg Kaldbekken","Arild Landau Werner","Jasman El Boumlali","Jens-Herman Haukeland","Tobias Remme","Jakob Klæboe Pedersen","Brage Aasen","Elliot Berbu Engebretsen"],
  "Fauske/Sprint": ["Philip Storli Hansen","Eirik Velle Strømsnes","Kasper Josefsen Bakkemo","Mathias Kosmo Skau","Simen Nyland","Erik Setså Borge","Adil Farah","Andreas Wold Gleinsvåg","Tobias Emil Johansen Alexandersen","Markus Olsen","Fredrik Bjørnstad","Petter Ferdinand Bangfil","Julian Andreas Olsen","Stian Sørdahl","Rasmus Wisth","Herman Monssen Furumo","Donat Berhane Tsegay","Petter Valla","Emil Hansen","Sondre Svemo Nyland","Richard Johansen Halvorsen","Magnus Johan Klaussen"],
  "Finnsnes": ["Michael Andersen","Håkon Rismo","Øystein Robinsønn Norheim","Henrik Fløgum","Noor Abdi Hussein Ahmed","Theophile Iragi Chirongozi","Jakob Berglund Jakobsen","Jonas Andre Christian Alapnes","Christian Arnesen","Sivert Ludviksen","Roni Gebregziabher Teclai","Lasse Lovin Bendiksen","Mathias André Eide Nikolaisen","Eskil Leander Skoglund","David-Andreas Løkke","Niklas Johan Sörensen","Jovan Radocaj","Mathias Sandvik","David Mathias Eilertsen","Kenneth Matthew Winther","Audun Berntsen Løvland","Joachim Sebulonsen"],
  "Fløya": ["Jonas Myhre","Vemund Dahl","Nemanja Masic","Sebastian Johnsen Warvik","Vebjørn Bye Amundsen","Eskil August Rønning Imøy","Sigurd Ekrem","Storm Espolin Andersen","Oskar Uteng","Magnus Børsheim Kalstad","Martin André Berg","Sander Egerton","Ask Wilhelm Henriksen Valen","Meron Rekka Ghilazghi","Lukas Lundstrøm Stokkedal","William Kristoffer Dahl","Kåre Skogvang Pedersen","Kenny Marblow","Hunor Bogdán","Lukas Elijah Beck-Hansen","Sivert Lind Olsen","Scott Alexander Fitzgerald"],
  "Alta": ["Maris Eltermanis","Aleksi Honka-Hallila","Sindri Huxley Arnason","Elias Ellingsen","Adam Hålas","Tobias Vonheim Norbye","Aidan Ettouati","Yegor Smirnov","Niklas Antonsen","Hans-Jørgen Sund Mikalsen","Marius Solbakken","Kristian Holsbø","Adrian Sandbukt","Felix Jacobsen","Christian Reginiussen","Nazar Martynenko","William Aksel Bratvedt","Leon Stenvoll","Gabriel Filip Åkesson"],
  "Lillestrøm 2": ["Luka Maric Veum","Lazar Babic","Johannes Burdal","Younes Aalili","Betim Hasanaj","Ilias Bouyambib","Mats Brede Ekra Olsen","Melvin Rogert Kristiansen","Amund Sæther Arntsen","Ole Alexander Haga","Isa Daniel Jallow","Leo Aastorp","Ivar Wiliam Vidaurre Winje","Lukas Bårdovich Prestholt","Wahib Fadil","Armand Thoresen Wangen"],
  "Kongsvinger 2": ["Sebastian Nærum Ekerhaugen","Johannes Marinius Simonsen","Oliver Bjerke Reierstad","Iver Elseth","Daniel Lysgård","Elias Berstad Tenden","Jakob Kvittum Konterud","Aron Wilhelmsen","Noah Theodor Nielsen","Eirik Ytreland","Eldar Nakstad","Matvii Ostrishchenko","Troy Fjukmoen","Scott Wilhelmsen","Andreas Dønnum","Liam Oluyemi Norderhaug Bråten","Fredrik Tunhøvd Bøsterud"],
  "Strømsgodset 2": ["Simo Lampinen-Skaug","Sokrates Sveia Krossen","Simen Skancke Elind","Hermann Loe-Eriksen","Sigurd Eriksrud Askland","Viktor Bretvik","Teo Sebastian Kaland","Isac Tostrup-Kval","Sigurd Dystland","André Stavås Skistad","Rafal Chverenec","Leon Hellesø","Markus Naasen Kvale","Mads Mosebekk Larsen","Elias Horne","Emil Juel Bache","Noel Kovács","Ole Enersen","Kevin André Dæhlin","Mats Spiten","Sean Healy Andresen","Marius Østbye Eriksrud"],
  "Skjervøy": ["Heljar Mikalsen Olsrud","Thomas Kristiansen","Peder Braathen Folstad","Bjørn-Are Aronsen","Irian Isaksen Høyer","Jostein Pedersen","Mats Solem Bakkeland","Konstantin Cvetkovic","Ulrik Marinius Reingjerdskog","Alf Sindre Einevoll","Vebjørn Dahle Bakland","Markus Karlsen Skogheim","Michael Fransisco Santana","Tenji Abdella Tenga","William Alm","Erlend Pedersen","Gabriel Inacio Dahl","Viljar Berg-Johansen","Dovydas Zala","Ørjan Skallebø","Emil Pedersen Winther","Magnus Lawrence Mahusay Larsen"],
  "Harstad": ["Jonas Aleksander Olsen Kristengård","Alvaro Rodriguez Alonso","Tobias Isaksen","Stian Christensen","Sander Esaias Ingebrigtsen","Eirik Christensen","Johannes Adrian Lund","Noah Leander Bendiksen","Theo Solheim Bergersen","Erling Fagerland","Kasper Harjo Akselsen","Kornelius Olaie Nordmo","Fredrik Andreassen Killie","Johannes Lindquist","Filip Klæbo-Solemdal","Jonas Vasseng","Aaron Nathan Sanquina Bakkemo","Hans Ailo Siri","Gabriel Andersen","Thomas Windstad","Amar Zulovic","Gabriel Fjellvang"],
  "Tromsø 2": ["Ole Kristian Lauvli","Jakob Durdi","Oliver Gudmund Østman Ottesen","Einar Høgetveit Jølle","Celius Kristoffersen","Lucas Jensen Wiik","Isak Kleczka","Nikolai Hansen Steffensen","Gard Harjo Haugsnes","Elias Molund","Daniel Ailo Sakshaug Bær","Sigurd Olsen","Nicolas Haugan","Noah Berger","Jonas Gärtner","Edvard Bjerkaas","Julian Lind Olsen","Adrian Evensen-Jensen","Sebastian Mihai Asan","Ludvig Hestness Gjertsen","Patrick Andre Strand"],
  "Skjetten": ["Michael Lie","Lucas Berg Haagenrud","Christiano Abilio Nystad Monteiro","Amir Adjou","Sondre Sagen","Mário Alexander Monteiro","Husam Mohammed Hassan","Morten Skjelle Paulsen","Wael Rachrach","Mansour Gueye","Romeo Vergnolle","Mohammad Ibrahim Alkabra","Tor Henrik Kjølen","Enes Shehabi","Mohammad Samih Tleimat","Henrik Brest Knutsen","Jonathan Monteiro","Odin Solheim","Anas Chaminta Ntiso","Markus Francis Bådstøløkken","Walid Khris","Elias Benjaminsen"],
  "Ulfstind": ["Gudmund Kongshavn","David Johnsen","Frank Even Bergheim","Simon Leander Haugen","Ole Andersland Riise","Julian Rosalio Kristiansen Aloyseous","Emil Andreas Haugen","Eivind Vold","Brage Fjellheim Wiik","Andreas Fiva","Dennis Emilian Bryne","Christoffer Yndestad","Mikael Schjølberg","Thomas Johannes Isaksen","Tom-Erik Strandli","Vegard Solhaug Brekke","Trym Brendstuen Mauno","Kristian Engstad Zachariassen","Vegard Lysvoll","Birk Berg-Johansen","Ole Marius Jørgensen","Jørgen Kilmark Tønnessen"],
  "Bossekop": ["Jonathan Linnes","Theo Gaup Nilsen","Lukas Friesen Wiik","Kristian Skorpen","Eskil Dagsvold Berg-Hansen","Joachim Fossmo","Ovlla Leander Eira Stamnes","Joel Sommerli","Simon Sommerli","Kai Espen Balto","Runar Ek Esjeholm","Peter Aas","Arle Ivar Ring","Isak Hunsdal Fallsen","Lars Henry Elvedal-Johansen","Elias Hunsdal Fallsen","Leander Heitmann Adamsen","Ulrik Koht Johannessen","Jørgen Bull Kristensen","Jørgen André Amundsen","Thomas Myreng","Vebjørn Atle Skorpen"],
  // ---- 3. divisjon Avd 6 (Østlandet/Innlandet) + Kvik (Avd 2) + Sogndal 2 (Avd 3) – TM 2026 ----
  "Lillehammer": ["Dylan Silva","Espen Evenrud Kjetlien","Sahan Wacays","Kristian Pettersen","Kasper Nordsveen","Sigve Rustad","Nathan Ndifon-Ewere Lenga","Henrik Sundgaard Holberg","Trygve Schreiner","Apipon Tongnoy","Simen Rasmus Renolen","Arne Ødegård","Nathan Holder","Olav Halvorsen","Mathias Leander Bølien Nygård","Jakob Hassan","Christian Dahl","Martin Husmoen Gjævenes","Simen Hammershaug","Deniz Christoffersen","Abdulmajid Kamal Abdulkadir","Preben Finstad"],
  "Gjøvik-Lyn": ["Rafael Veloso","Even Nordli Eriksen","Mathias Moe","Ulrik Domben Rognaldsen","Adrian Stokke","Jonas Chandee-Løken","Aleksander Sulland","Oscar Olsen Sangnæs","Thorbjørn Bellon Kristiansen","Oskar Sangnes","Kristoffer Ring Voldhagen","Jonas Dalen Korsaksel","Erik Slåtten","Mathis Thyli","André Brekken Weddegjerde","Ben Rossiter","Simen Brenden","Linus Skarseth Nilssen","Simen Lofthus Østerud","Håvar Befring","Moses Nyembo","Kristoffer Skjåk-Bræk"],
  "Råde": ["Oscar André Pedersen","Thomas Skjødt Johansen","Tobias Dyrseth Larsen","Ervin Kozica","Lucas Hans Gustaf Nilsson","Genjon Kavaja","Arber Rexhaj","Jacob Barrow","Benjamin Stensland","Netan Sansara","Elias Haug","Jonas Paus","Robin Thomassen","Oliver Slettum Fredriksen","Jonathan Elias Svendsen","Fredrik Stokke","Dana Montana Peroti","Andreas Hermansen","Tobias Eugen Guttulsrød","Abubakar Hussein Sharif","Deni Hasanagic","Martin Langsæther"],
  "Sandefjord 2": ["Daniel Gjone Dobbe","Gard Robertsen","Emran Ahmadi","Ola Reinert Bredvei","Oskar Loftesnes-Bjune","Per Reinert Bredvei","Anders Bjerknes Thorgersen","Linus Brathagen","Iver Lunde","Oscar Edwards Jørgensen","Ole Aanvik Wingsternæs","Edvard Cornelius Røberg","Kristoffer Halvorsen","Elias Vincent Johnsen","Elliot Gunnarsson Lavlund","Lamin Huchard-Nije","Vetle Holtung","Adrian Holtung","Mathias Døvle Lie"],
  "Elverum": ["Andreas Hippe Fagereng","Adrian Grasmo Bergman","Fredrik Liberg Berg","Anders Eriksson","Jonas Jensbak Nysæter","Femi Olofinjana","Espen Olsen","Amund Møllerhagen","Enoch Kofi Adu","Stig-Aleksander Santiago Bjørnæs","Jesper Aasen","Ola Sveen Boldvik","Marius Damhaug","Daniel Dalehaug","Jørgen Fylling","Vladimirs Kamess","Jonas Enkerud","Magnus Solum","Nelsinho","Syver Bjørnebye","Nicolai Elander Berg","Emil Andreas Waldal"],
  "Ørn-Horten": ["Kristoffer Solberg","Simen Solstad-Ramberg","Philip Andersen","Isac Lavik-De Lange","Vetle Schou Skullestad","Jonas Eldevik Lind","Lenny Falao Sørensen","Arnar Førsund","Sander Holseter-Karlsen","Thomas Knutsen","Alen Patros","Steffen Wivestad","Noah Johansen","August Vatne","Niclas Lavik-De Lange","Daniel Kubrom Hamde","Noah Molvær Antonsen","Pål Even Heggelund","Lars Magnus Takvam","Nathaniel Gashi","Andreas Ramstad","Peder Olai Mathisen Winge"],
  "Oppsal": ["August Vesterhus-Jacobsen","Jørgen Grønlie","Sebastian Jakobsen Lihaug","Andreas Fredrik Haug","Markus Mork Rydal","Greg Dylan Dusabe","Sarim Mohammed Tariq","Lucas Fabian Flåten-Lindbæk","Denis Ramadani","Emil Christian Horn","Fredrik Slinning Thomassen","Musa Badjie Lowe","Ahmed Sakali Hidani","Junior Kamul Chike Okoye","Kristian Arman Garsjø","Danyal Akthar","Adel Touhami","Amez Shwan Mustafa","Adam Barrar","Jonas Ringstad Skottvoll","Vuk Fajfric","Mats Brændvang"],
  "Drøbak/Frogn": ["Erlend André Foseidengen Jensen","Philip Haugan","Amund Gjersøyen","Mats Vågan","Tobias Gram-Caspersen","Nicolas Opheim Høihilder","Olav Bergstrøm Andersen","Mikkel Haukeberg Huseby","Trym Lind","Håvard Jonrud","Ole Jansson Berglien","Sondre Høydal","Sondre Stenbek","Emil Voldene Haugland","Felix Tomter Gray","Julius Ødegaard","Leo Emanuel Hagadokken Lenoci","Magnus Hart","Mikkel Aleksander Aarstrand","Mikkel Fodstad","Mathias Folkøy Woxen","Anders Brenden Solvang"],
  "Rælingen": ["Atle Wilhelmsen","Kristian Hovind","Andreas Bjørsvik","Thomas Haugen-Sverud","Jesper Buer Bjarmann","Erlend Flaten","Eirik Sannum","Selmer James Solland","Filip Frostrud Larsen","Mikkel Nordengen Knudsen","Theo Alexander Davidsen","Adrian Aronsen Tjernsli","Trym Engja Rindal","Ludvik Aksel Tangen","Rohullah Azimi","Henrik Sandås","Emil Andreas Karlsen-Chavez","Oliver Eliassen Eike","Yad Swar","Jonus Buer Bjarmann","Emil Hognes-Olsen","Petter William Lind Schei"],
  "Lyn 2": ["Tobias Johnsen-Kræmer","Mikkel Møller Gundersen","Wilhelm Frederik Daae Hrenovica","Emil Vold","Gabriel Erik Vik-Buet","Oliver Vartdal Nordgård","Kristian Kjerkreit","Aksel Eidsvik","Juuso Eemeli Nygren","Fredrik Sjåtil","Leon Fernandez Dalby","Isaac Barnett","Sivert Andreas Styrmoe Munch Rotevatn","William Hattestad Gautesen","Dawit Efrem Gherezghiher","Francis Bull","Victor Chammas Mangerud","Rayan Elmi Sharif","Fallou Sock","Håkon Eidsvåg Myhre","Godwin Victoire Diambilay","Ulrik August Daae Hrenovica"],
  "Fram": ["Andreas Albertsen","Jeremi Maciej Kamecki","Magnus Simensen Holthe","Halvor Semb","Sigurd Skifjeld","Erlend Leonardsen Klausen","Philip Jonhaugen Ask","Mohamed Sahal Bile","Jacob Eftedal","Lorentz Rørvik Wentworth","Liiban Abdi Ahmed","Emil André Jevard-Skuland","Simer Yosef Kflesus","Uno Pedersen","Eivind Johnsen","Wayne Tyson Jr. Cole","Ki Nathaniel Lid","Abdul-Basit Agouda","Martin Engdahl","Preben Langmo Wold","Nicolay Ulvær Andersen","Adrian Bunjaku"],
  "Sarpsborg 08 2": ["John Rune Alvbåge","August Fasting Risbråthe","Jesper Holter Skjøren","Lauin Nashuan Ibrahim","Magnus Knøsmoen Lunde","Jonas Hassel Pettersen","Eskil Graasten","Emil Majewski Sikkeland","Jesper Hystad Melleby","Mads Barret-Olsen","Aram Poya","Elias Ileby Nakstad","Rijad Hodzic","Håkon Finstad-Vogt","Eirik Paulshus Vold","Emil Orud Torp","Szabolcs Büki","Bop Guèye","Martin Andreas Bakkenget","Johannes Rogne Fjærvik"],
  "Brumunddal": ["Oliver Heggelund","Asgeir Spigseth","Magnus Iversen","Eivind Strand Osmo","Erik Sagstuen Nysæther","Emil Innselset Nordeng","Anders Ludvigsen","Jesper Hagelund","Herman Alexander Evensen","Syver Karlsen","Jesper Heggelund","Torgeir Osmo","Markus Holthe Lund","William Oliver Karlsen","Julian Eriksen Høsøien","Mathias Nilsen Hjemsæter","Kasper Sørum","Jørgen Strømeng","Jørgen Hårseth Holmlund","Markus Haave Andersen","Christian Lilleøen Ruud","Raphael Xeno Skøtt Dahl"],
  "Bjørkelangen": ["Ahmed Jouini","Even Vestreng","Hans Marius Granerud Fjeld","Ola Byfuglien","Marcel Mendyk","Martin Søbye","Kristian Sether","Mathias Ringstad Holmedahl","Paul Driscoll","Ola Haugerud Ness","Melih Can Danacı","Jon Emil Holm Olsen","Eirik Holm Olsen","William Norheim-Bergquist","Ali Riad Abdel Amir Al-Nashi","Saied Muslem Hashimi","Nicklas Hoffstuen Johnsrud","Ola Vestreng","Henrik Aas","Tobias Torre","Ola Bjerkenes","Hampus Helgerud"],
  "Kvik": ["Francois Guillemot Venn","Jakob Kaas","Henrik Skaugseth Hagen","Tobias Ludviksen","Viktor Haarberg","Birger Olav Sætre","Karl Nesse Wiig","Eskil Andreas Øien","Aleksander Stamnes Vavik","Tevje Rønning Torp","Jasem Mareno Bavi","Oskar Sandvik","Jacob Landro","Thomas Grønning","Hadi Karimi","Marius Blåsmo Norderud","Sebastian Reinke Kristensen","Skage Giljarhus Storheim","Oscar Kaplanski","David Melkvik","Ramy Labreche","Iben Elias Berntzen Kirkhus"],
  "Sogndal 2": ["Martin Opheim Østli","Ard Ragnar Sundal","Ulrik Svensøy","Mats Wehn Skjeldestad","Hans Pedersen Grønningsæter","David Kongelf","Theo Ruud Westgård","Jonas Henjesand Sætre","Emil Lunde Hillestad","Sander Sjøthun Heggestad","Markus Lazaro Mannsverk Bringas","Elling Ingeson Kvåle","Sigve Årdal Ølmheim","Julian Gjervik Madsen","Mathias Krogh Ravnestad","Khadar Abdi Ibrahim","Lukas Lemvik Vigdal","Nicolai Aske Granheim","Sverre Stavø","Viljar Stavø","Sondre Solstad Herfindal","Mohammad Ali"],
  // ---- 4. divisjon Avd 1 (Stavanger-området) – TM/FotMob/fotball.no 2026 ----
  "Sola": ["Sverre Olav Joa","Vegard Føyen","Mirkan Cevdet Buğurcu","Abdiasis Ali Hassan","Sander Mathiesen Bærheim","Said-Emin Muradovitch Makaev","Anders Haugen","Kittinan Kaeophu","Asher Tadesse Hadgu","Niama Haidary","Kristian Feed","Benjamin Brekke Munkvold","Andreas Kjærland-Haga","Mattias Haugen","Jonatan Rasmussen","Herman Haga","Ask Christiansen","Zaid Salameh Aldae","Mehdi Kralkallah","Adrian Hordnes Elde"],
  "Riska": ["Hakon Smalas","Andreas Smalas","Rene Duas","Knut Haugland","Eirik Olsen","Daniel Jacobsen","Morten Ommundsen","Anders Ommundsen","Kjetil Fjelde","Runar Fløysvik","Atle Soma","Thomas Vier","Sindre Stangborli","Geir André Aasen","Torger Motland","Vetle Myhre"],
  "Hana": ["Marko Berg","Morten Helmen","Anders Bauge","Fredrik Ommedal Hafnor","Stefan Berg","Thomas Gabriel Minde","Linus Monsen Furenes","Einar Kvalbein Skjørestad","Vegard Kvalbein Skjørestad","Casper Svarstad Hebnes","Joar Kvalbein Skjørestad","Erlend Gudmestad","Glenn Bungum Levang","Niclas Dolmen Håra","Christian Øen Lithun","Nichlas Thulin Kamfjord","Henrik Andreas Dybdahl","Henrik Malde Breimyr","Theo Svihus Gramstad","Eirik Skavhaug Larsson","Jesper Sundem Barlaug"],
  "Ganddal": ["Håvard Sannerud","Jesper Meisland","Jørgen Bærheim Borgenvik","Daniel Brun Bjelland","Lars Henrik Bjørnå","Gøran Wigestrand","Marius Ørn Høiland","Ole Marius Tjernagel Elgesem","Anders Imsland","Mark Alvin Skeie","Trym Einar Thesen","Jacob Eikeland Grova","Samuel Ole Tjelta","Jan Erik Gilje Jakobsen","Jakob Eikeland","Johannes Nordgård","Nathaniel Andreassen","Sigmund Lende","Milian Lode","Fredrik Torsteinbø"],
  "Frøyland": ["Daniel Kalhovd Kvamme","Sigbjørn Skjæveland","Ragnvald Soma","Rune Pedersen Bore","Berge Ohm","Kristoffer Mohn Kverneland","Eirik Hadland","Espen Ravndal","Jone Kleppa","Cato Hansen","Tommy Tønnesen","Petter Øfsteng","Eirik Bergli"],
  "Klepp": ["Mathias Brænd","Tomas Kyllingstad","Stian Braut","Thomas Undheim Hatteland","Tormod Fjelde","Martin Andreas Grødem","Anton Moi","Kristian Barka Braut","Theodor Tobiassen","Sindre Kyllingstad","Emil Kaspersen","Peder Liamo Hisken","Johannes Stokka","Simen Sele","Even Engelsgjerd-Kvål","Kasper Håland","Sondre Høyland Asheim","Mathias Melum-Hansen","Snorre Kleppe","Artur Kryvobok","Roderick Stoffel van Iwaarden","Jonas Vold Torland"],
  "Sunde": ["Sakarias Rolland Ågesen","Vegard Rasen","Ole Soma Hjelle","Martin Halsnøy","Kjartan Olsson Hauge","Kristoffer Ree","Kristian Kydland Revheim","Jarle Nordbø","Markus Hognestad","André Sande Maribu","Emil Birkedal Øvstebø","Jørn Hornseth","Jonas Tytlandsvik Johansen","Mats Haugland","Benjamin Pekmezovic","Ermias Solomon Habtegabr","Noah Serigstad","Axel Ferdinandsen Lønseth","Abel Yibo Beyene"],
  "Buøy": ["Petter Høie","Bjarne Jonassen","Håvard Ulla Linga","Sivert Stapnes Goa","Anders Jonassen","Ole Patrick Mauritzen","Henrik Øen Delis","Theodor Lind Jensen","Hans-Tore Henriksen","Jonas Jonassen","Sander Husebø","Morten Adamsen Husvæg","Tobias Trondsen","Emanuel Evertsen Omane","Erlend Wiull","Simon Kaland"],
  "Hundvåg": ["Jonas Thorgersen Laukvik","Nikolai Kavli Opsanger","Morten Melkevig","Fredrik Myhre Gjerde","Kristian Høvring","Martin Overvik","Lars Løkling","Steffen Bøifot","Mathias Helland Olsen","Jonas Halvorsen","Erik Berg Mauritzen","Nikolai Lyngnes Ramsland","Preben Erland"],
  "Vardeneset": ["Marius Kastet","Ørjan Aronsen Ellingsen","Samir Habibi","Christian Stokkeland Askeland","Oliver Gjøse Bertelsen","Daniel Robin Nustad","Sebastian Hammer Larsen","Eirik Birkeland","Joakim Berg Holter","Marcus Laursen","Sebastian Gjesdahl Aase","Maekele Michael Weldessilasie","Sigurd Helliesen Frøystein","Petter Haukali","Mikal Hebnes Olsen","Jaran Helmichsen","Azad Jørgensen","Matias Kleppe Reinsnos","Eirik Jakobsen","Morten Eriksen","Ceu Lian Khar","Lars Holm Larsen"],
  "Forus og Gausel": ["Espen Øvretveit","Markus Pedersen","August Dahl-Strønstad","Dennis Zhilivoda","Magnus Flokketveit King","Magnus Fjogstad","Ole Kristian Hovland Larsen","Hicham Billa","Haakon André Pollestad Hundsnes","Jørgen Rosnes Hansen","Karl Magnus Torgrimsen","Simen Melhus","Truls Fjeld Gudmundsen","Mikal Rødde Hjorteland","Kristoffer Kommedal","Alexander Rettedal","Nevill Sofo","Christoffer Holmebakken Salte","Runar Haheimsnes Engebretsen","Vetle Berg Johnsen","Cairo Lima","Simen Roland"],
  "Figgjo": ["Vidar Skjeggestad Assersen","Kasper Johan Idland Skjæveland","Tryggve Tobias Korneliussen","Ole Føreland","Christer Oftedal Vestly","Kenneth Fuglestad","Håkon Berge","Sondre Aano Lima","Aleksander Boge Nilssen","Fabiano Augusto Kristiansen","Henrik Idland","Svein Gøran Pedersen","Ali Aga Haidary","Ole Kjartan Bråstein","Isak Gebrehiwot","Jon Sivert Åsebø","Ørjan Johnsen","Sveinung Oseland","Sebastian Øverland-Tollefsen","Kieran Idland Skjæveland","Øyvind Espevik","Vegard Blikra Undheim"],
  // ---- 4. divisjon Avd 3 (Agder + Bryne 2) – TM/FotMob/fotball.no 2026 ----
  // (Vennesla og Flekkerøy mangler pålitelig kilde – de beholder genererte navn)
  "Bryne 2": ["Jakob Apalset Vassbø","Kristoffer Orre Kverneland","Andreas Ghezai Grøttjord","Aleksander Voll","Mario Elias Bøe","Lucas Vold","Trygve Alsvik Lygren","Christoffer Voll","Espen Krogedal","William Vaule","Håkon Tveit","Aleksander Bratli Pedersen","Emrik Andersen","Aleksander Heggernes Thu","Kristian Skurve Håland","Emil Vassbø","Sølve Egeland","Farid Jabrayilzade","Joachim Årstad Gursli","Daniel Ellingsen Hodneland","Jaran Eike Østrem","Oscar Aleksander Pedersen"],
  "Donn": ["Sander Våga","Emil Jacob Zimmermann","Sander Isefjær Ludvigsen","Morten Mykland","Anders Bergan","Jon Ole Reinhardsen","Mattias Breilid","Marius Hammersmark","Lars Øygarden Nordbø","Ola Thorsen Stangeland","Mads Quist Ness","Bjarte Richardsen","Jan Thomas Sandvik","Magnus Aamodt","Fabian Steen Finmark","Adrian Granåsen Hjelvik","Markus Andersen","Fredrik Hauglund Berge","Benjamin Torsvik","Anders Christian Bjørge","Sabaun Mir","Stian Ingebrethsen"],
  "Søgne": ["Sindre Tjørhom","Johannes Kjøstvedt","Fredrik Repstad Hansen","Martin Skaiå","Dan-Roger Roland","Kevin Sørland Vigebo","Martin Førland Velle","Christian Rogstad","Morten Dalene","Jarle Rogstad","Hans-Robin Enoksen","Simen Sætheren Øfstbø","Markus Aamodt","Ditlef Ueland","Daniel Aamodt","Sondre Veel","Tasso Thomas Dwe","Magne Karlsen","Emiel Alexander Peersen","Theodor Benjaminson","Kasper Lian Lohne","Anton Nygård"],
  "Express": ["Mathias Skjævestad","Emil Windegaard","Marius Aagre Larsen","Ole Svarstad","Teo Jørgen Peersen Hansen","Jonas Emil Dalen","Sijam Vincent Nuri","Tore Erik Skeimo Løvås","Elias Larsen","Eivind Boye Gundersen","John Emil Reinertsen","Mathias Wichmann","Ali Hossainy","Vitalij Bravikov","Even Misgna Zemichael","Eirik Husebye Sannæs","Daniel Lønning","Erik Gjerstad Beisland","Steinar Berås","Kent Erik Sellæg","Jakob Helland Kjølsrud","Yusef Omid"],
  "Vigør": ["Georg Esperaas Dirdal","Christopher Fuller Mollestad","Niklas Eilertsen","Fredrik Kviljo","Sebastian Fevang","Johannes Lien Bischoff","Stian Mangseth Hornnes","Jesper Aamodt Hjortshøj","Ulrik Moen","Tobias Hyltner Evensen","Fitor Nika","Shihab Mohamed Abbas Ibrahim","Felician Jorn Fridrich Aas","Sander Helliksen Loen","Adi Dukic","Danial Ahmadi","Oleksandr Shurman","Ali Dib","Simen Schille Olsen","Dawit Ghirmay Andom","Ismael Bahij","Julian Vigeland Andersen"],
  "Randesund": ["Herman Alsted Amundsen","Marius Wigardt","Felix Hagen Okalla","Kristian Lunde","Olai Benestad","Isak Breistein","Kristoffer André Hornnes","Henrik Robstad","Espen Knudsen","Diego Panique","Henrik Nyheim","Mats Vårdal","Brandon Caspar Kanyange","Stian Holbæk-Hanssen","Motuma Tilahun Abdisa","Daniel Høglo Nordvik","Ole Andreas Bjørnsgaard-Andersen","Even Enger","Magarsa Rassa Tilahun","Mathias Tønnessen","Markus Thomas Bjørnholmen Graham","Christoffer Lindberg"],
  "Gimletroll": ["Ole Bru Egeland","Kim Edvard Kittelsaa Handeland","Emil Jørgensen","Sebastian Bergqvist Støle","Eirik Sebastian Benham","Ola Esperås Thunberg","Mats Koppang-Grønn","Martin Måreid Lundevold","Kristian Svenningsen","Idar Golf","Kasper Rugland","Håvard Søvik","Gøran Breilid","David Skuland Soltveit","Thomas Eikeland","Sander Tangen Christensen","Benjamin Frustøl","Cornelius Garlie","Leo Johannes Gutvik"],
  "Trauma": ["Adam Rognli","Mehdi Shahriari","Jacob Lien Jomaas","Johan Sogorka Brinch","Mohsen Shahriari","Henrik Hegerlund","Jeremie Elepo","Marcus Hope","Mads Nørby Rønn Madsen","Jakob Rasmussen","Tor André Dalen","Reza Arezou","Erlend Øymoen Henriksen","Snorre Ulriksen Flatebø","Alex-André Hasselø Aanonsen","Brian Nordheim Haugenes","Adrian Siqveland Sunde","Aron Doru Lezeu","John Faranso","Simen Husum Hølleland","Jostein Egeland","David Anders Mackrill"],
  "Birkenes": ["Kenneth Fossdal","Lasse Aamlid","Ole Morten Søbye Byremo","Edvard Wisløff-Ohrvik","Viktor Frigstad","Brede Haugen Bildøy","Elias Christiansen","Bjørnar Gitmark Hove","Kristoffer Suggelia","Eivind Flaa","Jonas Sæter Sundtjønn","Nicolai Aas","Ole Kristian Frigstad","Robel Muhur Gebrehiet","Knut Arild Espegren","Jon Frigstad","Vemund Mollestad Rislaa","Thomas Salvesen","Jonas Hauge","Johannes Vreim Jørgensen","Lukas Stordal","Elias Flakk Thomassen"],
  "Lillesand": ["Håkon Nilsen Røste","Jonathan Jenssveen","Sebastian Håkedal","Jie Luu","Boo Gilbert Skuggevik Centeno","Isak Severin Berntsen","Dilmon Isak","Erik Tørring Enoksen","Sondre Haabesland","Patrick Le Gall","Abdullah Essa","Arbi Magomedovitsj Ismailov","Sebastian Ohrvik","Shun Phat Nham","Jan Fillip Bull Andersen","Kasper Glastad Mouridsen","Gustav Haugen Veiersted","Fredrik Danielsen","Khaled Özturk","Balder August Bratland","Maximillian Stephens","Kåre Magnus Helling Glamsland"],
  // ---- 4. divisjon Avd 4 (Agder/Bergen) – TM/FotMob/fotball.no 2026 ----
  // (Øygarden FK ble oppløst i 2022 – beholder genererte navn)
  "Hisøy": ["Ramunas Purauskas","Filip Holter Nilsen","Sondre Emil Hauge Finstad","Adrian Bakke","Patrick Fiuren-Gustafsson","Sune Aagaard Kiilerich","Kristoffer Goonewardene Solvei","Michal Rafal Tlolka","Henrik Ryltoft Bertelsen","Ole-Emil Birch Gundersen","Markus Larsen","Noah Flatebø","Sigurd Mørner Retterholt","Martin Handaa Andersen","Christian Thue","Sebastian Eppeland Hansen","Herman August Krogstadholm Zachariassen","Sebastian Holter Nilsen","Henrik Heggland","Herman Smedsaas Blakstad","Isak Flatebø","Marius August Lønnhaug"],
  "Start 2": ["Dennis Cornelius Birkenes","Børre Sirnes Kloster","Sondre Jørgensen","Johannes Grummedal Engenes","Leander Syvertsen Bjerke","Zakaria Rasouli","Elias Eriksen Aleksandersen","David Leander Nordvik","Gustav Vik","Magnus Netland Gudde","Fredrik Eidshaug","Bastian Norum Ruenes","Jacob Sheridan Kolbeinshavn","Nicolai Apland","Herman Waage","Emil Ogric"],
  "Jerv 2": ["Thomas Babale-Grobæk","Nichita Golburean","Julian van Etten Ankersen","Mattias Breive Lauvrak","Håkon Heier Trondsen","Marius Holthe Gummedal","Simen Isene Domaas","Jesper Hasselgård","Maximilian Fallås Andersen","Andreas Havstad Kvifte","Henrik Dokkedal","Patrik Isaksen","Tobias Lærum-Johansen","Tage Christopher Jørgensen-Hofstøl","Markus Syvertsen","Noa Matias Berntsen Vinterstø","Fares Aiman Mohammad Abdalhalim","Lukas Gebeyaw Aynshet"],
  "Smørås": ["Espen Birkeland","Martin Aandahl","Jelmer Hoekstra","Theodor Stensaker Nilsen","Mathias Thuestad","Ole Litlabø Eikenes","Håvard Flotve","Jonas Evensen","Håvard Fjellstad Langeland","Trond Ivar Eskeland","Sebastian Lothar Andersen","Ask Egeland-Sverdrup","Sander Simpson-Larsen","Yunus Tawfik"],
  "Baune": ["Emil Kristoffer Rosvold","Nicolay Aall Tveit","Eirik Kristoffersen","Eirik Stokkanes","Marius Ylvisåker","Joakim Lokøy Nordøy","Daniel Rongved Østrem","Pål Mildestveit","Erik Dalstø","Anders Næs","Asgrim Tangen Farnes","Simen Godøy"],
  "Loddefjord": ["Johnny Nguyen","Tobias Sæle Westrheim","Brage Skattebo","Nathan Daniel Harrington","Mathias Lundgren Nysæther","Kristian Gjerde Ødemark","Markus Vindheim Rivedal","Mathias Steffensen Svellingen","Matias Sekkingstad","Niklas Georg Andreassen","Nicholas Blumenfeldt Vindenes","Sigurd Stevnebø Kaale","Gutu Mohammad Taju","Martin Nyhammer","Henrik Vågen Hesjedal","Stian Lyseknappen","Mathias Johnsen","Marius Bildøy","Joachim Sæle Westrheim","Ebraheem Ahmed Riyad Missbah","Malik Mohammed Mohammed Miqdad","Ali Kamal Ali Abbas"],
  "Tertnes": ["Gustav Aarre Mohus","Kristian Bell","Dennis Mindor Marøy","Fabio Antonelli","Christer Teigland Johansen","Sindre Flaa","Olve Opsvik","Noa Lingeskog","Hans Berge","Kristoffer Nilsen","Bendik Kristoffersen","Andreas Risnes","Peder Vareide Augestad","Stefan Storvik Pedersen","Frank Lilledal","Jørgen Nielsen Hornnes","Ivar Mykkelvedt","Eirik Nielsen Hornnes","Desmond Chappy","Edmund Chappy","Håkon Lund"],
  "Arna-Bjørnar": ["Mathias Grimstad","Daniel Maria David","Thor Olav Fenne","Oscar Bakke Flaten","Rune Gravdal","Mathias Skaftun Boge","Øystein Aksnes","Tobias Nøss","Daniel Tangen","Espen Fedje","Martin Tysse","Preben Hille","Simen Næss","Joakim Vagenes Skjelbreid"],
  "Nymark": ["Lasse Steffensen","Markus Mek Pedersen","Kristian Henrik Kårstad Lilleaasen","Håvard Meling Nesse","Adrian Valør Olsen","Daniel Navarsete Tonheim","Martin Asserson","Håvard Kroken","Hans Jørgen Bakkehaugen","Martin Johnsen","Ole Marius Cassidy Ones"],
  "Trio": ["Aragon Thorkildsen Thorsen","Martin Fjeldstad Smith","Håkon Tarjei Sundsteigen Nes","Sander Saghaug Lillesletten","Brage Ripel Harsvik","Jakob Gjerde","William Saghaug","Brage Kvandal","Eivind Tufta Saghaug","Brynjar Sortland Olderkjær","Åsmund Eikeland Voster","Isak Rønstad Mo","Martin Lygre","Nicholas Aasen-Pedersen","Emil Haugan Solheim","Eirik Soma Ersland","Olav Bernhard Vågen Heggøy","Noah Tharaldsen Smith","Dennis Solheim Markhus","Nils Olav Smestad","Tristan Thorkildsen Thorsen"],
  "Nest-Sotra": ["Øyvind Kleppestrand","Vegard Sangolt Ekren","Emil Kalsaas","Adrian Torsnes Arefjord","Ole Thomas Herrem","William Christoffer Eide","Steffen Arseth Ljosheim","Håkon Herdlevær","Jakob Thormodsen Høyland","Sander Reksten Bruun","Håvard Hammersland Blom","Ian Christian Datu Bull"],
  // ---- 4. divisjon Avd 2 (Jæren) – TM/FotMob/fotball.no 2026 ----
  // (Gjesdal, Kvernaland, Tananger og Vikeså mangler pålitelig kilde – genererte navn)
  "Nærbø": ["Andreas Stokke","Erlend Kvia","Morten Nærland","Leif Arne Brekke","Vetle Aareskjold","Filip Håland","Elias Helgøy Fuglestad","Filip Ulriksen Rygg","Jan Isak Marin Johannessen","Jonathan Gudmestad Haugland","Ole Gabriel Kverneland","Benjamin Ravn Eriksen","John Thomas Marin Johannessen","Geir-Henry Dalemo-Espeland","Jonathan Lilleøre","Olav Valen-Knutsen","Tobias Risa Fylling","Joakim Aanestad Salte","Johannes Fjermestad","Kristoffer Friestad","Torben Krag"],
  "Vigrestad": ["Adrian Lode Torkildsen","Tarjei Lode","Jan Ove Osnes","Elias Mæland","Fredrik Årsland","Sander Hegelstad","Anders Mæland","Noah Hegelstad","Ronny Stokkeland Egelandsdal","Jøran Solberg Håland","Elias Bakhtyari","Oddbjørn Braut","Kjetil Espeland","Tore Aamodt","Lars Mathias Madland","Eivind Mæland","Ola Stålesen","Mustak Bakhtyari","Adrian Andersen","Sondre Risdal","Sander Aanestad","Ole Magnus Rugland"],
  "Ålgård": ["Marius Halvorsen","Steffen Olsson Bolme","Even Berg","Dennis Demirovic","Alexander Skavland","Markus Egelandsdal Sælevik","David Bregård","Mats Røisgaard","Teo Garcia Hjertvik-Bjelland","Sigurd Gjesdal","Benjamin Ravndal","Rógvi Baldvinsson","Kristian Novak","Steffen Aavitsland","Frank Aarthun","Amir Habibi","Sindre Karlsen","Arne Ravndal","Zabi Habibullah","Johannes Sletten Grüner","Henrik Kommedal"],
  "Lura": ["Andreas Vandug","Marius Jørgensen","Jørgen Bruvik Nieuwenhuizen","Jon Petter Berg","Vidar Lura Kristoffersen","Anders Øen","Kristian Øen","Inge Knutsen","Sebastian Hølland","Askild Underbakke","Abdulai Samura","Sander Lygren Sigmundstad","Adrian Malmin Ims","Daniel Ruci Furuhaug","Vetle Johansen Nilsen","Sivert Reilstad Bratten","Vegard Eide","Ørjan Eikehaug","Leif-André Nygård","Rahmat Kazemi","Thomas Kristoffersen","Chathveik Anandhan"],
  "Orre": ["Eivind Mossige","Dominic Pritchard","Thomas Nærland","Olav Mjåtveit","Thomas Erga","Magnus Braut","Fredrik Nevland","Jan Martin Hetland","Andrii Zubov","Jone Norheim","Fredrik Vigre","Rasmus Mæland Vigre","Joakim Jaarvik Aasheim","Olav Wiig","Ola Hella Andresen","Vetle Håland","Steffen Undal Hansen","Magnus Grødeland","Sven André Kyvik","Ordin Braut","Jøran Hadland","Svein Tore Havrevold"],
  "Randaberg": ["Mikal Helmikstøl Nedrebø","Magnus Bjørkelund Kaasen","Marcus Helmichsen Prestegård","Mathias Harestad","Sebastian Røe Berg","Marius Naustdal Storevik","Noah Totland","Sonny André Flatø Bugge","Paul Endre Ullenes","Jesper Mikkelsen","Henri Grude Thoresen","Markus Eik","Navin Murugesh","Ahmet Dereli","Mathias Nag Rydningen","Erik Brathetland","Tobias Miron Moldenæs","Lester Andualem Gundersen Mitchell","Håvard Vindenes","Jonas Kristiansen Skjæveland","Lued Nordhagen"],
  "Sandved": ["Bård Byrkjedal Berg","Anders Braut Egeli","Rune Aasland","Kåre Johan Henriksen","Cedrik Salvesen Larsen","Asbjørn Skjæveland","Marius Aasheim","Håvard Rosseland Vinnes","Ole Aasheim","Milad Rezai","Tobias Danielsen Skjæveland","Christoffer Thorsen","Thomas Sætre","Ola Braut","Samson Francis Clement","Denis Mehremic","Marcus Asbjørnsen","Morten Aasen","Livar Solberg","Elias Rettedal","Yngve Hagen","Martin Sandø Ophus"],
  "Rosseland": ["Sem Aleksander Bergene","Anders Espeland","Espen Klovning Hansen","Kenneth Monsen","Jan Rune Hoff","Peter Time","Jarle Madland","Andreas Aarrestad Time","Tord Johnsen Salte","Anders Thorsen","Geir Dahle Høyland","Truls Vagle","Leander Seland Egeland","Marius Sørheim","Ola Selliken","Sondre Svalestad Hovland","Svein Arne Monsen","Øyvind Kverneland Braaten","Robert Undheim","Albert Tjåland","Ola Mæland","Edvard Aarstad Rasmussen"],
  // ---- 4. divisjon Avd 5 (Vestland/Sogn) – TM/FotMob/fotball.no 2026 ----
  // (Tornado Måløy, Jotun og Bjørnar mangler pålitelig kilde – genererte navn)
  "Lyngbø": ["Edvard Larsen","Jakob Straten","Kim-André Damm Andresen","Sondre Riise Sævareid","Marcel Eltawafshy","Julian Waldemar Rasmussen Smørdal","Tommie Pettersen Langedal","Daniel Eltawafshy","Vegard Søren Holen Eimhjellen","Johannes Andreas Aslaksen","Isak Emil Røsbø Haukefær","Tom-Andre Klementsen Axland","Ørjan Lunde","Ivar Halland","Oskar Billing Karlsrud","Jørgen Davanger-Myren","Joakim Olsen Lunde","Kristian Davanger-Myren","Adrian Kosinski","Andreas Teigland Nilsen","Adrian Osa Sellevold","Ludvik Hope Skjeseth"],
  "Bremnes": ["Aron Guest-Aksnes","Lars Østensen","Jørgen Kallevåg","Magnus Steinsland Sortland","Markus Habbestad","Benjamin Gasland Isaksen","Odd Kristian Habbestad","Daniel Våge Nilsen","Rémi Steinsbø","Mika André Agasøster Rinne","Ole Eidet","Andreas Eidesvik","Jonah Brekke Munkvold","Magnus Eidevik","Kato Gjermund Aasheim","Semir Negash Gebe","Nichlas Jensen","Pål Hollund Esperø","Ola Tvenning Mæland","Fredrik Hestenes","Alexander Vold Stavland","Khaled Yahya Aadaywi"],
  "Fitjar": ["Ruben Træet","Ståle Gjøen Vestbøstad","Helge Myrmel Træet","Emil Sæterbø Fitjar","Mats Vik","Jone Nysæther","Lars Fitjar Waage","Daniel Skarpnes","Marius Sandvik Turøy","Birk Selsvold","Svein Herheim Junge","Reinert Børtveit Dahl","Sondre Fitjar","Jens Ragnar Våge Helland","Martin Føyen","Sander Hrafnsson Tverborgvik","Christian Andre Larsen","Emil Selsvold"],
  "Stryn": ["Jon-Terje Tjellaug","Jan Marius Klepp Brekke","Lars Midthjell Gjørven","Isak Heggdal Skogen","Ole-Ivan Glosvik Espeland","Sigurd Fotland Fænn","Lukas Roksvåg Leirgulen","John-Erlend Bø","Johannes Fredheim","Marius Konstali-Lødemel","Oliver Veka Brath","Lukas Olai Lødemel","Tomas Eikenes Tjellaug","Nftaleim Henok Asfaha","Markus Olsen","Theo Sande Tenden","Fredrik Njøten","Nikolas Ullebø Hool","Håvard Gjerde Sandal","Noah Heggestad Ommedal","Mats Eikenes Tjellaug","Vegard Guddal"],
  "Eid": ["Sondre Midthjell","Sander Torheim Frislid","Ove Andre Balsnes","Sindre Årskog","Johan Felde","Håvard Holmøyvik","Lukas Magnus Endal Andersson","Emilian Henden","Simen Lefdal","Henning Haugen","Tore Årskog","Daniel Haus","Jonas Beitveit","Noah Aleksander Taklo","Kristian Årskog","Kristian Lefdal","Joakim Frislid Vedvik","Henrik Vingen Vedeld","Oliver Holmøyvik"],
  "Kaupanger": ["Tor Kristian Dulsvik","Ruben Rundsveen Bøtun","Eirik Hellebust Menes","Leif Andrik Teigen","Jacob Nummedal Engebø","Sindre Åmot Alme","Rune Vatnamot Åberge","Mathias Vik Vatlestad","Magnus Langen Dale","Sindre Rørvik","Henrik Johannessen Selvåg","Kristoffer Dalaker","Kim Andre Dyrdal Stokke","Sebastian Haugen","Geir Ove Engebø","Håvard Grøteide","Nalawi Foto Solomon","Christopher Skjær Brugrand","Aleksander Belland Eriksen","Jens Mo","Jørgen Dalaker","Jo Nikolai Haukås"],
  "Årdal": ["Sigve Saur Midtun","Sivert Larsson","Kristian Lerum","Jesper Eldegard","Aleksander Hatlevoll Nundal","Morgan Ålsberg Tørnes","Kasper Bordvik","Oskar Grenager","Brede Stedje Ylvisåker","Kristoffer Eri Bjørkum","Øystein Riksheim Østvik","Johnny Hagen","Eirik Rode","Marius Loftheim","Espen Vigdal Rudi","Elias Mittet","Henrik Furebotn","Truls Hovland","Marius Wichne","Christian Stedje","Terje Kvam Øvstetun","Kevin Lægreid"],
  "Høyang": ["Eirik Råsberg","Robert Huseklepp Alrek","Luis Alejandro Nedrebø Maureira","Sverre Drage Skreien","Sander Stølen Olsen","Eirik Sjøthun Måren","Emil Hatlestad","Nahoum Neguse Eyob","Julian Pettersen Agovic","Mentasenote Alemu Girmissio","Magnus Kyrkjebø","Jonathan Østerbø Breidvik","Bernard Breidvik","Benjamin Ramsli Lyeng","Joakim Sjøthun Måren","Daniel Skilbrei Aven","Daniel Pettersen Agovic","Michael Hansen Våge","Brage Bjørkhaug","Robel Yemane Brhane","Heine Austrheim Johansen","Caspian Tonning Hansen"],
  "Florø": ["Herman Solheim Mortensen","Mikkel Fester Wurtz","Torkel Hammerseth Aarønes","Tobias Grotle Herstad","Christopher Dale Olsen","Simen Solheim","Christer Husa","Kim Vik","Martin Hollevik","Eirik Høydal","Dino Omerovic","Chrisander Eilertsen","Mats Sande Mallon","August Johan Ommedal","Simon Brekke Rebni","Mathias Hovland Bruheim","Kristoffer Ryland","Daniel Sagen Sundal"],
  // ---- 4. divisjon Avd 6 (Møre og Romsdal) – TM/fotball.no 2026 ----
  "Ørsta": ["Elias Vatne Nielsen","Andreas Skarmyr Egset","Tore Orten","Sigurd Aarflot Sundnes","Markus Halse","Eskild Dagfinrud","Henok Bisrat Tesfai","Matheo Remmen Bengtsson","Lasse Rebbestad","Øystein Grindland Bergersen","Nicolai Andrè Spilde","Reza Abouzari","Simen Tømmerbakk Flekke","Knut Erik Myklebust","Steffen Ervik Rekkbø","Steffen Øye Myklebust","Simen Rekkedal Nupen","Gaute Melle Trellevik"],
  "Skarbøvik": ["Henrik Moss","Svein Egil Løseth","Henrik Synnes","Preben Torvanger","Øyvind Pickart","Oddvar Aarsaether","Joakim Melingen","Sondre Kjølsøy","Kristian Klementsen","Kenneth Kjevik","Vegard Olsson","Daniel Gjerde"],
  "Bergsøy": ["Pedro Moreno","Sondre Nygård Olsen","Fredrik Muren","Pawel Jarzebak","Dani Rønnestad Hansen","Nils-Erik Engen","Daniel Sandvik","Simon Marcus Sieminski","Håvard Apelseth Hundsnes","Daniel Kvalsvik","Roald Andreas Runde","Kjetil Paulsen","Franjo Tepuric","Magnus Myklebust","Enrique Søvik","Frank Skorpen"],
  "Hareid": ["Ole-Monrad Alme","Baraka Kazige","Daniel Dybhavn Haddal","Gabriel Olav Peterson","Erlend Rokseth Skeide","Asbjørn Wiig Sævik","Jan André Corpuz Sunde","Ørjan Grimstad","Lars Roar Holstad","Håvard Mork Breivik","Andreas Fjørtoft","Jesper Sundnes Sundal","Øyvind Hagen","William Fjørtoft","Ulrik Husø Johansen","Jan André Corpuz Nedregård","Mats Djupvik","Odin Bjørlykke Bakke-Hareide","Tobias Pettersen Hatløy","Lavrans Gustavsen"],
  "Langevåg": ["Egil Gresdal","Johan Salen Nymark","Andreas Ashenafi Skotheimsvik","Lars Marcus Tynes Sunde","Karl Joakim Wrele","Vetle Fiskerstrand","Fredrik Digernes Nossen","Iver Standal","Vinjar Fiskerstrand","Julian Tios Soewandi","Kristian Robert Kirkpatrick","Marco Slyngstad Sandvik","Ask Veddegjerde","Håkon Vågnes Vadseth","Perry Waagan","Peder August Finholt Solevåg","Sigurd Vidhammer Tafjord","Jonas Aljon Vedde Ona","Lars Jensen Austnes","Donatas Skurdenis","Jonas Vidhammer Tafjord","Simon Vågnes"],
  "Rollon": ["Jonas Mathiesen","Eirik Marstrander Nedregaard","Anders Giske Hagen","Lage Hoel Haadem","Inge-André Godø","Vemund Hole Vik","Theo Gidney","Børge Gulbrandsen Drevik","Daniel Rusten","Nikolas Hjelset Hay","Theodor Rongved Østrem","Emil Solnørdal","Marius Myking Waagan","Anders Johann Dyb","Peter Alexander Stivang","Anders Waagan","Mohamed Babo Ali Maridi","Jakob Grindberg","Trond Stavset Fagervoll","Stian Sunde","Ulrik Paulsen Myklebust","Alexandros Anghel"],
  "Valder": ["Peter Thu Utheim","Felix Telvik","Andrei Florica","Nathanael Sæther Bordom","Erik Skjong Haglind","Oskar Telvik","Simen Skuseth","Markus Elias Molnes Tellnes","Shafi Mahdi Elmi","Steffen Bakke Elde","Herman Clausen Skjong","Liam Nordstrand Nilsen","Thomas Bjørlykhaug Skjong","Are Molnes","Ruben Haram Johnsen","Odin Ommundsen","Arthur Abdul-Bekovitsj Arsnukajev","Filip Sæther Bordom","Nikolai Grebstad Haglind","Tobias Nicolai Nordhus","Erlend Synnes Skjong","Anders Hole Oksnes"],
  "Surnadal": ["Ola Hoel Lervik","Jens-Sigurd Høiback","Torstein Snekvik","Brage Hauglann Talgø","Birk Bæverfjord","Marius Fjærvik","Håkon Bredesen","Petter Blekken Melkild","Henrik Aasbø Kvande","Sander Smevoll","Trond Blekken","Martin Lundemo Aakvik","Andreas Fjærvik","Erik Kvendset Andersen","Kjetil Rønning","Ingebrigt Løfaldli","Sindre Hyldbakk Kvande","Steinar Kvammen Sæter","Anders Trønsdal Røen","Noah Aune Bævre","Andreas Lundereng Skjefte","Scott Skjølsvold-Aasen"],
  "Sunndal": ["Neydson da Silva","Erik Iversen","Sakdarit Patkong","Christian Danielsen","Joakim Finnset Wirum","Espen Mellemseter","Eivind Lervik","Vegard Antonsen Ledal","Sander Resell Grimelid","Martin Sødahl Haugen","John Jørgen Gridseth Hafstad","Oliver Lie","Simen Svanberg Larsen","Grunde Hlydbakk Hanssen","Tor Erik Torske","Elias Romfo-Henriksen","Askil Melkild Røen","Erling Farstad Fredriksen"],
  "Clausenengen": ["Sander Røsand Rossing","Eirik Rakstang Rundberg","Erik Pettersen","Eirik Amarp Brekke","Jan Kristian Sørli","Ole Sørli","Jesper Pettersen Storbugt","Magnus Aspehaug Kjøl","Victor Ravnum Aspen","Anders Gussiås","Teodor Stene","Tobias Stafsnes-Tømmervåg"],
  "Dahle": ["Erik Ulseth","Bjørnar Jünge Husby","Johannes Wiig","Espen Belden Gjerde","Brian Hammeras","Marius Neergaard","Joakim Bjerkås","Henrik Rolland","Senay Isaac Habte","John Karlsen","Mats Brenden","Eirik Andersen","Tobias Dahle","Tobias Larsen Lysø","Mats Solli Lindskog","Mats Tolcsiner","Auden Ljøkjell Boksasp","Sindre Ohrstrand","Sander Bergland Henriksen","Andreas Hjelle Råket","Tom Einar Storvik","Jonas Tømmerdal Frøner"],
  "Tomrefjord": ["Eirik Myrstrand Taklo","Sander Dahle","Tom-André Tomren","Martin Kvernmo Langset","Petter Kornelius Eik","Liam Lundbø-Slemmen","Kristian Flittie Onstad","Mats Inge Skorgenes","Erlend Søberg","Vegard Storsæter Ellingseter","Leo Ringsby","Ole-Martin Lid","Thomas Andre Brastad","Casper Rolf Hellstrøm Andreassen","Aleksander Solbakken","Ken Robin Hildre","Fynn Luca Daniel","Håvard Myrstrand Taklo"]
};
/* Realistisk aldersfordeling: tyngde på 21-29, noen unge, noen veteraner.
   NB: alder er generert (ikke ekte fødselsdato) – kan avvike fra virkeligheten. */
function genAge(s){ const a=s%100; if(a<12) return 18+(s%3); if(a<86) return 21+((s>>>4)%9); return 30+((s>>>4)%5); }
const _sqCache={};
// klubbens sesongform (samme for hele klubben) -> -1/0/+1, varierer fra sesong til sesong
function clubFormDelta(team, season){ const f=hash(team+'@form'+season)%9-4; return f>=2?1:(f<=-2?-1:0); }
function buildSquad(team, base, names, elapsed){ // names==null => generér. elapsed = antall sesonger siden 2026
  // names kan være ["Navn", ...] ELLER [{name, pos, age}, ...] (ekte posisjon/alder brukes når oppgitt)
  elapsed = elapsed||0;
  const real = !!names; const n = real ? names.length : 18;
  const gk = 2, def = Math.round((n-gk)*0.38), mid = Math.round((n-gk)*0.38);
  const sq=[];
  for(let i=0;i<n;i++){
    const entry = real ? names[i] : null;
    const obj = entry && typeof entry === "object" ? entry : null;
    const defaultPos = i<gk ? "MV" : i<gk+def ? "FOR" : i<gk+def+mid ? "MID" : "ANG";
    const pos = (obj && obj.pos) ? obj.pos : defaultPos;         // ekte posisjon når oppgitt
    let name = real ? (obj ? obj.name : entry) : genName(team,i);
    const s = hash(team+'#'+(real?name:i));
    let r = clamp(base + (s%11-5) + (pos==="ANG"?1:0) + (i===gk?2:0), 20, 99);
    if(real && STAR_RATINGS[name]!=null) r=STAR_RATINGS[name];  // håndsatt stjernerating (f.eks. Tripić 94)
    else if(real) r=Math.min(r, base+3, 90);                    // vanlige spillere når aldri stjernenivå
    let age = (obj && obj.age) ? obj.age : genAge(s), gen=0, isReal=real; // ekte alder når oppgitt
    for(let yr=1; yr<=elapsed; yr++){ // utvikling sesong for sesong: eldre + bedre/dårligere
      age++;
      let d=[-1,0,0,1][hash(name+'~'+(2026+yr))%4] + (age<23?1:(age>30?-1:0)) + clubFormDelta(team,2026+yr);
      r=clamp(r+d,20,99);
      if(age >= 33+(hash(name)%11)){ // legger opp -> ung nykommer overtar plassen
        gen++; const gs=hash(team+'#slot'+i+'#g'+gen); name=randNameSeeded(gs); isReal=false;
        age=16+(gs%4); r=clamp(base+(gs%9-6)+(pos==="ANG"?1:0),20,90);
      }
    }
    sq.push({name, pos, rating:r, age, value:playerValue(r), real:isReal});
  }
  // små ekte tropper (kilder med få navn) fylles opp til 16 med genererte spillere
  let pad=0;
  while(real && sq.length<16){
    const s2=hash(team+'#pad'+pad);
    const pos = sq.filter(p=>p.pos==="MV").length<2 ? "MV" : ["FOR","MID","ANG"][pad%3];
    const r=clamp(base+(s2%9-5),20,90);
    sq.push({name:genName(team,100+pad), pos, rating:r, age:genAge(s2), value:playerValue(r), real:false});
    pad++;
  }
  return sq;
}
function squadFor(team, divIndex){
  const season = S ? S.season : 2026; // spillerne eldes/utvikles fra sesong til sesong
  const key=team+'|'+divIndex+'|'+season; let sq=_sqCache[key];
  if(!sq){ sq=buildSquad(team, strength(team,divIndex), REAL_SQUADS[team]||null, season-2026); _sqCache[key]=sq; }
  if(S && S.transfersOut && Object.keys(S.transfersOut).length) return sq.filter(p=>!S.transfersOut[team+'|'+p.name]);
  return sq;
}
let _ALLP=null, _ALLPseason=-1; // indeks over alle spillere i alle klubber (for søk)
function allPlayers(){
  const season = S ? S.season : 2026;
  if(_ALLP && _ALLPseason===season) return _ALLP; const out=[];
  DIVISIONS.forEach((d,di)=>d.groups.forEach(g=>g.teams.forEach(t=>{
    for(const p of squadFor(t,di)) out.push({name:p.name,pos:p.pos,rating:p.rating,value:p.value,age:p.age,team:t,divIndex:di});
  })));
  _ALLP=out; _ALLPseason=season; return out;
}
function searchPlayers(q){
  q=q.toLowerCase(); const out=[];
  // spillere du har mistet gratis (kontrakt utløpt) – nå i en annen klubb, kan hentes tilbake
  if(S.exPlayers) for(const x of S.exPlayers){ if(x.name.toLowerCase().includes(q)){ out.push({...x, ex:true}); if(out.length>=40) return out; } }
  for(const x of allPlayers()){
    if(x.team===S.userTeam) continue;
    if(S.transfersOut && S.transfersOut[x.team+'|'+x.name]) continue;
    if(x.name.toLowerCase().includes(q)){ out.push(x); if(out.length>=40) break; }
  }
  return out;
}
// hvilken divisjon spiller en klubb i (for visning + budsannsynlighet)
function divIndexOfTeam(team){ for(let di=0;di<DIVISIONS.length;di++) for(const g of DIVISIONS[di].groups) if(g.teams.includes(team)) return di; return DIVISIONS.length-1; }
// karrierehistorikk: hvor og hvor gammel spilleren startet (deterministisk ut fra navn)
const CAREER_POOL = ELITE.concat(OBOS);
function careerOf(name, currentTeam){
  const s=hash(name+'#car'); const startAge=15+(s%4);            // 15–18
  let started = ((s>>>3)%100<45) ? currentTeam : CAREER_POOL[(s>>>7)%CAREER_POOL.length];
  return { startAge, started, homegrown: started===currentTeam };
}
function bestXI(sq){
  const gk=sq.filter(p=>p.pos==="MV").sort((a,b)=>b.rating-a.rating);
  const out=sq.filter(p=>p.pos!=="MV").sort((a,b)=>b.rating-a.rating);
  return [...(gk[0]?[gk[0]]:[]), ...out.slice(0,10)];
}
function bestXIavg(sq){ const xi=bestXI(sq); return xi.length? Math.round(xi.reduce((s,p)=>s+p.rating,0)/xi.length) : 40; }
/* Styrketap for spiller på feil plass: 0 hvis posisjonen passer, ellers −10 (−20 hvis keeper er involvert) */
function slotPenalty(p, role){
  const allowed=ROLE_ALLOWED[role]||[];
  if(allowed.includes(p.pos)) return 0;
  if(role==="MV"||p.pos==="MV") return 20; // utespiller i mål / keeper på utebanen
  return 10;
}
/* Plasser en liste spillere inn i formasjonens 11 plasser (beste passform først) */
function placeInto(f, players){
  const roles=FORMATIONS[f], pool=players.slice(), out=new Array(roles.length).fill(null);
  roles.forEach((role,i)=>{ // 1) de som passer naturlig på plassen
    const c=pool.filter(p=>(ROLE_ALLOWED[role]||[]).includes(p.pos)).sort((a,b)=>b.rating-a.rating)[0];
    if(c){ out[i]=c.name; pool.splice(pool.indexOf(c),1); } });
  roles.forEach((role,i)=>{ if(out[i]) return; // 2) fyll resten (helst ikke keeper på utebanen)
    let c=pool.slice().sort((a,b)=>b.rating-a.rating);
    if(role!=="MV"){ const of=c.filter(p=>p.pos!=="MV"); if(of.length) c=of; }
    if(c.length){ out[i]=c[0].name; pool.splice(pool.indexOf(c[0]),1); } });
  return out;
}
function squadByName(name){ return S.squad.find(p=>p.name===name); }
/* Brukerens startellever: valgt lag (11 gyldige) ellers automatisk beste 11 */
function isAvailable(p){ return p && !(p.outDays>0); }   // skadet/utmattet kan ikke spille
function userXI(){
  const avail=S.squad.filter(isAvailable);
  if(S.lineup){ let xi=S.lineup.map(squadByName).filter(isAvailable);
    if(xi.length<11){ const fill=bestXI(avail).filter(p=>!xi.includes(p)); while(xi.length<11&&fill.length) xi.push(fill.shift()); }
    if(xi.length===11) return xi; }
  return bestXI(avail);
}
function ratingOf(team, divIndex){
  if(team===S.userTeam){ const xi=userXI();
    const roles=(S.formation&&FORMATIONS[S.formation]&&S.lineup)?FORMATIONS[S.formation]:null;
    // spillere på feil plass (f.eks. spiss som høyreback) trekker ned lagstyrken
    const sum=xi.reduce((s,p,i)=>s + p.rating - ((roles&&S.lineup[i]===p.name)?slotPenalty(p,roles[i]):0), 0);
    return Math.round(sum/xi.length); }
  return bestXIavg(squadFor(team,divIndex));
}

function weightedPick(list, wfn){
  let tot=0; const w=list.map(p=>{const x=Math.max(0.001,wfn(p)); tot+=x; return x;});
  let r=Math.random()*tot;
  for(let i=0;i<list.length;i++){ r-=w[i]; if(r<=0) return list[i]; }
  return list[list.length-1];
}
const SCORE_W={MV:0.03,FOR:0.6,MID:1.4,ANG:3.0};
const CARD_W ={MV:0.3,FOR:1.7,MID:1.5,ANG:1.0};
function pickScorer(sq){ return weightedPick(sq, p=>(SCORE_W[p.pos]||1)*(p.rating/50)); }
function pickAssist(sq, scorer){ const o=sq.filter(p=>p!==scorer); return weightedPick(o, p=>(SCORE_W[p.pos]||1)); }
function pickBooked(sq){ return weightedPick(sq, p=>(CARD_W[p.pos]||1)); }

/* =====================================================================
   KAMP-MATEMATIKK
   ===================================================================== */
function poisson(l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random();}while(p>L);return k-1;}
function xgPair(home,away,divH,divA){
  const ADV=4;
  let rH=ratingOf(home,divH)+ADV, rA=ratingOf(away,divA);
  let xgH=1.30+(rH-rA)*0.035, xgA=1.15+(rA-rH)*0.035;
  const adj={"Offensiv":[.35,.35],"Defensiv":[-.25,-.45],"Balansert":[0,0]}[S.tactic]||[0,0];
  if(home===S.userTeam){ xgH+=adj[0]; xgA+=adj[1]; }
  if(away===S.userTeam){ xgA+=adj[0]; xgH+=adj[1]; }
  return [clamp(xgH,0.18,5), clamp(xgA,0.18,5)];
}
function matchGoals(home,away,divH,divA){ const [a,b]=xgPair(home,away,divH,divA); return [poisson(a),poisson(b)]; }

/* ---------- Statistikk (toppscorer, assist, kort, redninger) ---------- */
function statKey(name,team){ return name+'|'+team; }
function recStat(name,team,field,n){ if(!S.stats)S.stats={}; const k=statKey(name,team);
  const e=S.stats[k]||(S.stats[k]={name,team,goals:0,assists:0,yellow:0,red:0,saves:0}); e[field]+=(n||1); }
function keeperOf(sq){ const gk=sq.filter(p=>p.pos==="MV").sort((a,b)=>b.rating-a.rating); return gk[0]||sq[0]; }
function squadOnPitch(team,divIndex){ return team===S.userTeam ? userXI() : bestXI(squadFor(team,divIndex)); }
function recordInstantMatch(home,away,hg,ag,divH,divA){ // statistikk for kamper som ikke spilles live
  const sqH=squadOnPitch(home,divH), sqA=squadOnPitch(away,divA);
  const goals=(n,team,sq)=>{ for(let i=0;i<n;i++){ const s=pickScorer(sq); recStat(s.name,team,"goals"); if(Math.random()<0.6) recStat(pickAssist(sq,s).name,team,"assists"); } };
  goals(hg,home,sqH); goals(ag,away,sqA);
  let cards=Math.min(7,poisson(2.4));
  for(let i=0;i<cards;i++){ const onHome=Math.random()<0.5; const team=onHome?home:away; const p=pickBooked(onHome?sqH:sqA); recStat(p.name,team, Math.random()<0.9?"yellow":"red"); }
  const gkH=keeperOf(sqH), gkA=keeperOf(sqA);
  if(gkH) recStat(gkH.name,home,"saves",poisson(1.6+ag));
  if(gkA) recStat(gkA.name,away,"saves",poisson(1.6+hg));
}
/* ---------- Sesongstatistikk for HVILKEN SOM HELST liga (simulert ved behov) ---------- */
let _lgStats={}, _lgStatsSeason=-1;
function simLeagueStats(divIndex, groupIndex){
  const grp=DIVISIONS[divIndex].groups[groupIndex]; const teams=grp.teams;
  const matches=2*Math.max(1,teams.length-1); // dobbel serie
  const base=BASE[Math.min(DIVISIONS[divIndex].level-1, BASE.length-1)];
  const stats={};
  const rec=(name,team,field,n)=>{ const k=name+'|'+team; const e=stats[k]||(stats[k]={name,team,goals:0,assists:0,yellow:0,red:0,saves:0}); e[field]+=(n||1); };
  for(const team of teams){
    const sq=squadFor(team, divIndex); if(!sq.length) continue;
    const tr=bestXIavg(sq);
    const perMatch=clamp(0.9+(tr-base)*0.03, 0.3, 3.2);
    const seasonGoals=Math.max(0, Math.round(perMatch*matches*0.55));
    for(let k=0;k<seasonGoals;k++){ const sc=pickScorer(sq); rec(sc.name,team,"goals"); if(Math.random()<0.62) rec(pickAssist(sq,sc).name,team,"assists"); }
    let cards=poisson(matches*0.5); for(let i=0;i<cards;i++){ const p=pickBooked(sq); rec(p.name,team, Math.random()<0.92?"yellow":"red"); }
    const gk=keeperOf(sq); if(gk) rec(gk.name,team,"saves", poisson(matches*1.3));
  }
  return Object.values(stats);
}
function getLeagueStats(divIndex, groupIndex){ // cache per sesong (ikke lagret – regnes på nytt per økt)
  const season = S ? S.season : 2026;
  if(_lgStatsSeason!==season){ _lgStats={}; _lgStatsSeason=season; }
  const key=divIndex+'|'+groupIndex;
  if(!_lgStats[key]) _lgStats[key]=simLeagueStats(divIndex, groupIndex);
  return _lgStats[key];
}

/* ---------- Terminliste (dobbel serie, sirkelmetoden) ---------- */
function makeFixtures(teams){
  let ts=teams.slice(); if(ts.length%2) ts.push("(fri)");
  const n=ts.length, half=n/2, first=[]; let arr=ts.slice();
  for(let r=0;r<n-1;r++){
    const round=[];
    for(let i=0;i<half;i++){ const h=arr[i], a=arr[n-1-i];
      if(h!=="(fri)"&&a!=="(fri)") round.push(r%2===0?[h,a]:[a,h]); }
    first.push(round); arr=[arr[0], arr[n-1], ...arr.slice(1,n-1)];
  }
  return [...first, ...first.map(rd=>rd.map(([h,a])=>[a,h]))];
}
/* ---------- Tabell ---------- */
function computeTable(teams, results){
  const row={}; teams.forEach(t=>row[t]={team:t,k:0,v:0,u:0,t:0,gf:0,ga:0,p:0});
  for(const r of results){ const H=row[r.home], A=row[r.away]; if(!H||!A) continue;
    H.k++;A.k++; H.gf+=r.hg;H.ga+=r.ag; A.gf+=r.ag;A.ga+=r.hg;
    if(r.hg>r.ag){H.v++;A.t++;H.p+=3;} else if(r.hg<r.ag){A.v++;H.t++;A.p+=3;} else {H.u++;A.u++;H.p++;A.p++;} }
  return Object.values(row).sort((a,b)=> b.p-a.p || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf || a.team.localeCompare(b.team,"no"));
}

/* =====================================================================
   ØKONOMI OG NM
   ===================================================================== */
const BUDGET=[40e6,12e6,3e6,800e3,250e3,80e3,30e3,10e3];
function genMarket(divIndex){
  const base=BASE[DIVISIONS[divIndex].level-1]; const arr=[];
  for(let i=0;i<28;i++){
    const r=clamp(Math.round(base + (Math.random()*22-9)), 22, 95);
    const pos=POSORDER[(Math.random()*4)|0];
    arr.push({name:randName(), pos, rating:r, age:18+((Math.random()*16)|0), value:playerValue(r)});
  }
  return arr.sort((a,b)=>b.rating-a.rating);
}
function randClub(){ let t=S.userTeam, g=0; while(t===S.userTeam && g++<10){ const d=DIVISIONS[(Math.random()*DIVISIONS.length)|0]; const gr=d.groups[(Math.random()*d.groups.length)|0]; t=gr.teams[(Math.random()*gr.teams.length)|0]; } return t; }
const ROUND_NAMES=["1. runde","2. runde","3. runde","4. runde","Kvartfinale","Semifinale","Finale"];
function drawCupOpponent(roundIdx){
  const maxIdx=Math.max(0,6-roundIdx);
  const di=(Math.random()*(maxIdx+1))|0;
  const d=DIVISIONS[di], g=d.groups[(Math.random()*d.groups.length)|0];
  let name=g.teams[(Math.random()*g.teams.length)|0], tries=0;
  while(name===S.userTeam && tries++<12) name=g.teams[(Math.random()*g.teams.length)|0];
  return {name, divIndex:di};
}
function freshCup(){ return {alive:true, done:false, won:false, roundIdx:0, opponent:drawCupOpponent(0), log:[]}; }

/* =====================================================================
   KALENDER  – sesongen starter 1. januar, kamper spilles fra mars/april
   ===================================================================== */
const MONTHS=["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember"];
const MLEN=[31,28,31,30,31,30,31,31,30,31,30,31];
function ymd(day){ let m=0,d=day; while(d>MLEN[m] && m<11){ d-=MLEN[m]; m++; } return {m:m+1,d}; }
function dateLabel(day){ const {m,d}=ymd(day); return `${d}. ${MONTHS[m-1]}`; }
function monthOfDay(day){ return ymd(day).m; }
// Eliteserien starter ~15. mars (dag 74), 1. div ~5. april (95), resten ~12. april (102)
function seasonStartDay(divIndex){ return divIndex===0?74 : divIndex===1?95 : 102; }
function roundDay(i){ return seasonStartDay(S.divIndex) + i*7; } // én runde per uke
/* Innstillinger: karrieren (S.settings) har forrang, deretter global lagring
   (gjelder ALLE karrierer, også nye), til slutt standardverdien. */
const GSET_KEY="tippeliga_settings";
function gsetGlobal(){ try{ return JSON.parse(localStorage.getItem(GSET_KEY)||"{}"); }catch(e){ return {}; } }
function gset(k,def){
  const s=(S&&S.settings)||{}; if(s[k]!=null) return s[k];
  const g=gsetGlobal(); if(g[k]!=null) return g[k];
  return def;
}
function windowOpen(day){ if(gset("alwaysWindow",false)) return true; const m=monthOfDay(day); return m===1||m===6||m===7||m===8; }
// NM-runder spilles på faste datoer utover sesongen (3. runde ~5. juni)
function cupRoundDay(i){ return 128 + i*14; }

/* =====================================================================
   SPILLTILSTAND
   ===================================================================== */
const SAVE_REG="tippeliga_saves_v9"; // register over lagrede spill
function saveKey(id){ return "tippeliga_sv9_"+id; }
let S=null, LIVE=null, LINEUP=null, LFORM="4-4-2", FLASH="", TSEARCH="", TF={pos:"",maxAge:"",maxPrice:"",club:""};
let CAS={game:"plinko", bet:10000, busy:false, res:null, minesN:5}; // casino-tilstand (ikke lagret)

function newCareer(manager, divIndex, groupIndex, team){
  S={ manager, season:2026, divIndex, groupIndex, userTeam:team, tactic:"Balansert",
      teams:[], fixtures:[], results:[], round:0, last:null, screen:"season",
      squad: squadFor(team,divIndex).map(p=>({...p})),
      budget: BUDGET[divIndex], market: genMarket(divIndex), cup: null };
  S.cup = freshCup(); // krever at S finnes (drawCupOpponent leser S.userTeam)
  S.formation = "4-4-2";
  S.lineup = placeInto(S.formation, S.squad.filter(isAvailable)); // posisjonsriktig startellever (endres i Lagledelse)
  S.day = 1; // 1. januar
  S.seasonsManaged = 0; // antall fullførte sesonger som trener
  S.autoSub = true; // automatiske bytter i kamp
  S.listed = []; // spillere lagt ut for salg (med bud fra andre lag)
  S.notes = []; // varslinger (bud, hendelser)
  S.transfersOut = {}; // spillere du har kjøpt vekk fra andre klubber
  S.exPlayers = []; // spillere du mistet gratis (kontrakt utløp) – nå i en annen klubb
  S.scout = null; // aktiv speider
  S.youth = genYouth(); // ungdomsakademi (G6–G20, U21)
  S.academy = []; // uplasserte talenter fra speideren
  S._id = nextSaveId(); // egen lagringsplass
  ensureSquadContracts();
  simYouthLeagues(); // ungdomsligaer + toppscorere klare fra start
  setupSeason();
  save();
}
// din egen klubb: dine spillernavn først (keeper→angrep), resten genereres til ~18
function buildCustomSquad(clubName, divIndex, names){
  const base=BASE[Math.min(DIVISIONS[divIndex].level-1, BASE.length-1)];
  const clean=(names||[]).map(s=>s.trim()).filter(Boolean);
  const all=clean.slice(0,24); let k=0;
  while(all.length<18){ all.push(genName(clubName, 100+k)); k++; }
  const n=all.length, gk=2, def=Math.round((n-gk)*0.38), mid=Math.round((n-gk)*0.38);
  return all.map((nm,i)=>{
    const pos = i<gk?"MV" : i<gk+def?"FOR" : i<gk+def+mid?"MID" : "ANG";
    const s=hash(clubName+'#'+nm+i);
    const r=clamp(base+(s%11-5)+(pos==="ANG"?1:0),20,99);
    return {name:nm, pos, rating:r, age:genAge(s), value:playerValue(r), real:false, custom:i<clean.length};
  });
}
function newCustomCareer(manager, divIndex, groupIndex, clubName, names){
  S={ manager, season:2026, divIndex, groupIndex, userTeam:clubName, tactic:"Balansert",
      teams:[], fixtures:[], results:[], round:0, last:null, screen:"season",
      squad: buildCustomSquad(clubName, divIndex, names),
      budget: BUDGET[divIndex], market: genMarket(divIndex), cup: null };
  S.cup = freshCup();
  S.formation = "4-4-2";
  S.lineup = placeInto(S.formation, S.squad.filter(isAvailable));
  S.day = 1; S.seasonsManaged = 0; S.autoSub = true;
  S.listed = []; S.transfersOut = {}; S.exPlayers = []; S.scout = null;
  S.youth = genYouth(); S.academy = []; S._id = nextSaveId(); S.custom = true;
  ensureSquadContracts(); simYouthLeagues(); setupSeason(); save();
}
/* ---------- Liga-struktur som lever: opp-/nedrykk for ALLE lag hver sesong ---------- */
function ensureDivTeams(){ if(!S.divTeams) S.divTeams = DIVISIONS.map(d=>d.groups.map(g=>g.teams.slice())); }
function curTeams(di,gi){ return (S&&S.divTeams&&S.divTeams[di]&&S.divTeams[di][gi]) ? S.divTeams[di][gi] : DIVISIONS[di].groups[gi].teams; }
function findTeamLocation(team){ if(!S.divTeams) return null; for(let di=0;di<S.divTeams.length;di++) for(let gi=0;gi<S.divTeams[di].length;gi++) if(S.divTeams[di][gi].includes(team)) return {di,gi}; return null; }
// flytt lag mellom nabodivisjoner: svakeste opp-lag byttes 1-for-1 med sterkeste ned-lag
function processLeagueMovements(userMove){
  ensureDivTeams(); let userPlaced=(userMove==='stay');
  const formOf=(team,di)=>{
    if(team===S.userTeam && !userPlaced){ if(userMove==='up') return 1e6; if(userMove==='down') return -1e6; return BASE[Math.min(DIVISIONS[di].level-1,BASE.length-1)]; }
    return strength(team,di)+(Math.random()*16-8);
  };
  for(let up=0; up<DIVISIONS.length-1; up++){
    const down=up+1;
    const K=Math.min(DIVISIONS[up].relegate*S.divTeams[up].length, DIVISIONS[down].promote*S.divTeams[down].length);
    if(K<=0) continue;
    const flat=di=>{ const a=[]; S.divTeams[di].forEach((g,gi)=>g.forEach((t,idx)=>a.push({team:t,gi,idx,f:formOf(t,di)}))); return a; };
    const upArr=flat(up).sort((a,b)=>a.f-b.f), downArr=flat(down).sort((a,b)=>b.f-a.f); // svakest opp / sterkest ned
    const kk=Math.min(K,upArr.length,downArr.length);
    for(let k=0;k<kk;k++){ const u=upArr[k], d=downArr[k];
      if(u.team===S.userTeam||d.team===S.userTeam) userPlaced=true;
      S.divTeams[up][u.gi][u.idx]=d.team; S.divTeams[down][d.gi][d.idx]=u.team; }
  }
}
function setupSeason(){
  ensureDivTeams();
  const teams=S.divTeams[S.divIndex][S.groupIndex];
  if(!teams.includes(S.userTeam)) teams[teams.length-1]=S.userTeam; // egen klubb / sikkerhet
  S.teams=teams.slice(); S.fixtures=makeFixtures(S.teams); S.results=[]; S.round=0; S.last=null; S.stats={};
}
function listSaves(){ try{ return JSON.parse(localStorage.getItem(SAVE_REG)||"[]"); }catch(e){ return []; } }
function writeReg(reg){ try{ localStorage.setItem(SAVE_REG, JSON.stringify(reg)); }catch(e){} }
function nextSaveId(){ return listSaves().reduce((m,r)=>Math.max(m, r.id||0), 0) + 1; }
function save(){ if(!S||!S._id) return; try{
    localStorage.setItem(saveKey(S._id), JSON.stringify(S));
    const reg=listSaves();
    const meta={ id:S._id, manager:S.manager, team:S.userTeam, season:S.season, div:DIVISIONS[S.divIndex].name, sm:S.seasonsManaged, cheated:!!S.cheated };
    const i=reg.findIndex(r=>r.id===S._id); if(i>=0) reg[i]=meta; else reg.push(meta);
    writeReg(reg);
  }catch(e){} }
function loadSave(id){ try{ const d=localStorage.getItem(saveKey(id)); if(!d) return; S=JSON.parse(d); if(S.screen==="live") S.screen="season"; render(); }catch(e){} }
function deleteSave(id){ try{ localStorage.removeItem(saveKey(id)); writeReg(listSaves().filter(r=>r.id!==id)); }catch(e){} render(); }

/* ---------- Liga: start runde (brukerkamp live, resten instant) ---------- */
function playRound(){
  if(S.round>=S.fixtures.length) return;
  const round=S.fixtures[S.round];
  const up=round.find(([h,a])=>h===S.userTeam||a===S.userTeam);
  const others=round.filter(p=>p!==up).map(([h,a])=>{ const [hg,ag]=matchGoals(h,a,S.divIndex,S.divIndex); recordInstantMatch(h,a,hg,ag,S.divIndex,S.divIndex); return {round:S.round,home:h,away:a,hg,ag}; });
  beginLive(up[0],up[1],S.divIndex,S.divIndex,{type:"league",others});
}
function simRest(){
  while(S.round<S.fixtures.length){
    for(const [h,a] of S.fixtures[S.round]){ const [hg,ag]=matchGoals(h,a,S.divIndex,S.divIndex); recordInstantMatch(h,a,hg,ag,S.divIndex,S.divIndex); S.results.push({round:S.round,home:h,away:a,hg,ag}); }
    S.round++;
  }
  S.last=null; S.screen="seasonend"; save(); render();
}
function nextDay(){ S.day++; if(S.day>365) S.day=365; recoverPlayers(1); tickListings(1); checkScout(false); save(); render(); }
function skipToMatch(){
  let t=Infinity, old=S.day;
  if(S.round<S.fixtures.length) t=Math.min(t, roundDay(S.round));
  if(S.cup.alive && !S.cup.done) t=Math.min(t, cupRoundDay(S.cup.roundIdx));
  if(S.scout && S.scout.active) t=Math.min(t, S.scout.returnDay); // stopp når speideren er tilbake
  if(t<Infinity && t<=365){ S.day=t; recoverPlayers(t-old); tickListings(t-old); checkScout(false); save(); render(); }
  else if(S.round<S.fixtures.length){ S.day=roundDay(S.round); const dd=Math.max(0,S.day-old); recoverPlayers(dd); tickListings(dd); save(); render(); }
}

/* ---------- Aldring + pensjon ---------- */
function retireAgeOf(p){ return 33 + (hash(p.name)%11); } // legger opp et sted mellom 33 og 43
function ageSquad(){
  const retired=[];
  S.squad = S.squad.filter(p=>{ p.age=(p.age||20)+1; if(p.age>=retireAgeOf(p)){ retired.push(p.name); return false; } return true; });
  const base=strength(S.userTeam, S.divIndex);          // akademiet henter inn ungdom hvert år
  const intake=Math.max(1, 20-S.squad.length); let added=0;
  for(let k=0;k<intake && S.squad.length<28;k++){
    const s=hash(S.userTeam+'#ng'+S.season+'#'+S.squad.length+'#'+k);
    const pos=POSORDER[(S.squad.length+k)%4], r=clamp(base+(s%9-6),20,99);
    S.squad.push({name:randName(), pos, rating:r, age:16+(s%3), value:playerValue(r), real:false, newgen:true}); added++;
  }
  if(S.lineup) S.lineup=S.lineup.filter(n=>S.squad.some(p=>p.name===n));
  if(retired.length) addMsg(`👴 ${retired.length} la opp: ${retired.slice(0,3).join(", ")}${retired.length>3?" m.fl.":""}`);
  if(added) addMsg(`🎓 ${added} nye spillere i troppen`);
}
function progressRatings(){ // etter sesongen: opp/ned/likt, bonus for de som presterte
  for(const p of S.squad){
    let d=[-1,0,0,1][(Math.random()*4)|0];
    if(p.age<23) d+=1; else if(p.age>30) d-=1;
    const st=S.stats && S.stats[statKey(p.name,S.userTeam)];
    if(st){ const c=st.goals+st.assists+Math.floor(st.saves/8); if(c>=10)d+=2; else if(c>=5)d+=1; }
    p.rating=clamp(p.rating+d,20,99); p.value=playerValue(p.rating);
  }
}
function beginSeasonAtCurrentClub(){
  MSGS=""; progressRatings(); decrementContracts(); ageSquad(); ageExPlayers(); ageUpYouth(); youthIntake(); simYouthLeagues(); checkScout(true);
  recoverPlayers(60); // lang vinterpause: full form og de fleste skader gror
  S.market=genMarket(S.divIndex); S.cup=freshCup(); S.day=1; setupSeason();
  if(MSGS) FLASH=MSGS;
}

/* ---------- Sesongslutt -> opp/nedrykk, sparken, trenerpensjon ---------- */
function nextSeason(){
  ensureDivTeams();
  const table=computeTable(S.teams,S.results);
  const pos=table.findIndex(r=>r.team===S.userTeam)+1, n=table.length, div=DIVISIONS[S.divIndex], oldDiv=S.divIndex;
  const wantUp = S.divIndex>0 && pos<=div.promote;
  const wantDown = S.divIndex<DIVISIONS.length-1 && pos>n-div.relegate;
  const userMove = wantUp?'up':(wantDown?'down':'stay');
  S.budget += Math.round(BUDGET[S.divIndex]*0.4) + Math.round(BUDGET[S.divIndex]*((n-pos)/n)*0.3);
  processLeagueMovements(userMove);                 // flytt alle lag (inkl. brukeren) mellom divisjonene
  const loc=findTeamLocation(S.userTeam); if(loc){ S.divIndex=loc.di; S.groupIndex=loc.gi; } // brukeren følger laget sitt
  const promoted = S.divIndex<oldDiv, relegated = S.divIndex>oldDiv;
  const sacked = relegated && Math.random()<0.5 && gset("sacking",true); // dårlig sesong -> kan få sparken (hvis på)
  S.budget = Math.max(S.budget, Math.round(BUDGET[S.divIndex]*0.5));
  S.season++; S.seasonsManaged++;
  S._lastFinish={pos, n, club:S.userTeam, promoted, relegated};
  if(S.seasonsManaged>=25){ S.screen="managerRetire"; save(); render(); return; } // lagt opp som trener
  if(sacked){ S.screen="sacked"; save(); render(); return; }                       // fikk sparken
  beginSeasonAtCurrentClub(); S.screen="season"; save(); render();
}
function succeedManager(name){ S.manager=name||randName(); S.seasonsManaged=0; beginSeasonAtCurrentClub(); S.screen="season"; save(); render(); }
function takeNewClub(divIndex, groupIndex, team){
  // Spillere som ikke finnes i den regenererte troppen (egenlagde, akademi-opprykk, signerte)
  // blir IGJEN i den gamle klubben – så du kan søke dem opp og hente dem tilbake senere.
  if(S.userTeam && S.squad && S.squad.length){
    const oldTeam=S.userTeam, oldDiv=S.divIndex;
    const regen=new Set(squadFor(oldTeam,oldDiv).map(p=>p.name));
    if(!S.exPlayers) S.exPlayers=[];
    const stayed=[];
    for(const p of S.squad){
      if(regen.has(p.name)) continue;
      let returned=false; // signert fra en annen klubb? -> han går tilbake dit
      if(S.transfersOut) for(const k of Object.keys(S.transfersOut))
        if(k.endsWith("|"+p.name)){ delete S.transfersOut[k]; returned=true; stayed.push(p.name); break; }
      if(!returned && !S.exPlayers.some(x=>x.name===p.name)){
        S.exPlayers.push({name:p.name,pos:p.pos,rating:p.rating,age:p.age,value:p.value||playerValue(p.rating),real:!!p.real,team:oldTeam,divIndex:oldDiv});
        stayed.push(p.name);
      }
    }
    if(stayed.length) pushNote(`👋 ${stayed.length} av spillerne dine ble igjen i ${oldTeam}: ${stayed.slice(0,3).join(", ")}${stayed.length>3?" m.fl.":""} – søk dem opp i Overgangsmarked for å hente dem tilbake.`);
  }
  _ALLP=null; // søkeindeksen må bygges på nytt (spillere kan ha flyttet tilbake)
  S.divIndex=divIndex; S.groupIndex=groupIndex; S.userTeam=team;
  S.squad=squadFor(team,divIndex).map(p=>({...p}));
  S.budget=BUDGET[divIndex]; S.formation="4-4-2"; S.lineup=placeInto(S.formation, S.squad.filter(isAvailable));
  S.market=genMarket(divIndex); S.cup=freshCup(); S.day=1;
  S.scout=null; S.youth=genYouth(); S.academy=[]; ensureSquadContracts(); simYouthLeagues();
  setupSeason(); S.screen="season"; save(); render();
}

/* =====================================================================
   KONTRAKTER / LØNN, SPEIDER OG UNGDOMSAKADEMI
   ===================================================================== */
let MSGS=""; function addMsg(m){ MSGS = MSGS ? MSGS+" · "+m : m; }
/* --- kontrakter & lønn --- */
function wageOf(rating, divIndex){ const f=[12,6,3,1.4,0.7,0.35,0.2,0.12][Math.min(divIndex,7)]; return Math.max(300, Math.round(rating*rating*f)); }
function ensureContract(p){ if(p.contract==null) p.contract=1+(hash(p.name+"c")%4); if(p.wage==null) p.wage=wageOf(p.rating, S.divIndex); if(p.fit==null) p.fit=100; if(p.outDays==null) p.outDays=0; }
// form/skade-recovery når dager går: spillere bygger seg opp og skader gror
function recoverPlayers(days){ if(!S||!S.squad||days<=0) return; for(const p of S.squad){ p.fit=Math.min(100,(p.fit==null?100:p.fit)+days*5); if(p.outDays>0){ p.outDays=Math.max(0,p.outDays-days); if(p.outDays===0) p.outReason=null; } } }
// varslinger (bud på utlagte spillere o.l.)
function pushNote(t){ if(!S) return; S.notes=S.notes||[]; S.notes.push({t, day:S.day}); if(S.notes.length>30) S.notes=S.notes.slice(-30); }
function clearNotes(){ if(S){ S.notes=[]; save(); render(); } }
function dismissNote(i){ if(S&&S.notes){ S.notes.splice(i,1); save(); render(); } }
// bud på utlagte spillere kommer ikke med en gang – de drypper inn over dager, av og til aldri
function tickListings(days){
  if(!S||!S.listed||!S.listed.length||days<=0) return;
  for(const l of S.listed){
    l.offers=l.offers||[]; l.days=(l.days||0)+days;
    const p=S.squad&&S.squad.find(x=>x.name===l.name); if(!p) continue;
    const attract=clamp((p.rating-40)/55, 0.04, 0.9);     // bedre spiller = mer interesse
    const ageF=p.age>32?0.4:(p.age>29?0.7:1);             // gamle spillere er mindre attraktive
    for(let d=0; d<days; d++){
      if(l.offers.length>=3) break;                        // maks 3 liggende bud om gangen
      if(Math.random() < 0.15*attract*ageF){               // daglig sjanse for et nytt bud
        const base=p.value||playerValue(p.rating);
        const amount=Math.round(base*(0.55+Math.random()*0.5));
        const club=randClub();
        l.offers.push({club, amount, day:S.day});
        pushNote(`💸 ${club} har lagt inn bud på ${p.name}: ${kr(amount)} – godta eller avslå i Overgangsmarked.`);
      }
    }
  }
}
function ensureSquadContracts(){ if(S&&S.squad) S.squad.forEach(ensureContract); }
function renewalCost(p){ return Math.round(p.wage*30 + p.rating*p.rating*(p.age<24?6:3)); }
function decrementContracts(){
  if(!gset("contracts",true)) return; // kontrakter slått av i innstillingene
  const expired=[]; if(!S.exPlayers) S.exPlayers=[];
  S.squad.forEach(p=>{ ensureContract(p); p.contract--; });
  S.squad=S.squad.filter(p=>{ if(p.contract<0){
    // glemte du å fornye? spilleren går GRATIS til en annen klubb – du kan søke ham opp og hente ham tilbake
    const dest=randClub(), di=divIndexOfTeam(dest);
    S.exPlayers.push({name:p.name,pos:p.pos,rating:p.rating,age:p.age,value:p.value,real:!!p.real, team:dest, divIndex:di});
    expired.push(p.name); return false; } return true; });
  if(S.lineup) S.lineup=S.lineup.filter(n=>S.squad.some(p=>p.name===n));
  if(expired.length) addMsg(`📄 ${expired.length} gikk gratis til en annen klubb (kontrakt utløp): ${expired.slice(0,3).join(", ")}${expired.length>3?" m.fl.":""} – søk dem opp på overgangsmarkedet for å hente dem tilbake.`);
}
// spillerne du mistet eldes også, og legger til slutt opp
function ageExPlayers(){ if(!S.exPlayers) return; S.exPlayers.forEach(x=>{ x.age=(x.age||22)+1; x.value=playerValue(x.rating); }); S.exPlayers=S.exPlayers.filter(x=>x.age<retireAgeOf(x)); }
/* --- speider --- */
function scoutCost(months){ return Math.round(BUDGET[S.divIndex]*0.01*(months/3)); }
function sendScout(months){
  if(S.scout && S.scout.active){ FLASH="🔭 Speideren er allerede ute."; render(); return; }
  const cost=scoutCost(months); if(S.budget<cost){ FLASH="⚠ Du har ikke råd til speideren."; render(); return; }
  S.budget-=cost; S.scout={active:true, returnDay:S.day+months*30, months};
  FLASH=`🔭 Speideren er sendt ut i ${months} måneder (kostet ${kr(cost)}). Kommer tilbake ~${dateLabel(Math.min(365,S.day+months*30))}.`;
  save(); render();
}
function checkScout(seasonRoll){
  if(!S.scout || !S.scout.active) return;
  if(!seasonRoll && S.day < S.scout.returnDay) return;
  if(!S.academy) S.academy=[];
  const n=2+(hash("sc"+S.season+S.day)%4); const found=[];
  for(let i=0;i<n;i++){
    const age=10+((Math.random()*8)|0); // 10-17
    const p={name:randName(), age, rating:clamp(18+(age-10)*3+((Math.random()*8)|0),15,62)};
    S.academy.push(p); found.push(`${p.name} (${age}å)`);
  }
  S.scout=null; FLASH=`🔭 Speideren er tilbake med ${found.length} talenter til akademiet (sett dem på et ungdomslag under Ungdom): ${found.slice(0,3).join(", ")}${found.length>3?" m.fl.":""}.`;
}
/* --- ungdomsakademi --- */
const YGROUPS=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
function groupMaxAge(label){ if(label.indexOf("U21")===0) return 21; const m=label.match(/G(\d+)/); return m?+m[1]:99; }
// ungdomsstyrke avhenger av hvor god klubben er (Viking >> 6.-divisjonslag)
function clubYouthBase(){ return BASE[Math.min(DIVISIONS[S.divIndex].level-1, BASE.length-1)]; }
function youthRatingFor(age, base, jitter){ return clamp(Math.round(14 + (age-6)*2.2 + (base-50)*0.5 + (jitter||0)), 10, 78); }
function youthPosForIndex(i){ return i<2?"MV" : i<6?"FOR" : i<9?"MID" : "ANG"; }
function genYouthPlayer(seed, age, base, pos){ const s=hash(seed); return {name:randName(), age, pos:pos||POSORDER[s%4], rating:youthRatingFor(age, base!=null?base:clubYouthBase(), s%7-3), goals:0,assists:0,yellow:0,red:0,saves:0}; }
function genYouth(){ const base=clubYouthBase(); const y={};
  for(const n of YGROUPS){ const t=[]; for(let i=0;i<12;i++) t.push(genYouthPlayer("G"+n+i+S.userTeam, n, base, youthPosForIndex(i))); y["G"+n]=t; }
  const u=[]; for(let i=0;i<14;i++) u.push(genYouthPlayer("U21"+i+S.userTeam, 18+(i%4), base, youthPosForIndex(i))); y["U21"]=u; return y; }
function migrateYouth(){ if(!S.youth) return; for(const l in S.youth) for(const p of (S.youth[l]||[])){ if(!p.pos) p.pos=POSORDER[hash(p.name)%4]; ["goals","assists","yellow","red","saves"].forEach(k=>{ if(p[k]==null)p[k]=0; }); } }
function youthRating(label){ const t=(S.youth&&S.youth[label])||[]; return t.length?Math.round(t.reduce((s,p)=>s+p.rating,0)/t.length):25; }
function youthTopScorer(label){ const t=(S.youth&&S.youth[label])||[]; let best=null; for(const p of t){ if((p.goals||0)>0 && (!best||p.goals>best.goals)) best=p; } return best; }
/* --- ungdomsligaer med tabeller (G13–U21), auto-simulert hver sesong --- */
function isTableGroup(label){ return /^(G(1[3-9]|20)|U21)$/.test(label); }
function localClubsForLeague(label, n){
  const grp=DIVISIONS[S.divIndex].groups[S.groupIndex].teams.filter(t=>t!==S.userTeam);
  const pool=grp.concat(REAL_POOL); const out=[]; let k=hash(label+S.season)>>>0;
  while(out.length<n && out.length<pool.length){ const c=pool[k%pool.length]; k++; if(!out.includes(c)) out.push(c); }
  return out;
}
function keeperOfYouth(t){ const gk=t.filter(p=>p.pos==="MV").sort((a,b)=>b.rating-a.rating); return gk[0]||t[0]; }
function distYouthStats(label, scored, conceded){
  const t=S.youth[label]||[]; if(!t.length) return;
  for(let k=0;k<scored;k++){ const sc=weightedPick(t,p=>(SCORE_W[p.pos]||1)*Math.max(1,p.rating)); sc.goals=(sc.goals||0)+1;
    if(Math.random()<0.6){ const others=t.filter(p=>p!==sc); if(others.length){ const as=weightedPick(others,p=>(SCORE_W[p.pos]||1)); as.assists=(as.assists||0)+1; } } }
  let cards=poisson(0.7); for(let i=0;i<cards;i++){ const p=weightedPick(t,p=>(CARD_W[p.pos]||1)); if(Math.random()<0.9) p.yellow=(p.yellow||0)+1; else p.red=(p.red||0)+1; }
  const gk=keeperOfYouth(t); if(gk) gk.saves=(gk.saves||0)+poisson(1.4+(conceded||0));
}
function simYouthLeagues(){
  if(!S.youth) return; migrateYouth(); S.youthTables={};
  for(const lab in S.youth) for(const p of S.youth[lab]){ p.goals=0;p.assists=0;p.yellow=0;p.red=0;p.saves=0; } // ny sesong
  for(const label of Object.keys(S.youth)){
    const t=S.youth[label]; if(!t||t.length<5) continue;
    const uR=youthRating(label);
    if(isTableGroup(label)){
      const teams=[{name:`${S.userTeam} ${label}`, r:uR, user:true, p:0,gf:0,ga:0,w:0,d:0,l:0}];
      for(const c of localClubsForLeague(label,5)) teams.push({name:`${c} ${label}`, r:clamp(uR+(hash(c+label+S.season)%15-7),12,82), p:0,gf:0,ga:0,w:0,d:0,l:0});
      for(let i=0;i<teams.length;i++) for(let j=0;j<teams.length;j++){ if(i===j) continue; const A=teams[i],B=teams[j];
        const hg=poisson(clamp(1.3+(A.r+3-B.r)*0.04,0.2,5)), ag=poisson(clamp(1.1+(B.r-A.r-3)*0.04,0.2,5));
        A.gf+=hg;A.ga+=ag;B.gf+=ag;B.ga+=hg;
        if(hg>ag){A.p+=3;A.w++;B.l++;} else if(hg<ag){B.p+=3;B.w++;A.l++;} else {A.p++;B.p++;A.d++;B.d++;}
        if(A.user) distYouthStats(label,hg,ag); if(B.user) distYouthStats(label,ag,hg);
      }
      teams.sort((a,b)=>b.p-a.p || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf);
      S.youthTables[label]=teams;
    } else { for(let g=0; g<10; g++) distYouthStats(label, poisson(1.8), poisson(1.2)); } // under 13 / egne lag
  }
}
/* --- chat med spillere --- */
function posWord(pos){ return {MV:'keeper',FOR:'forsvarsspiller',MID:'midtbanespiller',ANG:'spiss'}[pos]||'spiller'; }
// Smart, nøkkelfri svarmotor – forstår hva du skriver og svarer i karakter. Alltid på, gratis.
function chatReply(name,text){
  const p=playerInfo(name), t=(text||"").toLowerCase();
  const team=p.team||'klubben', pos=posWord(p.pos), age=p.age, rat=p.rating, q=t.includes("?");
  const pick=a=>a[(Math.random()*a.length)|0], has=(...w)=>w.some(x=>t.includes(x));
  let pool;
  if(has("hei","heis","halla","hallo","yo","god morgen","god kveld","heia trener"))
    pool=["Hei, sjef! 👋","Heisann, trener!","Hallo! Godt å høre fra deg, boss.","Yo, sjef – hva skjer?"];
  else if(has("hvordan går","hvordan har du","står til","alt bra","koss går"))
    pool=[`Det går veldig bra, takk! Trives som ${pos} her i ${team}.`,"Bare bra, sjef – klar for innsats!","Topp form om dagen, føler meg sterk 💪"];
  else if(has("kontrakt","lønn","betalt","penger","forny","avtale"))
    pool=[`Jeg er lykkelig i ${team} – en ny kontrakt hadde betydd alt.`,"Lønna er ikke det viktigste, men en forlengelse hadde gjort meg trygg, sjef.","Jeg vil bli her lenge. Snakk med agenten min, så ordner vi en avtale."];
  else if(has("benk","reserve","innbytter","spilletid","spille mer","får ikke spille"))
    pool=["Jeg vil gjerne spille mer, men jeg jobber knallhardt på trening uansett.","Sett meg på banen, så skal jeg vise hva jeg er god for!","Tøft å sitte på benken, men jeg respekterer valgene dine, boss."];
  else if(has("starte","starter","elleve","fra start"))
    pool=["Får jeg starte, gir jeg alt fra første fløyt!","Jeg er klar for å starte, sjef – stol på meg."];
  else if(has("skad","vondt","kjenner","sliten","trøtt"))
    pool=["Kroppen er litt sliten, men jeg presser på for laget.","Jeg er frisk og klar, ingen skader å bekymre seg for!","Kjenner litt på det, men det går fint til kamp."];
  else if(has("form","trening","trene","økt"))
    pool=[`Treningen går bra – jeg er i fin form (rundt ${rat||'god'} dagsform).`,"Jeg har trent ekstra denne uka, sjef.","Formen stiger for hver økt, lover!"];
  else if(has("score","scoringer","mål "))
    pool = p.pos==='ANG'?["Jeg er sulten på mål – skal fylle nettet i år! ⚽","Gi meg sjansene, så scorer jeg, sjef."]:["Jeg bidrar der jeg kan, selv om scoring ikke er hovedjobben min.","Jeg prøver å spille spissene gode."];
  else if(has("assist","pasning","servere"))
    pool=["Jeg elsker å spille frem en medspiller!","En god assist er nesten like deilig som et mål."];
  else if(has("kamp","motstander","neste","vinne","seier","tape","poeng"))
    pool=["Vi tar den kampen sammen, sjef! Tre poeng er målet.","Jeg gleder meg til neste kamp – vi skal vinne.","Motstanderen er tøff, men vi er klare for dem."];
  else if(has("selg","solgt","salg","overgang","slutte","forlate","annen klubb","bytte klubb","vil du gå"))
    pool=[`Jeg vil helst bli i ${team}, sjef – her trives jeg.`,"Vil du selge meg, må vi ta en prat… men jeg er lojal mot klubben.","Jeg tenker ikke på andre klubber akkurat nå."];
  else if(has("familie","kone","barn","hjemme","datter","sønn","kjæreste"))
    pool=["Familien har det fint, takk som spør! De heier fra tribunen.","Alt bra på hjemmebane, sjef 😊"];
  else if(has("taktikk","formasjon","presse","forsvar","angrep","posisjon","rolle"))
    pool=[`Jeg gjør jobben du gir meg som ${pos}, sjef.`,"Bare si hvordan du vil ha det taktisk, så leverer jeg.",`Jeg liker å ${p.pos==='ANG'?'presse høyt og angripe':p.pos==='MV'?'styre forsvaret bakfra':'jobbe hardt på banen'} – men du bestemmer.`];
  else if(has("kaptein","leder","ansvar"))
    pool=["Det hadde vært en stor ære å være kaptein! 🫡","Jeg tar gjerne mer ansvar i garderoben."];
  else if(has("gammel","alder","pensjon","legge opp","fremtid","slutte snart"))
    pool = (age&&age>=33)?["Jeg merker årene, men jeg har fortsatt mye å gi!","Jeg tar ett år av gangen nå, sjef."]:[`Jeg er ${age||'ung'} og har mange gode år foran meg!`,"Fremtiden er lys – jeg vil utvikle meg her i klubben."];
  else if(has("dårlig","elendig","skjerp","ikke godt nok","skuff","sur","misfornøyd"))
    pool=["Jeg hører deg, sjef. Jeg skal skjerpe meg og jobbe hardere.","Du har rett – jeg krever mer av meg selv neste kamp.","Beklager, det var ikke godt nok. Jeg reiser meg igjen."];
  else if(has("bra","god","flink","stolt","fantastisk","best","dyktig","konge","glad i deg","keeper konge"))
    pool=["Tusen takk, sjef – det betyr utrolig mye! 🙏","Så snilt sagt! Jeg gir alt for deg og laget.","Det varmer, boss. Jeg fortsetter å levere."];
  else if(has("takk","heia","heier","lykke til","stå på","kom igjen","tro på","stoler på"))
    pool=["Takk for tilliten, sjef! Vi står på sammen 💪","Heia oss! Vi fikser dette.","Setter pris på det, trener."];
  else if(has("trives","glad","fornøyd","kos"))
    pool=[`Jeg trives kjempegodt i ${team}, ærlig talt.`,"Beste klubben jeg har vært i, sjef!"];
  else if(q)
    pool=["Godt spørsmål, sjef! Ærlig talt gjør jeg bare mitt beste hver dag.","Hmm, det vet jeg ikke helt – men jeg er klar for hva du enn trenger.","Godt spørsmål! Jeg stoler på at du og laget tar de riktige valgene."];
  else
    pool=["Forstått, trener! 👍","Skal bli, sjef.","Jeg gir alt på trening i morgen.","Hehe, takk for praten, boss!","Vi snakkes – jeg må ut på løkka.","Notert! Jeg er klar når du trenger meg."];
  return pick(pool);
}
async function sendChat(name, text){ text=(text||"").trim(); if(!text) return;
  if(!S.chat) S.chat={}; const log=S.chat[name]||(S.chat[name]=[]);
  const priorHist=log.filter(m=>!m.typing).map(m=>({me:m.me,t:m.t}));
  log.push({me:true,t:text}); const typing={me:false,t:"… skriver",typing:true}; log.push(typing);
  save(); render();
  let reply=null;
  try{
    const r=await fetch("/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({player:playerInfo(name), history:priorHist, message:text})});
    if(r.ok){ const d=await r.json(); if(d&&d.reply) reply=d.reply; }
  }catch(_){}
  if(!reply){ await new Promise(res=>setTimeout(res, 500+Math.random()*700)); reply=chatReply(name,text); } // smart nøkkelfri svarmotor
  typing.typing=false; typing.t=reply;
  if(log.length>40) S.chat[name]=log.slice(-40);
  save(); render();
}
function chatBox(name){ const log=(S.chat&&S.chat[name])||[];
  return `<h4>💬 Chat med ${esc(name)}</h4>
    <div class="chatlog" id="chatlog">${log.length?log.map(m=>`<div class="cmsg ${m.me?'me':'them'} ${m.typing?'typing':''}">${esc(m.t)}</div>`).join(""):'<p class="muted2">Skriv en melding, så svarer spilleren.</p>'}</div>
    <div class="createform"><input id="chatIn" placeholder="Melding til ${esc(name)}…" autocomplete="off"/><button id="chatSend" class="btn small primary">Send</button></div>`; }
function playerInfo(name){
  let p=(S.squad||[]).find(x=>x.name===name);
  if(!p && S.youth){ for(const l in S.youth){ const f=(S.youth[l]||[]).find(x=>x.name===name); if(f){p=f;break;} } }
  return { name, age:p&&p.age, pos:p&&p.pos, rating:p&&p.rating, team:S.userTeam };
}
function wireChat(name){ if($("chatSend")) $("chatSend").onclick=()=>sendChat(name,$("chatIn").value);
  if($("chatIn")) $("chatIn").onkeydown=e=>{ if(e.key==="Enter") sendChat(name,$("chatIn").value); };
  const cl=$("chatlog"); if(cl) cl.scrollTop=cl.scrollHeight; }
function createYouthPlayer(label, name, age, pos){
  age=Math.max(5, parseInt(age,10)||groupMaxAge(label));
  if(age>groupMaxAge(label)){ FLASH=`⚠ Denne spilleren er for gammel for ${label} (maks ${groupMaxAge(label)} år).`; render(); return; }
  name=(name||"").trim()||randName();
  if(!POSORDER.includes(pos)) pos="MID";
  (S.youth[label]=S.youth[label]||[]).push({name, age, pos, rating:youthRatingFor(age, clubYouthBase()), custom:true, goals:0,assists:0,yellow:0,red:0,saves:0});
  FLASH=`🎓 ${name} (${age}å, ${POSNAME[pos]}) er lagt til på ${label}.`; save(); render();
}
function setYouthPos(label, name, pos){
  const p=(S.youth[label]||[]).find(x=>x.name===name); if(!p || !POSORDER.includes(pos)) return;
  p.pos=pos; FLASH=`🔁 ${esc(name)} spiller nå ${POSNAME[pos]}.`; save(); render();
}
function addYouthTeam(base){
  if(!S.youth) S.youth=genYouth();
  let n=2; while(S.youth[base+" "+n]) n++;
  const label=base+" "+n; const age=groupMaxAge(base);
  const t=[]; for(let i=0;i<10;i++) t.push(genYouthPlayer(label+i+S.userTeam, Math.min(age,Math.max(6,age))));
  S.youth[label]=t; FLASH=`➕ Nytt lag opprettet: ${label}.`; save(); render();
}
function ageUpYouth(){
  if(!S.youth) return; const moves=[];
  for(const label in S.youth){ const max=groupMaxAge(label); const keep=[];
    for(const p of S.youth[label]){ p.age++; if(p.age>max) moves.push(p); else keep.push(p); }
    S.youth[label]=keep; }
  let graduated=0;
  for(const p of moves){ if(p.age>21){ graduated++; continue; } const tgt=p.age>20?"U21":"G"+p.age; (S.youth[tgt]=S.youth[tgt]||[]).push(p); }
  if(graduated) addMsg(`🎓 ${graduated} spiller(e) ble for gamle for akademiet`);
}
// ungdomsmotstandere er lokale klubber (samme avdeling), navngitt «[Klubb] G15»
function localYouthOpponent(label){
  const grp=DIVISIONS[S.divIndex].groups[S.groupIndex].teams.filter(t=>t!==S.userTeam);
  const club=grp.length? grp[(Math.random()*grp.length)|0] : "Lokal";
  return `${club} ${label}`;
}
function playYouthMatch(label){
  const t=(S.youth&&S.youth[label])||[]; if(t.length<5){ FLASH="⚠ For få spillere til kamp (minst 5)."; render(); return; }
  const r=youthRating(label), oppR=clamp(r+((Math.random()*11)|0)-5,12,70);
  const hg=poisson(clamp(1.3+(r-oppR)*0.05,0.2,5)), ag=poisson(clamp(1.2+(oppR-r)*0.05,0.2,5));
  const evs=[]; for(let i=0;i<hg;i++){ const sc=t[(Math.random()*t.length)|0]; sc.goals=(sc.goals||0)+1; evs.push({min:1+((Math.random()*70)|0), name:sc.name}); }
  evs.sort((a,b)=>a.min-b.min);
  S.youthResult={label, opp:localYouthOpponent(label), hg, ag, evs}; save(); render();
}
/* --- ungdomskamper på kalenderen --- */
function youthLabels(){ return [...YGROUPS.map(n=>"G"+n),"U21"].filter(l=>S.youth&&S.youth[l]); }
function youthTodayTeams(day){
  if(!gset("youthMatches",true)) return []; // ungdomskamper slått av
  const base=100; if(day<base || (day-base)%7!==0) return [];
  const labels=youthLabels(); if(!labels.length) return [];
  const W=(day-base)/7, n=labels.length, a=labels[W%n], b=labels[(W+Math.floor(n/2))%n];
  return a===b?[a]:[a,b];
}
function genYouthOpp(label, oppR){ const t=[]; for(let i=0;i<11;i++){ const s=hash("opp"+label+S.day+i); t.push({name:randName(), age:groupMaxAge(label), rating:clamp(oppR+(s%7-3),12,70), pos:youthPosForIndex(i)}); } return t; }
function buildYouthLive(label){
  const t=(S.youth[label]||[]).slice(); const r=youthRating(label), oppR=clamp(r+((Math.random()*11)|0)-5,12,70);
  const hg=poisson(clamp(1.3+(r-oppR)*0.05,0.2,5)), ag=poisson(clamp(1.2+(oppR-r)*0.05,0.2,5));
  const home=`${S.userTeam} ${label}`, away=localYouthOpponent(label);
  const base=matchMinutes(label), stoppage=1+((Math.random()*3)|0), FT=base+stoppage; // litt tillegg også på ungdomskamp
  const evs=[]; const rmin=()=>1+((Math.random()*(FT-2))|0);
  for(let i=0;i<hg;i++) evs.push({min:rmin(),type:"goal",team:home});
  for(let i=0;i<ag;i++) evs.push({min:rmin(),type:"goal",team:away});
  let nm=Math.min(4,poisson(1.6)); for(let i=0;i<nm;i++) evs.push({min:rmin(),type:"near",team:Math.random()<0.5?home:away});
  evs.sort((a,b)=>a.min-b.min||(a.type==="goal"?-1:1));
  const onA=genYouthOpp(label,oppR);
  const ratH={}; t.forEach(p=>ratH[p.name]=6.0); const ratA={}; onA.forEach(p=>ratA[p.name]=6.0);
  return {home, away, divH:0,divA:0, ctx:{type:"youth",label}, finalScore:[hg,ag], evs, clock:0, shownScore:[0,0],
    speed:gset("matchSpeed",1000), timer:null, dividers:{}, fullTime:FT, baseTime:base, stoppage, onH:t, onA, userIsHome:false, userIsAway:false, userBench:[],
    userOn:t, ratH, ratA, userTeamName:home, yc:{}, subsLeft:0, autoDone:{}, ended:false};
}
function matchMinutes(label){ const a=groupMaxAge(label); return a<13?30 : a<=16?75 : 90; }
function watchYouthMatch(label){ const t=(S.youth&&S.youth[label])||[]; if(t.length<5){ FLASH="⚠ For få spillere til kamp (minst 5)."; render(); return; } LIVE=buildYouthLive(label); S.screen="live"; renderLive(); }
/* --- akademi -> ungdomslag --- */
function assignAcademy(i, label){
  const p=S.academy[i]; if(!p) return;
  if(p.age>groupMaxAge(label)){ FLASH=`⚠ ${p.name} (${p.age}å) er for gammel for ${label}.`; render(); return; }
  (S.youth[label]=S.youth[label]||[]).push({name:p.name, age:p.age, rating:p.rating, fromAcademy:true});
  S.academy.splice(i,1); FLASH=`✅ ${p.name} er satt på ${label}.`; save(); render();
}
function openPlayer(name, back){ S.detail=name; S.detailBack=back; S.screen="playerDetail"; render(); }
function openYouthPlayer(label, name){ S.ysel={label,name}; S.screen="youthPlayer"; render(); }
function moveYouthPlayer(fromLabel, name, toLabel){
  const arr=S.youth[fromLabel]||[]; const idx=arr.findIndex(p=>p.name===name); if(idx<0) return;
  const p=arr[idx];
  if(p.age>groupMaxAge(toLabel)){ FLASH=`⚠ ${p.name} (${p.age}å) er for gammel for ${toLabel}.`; render(); return; }
  arr.splice(idx,1); (S.youth[toLabel]=S.youth[toLabel]||[]).push(p);
  S.ysel={label:toLabel,name}; FLASH=`✅ ${p.name} er flyttet til ${toLabel}.`; save(); render();
}
function promoteYouthToSenior(label, name){
  const arr=S.youth[label]||[]; const idx=arr.findIndex(p=>p.name===name); if(idx<0) return;
  const p=arr[idx];
  if(p.age<14){ FLASH=`⚠ ${p.name} er bare ${p.age} år – må være minst 14 for å tas opp på A-laget.`; render(); return; }
  if(S.squad.length>=32){ FLASH="⚠ A-lagstroppen er full (maks 32)."; render(); return; }
  arr.splice(idx,1);
  const pos=POSORDER[1+(hash(p.name)%3)]; // FOR/MID/ANG
  const np={name:p.name, pos, rating:p.rating, age:p.age, value:playerValue(p.rating), real:false, fromAcademy:true};
  ensureContract(np); S.squad.push(np);
  FLASH=`⬆ ${p.name} er tatt opp på A-laget!`; S.screen="youth"; save(); render();
}
function removeYouthPlayer(label, name){
  const arr=S.youth[label]||[]; const idx=arr.findIndex(p=>p.name===name); if(idx<0) return;
  arr.splice(idx,1); FLASH=`🗑 ${name} er fjernet fra ${label}.`; S.screen="youth"; save(); render();
}
function youthIntake(){ // 1-3 nye unge spillere til akademilagene hver sesong
  if(!S.youth) return; const labels=youthLabels(); if(!labels.length) return;
  const n=1+((Math.random()*3)|0);
  for(let i=0;i<n;i++){ const l=labels[(Math.random()*labels.length)|0]; const a=Math.min(groupMaxAge(l),groupMaxAge(l)>20?18:groupMaxAge(l));
    (S.youth[l]=S.youth[l]||[]).push(genYouthPlayer(l+"new"+S.season+i, a)); }
  addMsg(`🌱 ${n} ny(e) spiller(e) kom til ungdomsavdelingen`);
}

/* =====================================================================
   LIVE KAMPSIMULERING (1 minutt = 1 sekund)
   ===================================================================== */
function buildLive(home,away,divH,divA,ctx){
  const [hg,ag]=matchGoals(home,away,divH,divA);
  const userIsHome=home===S.userTeam, userIsAway=away===S.userTeam;
  const onH = userIsHome ? userXI().slice() : bestXI(squadFor(home,divH)).slice();
  const onA = userIsAway ? userXI().slice() : bestXI(squadFor(away,divA)).slice();
  const startNames = new Set((userIsHome?onH:onA).map(p=>p.name));
  const userBench = (userIsHome||userIsAway) ? S.squad.filter(p=>!startNames.has(p.name) && !(p.outDays>0)) : [];
  const base=90, stoppage=1+((Math.random()*7)|0), FT=base+stoppage; // 1–7 min overtid/tillegg
  const evs=[]; const rmin=()=>1+((Math.random()*FT)|0);
  for(let i=0;i<hg;i++) evs.push({min:rmin(),type:"goal",team:home,pen:Math.random()<0.18,var:Math.random()<0.2});
  for(let i=0;i<ag;i++) evs.push({min:rmin(),type:"goal",team:away,pen:Math.random()<0.18,var:Math.random()<0.2});
  let nm=Math.min(5,poisson(2.2)); for(let i=0;i<nm;i++) evs.push({min:rmin(),type:"near",team:Math.random()<0.5?home:away});
  let yc=Math.min(6,poisson(2.2)); for(let i=0;i<yc;i++) evs.push({min:rmin(),type:"yellow",team:Math.random()<0.5?home:away});
  if(Math.random()<0.12) evs.push({min:rmin(),type:"red",team:Math.random()<0.5?home:away});
  if(Math.random()<0.35) evs.push({min:rmin(),type:"var",kind:"penalty",team:Math.random()<0.5?home:away}); // VAR: mulig straffe
  if(Math.random()<0.28) evs.push({min:rmin(),type:"var",kind:"red",team:Math.random()<0.5?home:away});      // VAR: mulig rødt kort
  // interaktiv straffe: du tar den selv, eller redder den når motstanderen får straffe (velg blant 24 plasser, 50/50)
  if(userIsHome||userIsAway){ if(Math.random()<0.45){ const pteam=Math.random()<0.5?home:away; evs.push({min:rmin(),type:"shot",kind:"penalty",team:pteam}); } }
  // spillerkarriere: du må TA VALG underveis (sentre/skyte/dribble, kjefte på dommeren osv.)
  if(ctx && ctx.type==="pmatch"){ const KINDS=["chance","chance","chance","freekick","ref"]; const np=3+((Math.random()*2)|0);
    for(let i=0;i<np;i++) evs.push({min:rmin(),type:"pdec",kind:KINDS[(Math.random()*KINDS.length)|0]}); }
  // smågodt-hendelser: frispark, offside, stolpe (sjelden – ikke fyll feeden)
  const FLAV=["frispark","offside","frispark","offside","frispark","post"]; // post er sjelden
  let nf=Math.min(4,poisson(2)); for(let i=0;i<nf;i++) evs.push({min:rmin(),type:FLAV[(Math.random()*FLAV.length)|0],team:Math.random()<0.5?home:away});
  evs.sort((a,b)=> a.min-b.min || (a.type==="goal"?-1:1));
  const userOn = userIsHome?onH:(userIsAway?onA:null);
  const ratH={}; onH.forEach(p=>ratH[p.name]=6.0); const ratA={}; onA.forEach(p=>ratA[p.name]=6.0);
  const asMins=(()=>{ const n=1+((Math.random()*2.4)|0), set=new Set(); while(set.size<n) set.add(58+((Math.random()*27)|0)); return [...set]; })(); // 1–3 auto-bytter på tilfeldige minutter (58–84)
  return {home,away,divH,divA,ctx, finalScore:[hg,ag], evs, clock:0, shownScore:[0,0],
    speed:gset("matchSpeed",1000), timer:null, dividers:{}, fullTime:FT, baseTime:base, stoppage, onH, onA, userIsHome, userIsAway, userBench,
    userOn, ratH, ratA, userTeamName:(userIsHome?home:(userIsAway?away:null)),
    userStart:(userIsHome||userIsAway)?[...startNames]:null, incidents:{},
    yc:{}, subsLeft:5, autoDone:{}, autoSubMins:asMins, ended:false};
}
function beginLive(home,away,divH,divA,ctx){ LIVE=buildLive(home,away,divH,divA,ctx); S.screen="live"; renderLive(); }
function userPitch(){ const L=LIVE; return L.userIsHome?L.onH:(L.userIsAway?L.onA:null); }
function removeFromPitch(team,name){ const L=LIVE; const arr=team===L.home?L.onH:L.onA; const i=arr.findIndex(p=>p.name===name); if(i>=0) arr.splice(i,1); }

/* ---- slitasje, besvimelse og skader (gjelder ditt lag i A-lagskamper) ---- */
const INJURIES=["strekk i låret","forstuet ankel","kneskade","muskelstrekk i leggen","hamstring","skuldra ut av ledd","brukket tå","ankelskade","ribbeinsbrudd","lårhøne"];
function maybeIncident(c){
  if(!gset("injuries",true)) return; // skader/utmattelse slått av
  const L=LIVE; if(!L||!(L.userIsHome||L.userIsAway)) return;
  if(L.ctx.type==="youth"||L.ctx.type==="pmatch") return; // kun manager-mode A-lag
  const pitch=userPitch(); if(!pitch) return;
  L.incidents=L.incidents||{};
  // besvime: en sliten spiller (lav form) som IKKE byttes ut kan kollapse sent i kampen.
  // Jo lavere form og jo lenger han står på banen, jo større sjanse. Form ≥50 = trygt.
  if(c>=55){ for(const pl of pitch.slice()){ if(L.incidents[pl.name]) continue;
    const def=50-(pl.fit==null?100:pl.fit);
    if(def>0){ const risk=(def/50)*0.035; if(Math.random()<risk){ faintPlayer(pl,c); } } } }
  // skade (sjelden) – kan ramme hvem som helst hele kampen
  if(Math.random()<0.0008){ const ok=pitch.filter(p=>!L.incidents[p.name]); const pl=ok[(Math.random()*ok.length)|0]; if(pl) injurePlayer(pl,c); }
}
function faintPlayer(pl,c){
  const L=LIVE; L.incidents[pl.name]=true; const team=L.userTeamName;
  removeFromPitch(team,pl.name); rtAdj(ratMapFor(team),pl.name,-0.6);
  const days=7+((Math.random()*9)|0), wk=Math.max(1,Math.round(days/7)); // ~1–2 uker
  pl.fit=10; pl.outDays=days; pl.outReason="utmattelse";
  liveFeed(`💫 <b>${c}'</b> ${esc(pl.name)} <b>besvimer av utmattelse</b> og må av! Han er sliten – ute i ~${wk} uke${wk===1?'':'r'}. (Husk å bytte ut slitne spillere!)`,"info");
}
function injurePlayer(pl,c){
  const L=LIVE; L.incidents[pl.name]=true; const team=L.userTeamName;
  removeFromPitch(team,pl.name); rtAdj(ratMapFor(team),pl.name,-0.4);
  const severe=Math.random()<0.3, wk=severe?(4+((Math.random()*9)|0)):(1+((Math.random()*3)|0)); // lett 1–3 uker, stygg 4–12
  pl.outDays=wk*7; pl.outReason="skade"; pl.fit=Math.min(pl.fit==null?100:pl.fit,40);
  const kind=INJURIES[(Math.random()*INJURIES.length)|0];
  liveFeed(`🤕 <b>${c}'</b> ${esc(pl.name)} <b>skadet seg</b> (${kind}) og må av – ute i <b>${wk} uke${wk===1?'':'r'}</b>.`,"info");
}

function liveFeed(html, cls){ const f=$("lvFeed"); if(!f) return; const d=document.createElement("div"); d.className="fl "+(cls||""); d.innerHTML=html; f.appendChild(d); f.scrollTop=f.scrollHeight; }
function ratMapFor(team){ const L=LIVE; return team===L.home?L.ratH:L.ratA; }
function onPitchFor(team){ const L=LIVE; return team===L.home?L.onH:L.onA; }
function rtAdj(map,nm,d){ if(map&&map[nm]!=null) map[nm]=clamp(map[nm]+d,3,10); }
function revealMinute(c){
  const L=LIVE; const rec = L.ctx.type!=="youth"; // ungdomskamper teller ikke i seniorstatistikken
  maybeAutoSub(c);
  for(const e of L.evs.filter(e=>e.min===c)){
    if(L.varActive||L.shotActive||L.pdecActive) break; // en pause er åpen – vent på spilleren
    const pitch = e.team===L.home?L.onH:L.onA; if(!pitch.length) continue;
    const mine = e.team===S.userTeam;
    if(e.type==="goal"){
      const sc=e.pen?penaltyTakerFor(e.team,pitch):pickScorer(pitch); const as=(!e.pen&&Math.random()<0.6)?pickAssist(pitch,sc):null;
      const isOG = !e.pen && Math.random()<0.06; // av og til selvmål – teller for oss, men står «selvmål»
      if(e.var && !L.skipping) startVarCheck(c, 'goal', {e, sc, as, isOG}); // VAR-sjekk på målet
      else applyGoal(c, e, sc, as, isOG);
    } else if(e.type==="var"){
      if(L.skipping) resolveVarKind(c, e.kind, {team:e.team}); else startVarCheck(c, e.kind, {team:e.team});
    } else if(e.type==="shot"){
      if(L.skipping) autoShot(c, e);
      else if(e.team===S.userTeam) startShot(c, e, 'shoot');   // du skyter
      else startShot(c, e, 'save');                            // motstanderen har straffe – du redder
    } else if(e.type==="pdec"){
      if(!L.skipping) startPdec(c, e);                         // spillerkarriere: ditt valg underveis
    } else if(e.type==="near"){
      const p=pickScorer(pitch);
      rtAdj(ratMapFor(e.team),p.name,0.1);
      liveFeed(`😮 <b>${c}'</b> Nesten mål! ${esc(p.name)} ${Math.random()<0.5?'reddet på streken':'like utenfor'} — <span class="ft">${esc(e.team)}</span>`,"near");    } else if(e.type==="post"){
      const p=pickScorer(pitch); rtAdj(ratMapFor(e.team),p.name,0.15);
      liveFeed(`🪵 <b>${c}'</b> I STOLPEN! ${esc(p.name)} ${Math.random()<0.5?'smalt i tverrliggeren':'traff stolpen'} — <span class="ft">${esc(e.team)}</span>`,"near");    } else if(e.type==="frispark"){
      const p=pickScorer(pitch);
      const v=[`${esc(p.name)} bøyer frisparket over muren – like utenfor`,`Frispark til ${esc(e.team)}, men ${esc(p.name)} treffer ikke`,`${esc(p.name)} slår frisparket inn i feltet – ryddet unna`][(Math.random()*3)|0];
      liveFeed(`🎯 <b>${c}'</b> ${v} — <span class="ft">${esc(e.team)}</span>`,"info");    } else if(e.type==="offside"){
      const p=pickScorer(pitch); rtAdj(ratMapFor(e.team),p.name,-0.1);
      const v=[`Offside! ${esc(p.name)} var for tidlig ute`,`Flagget går opp – ${esc(p.name)} i offside`][(Math.random()*2)|0];
      liveFeed(`🚩 <b>${c}'</b> ${v} — <span class="ft">${esc(e.team)}</span>`,"info");    } else if(e.type==="yellow"){
      const p=pickBooked(pitch); L.yc[p.name]=(L.yc[p.name]||0)+1;
      if(L.yc[p.name]>=2){ if(rec)recStat(p.name,e.team,"red"); removeFromPitch(e.team,p.name); rtAdj(ratMapFor(e.team),p.name,-1.0);
        liveFeed(`🟨🟥 <b>${c}'</b> ${esc(p.name)} – andre gule, utvist! — <span class="ft">${esc(e.team)}</span>`,"rc"); }
      else { if(rec)recStat(p.name,e.team,"yellow"); rtAdj(ratMapFor(e.team),p.name,-0.5); liveFeed(`🟨 <b>${c}'</b> ${esc(p.name)} — <span class="ft">${esc(e.team)}</span>`,"yc"); }
    } else if(e.type==="red"){
      const p=pickBooked(pitch); if(rec)recStat(p.name,e.team,"red"); removeFromPitch(e.team,p.name); rtAdj(ratMapFor(e.team),p.name,-1.5);
      liveFeed(`🟥 <b>${c}'</b> ${esc(p.name)} utvist${Math.random()<0.35?' <i>(VAR)</i>':''} — <span class="ft">${esc(e.team)}</span>`,"rc");
    }
  }
  if(c>=Math.floor((L.baseTime||90)/2) && !L.dividers.h){ L.dividers.h=true; liveFeed("⏸ Pause","div"); }
  if(L.baseTime && c===L.baseTime && !L.dividers.st){ L.dividers.st=true; liveFeed(`⏱ <b>${L.stoppage} min tillegg</b>`,"div"); }
}
// fullfør et mål (vanlig eller selvmål) – øker stillingen og viser melding + ball i mål
function applyGoal(c, e, sc, as, isOG){
  const L=LIVE, rec=L.ctx.type!=="youth", mine=e.team===S.userTeam;
  const oppTeam=e.team===L.home?L.away:L.home;
  if(e.team===L.home)L.shownScore[0]++; else L.shownScore[1]++;
  if(isOG){ // selvmål av motstanderen – teller for oss
    const og=pickScorer(onPitchFor(oppTeam)); rtAdj(ratMapFor(oppTeam), og.name, -0.8);
    liveFeed(`<b>⚽ ${c}'</b> SELVMÅL av ${esc(og.name)} <i>(${esc(oppTeam)})</i> – teller for <span class="ft">${esc(e.team)}</span>`, "goal og"+(mine?" mine":""));    return;
  }
  if(rec){ recStat(sc.name,e.team,"goals"); if(as) recStat(as.name,e.team,"assists"); }
  else if(L.ctx.type==="youth" && e.team===L.home) sc.goals=(sc.goals||0)+1; // ungdomsmål
  rtAdj(ratMapFor(e.team),sc.name,1.0); if(as) rtAdj(ratMapFor(e.team),as.name,0.7);
  const gk=keeperOf(onPitchFor(oppTeam)); if(gk) rtAdj(ratMapFor(oppTeam),gk.name,-0.3);
  const tag = e.pen ? ' <i>(straffe)</i>' : "";
  liveFeed(`<b>⚽ ${c}'</b> ${esc(sc.name)}${as?` <i>(assist: ${esc(as.name)})</i>`:""}${tag} — <span class="ft">${esc(e.team)}</span>`, "goal"+(mine?" mine":""));}
// klokketekst med overtid: 92' vises som «90+2'»
function clockText(L){ return (L.baseTime && L.clock>L.baseTime) ? (L.baseTime+"+"+(L.clock-L.baseTime)+"'") : (L.clock+"'"); }
// VAR-sjekk: stopp klokka i 10 sekunder, så et utfall (mål / straffe / rødt kort)
function startVarCheck(c, kind, data){
  const L=LIVE; if(L.timer){clearInterval(L.timer);L.timer=null;}
  L.varActive=true; L.varPending={c,kind,data};
  const REASONS={
    penalty:['mulig straffe – hands i feltet','mulig straffe – felling i 16-meteren','mulig straffe etter duell i feltet'],
    red:['mulig rødt kort – stygg takling','mulig rødt kort – albue i duell','mulig rødt kort – siste mann'],
    goal:['om målet skal godkjennes – mulig offside i forkant','om målet skal godkjennes – mulig hands før målet','om målet skal godkjennes – frispark i forkant']
  };
  const what=(REASONS[kind]||REASONS.goal)[(Math.random()*3)|0];
  const team = kind==='goal' ? (data.e&&data.e.team) : data.team;
  if(kind==='red'){ // velg synderen NÅ, så meldingen navngir riktig spiller på riktig lag
    const pitch=onPitchFor(data.team);
    data.p = pitch.length ? pickBooked(pitch) : null;
    liveFeed(`📺 <b>${clockText(L)}</b> VAR-SJEKK … sjekker ${what}${data.p?` på <b>${esc(data.p.name)}</b>`:''} (<span class="ft">${esc(team)}</span>) <i>(spillet er stoppet)</i>`,"var");
  } else {
    liveFeed(`📺 <b>${clockText(L)}</b> VAR-SJEKK${team?` for <span class="ft">${esc(team)}</span>`:''} … sjekker ${what} <i>(spillet er stoppet)</i>`,"var");
  }
  if($("lvClock")) $("lvClock").textContent="VAR …";
  L.varTimer=setTimeout(()=>resolveVar(false), Math.max(1400, Math.min(5000, L.speed*5))); // kortere VAR-pause i høy fart
}
function resolveVar(instant){
  const L=LIVE; if(!L||!L.varActive||!L.varPending) return;
  if(L.varTimer){ clearTimeout(L.varTimer); L.varTimer=null; }
  L.varActive=false; const {c,kind,data}=L.varPending; L.varPending=null;
  resolveVarKind(c, kind, data);
  if($("lvH")) $("lvH").textContent=L.shownScore[0]; if($("lvA")) $("lvA").textContent=L.shownScore[1];
  if($("lvClock")) $("lvClock").textContent=clockText(L);
  updateRatingsPanel();
  if(!instant){ if(L.clock>=L.fullTime) endLive(); else restartTimer(); }
}
function resolveVarKind(c, kind, data){
  const L=LIVE, rec=L.ctx.type!=="youth";
  if(kind==='goal'){
    if(Math.random()<0.6){ applyGoal(c, data.e, data.sc, data.as, data.isOG); liveFeed(`✅ <b>VAR:</b> Målet godkjennes!`,"var ok"); }
    else liveFeed(`❌ <b>VAR:</b> IKKE MÅL – annullert (${Math.random()<0.5?'offside':'forseelse i forkant'}).`,"var no");
  } else if(kind==='penalty'){
    if(Math.random()<0.55){ liveFeed(`🎯 <b>VAR:</b> STRAFFE til ${esc(data.team)}!`,"var ok");
      const sc=penaltyTakerFor(data.team, onPitchFor(data.team));
      if(Math.random()<0.8) applyGoal(c, {team:data.team, pen:true}, sc, null, false);
      else liveFeed(`😱 <b>${clockText(L)}</b> … men ${esc(sc.name)} bommer på straffen! — <span class="ft">${esc(data.team)}</span>`,"near");
    } else liveFeed(`❌ <b>VAR:</b> Ingen straffe – spillet fortsetter.`,"var no");
  } else if(kind==='red'){
    const pitch=onPitchFor(data.team);
    const p = (data.p && pitch.some(x=>x.name===data.p.name)) ? data.p : (pitch.length?pickBooked(pitch):null);
    if(Math.random()<0.5 && p){ if(rec)recStat(p.name,data.team,"red"); removeFromPitch(data.team,p.name); rtAdj(ratMapFor(data.team),p.name,-1.5);
      liveFeed(`🟥 <b>VAR:</b> RØDT KORT til ${esc(p.name)} (<span class="ft">${esc(data.team)}</span>)`,"var no rc"); }
    else liveFeed(`✅ <b>VAR:</b> ${p?esc(p.name)+' slipper med gult':'Bare gult kort, ikke rødt'}.`,"var ok");
  }
}
/* ---- interaktiv straffe/frispark: velg blant 24 plasser, 50/50 om du scorer ---- */
function pickShotTaker(pitch){ const me=(pitch||[]).find(p=>p.me); if(me) return me; const out=(pitch||[]).filter(p=>p.pos!=="MV"); out.sort((a,b)=>(SCORE_W[b.pos]||1)*b.rating-(SCORE_W[a.pos]||1)*a.rating); return out[0]||(pitch&&pitch[0]); }
/* Fast straffetaker (valgt i Lagledelse) – brukes hvis han er på banen, ellers beste skytter */
function penaltyTakerFor(team, pitch){
  if(S && team===S.userTeam && S.penaltyTaker){
    const p=(pitch||[]).find(x=>x.name===S.penaltyTaker); if(p) return p;
  }
  return pickShotTaker(pitch);
}
function autoShot(c, e){ const L=LIVE; const taker=penaltyTakerFor(e.team, onPitchFor(e.team)); if(!taker) return;
  if(Math.random()<0.5) applyGoal(c, {team:e.team, pen:e.kind==='penalty'}, taker, null, false);
  else liveFeed(`${e.kind==='penalty'?'🧤':'🚫'} <b>${c}'</b> ${esc(taker.name)} ${Math.random()<0.5?'ble reddet':'skjøt utenfor'} — <span class="ft">${esc(e.team)}</span>`,"near"); }
function startShot(c, e, mode){
  const L=LIVE; if(L.timer){clearInterval(L.timer);L.timer=null;} L.shotActive=true;
  const shoot = mode==='shoot';
  const userTeam = L.userIsHome?L.home:L.away;
  const taker = penaltyTakerFor(e.team, onPitchFor(e.team));   // fast straffetaker hvis valgt, ellers beste skytter
  const keeper = shoot ? null : keeperOf(onPitchFor(userTeam));
  if(!taker){ L.shotActive=false; autoShot(c,e); return; }
  L.shotPending={c,e,taker,keeper,mode};
  if(shoot){ liveFeed(`⚽ <b>${clockText(L)}</b> STRAFFE til ${esc(e.team)} – ${esc(taker.name)} skal skyte!`,"goal mine");
    if($("lvClock")) $("lvClock").textContent="STRAFFE"; }
  else { liveFeed(`🧤 <b>${clockText(L)}</b> STRAFFE til ${esc(e.team)}! ${esc(taker.name)} tar den – kast deg!`,"rc");
    if($("lvClock")) $("lvClock").textContent="STRAFFE MOT"; }
  const ctrl=$("lvCtrl"); if(ctrl){
    const title = shoot? `👇 Velg hvor <b>${esc(taker.name)}</b> skyter (24 plasser):` : `🧤 Velg hvor keeperen din stuper (24 plasser):`;
    ctrl.innerHTML=`<div class="shootwrap"><div class="shoottitle">${title}</div>
      <div class="goalgrid">${Array.from({length:24},(_,i)=>`<button class="goalcell" data-i="${i}"></button>`).join("")}</div></div>`;
    ctrl.querySelectorAll(".goalcell").forEach(b=>b.onclick=()=>takeShot(+b.dataset.i));
  }
}
function finishShotUI(){ const L=LIVE;
  if($("lvH")) $("lvH").textContent=L.shownScore[0]; if($("lvA")) $("lvA").textContent=L.shownScore[1];
  if($("lvClock")) $("lvClock").textContent=clockText(L);
  updateRatingsPanel(); redrawControls();
  if(L.clock>=L.fullTime) endLive(); else restartTimer();
}
/* ---- spillerkarriere: dine valg underveis i live-kampen (sentre/skyte/dribble/dommer) ---- */
function startPdec(c, e){
  const L=LIVE; if(L.timer){clearInterval(L.timer);L.timer=null;} L.pdecActive=true; L.pdecPending={c, kind:e.kind};
  const ui=pcStepUI(e.kind, S.player.pos);
  if($("lvClock")) $("lvClock").textContent="DIN TUR";
  const ctrl=$("lvCtrl"); if(ctrl){
    ctrl.innerHTML=`<div class="shootwrap"><div class="shoottitle">🎮 ${esc(S.player.name)}: ${ui.prompt}</div>
      <div class="lvctrl">${ui.acts.map(([a,l])=>`<button class="btn primary pdecbtn" data-a="${a}">${l}</button>`).join("")}</div></div>`;
    ctrl.querySelectorAll(".pdecbtn").forEach(b=>b.onclick=()=>resolvePdec(b.dataset.a));
  }
}
function resolvePdec(action){
  const L=LIVE, P=L.pdecPending; if(!P) return; L.pdecPending=null; L.pdecActive=false;
  const p=S.player, club=S.userTeam, kind=P.kind, r=Math.random(), map=ratMapFor(club), home=club===L.home; let txt="", dr=0;
  const meScore=()=>{ if(home)L.shownScore[0]++; else L.shownScore[1]++; recStat(p.name,club,"goals"); };
  const meAssist=()=>{ if(home)L.shownScore[0]++; else L.shownScore[1]++; recStat(p.name,club,"assists"); };
  const concede=()=>{ if(home)L.shownScore[1]++; else L.shownScore[0]++; };
  if(kind==='freekick'){
    if(action==='fk_shoot'){ if(r<0.3){ meScore(); dr=1.2; txt=`⚽ ${esc(p.name)} setter frisparket i krysset – MÅL!`; } else { dr=-0.1; txt=`${esc(p.name)} skyter frisparket like over.`; } }
    else { if(r<0.4){ meAssist(); dr=0.8; txt=`🎯 ${esc(p.name)} legger inn – mål! Assist til deg!`; } else { dr=0; txt=`Innlegget fra ${esc(p.name)} ble klarert.`; } }
  } else if(kind==='ref'){
    const card = action==='sorry'?(r<0.7?0:1):action==='ball'?(r<0.5?0:(r<0.95?1:2)):(r<0.3?0:(r<0.7?1:2));
    if(card===0){ dr=0.05; txt=`Dommeren lar ${esc(p.name)} slippe unna – ingen kort. 😅`; }
    else if(card===1){ recStat(p.name,club,"yellow"); dr=-0.4; txt=`🟨 ${esc(p.name)} får gult kort!`; }
    else { recStat(p.name,club,"red"); removeFromPitch(club,p.name); dr=-1.3; txt=`🟥 ${esc(p.name)} kjeftet for mye – RØDT KORT, utvist!`; }
  } else if(p.pos==='MV'){
    const ok=(action==='dive'&&r<0.55)||(action==='rush'&&r<0.45)||(action==='stay'&&r<0.5);
    if(ok){ recStat(p.name,club,"saves"); dr=0.4; txt=`🧤 ${esc(p.name)} med flott redning!`; } else { concede(); dr=-0.5; txt=`⚽ Baklengs bak ${esc(p.name)}.`; }
  } else if(p.pos==='FOR'){
    if(action==='tackle'){ if(r<0.6){ dr=0.3; txt=`🦵 ${esc(p.name)} med ren takling!`; } else { dr=-0.3; txt=`${esc(p.name)} bommer på taklingen.`; } }
    else if(action==='clear'){ dr=0.15; txt=`🛡️ ${esc(p.name)} klarerer trygt unna.`; }
    else { if(r<0.45){ meAssist(); dr=0.6; txt=`🎯 ${esc(p.name)} med målgivende oppspill! Assist!`; } else { dr=-0.2; txt=`Oppspillet fra ${esc(p.name)} ble snappet.`; } }
  } else {
    if(action==='shoot'){ if(r<0.4){ meScore(); dr=1.2; txt=`⚽ ${esc(p.name)} SCORER!`; } else if(r<0.7){ dr=-0.1; txt=`🧤 Keeper redder ${esc(p.name)}s skudd.`; } else { dr=-0.15; txt=`${esc(p.name)} skyter like utenfor.`; } }
    else if(action==='pass'){ if(r<0.45){ meAssist(); dr=0.8; txt=`🤝 ${esc(p.name)} med en nydelig assist!`; } else { dr=0; txt=`Pasningen fra ${esc(p.name)} når fram.`; } }
    else { if(r<0.3){ meScore(); dr=1.0; txt=`💨 ${esc(p.name)} dribler og scorer!`; } else if(r<0.6){ dr=0.4; txt=`💨 ${esc(p.name)} med en fin dribling.`; } else { dr=-0.3; txt=`${esc(p.name)} mister ballen.`; } }
  }
  rtAdj(map,p.name,dr);
  liveFeed(`${dr>=1?'✨ ':''}<b>${clockText(L)}</b> ${txt} — <span class="ft">${esc(club)}</span>`, dr>0.5?"goal mine":"info");
  finishShotUI();
}
function takeShot(idx){
  const L=LIVE, P=L.shotPending; if(!P) return; L.shotPending=null;
  const {c,e,taker,keeper,mode}=P; const cells=document.querySelectorAll(".goalcell"); cells.forEach(x=>x.disabled=true);
  const cell=cells[idx], good=Math.random()<0.5; // 50/50
  const userTeam = L.userIsHome?L.home:L.away;
  if(mode==='shoot'){
    if(cell){ cell.classList.add(good?"scored":"missed"); cell.textContent=good?"⚽":"🧤"; }
    setTimeout(()=>{ L.shotActive=false;
      if(good) applyGoal(c,{team:e.team,pen:true},taker,null,false);
      else { rtAdj(ratMapFor(e.team),taker.name,-0.4); liveFeed(`🧤 <b>${clockText(L)}</b> ${Math.random()<0.5?'Reddet av keeper':'Like utenfor'}! ${esc(taker.name)} bommet — <span class="ft">${esc(e.team)}</span>`,"near"); }
      finishShotUI();
    },800);
  } else { // du redder straffen
    const saved=good;
    if(cell){ cell.classList.add(saved?"scored":"missed"); cell.textContent=saved?"🧤":"⚽"; }
    setTimeout(()=>{ L.shotActive=false;
      if(saved){ if(keeper) rtAdj(ratMapFor(userTeam),keeper.name,0.9); liveFeed(`🧤 <b>${clockText(L)}</b> REDNING! Keeperen din stuper riktig vei og redder straffen fra ${esc(taker.name)}! — <span class="ft">${esc(userTeam)}</span>`,"goal mine"); }
      else applyGoal(c,{team:e.team,pen:true},taker,null,false); // motstanderen scorer
      finishShotUI();
    },800);
  }
}
function applySub(offName, onName){
  const L=LIVE; const pitch=userPitch(); if(!pitch||L.subsLeft<=0) return false;
  const oi=pitch.findIndex(p=>p.name===offName), bi=L.userBench.findIndex(p=>p.name===onName);
  if(oi<0||bi<0) return false;
  const inp=L.userBench[bi];
  pitch.splice(oi,1,inp); L.userBench.splice(bi,1); L.subsLeft--;
  const umap=L.userIsHome?L.ratH:L.ratA; if(umap && umap[inp.name]==null) umap[inp.name]=6.0; // innbytter starter på 6,0
  updateRatingsPanel(); return true;
}
function maybeAutoSub(c){
  const L=LIVE; if(!S.autoSub) return; const pitch=userPitch(); if(!pitch) return;
  if(!L.autoSubMins) return;
  if(L.autoSubMins.includes(c) && !L.autoDone[c] && L.subsLeft>0 && L.userBench.length){
    L.autoDone[c]=true;
    // bytt ut en av de 3 svakeste utespillerne (tilfeldig), inn en av de 3 beste på benken – ulikt hver kamp
    const outC=pitch.filter(p=>p.pos!=="MV").sort((a,b)=>a.rating-b.rating).slice(0,3);
    const inC=L.userBench.filter(p=>p.pos!=="MV").sort((a,b)=>b.rating-a.rating).slice(0,3);
    const out=outC[(Math.random()*outC.length)|0], inp=inC[(Math.random()*inC.length)|0];
    if(out && inp && applySub(out.name,inp.name))
      liveFeed(`🔄 <b>${c}'</b> ${esc(inp.name)} inn for ${esc(out.name)} <i>(auto)</i> — <span class="ft">${esc(S.userTeam)}</span>`,"sub");
  }
}
/* FotMob-aktig: ALLE spillere beveger seg opp/ned hvert minutt – ballbesittelse,
   pasninger, balltap, redninger – ikke bare de som scorer. */
const RTVOL={MV:0.05,FOR:0.06,MID:0.075,ANG:0.085};
function tickRatings(){
  const L=LIVE; if(!L||(!L.ratH&&!L.ratA)) return;
  const [h,a]=L.shownScore;
  const side=(on,map,mom)=>{
    if(!on||!map||!on.length) return;
    for(const p of on){ if(map[p.name]==null) continue;
      const vol=RTVOL[p.pos]||0.065;
      // grunnstøy (touch for touch) + svak klassebias + medvind/motvind ut fra stilling
      let d=(Math.random()-0.5)*2*vol + (p.rating-58)*0.00018 + mom*0.004;
      rtAdj(map,p.name,d);
    }
    // tydelige mikrohendelser hvert minutt: én god aksjon (+) og ett balltap (−)
    const g=on[(Math.random()*on.length)|0]; if(g) rtAdj(map,g.name, 0.05+Math.random()*0.07);   // bra pasning/driblefinte
    const b=on[(Math.random()*on.length)|0]; if(b) rtAdj(map,b.name, -(0.05+Math.random()*0.07)); // mister ballen
    if(Math.random()<0.18){ const gk=keeperOf(on); if(gk) rtAdj(map,gk.name, 0.05+Math.random()*0.06); } // keeperredning
  };
  side(L.onH, L.ratH, Math.sign(h-a));
  side(L.onA, L.ratA, Math.sign(a-h));
}
function liveTick(){
  const L=LIVE; if(!L) return;
  L.clock++; revealMinute(L.clock);
  if(L.varActive||L.shotActive||L.pdecActive) return; // VAR / skyte-valg / spillervalg: klokka venter
  maybeIncident(L.clock);
  tickRatings();
  if($("lvClock")) $("lvClock").textContent=clockText(L);
  if($("lvH")) $("lvH").textContent=L.shownScore[0];
  if($("lvA")) $("lvA").textContent=L.shownScore[1];
  updateRatingsPanel();
  if(L.clock>=L.fullTime){ clearInterval(L.timer); L.timer=null; endLive(); }
}
/* lagrating: keeper→spiss, oppdateres live og etter kampen.
   Ditt lag vises til HØYRE (hjemme eller borte), motstanderen til VENSTRE. */
function ratingPanelHTML(team, on, map, side){
  if(!on||!map) return "";
  const order={MV:0,FOR:1,MID:2,ANG:3};
  const rows=on.slice().sort((a,b)=>(order[a.pos]==null?9:order[a.pos])-(order[b.pos]==null?9:order[b.pos]));
  return `<div class="rttitle">${side==='r'?'⭐ ':''}${esc(team)} <i class="muted2">${side==='r'?'(ditt lag)':''}</i></div>`+rows.map(p=>{
    const r=map[p.name]; if(r==null) return "";
    const cls=r>=7.5?'rg':(r<5.5?'rr':'');
    return `<div class="rtrow"><span class="rtn">${esc(p.name)} <i class="muted2">${p.pos||''}</i></span><span class="rtv ${cls}">${r.toFixed(1).replace('.',',')}</span></div>`;
  }).join("");
}
function updateRatingsPanel(){
  const L=LIVE; if(!L) return; const elL=$("lvRatL"), elR=$("lvRatR"); if(!elL||!elR) return;
  const userIsHomeSide = L.userTeamName===L.home;
  const userTeam=userIsHomeSide?L.home:L.away, userPitchArr=userIsHomeSide?L.onH:L.onA, userMap=userIsHomeSide?L.ratH:L.ratA;
  const oppTeam=userIsHomeSide?L.away:L.home, oppPitchArr=userIsHomeSide?L.onA:L.onH, oppMap=userIsHomeSide?L.ratA:L.ratH;
  elR.innerHTML=ratingPanelHTML(userTeam, userPitchArr, userMap, 'r'); // ditt lag = høyre
  elL.innerHTML=ratingPanelHTML(oppTeam, oppPitchArr, oppMap, 'l'); // motstander = venstre
}
function applyFinalRatings(){
  const L=LIVE; if(!L.ratH||!L.ratA) return;
  const [hg,ag]=L.shownScore;
  const finalize=(on,map,gf,gc)=>{
    const delta = gf>gc?0.4 : (gf<gc?-0.4 : 0.1); // seier løfter, tap senker
    for(const p of on) rtAdj(map, p.name, delta);
    const gk=keeperOf(on);
    if(gc===0){ if(gk) rtAdj(map, gk.name,0.6); for(const p of on) if(p.pos==="FOR") rtAdj(map, p.name,0.3); } // clean sheet
    else if(gc>=3){ if(gk) rtAdj(map, gk.name,-0.5); }
  };
  finalize(L.onH, L.ratH, hg, ag);
  finalize(L.onA, L.ratA, ag, hg);
}
function restartTimer(){ const L=LIVE; if(L.varActive||L.shotActive||L.pdecActive) return; if(L.timer) clearInterval(L.timer); if(L.clock<L.fullTime) L.timer=setInterval(liveTick, L.speed); }
function skipToEnd(){ const L=LIVE; if(L.timer){clearInterval(L.timer);L.timer=null;}
  if(L.varActive) resolveVar(true); // avgjør en pågående VAR med en gang
  if(L.shotActive){ L.shotActive=false; if(L.shotPending){ autoShot(L.shotPending.c, L.shotPending.e); L.shotPending=null; } }
  if(L.pdecActive){ L.pdecActive=false; L.pdecPending=null; }
  L.skipping=true;
  while(L.clock<L.fullTime){ L.clock++; revealMinute(L.clock); maybeIncident(L.clock); tickRatings(); }
  L.skipping=false;
  if($("lvClock")) $("lvClock").textContent=clockText(L);
  if($("lvH")) $("lvH").textContent=L.shownScore[0]; if($("lvA")) $("lvA").textContent=L.shownScore[1];
  endLive();
}
function endLive(){
  const L=LIVE; if(L.ended) return; L.ended=true;
  if(L.varTimer){ clearTimeout(L.varTimer); L.varTimer=null; } L.varActive=false;
  // slitasje: spillere som spilte mister form (de som spilte hele = mest)
  if(L.userStart && L.ctx.type!=="pmatch" && L.ctx.type!=="youth"){
    const stillOn=new Set((userPitch()||[]).map(p=>p.name));
    for(const nm of L.userStart){ if(L.incidents&&L.incidents[nm]) continue; const sp=squadByName(nm); if(!sp) continue;
      sp.fit=Math.max(5,(sp.fit==null?100:sp.fit)-(stillOn.has(nm)?26+((Math.random()*10)|0):14)); }
  }
  const [hg,ag]=L.shownScore;
  if(L.ctx.type!=="youth"){ const gkH=keeperOf(L.onH), gkA=keeperOf(L.onA);
    if(gkH) recStat(gkH.name,L.home,"saves",poisson(1.6+ag));
    if(gkA) recStat(gkA.name,L.away,"saves",poisson(1.6+hg)); }
  applyFinalRatings(); updateRatingsPanel();
  liveFeed(`⏱ <b>Full tid:</b> ${esc(L.home)} ${hg} – ${ag} ${esc(L.away)}`,"div ft2");
  const c=$("lvCtrl"); if(c){ c.innerHTML=`<button class="btn big primary" id="lvDone">Fortsett ▶</button>`; $("lvDone").onclick=finishLive; }
}
/* ---- live-kontroller (fart, hopp, auto-bytte, manuelt bytte) ---- */
function liveControlsHTML(){
  const L=LIVE, userInv=(L.userIsHome||L.userIsAway) && L.ctx.type!=="pmatch"; // spilleren styrer ikke bytter
  return `<button class="btn small spd ${L.speed===1000?'on':''}" data-spd="1000">1×</button>
    <button class="btn small spd ${L.speed===200?'on':''}" data-spd="200">5×</button>
    <button class="btn small spd ${L.speed===100?'on':''}" data-spd="100">10×</button>
    <button class="btn small" id="lvSkip">Hopp til slutt ⏭</button>
    ${userInv?`<button class="btn small" id="lvAuto">Auto-bytte: ${S.autoSub?'PÅ':'AV'}</button>`:""}
    ${userInv&&!S.autoSub?`<button class="btn small" id="lvSub">Bytte (${L.subsLeft})</button>`:""}`;
}
function wireLiveControls(){
  document.querySelectorAll(".spd").forEach(b=>b.onclick=()=>{ LIVE.speed=+b.dataset.spd;
    if(S){ S.settings=S.settings||{}; S.settings.matchSpeed=LIVE.speed; } // farten huskes til neste kamp
    try{ const g=gsetGlobal(); g.matchSpeed=LIVE.speed; localStorage.setItem(GSET_KEY,JSON.stringify(g)); }catch(e){}
    document.querySelectorAll(".spd").forEach(x=>x.classList.toggle("on",x===b)); restartTimer(); });
  if($("lvSkip")) $("lvSkip").onclick=skipToEnd;
  if($("lvAuto")) $("lvAuto").onclick=()=>{ S.autoSub=!S.autoSub; redrawControls(); };
  if($("lvSub")) $("lvSub").onclick=openSubUI;
}
function redrawControls(){ const c=$("lvCtrl"); if(c){ c.innerHTML=liveControlsHTML(); wireLiveControls(); } }
function openSubUI(){
  const L=LIVE; if(L.timer){clearInterval(L.timer);L.timer=null;} // klokka venter mens du bytter
  drawSubUI();
}
// bytte-vinduet blir stående åpent så du kan bytte FLERE i samme runde (helt til du er ferdig)
function drawSubUI(){
  const L=LIVE, pitch=userPitch(), c=$("lvCtrl"); if(!c) return;
  const done=`<button class="btn small primary" id="subDone">Ferdig ▶</button>`;
  if(L.subsLeft<=0){ c.innerHTML=`<div class="subui"><span>Ingen bytter igjen (brukt 5/5).</span>${done}</div>`; $("subDone").onclick=()=>{ redrawControls(); restartTimer(); }; return; }
  if(!L.userBench.length){ c.innerHTML=`<div class="subui"><span>Benken er tom.</span>${done}</div>`; $("subDone").onclick=()=>{ redrawControls(); restartTimer(); }; return; }
  c.innerHTML=`<div class="subui"><span>Bytter igjen: <b>${L.subsLeft}</b></span>
    <span>Ut:</span><select id="subOff">${pitch.map(p=>`<option value="${esc(p.name)}">${esc(p.name)} (${p.pos} ${p.rating})</option>`).join("")}</select>
    <span>Inn:</span><select id="subOn">${L.userBench.map(p=>`<option value="${esc(p.name)}">${esc(p.name)} (${p.pos} ${p.rating})</option>`).join("")}</select>
    <button class="btn small primary" id="subDo">Bytt</button>${done}</div>`;
  $("subDone").onclick=()=>{ redrawControls(); restartTimer(); };
  $("subDo").onclick=()=>{ const off=$("subOff").value, on=$("subOn").value;
    if(on && applySub(off,on)) liveFeed(`🔄 <b>${L.clock}'</b> ${esc(on)} inn for ${esc(off)} — <span class="ft">${esc(S.userTeam)}</span>`,"sub");
    drawSubUI(); }; // bli stående åpen for nye bytter
}
function finishLive(){
  const L=LIVE, [hg,ag]=L.shownScore;
  if(L.ctx.type==="league"){
    S.results.push({round:S.round,home:L.home,away:L.away,hg,ag});
    S.results.push(...L.ctx.others);
    S.last=[{home:L.home,away:L.away,hg,ag}, ...L.ctx.others];
    S.round++; LIVE=null;
    S.screen = S.round>=S.fixtures.length ? "seasonend" : "season";
  } else if(L.ctx.type==="youth"){
    S.youthResult={label:L.ctx.label, opp:L.away, hg, ag, evs:[], live:true};
    S.youthView=L.ctx.label; LIVE=null; S.screen="youth";
  } else if(L.ctx.type==="pmatch"){
    finishPlayerLiveMatch(L); return;
  } else { resolveCup(hg,ag); LIVE=null; }
  save(); render();
}
// hent spillerens bidrag fra live-kampen og oppdater karrieren
function finishPlayerLiveMatch(L){
  const p=S.player, [hg,ag]=L.shownScore;
  const st=(S.stats&&S.stats[statKey(p.name,S.userTeam)])||{goals:0,assists:0,saves:0,yellow:0,red:0};
  const mg=st.goals||0, ma=st.assists||0, ms=st.saves||0;
  p.apps++; p.seasonApps++; p.goals+=mg; p.assists+=ma; p.saves+=ms; p.seasonGoals+=mg; p.seasonAssists+=ma;
  p.yellows=(p.yellows||0)+(st.yellow||0); p.reds=(p.reds||0)+(st.red||0);
  S.clubGF=(S.clubGF||0)+hg; S.clubGA=(S.clubGA||0)+ag;
  if(hg>ag) S.clubW=(S.clubW||0)+1; else if(hg<ag) S.clubL=(S.clubL||0)+1; else S.clubD=(S.clubD||0)+1;
  const myRating=(L.userIsHome?L.ratH:L.ratA)[p.name];
  const motm = (myRating>=8)||(mg+ma)>=2; if(motm) p.motm++;
  S._pmatchResult={ result:`${L.home} ${hg}–${ag} ${L.away}`, mg, ma, ms, rating:myRating, motm, yc:st.yellow||0, rc:st.red||0 };
  S.matchNo++; LIVE=null; S.pmatch=null; S.squad=null; S.screen="pcareer"; save(); render();
}

/* ---------- NM ---------- */
function resolveCup(hg,ag){
  if(hg===ag){ S.shootout={us:0,them:0,ut:0,ot:0,log:[],hg,ag,decided:null}; S.screen="shootout"; return; }
  finalizeCupRound(hg>ag, hg, ag, false);
}
function finalizeCupRound(win, hg, ag, pens){
  S.cup.log.push({name:ROUND_NAMES[S.cup.roundIdx], opp:S.cup.opponent.name, hg, ag, win, pens});
  if(win){ S.cup.roundIdx++; if(S.cup.roundIdx>=ROUND_NAMES.length){ S.cup.won=true; S.cup.done=true; FLASH=`🏆 ${S.userTeam} vant NM-cupen!`; } else { S.cup.opponent=drawCupOpponent(S.cup.roundIdx); } }
  else { S.cup.alive=false; S.cup.done=true; }
  S.screen="season";
}
/* straffekonkurranse: best av 5, så sudden death */
function penResult(us,them,ut,ot){
  const uR=Math.max(0,5-ut), oR=Math.max(0,5-ot);
  if(ut<5||ot<5){ if(us>them+oR) return "user"; if(them>us+uR) return "opp"; return null; }
  if(ut===ot && us!==them) return us>them?"user":"opp";
  return null;
}
function takePenalty(takerName){
  const so=S.shootout; if(!so||so.decided) return;
  const taker=S.squad.find(p=>p.name===takerName);
  const uC=clamp(0.58+((taker?taker.rating:55)-50)*0.006, 0.5, 0.93);
  const uScored=Math.random()<uC; if(uScored)so.us++; so.ut++; so.log.push({side:"user",name:takerName,scored:uScored});
  let res=penResult(so.us,so.them,so.ut,so.ot);
  if(!res){
    const oR=bestXIavg(squadFor(S.cup.opponent.name,S.cup.opponent.divIndex));
    const oScored=Math.random()<clamp(0.58+(oR-50)*0.006,0.5,0.9); if(oScored)so.them++; so.ot++;
    so.log.push({side:"opp",name:S.cup.opponent.name,scored:oScored});
    res=penResult(so.us,so.them,so.ut,so.ot);
  }
  if(res) so.decided=res;
  save(); render();
}
function finishShootout(){ const so=S.shootout; finalizeCupRound(so.decided==="user", so.hg, so.ag, true); S.shootout=null; save(); render(); }
function playCupLive(){ if(!S.cup.alive||S.cup.done) return; beginLive(S.userTeam, S.cup.opponent.name, S.divIndex, S.cup.opponent.divIndex, {type:"cup"}); }
function playCupInstant(){ if(!S.cup.alive||S.cup.done) return; const o=S.cup.opponent; const [hg,ag]=matchGoals(S.userTeam,o.name,S.divIndex,o.divIndex); recordInstantMatch(S.userTeam,o.name,hg,ag,S.divIndex,o.divIndex); resolveCup(hg,ag); save(); render(); }

/* =====================================================================
   RENDERING
   ===================================================================== */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const $=id=>document.getElementById(id);
const kr=n=> (n>=1e6 ? (n/1e6).toFixed(n>=1e7?0:1).replace(".",",")+" mill" : Math.round(n).toLocaleString("no-NO")) + " kr";
function flashBar(){ if(!FLASH) return ""; const h=`<div class="flash">${esc(FLASH)}</div>`; FLASH=""; return h; }
function lineupSummary(){ const valid=S.lineup && S.lineup.map(squadByName).filter(Boolean).length===11;
  if(valid && S.formation && FORMATIONS[S.formation]) return S.formation;
  const c={MV:0,FOR:0,MID:0,ANG:0}; userXI().forEach(p=>c[p.pos]++);
  return `${c.FOR}-${c.MID}-${c.ANG}${valid?'':' (auto)'}`; }

function render(){
  const app=$("app");
  if(!S){ renderSetup(app); return; }
  switch(S.screen){
    case "live": renderLive(); break;
    case "browse": renderBrowse(app); break;
    case "guide": renderGuide(app); break;
    case "casino": renderCasino(app); break;
    case "settings": renderSettings(app); break;
    case "seasonend": renderSeasonEnd(app); break;
    case "squad": renderSquad(app); break;
    case "lineup": renderLineup(app); break;
    case "transfer": renderTransfer(app); break;
    case "stats": renderStats(app); break;
    case "scout": renderScout(app); break;
    case "youth": renderYouth(app); break;
    case "youthPlayer": renderYouthPlayer(app); break;
    case "playerDetail": renderPlayerDetail(app); break;
    case "shootout": renderShootout(app); break;
    case "managerRetire": renderManagerRetire(app); break;
    case "sacked": renderSacked(app); break;
    case "pcareer": renderPlayerCareer(app); break;
    case "pmatch": renderPlayerMatch(app); break;
    case "pretire": renderPlayerRetire(app); break;
    case "ptable": renderPlayerTable(app); break;
    case "pcoach": renderPlayerCoach(app); break;
    case "ptransfer": renderPlayerTransfer(app); break;
    case "phistory": renderPlayerHistory(app); break;
    default: renderSeason(app);
  }
}

/* ---------- Oppsett ---------- */
function renderSetup(app){
  const saves=listSaves();
  app.innerHTML=`
    <div class="card setup">
      <h1>⚽ Norsk Tippeliga <span class="yr">2026</span></h1>
      <p class="sub">Bli manager. Velg klubb fra hele Norge – Eliteserien til 7. divisjon.</p>
      ${saves.length?`<h4>Lagrede spill</h4><div class="saveslist">${saves.slice().reverse().map(s=>`<div class="saverow"><button class="btn saveload" data-id="${s.id}">▶ ${esc(s.manager)} – ${esc(s.team)} <span class="muted2">${esc(s.div)}, sesong ${s.season}${s.cheated?' · 🎮 jukset':''}</span></button><button class="btn small savedel" data-id="${s.id}" title="Slett">✕</button></div>`).join("")}</div><div class="or">– eller start ny karriere –</div>`:""}
      <label>Manager-navn</label><input id="mgr" placeholder="Skriv navnet ditt"/>
      <label>Divisjon</label><select id="div"></select>
      <label>Avdeling</label><select id="grp"></select>
      <label>Lag</label><select id="team"></select>
      <div class="searchwrap"><input id="search" placeholder="🔎 Søk etter lag i hele Norge…"/><div id="results" class="results"></div></div>
      <button id="start" class="btn big primary">Start karriere</button>
      <div class="or">– eller –</div>
      <button id="toggleCustom" class="btn link">🛠️ Lag din egen klubb</button>
      <div id="customBox" class="custombox" style="display:none">
        <label>Klubbnavn</label><input id="cName" placeholder="F.eks. Pol United"/>
        <label>Divisjon</label><select id="cDiv"></select>
        <label>Avdeling</label><select id="cGrp"></select>
        <label>Spillere – én per linje (keeper og forsvar øverst, så midt/angrep)</label>
        <textarea id="cPlayers" rows="6" placeholder="Ola Hansen&#10;Per Olsen&#10;Lars Berg&#10;…"></textarea>
        <p class="muted2">Skriv inn de du vil ha selv. Resten fyller spillet ut automatisk (~18 totalt). Du havner i divisjonen og avdelingen du velger.</p>
        <button id="startCustom" class="btn big primary">Start med egen klubb ▶</button>
      </div>
      <div class="or">– eller –</div>
      <button id="togglePlayer" class="btn link">🎮 Spillerkarriere (bli én spiller)</button>
      <div id="playerBox" class="custombox" style="display:none">
        <label>Spillernavn</label><input id="pName" placeholder="F.eks. Ola Larsen"/>
        <label>Posisjon</label><select id="pPos">${POSORDER.map(p=>`<option value="${p}">${POSNAME[p]}</option>`).join("")}</select>
        <label>Alder (6–45)</label><input id="pAge" type="number" min="6" max="45" value="17"/>
        <label>Divisjon</label><select id="pDiv"></select>
        <label>Avdeling</label><select id="pGrp"></select>
        <label>Klubb</label><select id="pClub"></select>
        <p class="muted2">Du blir én enkelt spiller. I hver kamp velger du hva du gjør (skyte, pasning, dribling, takling …) og bygger din egen statistikk.</p>
        <button id="startPlayer" class="btn big primary">Start spillerkarriere ▶</button>
      </div>
      <button id="browseFromSetup" class="btn link">Se alle lag og divisjoner</button>
      <button id="guideFromSetup" class="btn link">📖 Slik spiller du – guide</button>
    </div>`;
  const divSel=$("div"), grpSel=$("grp"), teamSel=$("team");
  DIVISIONS.forEach((d,i)=>divSel.add(new Option(d.name,i)));
  function fillGroups(){ grpSel.innerHTML=""; DIVISIONS[+divSel.value].groups.forEach((g,i)=>grpSel.add(new Option(g.name||"Serien",i))); fillTeams(); }
  function fillTeams(){ teamSel.innerHTML=""; DIVISIONS[+divSel.value].groups[+grpSel.value].teams.forEach(t=>teamSel.add(new Option(t,t))); }
  divSel.onchange=fillGroups; grpSel.onchange=fillTeams; fillGroups();
  $("search").oninput=e=>{ const q=e.target.value.trim().toLowerCase(); const box=$("results"); box.innerHTML=""; if(q.length<2) return;
    const hits=[]; DIVISIONS.forEach((d,di)=>d.groups.forEach((g,gi)=>g.teams.forEach(t=>{ if(t.toLowerCase().includes(q)) hits.push({t,di,gi,d:d.name,g:g.name}); })));
    hits.slice(0,40).forEach(h=>{ const b=document.createElement("button"); b.className="hit";
      b.innerHTML=`<b>${esc(h.t)}</b> <span>${esc(h.d)}${h.g?" · "+esc(h.g):""}</span>`;
      b.onclick=()=>{ divSel.value=h.di; fillGroups(); grpSel.value=h.gi; fillTeams(); teamSel.value=h.t; box.innerHTML=""; e.target.value=h.t; }; box.appendChild(b); }); };
  $("start").onclick=()=>{ newCareer($("mgr").value.trim()||"Manager", +divSel.value, +grpSel.value, teamSel.value); render(); };
  // --- egen klubb ---
  const cDiv=$("cDiv"), cGrp=$("cGrp");
  DIVISIONS.forEach((d,i)=>cDiv.add(new Option(d.name,i)));
  function cFillGroups(){ cGrp.innerHTML=""; DIVISIONS[+cDiv.value].groups.forEach((g,i)=>cGrp.add(new Option(g.name||"Serien",i))); }
  cDiv.onchange=cFillGroups; cFillGroups();
  $("toggleCustom").onclick=()=>{ const b=$("customBox"); b.style.display = b.style.display==="none"?"block":"none"; };
  $("startCustom").onclick=()=>{
    const name=$("cName").value.trim(); if(!name){ $("cName").focus(); return; }
    const names=$("cPlayers").value.split(/\n+/).map(s=>s.trim()).filter(Boolean);
    newCustomCareer($("mgr").value.trim()||"Manager", +cDiv.value, +cGrp.value, name, names); render();
  };
  // --- spillerkarriere ---
  const pDiv=$("pDiv"), pGrp=$("pGrp"), pClub=$("pClub");
  DIVISIONS.forEach((d,i)=>pDiv.add(new Option(d.name,i)));
  function pFillG(){ pGrp.innerHTML=""; DIVISIONS[+pDiv.value].groups.forEach((g,i)=>pGrp.add(new Option(g.name||"Serien",i))); pFillT(); }
  function pFillT(){ pClub.innerHTML=""; DIVISIONS[+pDiv.value].groups[+pGrp.value].teams.forEach(t=>pClub.add(new Option(t,t))); }
  pDiv.onchange=pFillG; pGrp.onchange=pFillT; pFillG();
  $("togglePlayer").onclick=()=>{ const b=$("playerBox"); b.style.display = b.style.display==="none"?"block":"none"; };
  $("startPlayer").onclick=()=>{
    const name=$("pName").value.trim(); if(!name){ $("pName").focus(); return; }
    const age=Math.max(6,Math.min(45,parseInt($("pAge").value,10)||17));
    newPlayerCareer(name, $("pPos").value, age, +pDiv.value, +pGrp.value, pClub.value); render();
  };
  document.querySelectorAll(".saveload").forEach(b=>b.onclick=()=>loadSave(+b.dataset.id));
  document.querySelectorAll(".savedel").forEach(b=>b.onclick=()=>{ if(confirm("Slette denne lagringen?")) deleteSave(+b.dataset.id); });
  $("browseFromSetup").onclick=()=>{ S={screen:"browse", _setup:true}; render(); };
  $("guideFromSetup").onclick=()=>{ S={screen:"guide", _setup:true}; render(); };
}

/* ---------- Spillerkarriere: bli ÉN spiller (velg navn, alder 6–45, ta valg i kampene) ---------- */
function newPlayerCareer(name, pos, age, divIndex, groupIndex, club){
  S={ playerMode:true, manager:name, season:2026, userTeam:club, divIndex, groupIndex, seasonsManaged:0,
      player:{ name, pos, age:Math.max(6,Math.min(45,age|0)), club, goals:0, assists:0, apps:0, saves:0, motm:0,
               seasonGoals:0, seasonAssists:0, seasonApps:0 },
      matchNo:0, totalMatches:18, clubW:0, clubD:0, clubL:0, clubGF:0, clubGA:0, _id:nextSaveId(), screen:"pcareer" };
  ensureDivTeams(); save();
}
function pcOpponent(){ const t=curTeams(S.divIndex,S.groupIndex).filter(x=>x!==S.userTeam); return t.length?t[(Math.random()*t.length)|0]:"Motstander"; }
function pcActions(pos){
  if(pos==="MV") return [["dive","🧤 Kast deg"],["stay","🧍 Bli stående"],["rush","🏃 Rush ut"]];
  if(pos==="FOR") return [["tackle","🦵 Takling"],["clear","🛡️ Klarering"],["build","🎯 Spill opp"]];
  return [["shoot","⚽ Skyt"],["pass","🤝 Pasning"],["dribble","💨 Dribble"]];
}
const PC_SIT={
  ANG:["Ballen ruller mot deg i feltet.","Du er fri på kanten med fart.","En retur spretter ut til deg.","Du får ballen med ryggen mot mål.","Et innlegg er på vei mot deg foran mål."],
  MID:["Du vinner ballen på midten.","Rom åpner seg foran deg.","Du får ballen 20 meter fra mål.","En medspiller spiller deg fri.","Du driver ballen mot feltet."],
  FOR:["Motstanderens spiss er på vei mot deg.","Et innlegg kommer inn i feltet.","Du presses av en angriper.","Ballen er løs i ditt felt.","Du må stoppe en kontring."],
  MV:["Motstanderen bryter gjennom alene!","Et hardt skudd kommer mot mål.","Et innlegg svever inn i feltet.","En spiss er fri foran deg.","Skudd fra distanse på vei."]
};
function pcRnd(a){ return a[(Math.random()*a.length)|0]; }
// bygg en kampsekvens med blandede hendelser: vanlige sjanser + straffe/frispark/dommer
function pcStepUI(type, pos){
  if(type==='penalty') return pos==='MV'
    ? {prompt:"⚽ Motstanderen har straffe – kast deg!", acts:[["save_l","↖️ Venstre"],["save_m","⬆️ Midten"],["save_r","↗️ Høyre"]]}
    : {prompt:"⚽ STRAFFE til laget ditt! Hvor skyter du?", acts:[["pen_corner","🎯 Hjørnet"],["pen_mid","⬆️ Midt i mål"],["pen_panenka","🥄 Panenka"]]};
  if(type==='freekick') return pos==='MV'
    ? {prompt:"🎯 Farlig frispark mot mål – klar i buret!", acts:[["save_l","↖️ Venstre"],["save_r","↗️ Høyre"],["stay","🧍 Bli stående"]]}
    : {prompt:"🎯 Frispark i god posisjon!", acts:[["fk_shoot","⚽ Skyt på mål"],["fk_cross","🎯 Legg inn i feltet"]]};
  if(type==='ref') return {prompt:"🟨 Hard duell – dommeren kommer mot deg! Hva sier du?", acts:[["sorry","🙏 Beklager, dommer"],["ball","😐 Jeg spilte ballen!"],["argue","😡 Helt feil, dommer!"]]};
  return {prompt:pcRnd(PC_SIT[pos]||PC_SIT.MID)+" Hva gjør du?", acts:pcActions(pos)};
}
// din spiller-rating i kampene (stiger med karrieren, prime-alder gir mer)
function pcMyRating(){ const p=S.player; const prime = p.age>=20&&p.age<=31?6:(p.age<17||p.age>37?-6:0); return clamp(54+prime+Math.min(14,(p.goals+p.assists)/4),35,92); }
function startPlayerMatch(){ if(S.matchNo>=S.totalMatches) return; S._lastSeasonMove=null; S._pmatchResult=null;
  const p=S.player, club=S.userTeam, di=S.divIndex;
  // bygg en ekte tropp for klubben din med DEG i – så manager-mode-motoren kan simulere kampen
  const sq=squadFor(club,di).map(x=>({...x}));
  const myP={ name:p.name, pos:p.pos, rating:pcMyRating(), age:p.age, value:0, real:false, me:true };
  let idx=sq.findIndex(x=>x.pos===p.pos); if(idx<0) idx=sq.length, sq.push(myP); else sq[idx]=myP;
  S.squad=sq;
  let xi=bestXI(sq);
  if(!xi.some(x=>x.me)){ // tving DEG inn i startelleveren
    let oi=xi.findIndex(x=>x.pos===p.pos && !x.me);
    if(oi<0) oi=xi.map((x,i)=>[x,i]).filter(([x])=>x.pos!=="MV").sort((a,b)=>a[0].rating-b[0].rating)[0][1];
    if(oi>=0) xi[oi]=myP;
  }
  S.lineup=xi.map(x=>x.name); S.tactic=S.tactic||"Balansert"; S.autoSub=false;
  S.stats={}; // bare denne kampens statistikk teller for spilleren
  const opp=pcOpponent();
  beginLive(club, opp, di, di, {type:"pmatch", opp});
}
function doPlayerAction(action){
  const M=S.pmatch, p=S.player; if(!M||M.done) return;
  const type=M.events[M.idx]||'chance', r=Math.random(); let txt="", dr=0, ended=false;
  if(type==='penalty' && p.pos!=='MV'){
    const ch = action==='pen_corner'?0.72 : action==='pen_mid'?0.55 : 0.5;
    if(r<ch){ M.myGoals++; M.teamScore++; dr=1.3; txt= action==='pen_panenka'?"🥄 Panenka! Iskaldt – STRAFFEMÅL!":"⚽ STRAFFEMÅL! Du setter den sikkert."; }
    else { dr=-0.4; txt="🧤 Keeper redder straffen din!"; }
  } else if(type==='penalty' && p.pos==='MV'){
    if(r<0.45){ M.mySaves++; dr=0.9; txt="🧤 STRAFFEREDNING! Du stuper riktig vei!"; } else { M.oppScore++; dr=-0.4; txt="⚽ Straffen går i mål bak deg."; }
  } else if(type==='freekick' && p.pos!=='MV'){
    if(action==='fk_shoot'){ if(r<0.3){ M.myGoals++; M.teamScore++; dr=1.2; txt="⚽ FRISPARKMÅL – rett i krysset!"; } else { dr=-0.1; txt="Frisparket går like over."; } }
    else { if(r<0.4){ M.myAssists++; M.teamScore++; dr=0.8; txt="🎯 Perfekt innlegg – mål! Assist til deg!"; } else { dr=0; txt="Innlegget ble klarert unna."; } }
  } else if(type==='freekick' && p.pos==='MV'){
    if(r<0.5){ M.mySaves++; dr=0.5; txt="🧤 Du bokser unna frisparket!"; } else { M.oppScore++; dr=-0.4; txt="⚽ Frisparket smyger seg i mål."; }
  } else if(type==='ref'){
    let card = action==='sorry' ? (r<0.7?0:1) : action==='ball' ? (r<0.5?0:(r<0.95?1:2)) : (r<0.3?0:(r<0.7?1:2));
    if(card===0){ dr=0.05; txt="Dommeren lar det gå – ingen kort. 😅"; }
    else if(card===1){ M.yc++; dr=-0.3; txt="🟨 Gult kort!"; if(M.yc>=2){ M.rc=1; M.sentOff=true; dr-=0.7; txt="🟨🟥 Andre gule – du er UTVIST!"; ended=true; } }
    else { M.rc=1; M.sentOff=true; dr=-1.2; txt="🟥 RØDT KORT! Du er utvist!"; ended=true; }
  } else if(p.pos==="MV"){
    const ok=(action==="dive"&&r<0.55)||(action==="rush"&&r<0.45)||(action==="stay"&&r<0.5);
    if(ok){ M.mySaves++; dr=0.4; txt=pcRnd(["💪 Flott redning!","🧤 Du kaster deg og redder!","Du holder buret rent her!"]); }
    else { M.oppScore++; dr=-0.5; txt=pcRnd(["⚽ Du nådde den ikke – baklengs.","Ballen suser i mål bak deg.","For seint ute – mål til motstanderen."]); }
  } else if(p.pos==="FOR"){
    if(action==="tackle"){ if(r<0.6){ dr=0.3; txt="🦵 Ren takling – ballen er din!"; } else if(r<0.78){ M.oppScore++; dr=-0.5; txt="Du bommer på taklingen – mål til motstanderen!"; } else { dr=-0.15; txt="Du kommer litt seint, men det går bra."; } }
    else if(action==="clear"){ dr=0.15; txt="🛡️ Trygg klarering, faren er ryddet unna."; }
    else { if(r<0.45){ M.myAssists++; M.teamScore++; dr=0.6; txt="🎯 Nydelig oppspill – og laget scorer! Assist til deg!"; } else { dr=-0.2; txt="Oppspillet ble snappet opp."; } }
  } else {
    if(action==="shoot"){ if(r<0.38){ M.myGoals++; M.teamScore++; dr=1.2; txt=pcRnd(["⚽ MÅÅÅL! Du setter den i hjørnet!","Du curler den i krysset – scoring!","Iskaldt avsluttet – mål!"]); } else if(r<0.68){ dr=-0.1; txt="🧤 Keeper redder skuddet ditt."; } else { dr=-0.15; txt="Skuddet går like utenfor."; } }
    else if(action==="pass"){ if(r<0.45){ M.myAssists++; M.teamScore++; dr=0.8; txt="🤝 Perfekt pasning – medspiller scorer! Assist!"; } else { dr=0; txt="Pasningen kommer fram, men det blir ikke mål."; } }
    else { if(r<0.3){ M.myGoals++; M.teamScore++; dr=1.0; txt="💨 Du dribler av keeper og scorer!"; } else if(r<0.6){ dr=0.4; txt="💨 Du dribler deg forbi en mann – godt jobba."; } else { dr=-0.3; txt="Du mister ballen i driblingen."; } }
  }
  M.rating=clamp(M.rating+dr,3,10);
  if(Math.random()<0.20) M.oppScore++;     // motstanderen kan score uavhengig
  if(Math.random()<0.12) M.teamScore++;    // medspiller scorer uavhengig
  M.log.push(txt); M.idx++;
  if(ended || M.idx>=M.n) finishPlayerMatch(); else { save(); render(); }
}
function finishPlayerMatch(){
  const M=S.pmatch, p=S.player;
  p.apps++; p.seasonApps++; p.goals+=M.myGoals; p.assists+=M.myAssists; p.saves+=M.mySaves;
  p.seasonGoals+=M.myGoals; p.seasonAssists+=M.myAssists;
  p.yellows=(p.yellows||0)+M.yc; p.reds=(p.reds||0)+(M.rc||0);
  // klubbens tabell-resultat denne sesongen
  S.clubGF=(S.clubGF||0)+M.teamScore; S.clubGA=(S.clubGA||0)+M.oppScore;
  if(M.teamScore>M.oppScore) S.clubW=(S.clubW||0)+1; else if(M.teamScore<M.oppScore) S.clubL=(S.clubL||0)+1; else S.clubD=(S.clubD||0)+1;
  const res = M.teamScore>M.oppScore?"seier":(M.teamScore<M.oppScore?"tap":"uavgjort");
  if(M.rating>=8 || (M.myGoals+M.myAssists)>=2){ p.motm++; M.motm=true; }
  M.done=true; M.result=`${S.userTeam} ${M.teamScore}–${M.oppScore} ${M.opp}`;
  S.matchNo++; save(); render();
}
// flytt spillerens klubb til en annen divisjon (1-for-1-bytte, beholder størrelser)
function pcMoveClub(newDiv){
  ensureDivTeams(); const loc=findTeamLocation(S.userTeam), narr=S.divTeams[newDiv][0];
  if(loc){ const arr=S.divTeams[loc.di][loc.gi], i=arr.indexOf(S.userTeam); const swap=narr[narr.length-1]; narr[narr.length-1]=S.userTeam; if(i>=0) arr[i]=swap; }
  else narr[narr.length-1]=S.userTeam;
  S.divIndex=newDiv; S.groupIndex=0;
}
function newPlayerSeason(){
  const p=S.player, d=DIVISIONS[S.divIndex];
  const table=pcDivTable(), pos=table.findIndex(r=>r.me)+1, n=table.length;
  let moved="";
  if(S.divIndex>0 && pos<=d.promote){ pcMoveClub(S.divIndex-1); moved=`⬆ OPPRYKK til ${DIVISIONS[S.divIndex].name}`; }
  else if(S.divIndex<DIVISIONS.length-1 && pos> n-d.relegate){ pcMoveClub(S.divIndex+1); moved=`⬇ NEDRYKK til ${DIVISIONS[S.divIndex].name}`; }
  if(!p.history) p.history=[];
  p.history.push({season:S.season, club:p.club, div:d.name, pos, apps:p.seasonApps, goals:p.seasonGoals, assists:p.seasonAssists});
  p.age++; S.season++; S.seasonsManaged++; p.seasonGoals=0; p.seasonAssists=0; p.seasonApps=0; S.matchNo=0; S.pmatch=null;
  S.clubW=0; S.clubD=0; S.clubL=0; S.clubGF=0; S.clubGA=0; S._lastSeasonMove=moved;
  S.screen = p.age>45 ? "pretire" : "pcareer"; save(); render();
}
function renderPlayerCareer(app){
  const p=S.player, d=DIVISIONS[S.divIndex];
  const over=S.matchNo>=S.totalMatches;
  let html=`<div class="topbar"><div><span class="club">${esc(p.name)}</span><span class="meta">${POSNAME[p.pos]} · ${p.age} år · ${esc(p.club)} · ${esc(d.name)} · Sesong ${S.season}</span></div><div class="actions"><button id="pcQuit" class="btn small">Avslutt</button></div></div>`;
  const pr=S._pmatchResult;
  html+=`<div class="card"><h3>🎮 Spillerkarriere</h3>
    ${S._lastSeasonMove?`<div class="endcard ${S._lastSeasonMove[0]==='⬆'?'promo':'releg'}" style="margin-bottom:10px"><h2>${esc(S._lastSeasonMove)}</h2></div>`:""}
    ${pr?`<div class="card" style="margin-bottom:10px;background:var(--panel2)"><b>Siste kamp:</b> ${esc(pr.result)}<br><span class="muted2">Din kamp: rating ${pr.rating?pr.rating.toFixed(1).replace('.',','):'–'} · ${pr.mg} mål · ${pr.ma} assist${S.player.pos==="MV"?` · ${pr.ms} redninger`:""}${pr.rc?' · 🟥 utvist':(pr.yc?` · 🟨${pr.yc}`:'')}${pr.motm?' · 🏅 Banens beste!':''}</span></div>`:""}
    <div class="pdgrid">
      <span>Klubb</span><span>${esc(p.club)} <span class="muted2">(${esc(d.name)})</span></span>
      <span>Sesong</span><span>${S.season} – kamp ${Math.min(S.matchNo+1,S.totalMatches)} av ${S.totalMatches}</span>
      <span>Kamper</span><span>${p.apps}</span>
      <span>Mål</span><span class="prt">${p.goals}</span>
      <span>Assist</span><span>${p.assists}</span>
      ${p.pos==="MV"?`<span>Redninger</span><span>${p.saves}</span>`:""}
      <span>Kort</span><span>🟨 ${p.yellows||0} · 🟥 ${p.reds||0}</span>
      <span>Banens beste</span><span>${p.motm}</span>
      <span>Denne sesongen</span><span>${p.seasonGoals} mål · ${p.seasonAssists} assist · ${p.seasonApps} kamper</span>
    </div>
    <div class="lineupbtns" style="margin-top:12px">${over?`<button id="pcSeason" class="btn big primary">Fullfør sesongen ▶</button>`:`<button id="pcPlay" class="btn big primary">Spill neste kamp ▶</button>`}</div>
    <div class="lineupbtns" style="margin-top:8px">
      <button id="pcTable" class="btn small">📊 Tabell</button>
      <button id="pcCoach" class="btn small">💬 Spør treneren</button>
      <button id="pcTrans" class="btn small">🔁 Overgang</button>
      <button id="pcHist" class="btn small">📜 Historikk</button>
    </div></div>`;
  app.innerHTML=html;
  if($("pcPlay")) $("pcPlay").onclick=()=>{ startPlayerMatch(); };
  if($("pcSeason")) $("pcSeason").onclick=()=>newPlayerSeason();
  if($("pcTable")) $("pcTable").onclick=()=>{ S.screen="ptable"; render(); };
  if($("pcCoach")) $("pcCoach").onclick=()=>{ S._coachQ=null; S._coachA=null; S.screen="pcoach"; render(); };
  if($("pcTrans")) $("pcTrans").onclick=()=>{ S._pOffers=null; S.screen="ptransfer"; render(); };
  if($("pcHist")) $("pcHist").onclick=()=>{ S.screen="phistory"; render(); };
  if($("pcQuit")) $("pcQuit").onclick=()=>{ if(confirm("Avslutte spillerkarrieren? (lagringen beholdes)")){ S=null; render(); } };
}
function renderPlayerMatch(app){
  const M=S.pmatch, p=S.player; if(!M){ S.screen="pcareer"; render(); return; }
  let html=`<div class="card live"><div class="lvtop">Spillerkarriere – ${esc(p.name)} (${POSNAME[p.pos]})</div>
    <div class="lvteams"><span class="lvname me">${esc(S.userTeam)}</span><span class="lvscore"><b>${M.teamScore}</b><i>-</i><b>${M.oppScore}</b></span><span class="lvname">${esc(M.opp)}</span></div>
    <div class="lvclock">Din rating: <b>${M.rating.toFixed(1).replace('.',',')}</b> · ⚽ ${M.myGoals} · 🤝 ${M.myAssists}${p.pos==="MV"?` · 🧤 ${M.mySaves}`:""}${M.yc?` · 🟨${M.yc}`:""}${M.rc?` · 🟥`:""}</div>
    <div class="lvfeed" style="height:auto;min-height:120px;max-height:260px">${M.log.map(t=>`<div class="fl">${t}</div>`).join("")||'<p class="muted2">Kampen er i gang…</p>'}</div>`;
  if(!M.done){
    if(M._uiIdx!==M.idx){ M._ui=pcStepUI(M.events[M.idx]||'chance', p.pos); M._uiIdx=M.idx; }
    html+=`<div class="pcsit"><b>Hendelse ${M.idx+1} av ${M.n}:</b> ${M._ui.prompt}</div>
      <div class="lvctrl">${M._ui.acts.map(([a,l])=>`<button class="btn primary pcact" data-a="${a}">${l}</button>`).join("")}</div>`;
  } else {
    html+=`<div class="endcard ${M.teamScore>M.oppScore?'gold':(M.teamScore<M.oppScore?'releg':'')}" style="margin-top:10px"><h2>${esc(M.result)}</h2>
      <p>Din kamp: rating <b>${M.rating.toFixed(1).replace('.',',')}</b> · ${M.myGoals} mål · ${M.myAssists} assist${p.pos==="MV"?` · ${M.mySaves} redninger`:""}${M.yc?` · 🟨${M.yc}`:""}${M.rc?` · 🟥 utvist`:""}${M.motm?' · 🏅 Banens beste!':''}</p>
      <button id="pcBack" class="btn big primary">Tilbake ▶</button></div>`;
  }
  html+=`</div>`; app.innerHTML=html;
  document.querySelectorAll(".pcact").forEach(b=>b.onclick=()=>doPlayerAction(b.dataset.a));
  if($("pcBack")) $("pcBack").onclick=()=>{ S.pmatch=null; S.screen="pcareer"; render(); };
}
function renderPlayerRetire(app){
  const p=S.player;
  app.innerHTML=`<div class="card setup"><h1>🎖️ Karrieren er over</h1>
    <p class="sub">${esc(p.name)} legger opp etter en lang karriere: <b>${p.apps}</b> kamper, <b>${p.goals}</b> mål, <b>${p.assists}</b> assist${p.pos==="MV"?`, ${p.saves} redninger`:""} – og ${p.motm} ganger banens beste. 🐐</p>
    <button id="prDone" class="btn big primary">Tilbake til start ▶</button></div>`;
  $("prDone").onclick=()=>{ S=null; render(); };
}
function renderPlayerHistory(app){
  const p=S.player, h=p.history||[];
  let html=`<div class="topbar"><div><span class="club">📜 Historikk</span><span class="meta">${esc(p.name)} · totalt ${p.goals} mål · ${p.assists} assist</span></div><div class="actions"><button id="pcBack2" class="btn small">Tilbake</button></div></div>`;
  html+=`<div class="card"><h3>Sesong for sesong</h3>`;
  if(!h.length) html+=`<p class="muted2">Ingen fullførte sesonger ennå. Fullfør en sesong, så vises mål og assist her.</p>`;
  else { html+=`<table class="ltable"><thead><tr><th>Sesong</th><th>Klubb</th><th>Divisjon</th><th>Plass</th><th>K</th><th>Mål</th><th>Assist</th></tr></thead><tbody>`;
    h.slice().reverse().forEach(s=>{ html+=`<tr><td>${s.season}</td><td>${esc(s.club)}</td><td>${esc(s.div)}</td><td>${s.pos}.</td><td>${s.apps}</td><td><b>${s.goals}</b></td><td>${s.assists}</td></tr>`; });
    html+=`</tbody></table>`; }
  // pågående sesong
  html+=`<p class="muted2" style="margin-top:8px">Inneværende sesong (${S.season}): ${p.seasonGoals} mål · ${p.seasonAssists} assist · ${p.seasonApps} kamper</p></div>`;
  app.innerHTML=html;
  $("pcBack2").onclick=()=>{ S.screen="pcareer"; render(); };
}
// tabell for spillerens divisjon: din klubb med faktisk rekord, resten ut fra styrke
function pcDivTable(){
  const di=S.divIndex, gi=S.groupIndex, base=BASE[Math.min(DIVISIONS[di].level-1,BASE.length-1)], mp=S.matchNo;
  const rows=curTeams(di,gi).map(t=>{
    if(t===S.userTeam){ const w=S.clubW||0,dd=S.clubD||0,l=S.clubL||0; return {team:t,k:w+dd+l,v:w,u:dd,t:l,gf:S.clubGF||0,ga:S.clubGA||0,p:w*3+dd,me:true}; }
    const noise=(hash(t+S.season)%7)-3, ppm=clamp(1.1+(strength(t,di)-base)*0.05+noise*0.04,0.3,2.6);
    const pts=Math.round(ppm*mp), w=Math.floor(pts/3), d=pts-w*3, l=Math.max(0,mp-w-d);
    const gf=Math.max(0,Math.round(mp*1.3+(strength(t,di)-base)*0.06*mp)), ga=Math.max(0,Math.round(mp*1.2-(strength(t,di)-base)*0.04*mp));
    return {team:t,k:mp,v:w,u:d,t:l,gf,ga,p:pts};
  });
  rows.sort((a,b)=> b.p-a.p || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf || a.team.localeCompare(b.team,"no"));
  return rows;
}
function renderPlayerTable(app){
  const rows=pcDivTable(), d=DIVISIONS[S.divIndex];
  let html=`<div class="topbar"><div><span class="club">📊 Tabell</span><span class="meta">${esc(d.name)} · Sesong ${S.season} · etter ${S.matchNo} kamper</span></div><div class="actions"><button id="pcBack2" class="btn small">Tilbake</button></div></div>`;
  html+=`<div class="card"><table class="ltable"><thead><tr><th>#</th><th>Lag</th><th>K</th><th>S</th><th>U</th><th>T</th><th>Mål</th><th>P</th></tr></thead><tbody>`;
  rows.forEach((r,i)=>{ html+=`<tr class="${r.me?'me-row':''}"><td>${i+1}</td><td>${esc(r.team)}</td><td>${r.k}</td><td>${r.v}</td><td>${r.u}</td><td>${r.t}</td><td>${r.gf}–${r.ga}</td><td><b>${r.p}</b></td></tr>`; });
  html+=`</tbody></table></div>`; app.innerHTML=html;
  $("pcBack2").onclick=()=>{ S.screen="pcareer"; render(); };
}
function coachReply(k){
  const p=S.player, ga=p.seasonGoals+p.seasonAssists, good = p.seasonGoals>=3 || p.motm>=2 || (p.seasonApps>0 && ga/Math.max(1,p.seasonApps)>=0.6);
  if(k==='plass') return good? "Du er en av mine viktigste spillere – selvsagt får du spille fast!" : "Du må jobbe deg inn på laget. Vis meg mer i kampene, så får du sjansen.";
  if(k==='form') return good? "Du er i kanonform om dagen – bare fortsett sånn! 🔥" : "Formen kan bli bedre. Jeg har troen på deg, men du må levere mer.";
  if(k==='straffe') return ((p.pos==='ANG'||p.pos==='MID')&&good)? "Ja – du er trygg fra krittmerket. Du tar straffene fremover." : "La oss holde på den faste straffetakeren foreløpig.";
  if(k==='kaptein') return good? "Du leder godt med innsatsen din – jeg vurderer deg sterkt som kaptein." : "Kapteinsbindet må fortjenes. Vis lederskap først, så får vi se.";
  return "Bare fokuser på neste kamp, så ordner resten seg.";
}
function renderPlayerCoach(app){
  const p=S.player;
  let html=`<div class="topbar"><div><span class="club">💬 Treneren</span><span class="meta">${esc(p.club)} · Sesong ${S.season}</span></div><div class="actions"><button id="pcBack2" class="btn small">Tilbake</button></div></div>`;
  html+=`<div class="card"><h3>Spør treneren</h3>`;
  if(S._coachQ) html+=`<div class="chatlog"><div class="cmsg me">${esc(S._coachQ)}</div><div class="cmsg them">${esc(S._coachA)}</div></div>`;
  const qs=[["plass","Får jeg fast plass på laget?"],["form","Hva synes du om formen min?"],["straffe","Kan jeg ta straffene?"],["kaptein","Kan jeg bli kaptein?"]];
  html+=`<div class="lineupbtns" style="margin-top:10px">${qs.map(([k,q])=>`<button class="btn small coachq" data-k="${k}">${esc(q)}</button>`).join("")}</div></div>`;
  app.innerHTML=html;
  document.querySelectorAll(".coachq").forEach(b=>b.onclick=()=>{ S._coachQ=b.textContent; S._coachA=coachReply(b.dataset.k); render(); });
  $("pcBack2").onclick=()=>{ S._coachQ=null; S._coachA=null; S.screen="pcareer"; render(); };
}
function pcGenOffers(){
  const p=S.player, form=p.seasonGoals + p.seasonAssists*0.7 + p.motm*2;
  const target=clamp(S.divIndex - (form>=5?1:0) + (form<1?1:0), 0, DIVISIONS.length-1);
  const offers=[], seen=new Set([S.userTeam]); let tries=0;
  while(offers.length<3 && tries++<200){
    const di=clamp(target + ((Math.random()*3)|0)-1, 0, DIVISIONS.length-1), gi=(Math.random()*DIVISIONS[di].groups.length)|0, teams=curTeams(di,gi);
    const t=teams[(Math.random()*teams.length)|0]; if(seen.has(t)) continue; seen.add(t);
    offers.push({team:t, divIndex:di, groupIndex:gi, div:DIVISIONS[di].name});
  }
  return offers;
}
function pcTransferTo(o){
  const p=S.player; p.club=o.team; S.userTeam=o.team; S.divIndex=o.divIndex; S.groupIndex=o.groupIndex;
  S._pOffers=null; S.clubW=0;S.clubD=0;S.clubL=0;S.clubGF=0;S.clubGA=0; S.matchNo=0; S.pmatch=null;
  S.screen="pcareer"; save(); render();
}
function renderPlayerTransfer(app){
  const p=S.player;
  let html=`<div class="topbar"><div><span class="club">🔁 Overgang</span><span class="meta">${esc(p.club)} · Sesong ${S.season}</span></div><div class="actions"><button id="pcBack2" class="btn small">Tilbake</button></div></div>`;
  html+=`<div class="card"><h3>Overgangsvindu</h3>`;
  if(!S._pOffers){
    html+=`<p class="muted2">Meld deg tilgjengelig på overgangsmarkedet, så kommer det tilbud fra andre klubber. Spiller du bra, kommer tilbudene fra bedre klubber (høyere divisjon).</p>
      <button id="pListMe" class="btn big primary">Meld deg tilgjengelig</button>`;
  } else if(S._pOffers.length){
    html+=`<p class="muted2">${esc(p.name)} er på markedet – ${S._pOffers.length} klubb(er) vil ha deg. Velg én, eller bli værende:</p>
      <div class="joblist">${S._pOffers.map((o,i)=>`<button class="joboffer" data-i="${i}"><span class="jteam">${esc(o.team)} <span class="str">${strength(o.team,o.divIndex)}</span></span><span class="jdiv">${esc(o.div)}</span></button>`).join("")}</div>
      <button id="pStay" class="btn small" style="margin-top:8px">Bli værende i ${esc(p.club)}</button>`;
  } else html+=`<p class="muted2">Ingen klubber meldte interesse denne gangen. Spill noen flere kamper og prøv igjen.</p><button id="pStay" class="btn small">Tilbake</button>`;
  html+=`</div>`; app.innerHTML=html;
  if($("pListMe")) $("pListMe").onclick=()=>{ S._pOffers=pcGenOffers(); render(); };
  if($("pStay")) $("pStay").onclick=()=>{ S._pOffers=null; S.screen="pcareer"; render(); };
  document.querySelectorAll(".joboffer").forEach(b=>b.onclick=()=>pcTransferTo(S._pOffers[+b.dataset.i]));
  $("pcBack2").onclick=()=>{ S._pOffers=null; S.screen="pcareer"; render(); };
}
/* ---------- Header + infobar ---------- */
function header(){
  const d=DIVISIONS[S.divIndex], g=d.groups[S.groupIndex];
  return `<div class="topbar">
    <div><span class="club">${esc(S.userTeam)}</span><span class="meta">${esc(S.manager)} · ${esc(d.name)}${g.name?" "+esc(g.name):""} · Sesong ${S.season}${S.cheated?' · <b style="color:var(--gold)">🎮 Jukset</b>':''}</span></div>
    <div class="actions">
      <button id="goSeason" class="btn small">Liga</button>
      <button id="goSquad" class="btn small">Tropp</button>
      <button id="navLineup" class="btn small">Lagledelse</button>
      <button id="goTransfer" class="btn small">Overgang</button>
      <button id="goScout" class="btn small">Speider</button>
      <button id="goYouth" class="btn small">Ungdom</button>
      <button id="goStats" class="btn small">Statistikk</button>
      <button id="goBrowse" class="btn small">Ligaer</button>
      <button id="goCasino" class="btn small">🎰 Casino</button>
      <button id="goGuide" class="btn small">📖 Guide</button>
      <button id="goSettings" class="btn small" title="Innstillinger">⚙️</button>
      <button id="quit" class="btn small">Avslutt</button>
    </div></div>`;
}
function infobar(){
  return `<div class="infobar">
    <span>📅 <b>${dateLabel(S.day)} ${S.season}</b></span>
    <span>💪 Lagstyrke <b>${bestXIavg(S.squad)}</b></span>
    <span>💰 Budsjett <b>${kr(S.budget)}</b></span>
    <span>🏆 NM <b>${cupStatus()}</b></span>${(S.notes&&S.notes.length)?`<span>🔔 <b>${S.notes.length}</b></span>`:""}</div>`;
}
function cupStatus(){ const c=S.cup; return c.won?"Vant! 🏆":(c.done?"Ute":ROUND_NAMES[c.roundIdx]); }
function wireHeader(){
  const go=(id,scr)=>{ if($(id)) $(id).onclick=()=>{ if(scr!=="lineup") LINEUP=null; if(scr!=="youth") S.youthView=null; S._setup=false; S.screen=scr; render(); }; };
  go("goSeason","season"); go("goSquad","squad"); go("navLineup","lineup"); go("goTransfer","transfer"); go("goScout","scout"); go("goYouth","youth"); go("goStats","stats"); go("goBrowse","browse"); go("goGuide","guide"); go("goCasino","casino"); go("goSettings","settings");
  if($("quit")) $("quit").onclick=()=>{ if(confirm("Avslutte karrieren? (lagringen beholdes)")){ S=null; render(); } };
}

/* ---------- Sesong ---------- */
function tacticRow(){ return `<div class="tactic"><label>Taktikk:</label>${["Defensiv","Balansert","Offensiv"].map(t=>`<button class="tac ${S.tactic===t?'on':''}" data-t="${t}">${t}</button>`).join("")}</div>
  <div class="lineupbar">Startellever: <b>${lineupSummary()}</b> <button id="cardLineup" class="btn small">Lagledelse</button></div>`; }
function renderSeason(app){
  const table=computeTable(S.teams,S.results), total=S.fixtures.length;
  const cupActive = S.cup.alive && !S.cup.done;
  const lmd = S.round<total ? roundDay(S.round) : Infinity;
  const cmd = cupActive ? cupRoundDay(S.cup.roundIdx) : Infinity;
  let card="";
  if(S.round<total && S.day>=lmd){ // LIGA-KAMPDAG
    const [h,a]=S.fixtures[S.round].find(([h,a])=>h===S.userTeam||a===S.userTeam); const home=h===S.userTeam;
    card=`<div class="card match">
      <div class="rnd">⚽ Seriekamp · Runde ${S.round+1}/${total} · ${dateLabel(S.day)}</div>
      <div class="fixture"><span class="${home?'me':''}">${esc(h)}</span><span class="vs">${home?'(H)':''} vs ${home?'':'(B)'}</span><span class="${!home?'me':''}">${esc(a)}</span></div>
      ${tacticRow()}
      <div class="playbtns"><button id="play" class="btn big primary">Spill kamp (live) ▶</button><button id="simrest" class="btn">Simuler resten av sesongen</button></div></div>`;
  } else if(cupActive && S.day>=cmd){ // NM-KAMPDAG
    const opp=S.cup.opponent;
    card=`<div class="card match">
      <div class="rnd">🏆 NM · ${ROUND_NAMES[S.cup.roundIdx]} · ${dateLabel(S.day)}</div>
      <div class="fixture"><span class="me">${esc(S.userTeam)}</span><span class="vs">(H) vs</span><span>${esc(opp.name)}</span></div>
      <div class="muted2" style="text-align:center;margin-bottom:6px">Motstander fra ${esc(DIVISIONS[opp.divIndex].name)}</div>
      ${tacticRow()}
      <div class="playbtns"><button id="cupLive" class="btn big primary">Spill NM-kamp (live) ▶</button><button id="cupSim" class="btn">Simuler NM-kamp</button></div></div>`;
  } else if(S.round<total){ // MELLOM KAMPER
    const ld=lmd-S.day; const [h,a]=S.fixtures[S.round].find(([h,a])=>h===S.userTeam||a===S.userTeam); const home=h===S.userTeam;
    let nm="";
    if(cupActive){ const cd=cmd-S.day; nm=`<div class="nextmatch">🏆 NM ${ROUND_NAMES[S.cup.roundIdx]} <b>${dateLabel(cmd)}</b> (om ${cd} ${cd===1?'dag':'dager'}) mot ${esc(S.cup.opponent.name)}</div>`; }
    else if(S.cup.done) nm=`<div class="muted2" style="text-align:center">NM: ${S.cup.won?'vant cupen 🏆':'ute av cupen'}</div>`;
    card=`<div class="card">
      <div class="rnd">${S.round===0?'Oppkjøring til sesongen':'Mellom kamper'}</div>
      <div class="datebig">📅 ${dateLabel(S.day)} ${S.season}</div>
      <div class="nextmatch">⚽ Seriekamp <b>${dateLabel(lmd)}</b> (om ${ld} ${ld===1?'dag':'dager'}):<br><span class="${home?'me':''}">${esc(h)}</span> vs <span class="${!home?'me':''}">${esc(a)}</span></div>
      ${nm}
      <div class="winrow">Overgangsvindu: ${windowOpen(S.day)?'<b class="ok2">ÅPENT</b>':'<b class="no2">stengt</b>'} <span class="muted2">(åpent jan/jun/jul/aug)</span></div>
      <div class="playbtns"><button id="nextDay" class="btn big primary">Neste dag ▶</button><button id="skipMatch" class="btn">Hopp til neste kamp ⏭</button></div></div>`;
  }
  let lastHtml="";
  if(S.cup.log.length){ const l=S.cup.log[S.cup.log.length-1]; lastHtml+=`<div class="card"><h3>NM – ${esc(l.name)}</h3><div class="reslist"><div class="resrow mine"><span class="rl">${esc(S.userTeam)}</span><span class="sc">${l.hg} – ${l.ag}</span><span class="rr">${esc(l.opp)}</span></div></div><div class="muted2" style="margin-top:6px">${l.win?(S.cup.won?'🏆 Vant NM!':'✓ videre til neste runde'):'✗ ute av cupen'}${l.pens?' (etter straffer)':''}</div></div>`; }
  if(S.last){ lastHtml+=`<div class="card"><h3>Runde ${S.round} – resultater</h3><div class="reslist">${S.last.map(m=>{
      const mine=m.home===S.userTeam||m.away===S.userTeam;
      return `<div class="resrow ${mine?'mine':''}"><span class="rl">${esc(m.home)}</span><span class="sc">${m.hg} – ${m.ag}</span><span class="rr">${esc(m.away)}</span></div>`; }).join("")}</div></div>`; }
  const yt=youthTodayTeams(S.day);
  const youthNote = yt.length ? `<div class="card"><div class="flash" style="margin:0">🧒 Ungdomskamp i dag: <b>${yt.map(esc).join(", ")}</b> spiller. <button id="toYouth" class="btn small primary" style="margin-left:8px">Se kampen</button></div></div>` : "";
  const notes=(S.notes&&S.notes.length)?`<div class="card notescard"><h3>🔔 Varslinger (${S.notes.length}) <button id="clrNotes" class="btn small" style="float:right">Tøm alle</button></h3>${S.notes.slice().reverse().map((n,ri)=>{ const idx=S.notes.length-1-ri; return `<div class="noterow"><span>${esc(n.t)}</span><button class="btn small" data-note="${idx}">✕</button></div>`; }).join("")}</div>`:"";
  app.innerHTML=header()+infobar()+flashBar()+notes+youthNote+card+tableHtml(table)+lastHtml;
  wireHeader();
  if($("clrNotes")) $("clrNotes").onclick=clearNotes;
  document.querySelectorAll("[data-note]").forEach(b=>b.onclick=()=>dismissNote(+b.dataset.note));
  if($("toYouth")) $("toYouth").onclick=()=>{ S.youthView=null; S.screen="youth"; render(); };
  if($("play")) $("play").onclick=playRound;
  if($("simrest")) $("simrest").onclick=simRest;
  if($("cupLive")) $("cupLive").onclick=playCupLive;
  if($("cupSim")) $("cupSim").onclick=playCupInstant;
  if($("nextDay")) $("nextDay").onclick=nextDay;
  if($("skipMatch")) $("skipMatch").onclick=skipToMatch;
  if($("cardLineup")) $("cardLineup").onclick=()=>{ S.screen="lineup"; render(); };
  document.querySelectorAll(".tac").forEach(b=>b.onclick=()=>{S.tactic=b.dataset.t;render();});
}
function tableHtml(table){
  const d=DIVISIONS[S.divIndex], n=table.length;
  const rows=table.map((r,i)=>{ const pos=i+1; let cls="";
    if(S.divIndex===0 && pos===1) cls="gold"; else if(d.promote && pos<=d.promote) cls="promo";
    if(d.relegate && pos>n-d.relegate) cls="releg";
    return `<tr class="${cls} ${r.team===S.userTeam?'me':''}"><td>${pos}</td><td class="tn">${esc(r.team)}</td><td>${r.k}</td><td>${r.v}</td><td>${r.u}</td><td>${r.t}</td><td>${r.gf}-${r.ga}</td><td>${r.gf-r.ga>0?'+':''}${r.gf-r.ga}</td><td class="pts">${r.p}</td></tr>`; }).join("");
  return `<div class="card"><h3>Tabell</h3><table class="ltbl"><thead><tr><th>#</th><th class="tn">Lag</th><th>K</th><th>V</th><th>U</th><th>T</th><th>Mål</th><th>+/-</th><th>P</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="legend">${S.divIndex===0?'<span class="lg gold">Seriemester</span>':''}${d.promote?'<span class="lg promo">Opprykk</span>':''}${d.relegate?'<span class="lg releg">Nedrykk</span>':''}<span class="lg me">Ditt lag</span></div></div>`;
}

/* ---------- Live-skjerm ---------- */
function renderLive(){
  const L=LIVE; if(!L){ S.screen = S.playerMode?"pcareer":"season"; render(); return; }
  const app=$("app");
  const label = L.ctx.type==="cup" ? `NM – ${ROUND_NAMES[S.cup.roundIdx]}` : L.ctx.type==="youth" ? `Ungdomskamp – ${L.ctx.label}` : L.ctx.type==="pmatch" ? `${esc(S.player.name)} (${POSNAME[S.player.pos]}) · ${DIVISIONS[S.divIndex].name}` : `${DIVISIONS[S.divIndex].name} – Runde ${S.round+1}`;
  app.innerHTML=`<div class="card live">
    <div class="lvtop">${esc(label)}</div>
    <div class="lvteams"><span class="lvname ${L.home===S.userTeam?'me':''}">${esc(L.home)}</span>
      <span class="lvscore"><b id="lvH">${L.shownScore[0]}</b><i>-</i><b id="lvA">${L.shownScore[1]}</b></span>
      <span class="lvname ${L.away===S.userTeam?'me':''}">${esc(L.away)}</span></div>
    <div class="lvclock"><span id="lvClock">${L.clock}'</span></div>
    <div class="lvmid">
      <div class="lvratings side" id="lvRatL"></div>
      <div class="lvfeed" id="lvFeed"></div>
      <div class="lvratings side" id="lvRatR"></div>
    </div>
    <div class="lvctrl" id="lvCtrl">${liveControlsHTML()}</div></div>`;
  wireLiveControls();
  updateRatingsPanel();
  restartTimer();
}

/* ---------- Tropp ---------- */
function renderSquad(app){
  ensureSquadContracts();
  const xi=new Set(userXI());
  let html=header()+infobar()+flashBar()+`<div class="card"><h3>Tropp – ${esc(S.userTeam)} <span class="muted2">(★ = starteller · trykk for detaljer)</span></h3>`;
  const injN=S.squad.filter(p=>p.outDays>0).length;
  if(injN) html=html.replace("(★ = starteller · trykk for detaljer)",`(★ = starteller · 🤕/💫 = ute · ${injN} utilgjengelig)`);
  for(const pos of POSORDER){
    const ps=S.squad.filter(p=>p.pos===pos).sort((a,b)=>b.rating-a.rating);
    html+=`<h4>${POSNAME[pos]}</h4><div class="plist">${ps.map(p=>{
      const fit=p.fit==null?100:p.fit;
      const badge = p.outDays>0
        ? ` <i class="injtag">${p.outReason==="utmattelse"?'💫':'🤕'} ${Math.ceil(p.outDays/7)} uke${Math.ceil(p.outDays/7)===1?'':'r'}</i>`
        : (fit<60 ? ` <i class="tiredtag">😓 ${Math.round(fit)}%</i>` : '');
      return `<button class="prow ${p.outDays>0?'inj':''}" data-pn="${esc(p.name)}"><span class="pn">${xi.has(p)?'★ ':''}${esc(p.name)}${badge}</span><span class="pa">${p.age} år</span><span class="prt">${p.rating}</span></button>`;
    }).join("")}</div>`;
  }
  html+=`</div>`;
  html+=`<div class="card"><h3>🎓 Lag din egen spiller</h3>
    <p class="muted2">Egne spillere: 14 år = 15 i styrke, +5 per år opp til 18 (=35). Velg alder fra 14.</p>
    <div class="createform">
      <input id="cpName" placeholder="Spillernavn"/>
      <select id="cpPos">${POSORDER.map(p=>`<option value="${p}">${POSNAME[p]}</option>`).join("")}</select>
      <input id="cpAge" type="number" min="14" max="45" value="16" title="Alder"/>
      <button id="cpAdd" class="btn small primary">Lag spiller</button>
    </div></div>`;
  app.innerHTML=html; wireHeader();
  if($("cpAdd")) $("cpAdd").onclick=()=>createPlayer($("cpName").value, $("cpPos").value, $("cpAge").value);
  document.querySelectorAll(".prow[data-pn]").forEach(b=>b.onclick=()=>openPlayer(b.dataset.pn,"squad"));
}

/* ---------- Lagledelse: formasjon, posisjoner (HB, VB, spiss …) og benk ---------- */
function renderLineup(app){
  if(LINEUP===null){
    LFORM = (S.formation && FORMATIONS[S.formation]) ? S.formation : "4-4-2";
    const saved = S.lineup ? S.lineup.map(squadByName).filter(Boolean) : [];
    if(saved.length===11 && S.formation && FORMATIONS[S.formation] && S.lineup.length===11) LINEUP=S.lineup.slice();
    else if(saved.length===11) LINEUP=placeInto(LFORM, saved);           // gammel lagring uten formasjon
    else LINEUP=placeInto(LFORM, S.squad.filter(isAvailable));
  }
  const roles=FORMATIONS[LFORM];
  const chosen=new Set(LINEUP.filter(Boolean));
  let nSel=0, sum=0, warns=0;
  LINEUP.forEach((n,i)=>{ const p=n&&squadByName(n); if(!p) return; nSel++;
    const pen=slotPenalty(p,roles[i]); if(pen>0) warns++; sum+=p.rating-pen; });
  const eff=nSel?Math.round(sum/nSel):0;
  const slotOptions=(i)=>{
    const cur=LINEUP[i]; let o='<option value="">– velg spiller –</option>';
    for(const pos of POSORDER){
      const ps=S.squad.filter(p=>p.pos===pos).sort((a,b)=>b.rating-a.rating);
      if(!ps.length) continue;
      o+=`<optgroup label="${POSNAME[pos]}">`+ps.map(p=>{ const out=p.outDays>0;
        return `<option value="${esc(p.name)}" ${p.name===cur?'selected':''} ${out&&p.name!==cur?'disabled':''}>${esc(p.name)}${out?' 🤕':''}${chosen.has(p.name)&&p.name!==cur?' •':''} (${p.rating})</option>`;
      }).join("")+`</optgroup>`;
    }
    return o;
  };
  const slotRow=(i)=>{ const p=LINEUP[i]&&squadByName(LINEUP[i]); const pen=p?slotPenalty(p,roles[i]):0;
    return `<div class="slotrow"><span class="role">${roles[i]}<i>${ROLENAME[roles[i]]}</i></span>
      <select data-slot="${i}">${slotOptions(i)}</select>
      ${p?`<span class="prt">${p.rating-pen}</span>`:'<span class="prt muted2">–</span>'}
      ${pen>0?`<span class="warn">⚠ −${pen}</span>`:''}</div>`; };
  const groups=[["🧤 Keeper","MV"],["🛡️ Forsvar","FOR"],["🎯 Midtbane","MID"],["⚡ Angrep","ANG"]];
  const slotsHtml=groups.map(([label,g])=>{
    const idx=roles.map((r,i)=>ROLE_GROUP[r]===g?i:-1).filter(i=>i>=0);
    return idx.length?`<h4>${label}</h4>`+idx.map(slotRow).join(""):"";
  }).join("");
  const bench=S.squad.filter(p=>!chosen.has(p.name)).sort((a,b)=>POSORDER.indexOf(a.pos)-POSORDER.indexOf(b.pos)||b.rating-a.rating);
  app.innerHTML=header()+infobar()+flashBar()+`<div class="card"><h3>Lagledelse – sett laget</h3>
    <p class="muted2">Velg formasjon, og bestem hvor hver spiller skal spille – høyreback, spiss, osv.
      Spillere på feil plass svekkes (⚠). De som ikke er på banen, sitter på benken.</p>
    <div class="formpills">${Object.keys(FORMATIONS).map(f=>`<button class="tac ${f===LFORM?'on':''}" data-f="${f}">${f}</button>`).join("")}</div>
    <div class="lineupcount">Valgt: <b class="${nSel===11?'ok':'no'}">${nSel}/11</b>
      &nbsp;·&nbsp; Lagstyrke: <b>${eff}</b>${warns?` &nbsp;·&nbsp; <span class="warn">⚠ ${warns} utenfor posisjon</span>`:""}</div>
    <div class="lineupbtns">
      <button id="autoXI" class="btn small">Auto (beste 11)</button>
      <button id="saveXI" class="btn small ${nSel===11?'primary':'dis'}">Bruk laget</button>
      <button id="cancelXI" class="btn small">Avbryt</button></div>
    ${slotsHtml}
    <h4>⚽ Straffetaker</h4>
    <div class="createform"><select id="penTaker" style="flex:1;min-width:170px">
      <option value="">Automatisk (beste skytter)</option>
      ${LINEUP.filter(Boolean).map(n=>{ const p=squadByName(n); return p?`<option value="${esc(n)}" ${S.penaltyTaker===n?'selected':''}>${esc(n)} (${p.pos} · ${p.rating})</option>`:""; }).join("")}
    </select></div>
    <p class="muted2">Han tar straffene i kamp (så lenge han er på banen). I straffekonkurranser i NM velger du fortsatt hver skytter selv.</p>
    <h4>🪑 Benken (${bench.length})</h4>
    <div class="benchlist">${bench.map(p=>`<span class="bench-chip">${esc(p.name)} <i>${p.pos} · ${p.rating}${p.outDays>0?' 🤕':''}</i></span>`).join("")||'<span class="muted2">Ingen – alle er på banen.</span>'}</div>
  </div>`;
  wireHeader();
  document.querySelectorAll(".formpills .tac").forEach(b=>b.onclick=()=>{ LFORM=b.dataset.f;
    LINEUP=placeInto(LFORM, LINEUP.filter(Boolean).map(squadByName).filter(Boolean)); render(); });
  document.querySelectorAll("select[data-slot]").forEach(sel=>sel.onchange=()=>{
    const i=+sel.dataset.slot, n=sel.value||null, prev=LINEUP[i];
    if(n){ const j=LINEUP.indexOf(n); if(j>=0&&j!==i) LINEUP[j]=prev; } // bytt plass hvis han sto et annet sted
    LINEUP[i]=n; render(); });
  if($("penTaker")) $("penTaker").onchange=()=>{ S.penaltyTaker=$("penTaker").value||null; save(); };
  $("autoXI").onclick=()=>{ LINEUP=placeInto(LFORM, S.squad.filter(isAvailable)); render(); };
  $("cancelXI").onclick=()=>{ LINEUP=null; S.screen="season"; render(); };
  $("saveXI").onclick=()=>{ if(nSel!==11){ FLASH="⚠ Du må sette 11 spillere på laget."; render(); return; }
    const hurt=LINEUP.find(n=>{ const p=n&&squadByName(n); return p&&p.outDays>0; });
    if(hurt){ FLASH=`⚠ ${hurt} er skadet/utmattet og kan ikke starte – velg en annen.`; render(); return; }
    S.lineup=LINEUP.slice(); S.formation=LFORM; LINEUP=null;
    FLASH=`✅ Startelleveren er lagret (${LFORM}).`; S.screen="season"; save(); render(); };
}

/* ---------- Overgangsmarked ---------- */
function createPlayer(name, pos, age){
  if(S.squad.length>=32){ FLASH="⚠ Troppen er full (maks 32). Selg en spiller først."; render(); return; }
  age=Math.max(14, parseInt(age,10)||14);
  name=(name||"").trim()||randName();
  if(!POSORDER.includes(pos)) pos="MID";
  // 14-åring = 15, så +5 per år til 18 (=35), eldre enn 18 stopper på 35
  const r=15+5*(clamp(age,14,18)-14);
  S.squad.push({name, pos, rating:r, age, value:playerValue(r), real:false, custom:true});
  FLASH=`🎓 ${name} (${age} år, ${POSNAME[pos]}, styrke ${r}) er lagt til i troppen.`;
  save(); render();
}
function bidForPlayer(i, amount){
  const p=S.market[i]; if(!p) return;
  if(!windowOpen(S.day)){ FLASH="⚠ Overgangsvinduet er stengt (åpent jan/jun/jul/aug)."; render(); return; }
  if(S.squad.length>=32){ FLASH="⚠ Troppen er full (maks 32)."; render(); return; }
  amount=Math.round(amount||0);
  if(amount<=0){ FLASH="⚠ Skriv inn et bud."; render(); return; }
  if(amount>S.budget){ FLASH="⚠ Du har ikke råd til budet."; render(); return; }
  const prob=clamp((amount/p.value - 0.85)/0.25, 0, 1); // høyt bud -> ja, lavt -> nei
  if(Math.random()<prob){ S.budget-=amount; S.squad.push({...p}); S.market.splice(i,1);
    FLASH=`✅ Budet ble akseptert! ${p.name} (${p.rating}) er din for ${kr(amount)}. Sett ham på laget i Lagledelse.`; }
  else FLASH=`❌ ${p.name}s klubb takket nei til budet på ${kr(amount)}. Prøv et høyere bud.`;
  save(); render();
}
function bidForClubPlayer(team, divIndex, name, amount){
  if(!windowOpen(S.day)){ FLASH="⚠ Overgangsvinduet er stengt (åpent jan/jun/jul/aug)."; render(); return; }
  if(S.squad.length>=32){ FLASH="⚠ Troppen er full (maks 32)."; render(); return; }
  const p=squadFor(team,divIndex).find(x=>x.name===name);
  if(!p){ FLASH="⚠ Spilleren er ikke tilgjengelig lenger."; render(); return; }
  amount=Math.round(amount||0);
  if(amount<=0){ FLASH="⚠ Skriv inn et bud."; render(); return; }
  if(amount>S.budget){ FLASH="⚠ Du har ikke råd til budet."; render(); return; }
  let prob=clamp((amount/p.value - 0.9)/0.35, 0, 1);
  const levelDiff=S.divIndex-divIndex;              // >0 hvis spilleren spiller i en HØYERE divisjon
  if(levelDiff>0) prob*=Math.pow(0.35, levelDiff);  // klubb i bedre divisjon sier som regel nei
  if(p.rating>bestXIavg(S.squad)+6) prob*=0.5;      // stjerne over ditt nivå
  if(Math.random()<prob){
    S.budget-=amount; if(!S.transfersOut)S.transfersOut={}; S.transfersOut[team+'|'+name]=true;
    S.squad.push({name:p.name,pos:p.pos,rating:p.rating,age:p.age,value:p.value,real:p.real});
    if(S.lineup) S.lineup=S.lineup; // uendret
    FLASH=`✅ ${p.name} (${p.rating}) er signert fra ${team} for ${kr(amount)}!`;
  } else {
    FLASH=`❌ ${team} avslo budet på ${p.name}.${levelDiff>0?' De spiller i en bedre divisjon og vil ikke selge så lett.':' Prøv et høyere bud.'}`;
  }
  save(); render();
}
function bidForExPlayer(name, amount){ // hent tilbake en spiller du mistet gratis
  if(!windowOpen(S.day)){ FLASH="⚠ Overgangsvinduet er stengt (åpent jan/jun/jul/aug)."; render(); return; }
  if(S.squad.length>=32){ FLASH="⚠ Troppen er full (maks 32)."; render(); return; }
  const idx=S.exPlayers? S.exPlayers.findIndex(x=>x.name===name):-1, p=idx>=0?S.exPlayers[idx]:null;
  if(!p){ FLASH="⚠ Spilleren er ikke tilgjengelig lenger."; render(); return; }
  amount=Math.round(amount||0);
  if(amount<=0){ FLASH="⚠ Skriv inn et bud."; render(); return; }
  if(amount>S.budget){ FLASH="⚠ Du har ikke råd til budet."; render(); return; }
  let prob=clamp((amount/p.value - 0.85)/0.3, 0, 1);
  const levelDiff=S.divIndex-p.divIndex; if(levelDiff>0) prob*=Math.pow(0.45,levelDiff); // ny klubb i bedre divisjon vil ikke selge billig
  if(Math.random()<prob){
    S.budget-=amount; S.squad.push({name:p.name,pos:p.pos,rating:p.rating,age:p.age,value:p.value,real:!!p.real});
    const club=p.team; S.exPlayers.splice(idx,1);
    FLASH=`✅ ${p.name} (${p.rating}) er hentet tilbake fra ${club} for ${kr(amount)}! Sett ham på laget i Lagledelse.`;
  } else FLASH=`❌ ${p.team} avslo budet på ${p.name}. Prøv et høyere bud.`;
  save(); render();
}
function listPlayer(i){
  if(!windowOpen(S.day)){ FLASH="⚠ Vinduet er stengt (åpent jan/jun/jul/aug)."; render(); return; }
  if(S.squad.length<=14){ FLASH="⚠ Du må ha minst 14 spillere."; render(); return; }
  const p=S.squad[i]; if(!S.listed) S.listed=[];
  if(S.listed.some(l=>l.name===p.name)){ FLASH=`${p.name} er allerede lagt ut.`; render(); return; }
  S.listed.push({name:p.name, value:p.value, days:0, offers:[]}); // bud kommer ikke med en gang
  FLASH=`📢 ${p.name} er lagt ut for salg. Bud kommer ikke med en gang – det kan ta noen dager, og av og til er det ingen som vil ha ham. Du får varsel når noen byr.`;
  save(); render();
}
function acceptOffer(li, oi){
  const l=S.listed[li]; if(!l) return; const off=l.offers&&l.offers[oi]; if(!off) return;
  if(S.squad.length<=14){ FLASH="⚠ Du må ha minst 14 spillere."; render(); return; }
  const idx=S.squad.findIndex(p=>p.name===l.name);
  if(idx>=0){ S.budget+=off.amount; S.squad.splice(idx,1); if(S.lineup) S.lineup=S.lineup.filter(n=>n!==l.name); }
  S.listed.splice(li,1);
  FLASH=`💰 ${l.name} solgt til ${off.club} for ${kr(off.amount)}.`;
  save(); render();
}
function rejectOffer(li, oi){
  const l=S.listed&&S.listed[li]; if(!l||!l.offers||!l.offers[oi]) return;
  const off=l.offers[oi]; l.offers.splice(oi,1);
  FLASH=`🙅 Du avslo budet fra ${off.club} (${kr(off.amount)}). ${l.name} er fortsatt lagt ut.`;
  save(); render();
}
function unlist(li){ if(S.listed&&S.listed[li]){ FLASH=`${S.listed[li].name} er trukket fra markedet.`; S.listed.splice(li,1); } save(); render(); }
// kast en spiller ut av klubben mot 50 % av verdien (umiddelbart, ingen kjøper trengs)
function releasePlayer(name){
  const i=S.squad.findIndex(p=>p.name===name); if(i<0) return;
  if(S.squad.length<=14){ FLASH="⚠ Du må ha minst 14 spillere – kan ikke kaste ut flere."; render(); return; }
  const p=S.squad[i], full=p.value||playerValue(p.rating), payout=Math.round(full*0.5);
  S.budget+=payout; S.squad.splice(i,1);
  if(S.lineup) S.lineup=S.lineup.filter(n=>n!==name);
  if(S.listed) S.listed=S.listed.filter(l=>l.name!==name);
  FLASH=`🚪 ${name} er kastet ut av klubben. Du fikk ${kr(payout)} (50 % av verdien ${kr(full)}).`;
  save(); render();
}
function renderTransfer(app){
  const open=windowOpen(S.day); const q=(TSEARCH||"").trim().toLowerCase();
  const pass=r=>{
    if(TF.pos && r.pos!==TF.pos) return false;
    if(TF.maxAge && r.age && r.age>+TF.maxAge) return false;
    if(TF.maxPrice && r.value>+TF.maxPrice) return false;
    return true;
  };
  const cl=TF.club.trim().toLowerCase();
  let rows=[];
  if(!cl) S.market.forEach((p,i)=>{ if(!q||p.name.toLowerCase().includes(q)) rows.push({m:true,i,name:p.name,sub:"ledig",pos:p.pos,rating:p.rating,value:p.value,age:p.age}); });
  if(q.length>=2){ for(const x of searchPlayers(q)){ if(!cl||x.team.toLowerCase().includes(cl)) rows.push({m:false,ex:x.ex,name:x.name,sub:x.team,pos:x.pos,rating:x.rating,value:x.value,team:x.team,divIndex:x.divIndex,age:x.age}); } }
  else if(cl){ if(S.exPlayers) for(const x of S.exPlayers){ if(x.team.toLowerCase().includes(cl)) rows.push({m:false,ex:true,name:x.name,sub:x.team,pos:x.pos,rating:x.rating,value:x.value,team:x.team,divIndex:x.divIndex,age:x.age}); } for(const x of allPlayers()){ if(x.team===S.userTeam) continue; if(S.transfersOut&&S.transfersOut[x.team+'|'+x.name]) continue; if(x.team.toLowerCase().includes(cl)){ rows.push({m:false,name:x.name,sub:x.team,pos:x.pos,rating:x.rating,value:x.value,team:x.team,divIndex:x.divIndex,age:x.age}); } } }
  rows=rows.filter(pass).slice(0,80);
  let html=header()+infobar()+flashBar()+`<div class="card"><h3>Overgangsmarked</h3>
    <div class="winrow">${open?'<b class="ok2">Vinduet er ÅPENT</b> – legg inn bud.':'<b class="no2">STENGT.</b> Du kan kun handle i januar, juni, juli og august.'}</div>
    <input id="tsearch" class="tsearch" placeholder="🔎 Søk i ALLE klubber – by på hvem som helst…" value="${esc(TSEARCH)}"/>
    <div class="tfilters">
      <select id="fPos"><option value="">Alle posisjoner</option>${POSORDER.map(p=>`<option ${TF.pos===p?'selected':''}>${p}</option>`).join("")}</select>
      <input id="fAge" type="number" placeholder="Maks alder" value="${esc(TF.maxAge)}"/>
      <input id="fPrice" type="number" placeholder="Maks pris (kr)" value="${esc(TF.maxPrice)}"/>
      <input id="fClub" placeholder="Klubb" value="${esc(TF.club)}"/>
    </div>
    <p class="muted2">${q.length>=2?`${rows.length} treff (ledige spillere + alle klubber)`:'Ledige spillere vises. Søk for å finne og by på spillere i alle lag – spillere i bedre klubber krever mye høyere bud.'}</p>
    <div class="mhead"><span>Spiller</span><span>Pos</span><span>St.</span><span>Verdi</span><span>Bud</span></div>
    ${rows.map(r=>`<div class="mrow"><span class="pn">${esc(r.name)}<br><i class="clubtag">${r.m?`🆓 Ledig · ${r.age||'?'} år`:`${r.ex?'↩️':'🏟'} ${esc(r.sub)}${r.divIndex!=null?' · '+esc(DIVISIONS[r.divIndex].name):''} · ${r.age||'?'} år${r.ex?' (gikk gratis fra deg)':''}`}</i></span><span>${r.pos}</span><span class="prt">${r.rating}</span><span>${kr(r.value)}</span>
      <span class="bidcell"><input class="bidinp" type="number" placeholder="${Math.round(r.value)}" ${open?'':'disabled'}/>
      <button class="btn small ${open?'primary':'dis'}" data-src="${r.m?'m':(r.ex?'x':'c')}" ${r.m?`data-i="${r.i}"`:`data-team="${esc(r.team)}" data-div="${r.divIndex}" data-name="${esc(r.name)}"`}>Bud</button></span></div>`).join("")||'<p class="muted2">Ingen treff.</p>'}
  </div>
  ${(S.listed&&S.listed.length)?`<div class="card"><h3>📢 Lagt ut for salg</h3>${S.listed.map((l,li)=>`<div class="listed"><div class="pn">${esc(l.name)}</div>${(l.offers&&l.offers.length)? l.offers.map((o,oi)=>`<div class="offerrow"><span>${esc(o.club)} byr <b>${kr(o.amount)}</b></span><button class="btn small primary" data-acc="${li}.${oi}">Godta</button><button class="btn small" data-rej="${li}.${oi}">Avslå</button></div>`).join("") : `<div class="muted2">⏳ Ingen bud ennå${l.days?` (lagt ut i ${l.days} dag${l.days===1?'':'er'})`:''} – det kan ta noen dager, og noen ganger melder ingen seg.</div>`}<button class="btn small" data-unlist="${li}">Trekk tilbake</button></div>`).join("")}</div>`:""}
  <div class="card"><h3>Selg fra troppen</h3><p class="muted2">Legg en spiller ut på markedet, så kommer bud fra andre lag.</p>
    ${S.squad.slice().sort((a,b)=>b.rating-a.rating).map(p=>{ const i=S.squad.indexOf(p); const listed=S.listed&&S.listed.some(l=>l.name===p.name);
      return `<div class="mrow"><span class="pn">${esc(p.name)}</span><span>${p.pos}</span><span class="prt">${p.rating}</span><span>${kr(p.value)}</span><span><button class="btn small ${(!open||listed)?'dis':''}" data-list="${i}">${listed?'utlagt':'Legg ut'}</button></span></div>`; }).join("")}
  </div>`;
  app.innerHTML=html; wireHeader();
  if($("tsearch")) $("tsearch").oninput=e=>{ TSEARCH=e.target.value; const cur=e.target.selectionStart; render(); const s=$("tsearch"); if(s){ s.focus(); try{s.setSelectionRange(cur,cur);}catch(_){} } };
  if($("fPos")) $("fPos").onchange=e=>{ TF.pos=e.target.value; render(); };
  if($("fAge")) $("fAge").onchange=e=>{ TF.maxAge=e.target.value; render(); };
  if($("fPrice")) $("fPrice").onchange=e=>{ TF.maxPrice=e.target.value; render(); };
  if($("fClub")) $("fClub").onchange=e=>{ TF.club=e.target.value; render(); };
  document.querySelectorAll("[data-src]").forEach(b=>b.onclick=()=>{
    const row=b.closest(".mrow"), inp=row&&row.querySelector(".bidinp");
    const amt=(inp&&inp.value)? +inp.value : (inp? +inp.placeholder : 0);
    if(b.dataset.src==="m") bidForPlayer(+b.dataset.i, amt);
    else if(b.dataset.src==="x") bidForExPlayer(b.dataset.name, amt);
    else bidForClubPlayer(b.dataset.team, +b.dataset.div, b.dataset.name, amt);
  });
  document.querySelectorAll("[data-list]").forEach(b=>b.onclick=()=>listPlayer(+b.dataset.list));
  document.querySelectorAll("[data-acc]").forEach(b=>b.onclick=()=>{ const [li,oi]=b.dataset.acc.split(".").map(Number); acceptOffer(li,oi); });
  document.querySelectorAll("[data-rej]").forEach(b=>b.onclick=()=>{ const [li,oi]=b.dataset.rej.split(".").map(Number); rejectOffer(li,oi); });
  document.querySelectorAll("[data-unlist]").forEach(b=>b.onclick=()=>unlist(+b.dataset.unlist));
}

/* ---------- Statistikk ---------- */
function renderStats(app){
  const arr=Object.values(S.stats||{});
  const cats=[["goals","⚽ Toppscorer"],["assists","🅰️ Assist"],["saves","🧤 Redninger (keeper)"],["yellow","🟨 Gule kort"],["red","🟥 Røde kort"]];
  let html=header()+infobar()+flashBar();
  // Dine lags toppscorere (A-lag + ungdomslag)
  const mine=arr.filter(p=>p.team===S.userTeam && p.goals>0).sort((a,b)=>b.goals-a.goals);
  const ytop=(S.youth?Object.keys(S.youth):[]).map(l=>({l,p:youthTopScorer(l)})).filter(x=>x.p).sort((a,b)=>b.p.goals-a.p.goals);
  html+=`<div class="card"><h3>⭐ Toppscorere – dine lag</h3>
    <h4>${esc(S.userTeam)} (A-laget)</h4>
    ${mine.length?`<div class="statlist">${mine.slice(0,8).map((p,i)=>`<div class="statrow mine"><span class="sr">${i+1}</span><span class="sn">${esc(p.name)}</span><span class="sv">${p.goals} mål</span></div>`).join("")}</div>`:'<p class="muted2">Ingen mål på A-laget ennå denne sesongen.</p>'}
    ${ytop.length?`<h4>Ungdomslag</h4><div class="statlist">${ytop.slice(0,10).map(x=>`<div class="statrow"><span class="sr">${esc(x.l)}</span><span class="sn">${esc(x.p.name)}</span><span class="sv">${x.p.goals} mål</span></div>`).join("")}</div>`:'<h4>Ungdomslag</h4><p class="muted2">Spill ungdomskamper for å få toppscorere her.</p>'}
  </div>`;
  // Ungdomsstatistikk per aldersgruppe (auto-generert – ingen kamp nødvendig)
  if(S.youth){
    const groups=Object.keys(S.youth).sort((a,b)=>groupMaxAge(a)-groupMaxAge(b)||a.localeCompare(b,"no"));
    if(!S.statGroup || !S.youth[S.statGroup]) S.statGroup=groups[0];
    const g=S.statGroup, t=(S.youth[g]||[]);
    const ylist=(title,field,filt,unit)=>{ let a=t.filter(p=>(p[field]||0)>0); if(filt) a=a.filter(filt);
      a=a.sort((x,y)=>y[field]-x[field]).slice(0,8);
      return `<h4>${title}</h4>`+(a.length?`<div class="statlist">${a.map((p,i)=>`<div class="statrow"><span class="sr">${i+1}</span><span class="sn">${esc(p.name)} <i class="muted2">${p.pos||''}</i></span><span class="sv">${p[field]}${unit?' '+unit:''}</span></div>`).join("")}</div>`:'<p class="muted2">Ingen ennå.</p>'); };
    html+=`<div class="card"><h3>🧒 Ungdomsstatistikk – velg aldersgruppe</h3>
      <select id="statGroupSel" class="tsearch">${groups.map(l=>`<option ${l===g?'selected':''}>${esc(l)}</option>`).join("")}</select>
      ${ylist("⚽ Toppscorer","goals",null,"mål")}
      ${ylist("🅰️ Assist","assists",null,"")}
      ${ylist("🟨 Gule kort","yellow",null,"")}
      ${ylist("🟥 Røde kort","red",null,"")}
      ${ylist("🧤 Keeper – flest redninger","saves",p=>p.pos==="MV","redn.")}
    </div>`;
  }
  // Ligastatistikk – velg HVILKEN SOM HELST liga (din serie = faktiske kamper, andre = simulert)
  if(!S.statLeague || DIVISIONS[S.statLeague.di]==null) S.statLeague={di:S.divIndex, gi:S.groupIndex};
  let sdi=S.statLeague.di, sgi=S.statLeague.gi;
  if(sgi>=DIVISIONS[sdi].groups.length){ sgi=0; S.statLeague.gi=0; }
  const isOwn = sdi===S.divIndex && sgi===S.groupIndex;
  const leagueArr = isOwn ? arr : getLeagueStats(sdi,sgi);
  const grpName = DIVISIONS[sdi].groups.length>1 ? ' · '+(DIVISIONS[sdi].groups[sgi].name||('Avd '+(sgi+1))) : '';
  const statList=(field,title)=>{ const top=leagueArr.filter(p=>p[field]>0).sort((a,b)=>b[field]-a[field]).slice(0,10);
    return `<h4>${title}</h4>`+(top.length?`<div class="statlist">${top.map((p,i)=>`<div class="statrow ${p.team===S.userTeam?'mine':''}"><span class="sr">${i+1}</span><span class="sn">${esc(p.name)} <i class="muted2">${esc(p.team)}</i></span><span class="sv">${p[field]}</span></div>`).join("")}</div>`:'<p class="muted2">Ingen ennå.</p>'); };
  html+=`<div class="card"><h3>📈 Ligastatistikk – velg liga</h3>
    <div class="leaguesel">
      <select id="statDiv" class="tsearch">${DIVISIONS.map((d,i)=>`<option value="${i}" ${i===sdi?'selected':''}>${esc(d.name)}</option>`).join("")}</select>
      ${DIVISIONS[sdi].groups.length>1?`<select id="statGrp" class="tsearch">${DIVISIONS[sdi].groups.map((g,i)=>`<option value="${i}" ${i===sgi?'selected':''}>${esc(g.name||('Avd '+(i+1)))}</option>`).join("")}</select>`:''}
    </div>
    <p class="muted2">${esc(DIVISIONS[sdi].name)}${grpName} – ${isOwn?'din serie (faktiske kamper denne sesongen)':'sesongstatistikk'}.</p>
    ${isOwn && !leagueArr.length ? '<p class="muted2">Ingen kamper spilt i din serie ennå – spill en runde først.</p>' : cats.map(([f,t])=>statList(f,t)).join("")}
  </div>`;
  app.innerHTML=html; wireHeader();
  if($("statGroupSel")) $("statGroupSel").onchange=e=>{ S.statGroup=e.target.value; render(); };
  if($("statDiv")) $("statDiv").onchange=e=>{ S.statLeague={di:+e.target.value, gi:0}; render(); };
  if($("statGrp")) $("statGrp").onchange=e=>{ S.statLeague={di:sdi, gi:+e.target.value}; render(); };
}

/* ---------- Klubbvelger (delt av oppsett og sparken) ---------- */
function wireClubSelects(divSel, grpSel, teamSel){
  divSel.innerHTML=""; DIVISIONS.forEach((d,i)=>divSel.add(new Option(d.name,i)));
  function fillG(){ grpSel.innerHTML=""; DIVISIONS[+divSel.value].groups.forEach((g,i)=>grpSel.add(new Option(g.name||"Serien",i))); fillT(); }
  function fillT(){ teamSel.innerHTML=""; DIVISIONS[+divSel.value].groups[+grpSel.value].teams.forEach(t=>teamSel.add(new Option(t,t))); }
  divSel.onchange=fillG; grpSel.onchange=fillT; fillG();
}

/* ---------- Speider ---------- */
function renderScout(app){
  let html=header()+infobar()+flashBar()+`<div class="card"><h3>🔭 Speider</h3>`;
  if(S.scout && S.scout.active){
    const left=Math.max(0,S.scout.returnDay-S.day);
    html+=`<p>Speideren er ute på oppdrag – tilbake ~<b>${dateLabel(Math.min(365,S.scout.returnDay))}</b> (${left} dager igjen).</p>
      <p class="muted2">Han leter etter unge talenter (10–17 år) til akademiet ditt.</p>`;
  } else {
    html+=`<p class="muted2">Send ut en speider for å finne unge talenter til akademiet. Prisen avhenger av hvilken klubb du er i.</p>
      <div class="lineupbtns">${[3,6,9].map(m=>`<button class="btn small primary scoutbtn" data-m="${m}">${m} måneder – ${kr(scoutCost(m))}</button>`).join("")}</div>`;
  }
  html+=`</div>`; app.innerHTML=html; wireHeader();
  document.querySelectorAll(".scoutbtn").forEach(b=>b.onclick=()=>sendScout(+b.dataset.m));
}

/* ---------- Ungdomsakademi ---------- */
function renderYouth(app){
  if(!S.youth) S.youth=genYouth(); if(!S.academy) S.academy=[];
  migrateYouth(); if(!S.youthTables) simYouthLeagues(); // sørg for at tabellene finnes uten å spille
  const today=youthTodayTeams(S.day);
  let html=header()+infobar()+flashBar();
  if(!S.youthView){
    const labels=Object.keys(S.youth).sort((a,b)=> groupMaxAge(a)-groupMaxAge(b) || a.localeCompare(b,"no"));
    if(today.length) html+=`<div class="flash">🧒 Ungdomskamp i dag: <b>${today.map(esc).join(", ")}</b> – gå inn på laget for å se kampen!</div>`;
    html+=`<div class="card"><h3>Ungdomsakademi – ${esc(S.userTeam)}</h3>
      <p class="muted2">Trykk på et lag for spillere, kamp og egne spillere. Spillerne rykker opp et trinn hver sesong.</p>
      <div class="ylist">${labels.map(l=>`<button class="ybtn ${today.includes(l)?'playing':''}" data-y="${esc(l)}">${esc(l)}${today.includes(l)?' ⚽':''} <span class="muted2">${S.youth[l].length} sp · snitt ${youthRating(l)}</span></button>`).join("")}</div>
      <h4>Opprett ekstra lag</h4>
      <div class="createform"><select id="ngBase">${[...YGROUPS.map(n=>"G"+n),"U21"].map(g=>`<option>${g}</option>`).join("")}</select><button id="ngAdd" class="btn small primary">Opprett lag (f.eks. G12 2)</button></div>
    </div>`;
    html+=`<div class="card"><h3>🎓 Akademi – uplasserte talenter (${S.academy.length})</h3>`;
    if(!S.academy.length) html+=`<p class="muted2">Ingen talenter nå. Send ut en speider for å finne unge spillere.</p>`;
    else { const teamOpts=a=>Object.keys(S.youth).filter(l=>groupMaxAge(l)>=a).sort((x,y)=>groupMaxAge(x)-groupMaxAge(y));
      html+=S.academy.map((p,i)=>`<div class="mrow"><span class="pn">${esc(p.name)} <i class="muted2">${p.age}å</i></span><span class="prt">${p.rating}</span>
        <span class="bidcell"><select class="acsel" data-i="${i}">${teamOpts(p.age).map(l=>`<option>${esc(l)}</option>`).join("")}</select><button class="btn small primary" data-ac="${i}">Sett på lag</button></span></div>`).join(""); }
    html+=`</div>`;
    app.innerHTML=html; wireHeader();
    document.querySelectorAll(".ybtn").forEach(b=>b.onclick=()=>{ S.youthView=b.dataset.y; render(); });
    if($("ngAdd")) $("ngAdd").onclick=()=>addYouthTeam($("ngBase").value);
    document.querySelectorAll("[data-ac]").forEach(b=>b.onclick=()=>{ const i=+b.dataset.ac; const sel=document.querySelector(`.acsel[data-i="${i}"]`); assignAcademy(i, sel?sel.value:null); });
    return;
  }
  const label=S.youthView, team=(S.youth[label]||[]).slice().sort((a,b)=>b.rating-a.rating);
  const playsToday=today.includes(label); const ts=youthTopScorer(label);
  html+=`<div class="card"><h3>${esc(label)} <span class="muted2">(maks ${groupMaxAge(label)} år)</span>${playsToday?' <b class="ok2">⚽ spiller i dag</b>':''}</h3>
    ${ts?`<p class="muted2">⚽ Toppscorer: <b>${esc(ts.name)}</b> (${ts.goals} mål)</p>`:''}
    <p class="muted2">Trykk på en spiller for å bytte posisjon, flytte, ta opp til A-laget eller fjerne.</p>
    <div class="plist">${team.map(p=>`<button class="prow" data-yp="${esc(p.name)}"><span class="pn">${esc(p.name)}${p.custom?' <i class="muted2">(egen)</i>':p.fromAcademy?' <i class="muted2">(akademi)</i>':''}</span><span class="pa">${p.pos||''} · ${p.age} år${p.goals?' · '+p.goals+' ⚽':''}</span><span class="prt">${p.rating}</span></button>`).join("")||'<p class="muted2">Ingen spillere.</p>'}</div>
    <div class="lineupbtns" style="margin-top:10px">${playsToday?`<button id="yWatch" class="btn big primary">Se kampen (live) ▶</button>`:''}<button id="yMatch" class="btn small">Spill treningskamp</button><button id="yBack" class="btn small">Tilbake til lagene</button></div>`;
  if(S.youthResult && S.youthResult.label===label){ const r=S.youthResult;
    html+=`<div class="reslist" style="margin-top:10px"><div class="resrow mine"><span class="rl">${esc(S.userTeam)} ${esc(label)}</span><span class="sc">${r.hg} – ${r.ag}</span><span class="rr">${esc(r.opp||'Motstander')}</span></div></div>
      ${r.evs&&r.evs.length?`<div class="muted2" style="margin-top:6px">${r.evs.map(e=>`⚽ ${e.min}' ${esc(e.name)}`).join("<br>")}</div>`:''}`; }
  html+=`</div>`;
  if(isTableGroup(label) && S.youthTables && S.youthTables[label]){ const tb=S.youthTables[label];
    html+=`<div class="card"><h3>Tabell – ${esc(label)} <span class="muted2">(${matchMinutes(label)} min kamper · ferdig før sesongstart)</span></h3>
      <table class="ltbl"><thead><tr><th>#</th><th class="tn">Lag</th><th>K</th><th>Mål</th><th>+/-</th><th>P</th></tr></thead>
      <tbody>${tb.map((r,i)=>`<tr class="${r.user?'me':''}"><td>${i+1}</td><td class="tn">${esc(r.name)}</td><td>${r.w+r.d+r.l}</td><td>${r.gf}-${r.ga}</td><td>${r.gf-r.ga>0?'+':''}${r.gf-r.ga}</td><td class="pts">${r.p}</td></tr>`).join("")}</tbody></table></div>`;
  }
  html+=`<div class="card"><h4>Lag egen spiller</h4>
    <div class="createform"><input id="yName" placeholder="Navn"/>
      <select id="yPos">${POSORDER.map(p=>`<option value="${p}">${POSNAME[p]}</option>`).join("")}</select>
      <input id="yAge" type="number" min="5" max="21" value="${groupMaxAge(label)}" title="Alder"/>
      <button id="yAdd" class="btn small primary">Legg til på ${esc(label)}</button></div>
    <p class="muted2">Maks ${groupMaxAge(label)} år – velg posisjon. Du kan bytte posisjon senere ved å trykke på spilleren.</p></div>`;
  app.innerHTML=html; wireHeader();
  if($("yWatch")) $("yWatch").onclick=()=>watchYouthMatch(label);
  if($("yMatch")) $("yMatch").onclick=()=>playYouthMatch(label);
  if($("yBack")) $("yBack").onclick=()=>{ S.youthView=null; render(); };
  if($("yAdd")) $("yAdd").onclick=()=>createYouthPlayer(label, $("yName").value, $("yAge").value, $("yPos").value);
  document.querySelectorAll(".prow[data-yp]").forEach(b=>b.onclick=()=>openYouthPlayer(label, b.dataset.yp));
}

/* ---------- Ungdomsspiller: flytt / ta opp / fjern ---------- */
function renderYouthPlayer(app){
  const sel=S.ysel||{}, label=sel.label, name=sel.name;
  const arr=(S.youth&&S.youth[label])||[]; const p=arr.find(x=>x.name===name);
  let html=header()+infobar()+flashBar();
  if(!p){ html+=`<div class="card"><p class="muted2">Fant ikke spilleren.</p><button id="ypBack" class="btn small">Tilbake</button></div>`;
    app.innerHTML=html; wireHeader(); if($("ypBack")) $("ypBack").onclick=()=>{S.screen="youth";render();}; return; }
  const targets=Object.keys(S.youth).filter(l=>l!==label && groupMaxAge(l)>=p.age).sort((a,b)=>groupMaxAge(a)-groupMaxAge(b));
  html+=`<div class="card"><h3>${esc(p.name)} <span class="muted2">(${esc(label)})</span></h3>
    <div class="pdgrid"><span>Posisjon</span><span>${POSNAME[p.pos]||p.pos||'-'}</span><span>Alder</span><span>${p.age} år</span><span>Født</span><span>${S.season-p.age}</span><span>Styrke</span><span class="prt">${p.rating}</span></div>
    <h4>Bytt posisjon</h4>
    <div class="createform"><select id="ypPos">${POSORDER.map(x=>`<option value="${x}" ${x===p.pos?'selected':''}>${POSNAME[x]}</option>`).join("")}</select><button id="ypSetPos" class="btn small primary">Endre posisjon</button></div>
    <h4>Flytt til annet ungdomslag</h4>
    <div class="createform"><select id="ypTo">${targets.length?targets.map(l=>`<option>${esc(l)}</option>`).join(""):'<option value="">(ingen passende lag)</option>'}</select><button id="ypMove" class="btn small primary">Flytt</button></div>
    <div class="lineupbtns" style="margin-top:12px">
      <button id="ypSenior" class="btn small primary">⬆ Ta opp til A-laget</button>
      <button id="ypRemove" class="btn small">🗑 Fjern spiller</button>
      <button id="ypBack" class="btn small">Tilbake</button></div></div>
    <div class="card">${chatBox(name)}</div>`;
  app.innerHTML=html; wireHeader(); wireChat(name);
  if($("ypSetPos")) $("ypSetPos").onclick=()=>setYouthPos(label,name,$("ypPos").value);
  if($("ypMove")) $("ypMove").onclick=()=>{ const to=$("ypTo").value; if(to) moveYouthPlayer(label,name,to); };
  if($("ypSenior")) $("ypSenior").onclick=()=>promoteYouthToSenior(label,name);
  if($("ypRemove")) $("ypRemove").onclick=()=>removeYouthPlayer(label,name);
  if($("ypBack")) $("ypBack").onclick=()=>{ S.screen="youth"; render(); };
}

/* ---------- Spillerdetalj ---------- */
function renderPlayerDetail(app){
  ensureSquadContracts();
  const p=S.squad.find(x=>x.name===S.detail);
  let html=header()+infobar();
  if(p){ const born=S.season-p.age; const car=careerOf(p.name, S.userTeam);
    html+=`<div class="card"><h3>${esc(p.name)}</h3>
      <div class="pdgrid">
        <span>Posisjon</span><span>${POSNAME[p.pos]||p.pos}</span>
        <span>Styrke</span><span class="prt">${p.rating}</span>
        <span>Alder</span><span>${p.age} år</span>
        <span>Født</span><span>${born}</span>
        <span>Karriere</span><span>${car.homegrown?`Egenutviklet i ${esc(S.userTeam)} fra ${car.startAge} år`:`Startet i ${esc(car.started)} som ${car.startAge}-åring`}</span>
        <span>Nå i</span><span>${esc(S.userTeam)}</span>
        <span>Kontrakt</span><span>${!gset("contracts",true)?'<span class="muted2">slått av i ⚙️ Innstillinger – ingen kontrakter går ut</span>':p.contract>0?`${p.contract} sesong(er) igjen`:'<b class="no2">utløper etter sesongen – forny nå, ellers går han gratis!</b>'}</span>
        <span>Ukelønn</span><span>${kr(p.wage)}</span>
      </div>
      <div class="lineupbtns" style="margin-top:10px">
        ${gset("contracts",true)?`<button id="renew" class="btn small primary">Forny kontrakt (+2 sesonger) – ${kr(renewalCost(p))}</button>`:""}
        <button id="release" class="btn small danger">🚪 Kast ut av klubben (+${kr(Math.round((p.value||0)*0.5))})</button>
        <button id="pdBack" class="btn small">Tilbake</button></div>
      <p class="muted2" style="margin:8px 0 0">Kaster du ham ut får du <b>50 %</b> av verdien med en gang. Vil du ha mer, legg ham ut for salg i Overgangsmarked og vent på bud.</p></div>
      <div class="card">${chatBox(p.name)}</div>`;
  } else html+=`<div class="card"><p class="muted2">Fant ikke spilleren.</p><button id="pdBack" class="btn small">Tilbake</button></div>`;
  app.innerHTML=html; wireHeader();
  if($("renew")&&p) $("renew").onclick=()=>{ const c=renewalCost(p); if(S.budget<c){ FLASH="⚠ Ikke råd til å fornye kontrakten."; render(); return; } S.budget-=c; p.contract+=2; FLASH=`✅ ${p.name} har fornyet kontrakten (+2 sesonger).`; save(); render(); };
  if($("release")&&p) $("release").onclick=()=>{ if(confirm(`Kaste ${p.name} ut av klubben for ${kr(Math.round((p.value||0)*0.5))} (50 % av verdien)?`)){ S.screen=S.detailBack||"squad"; releasePlayer(p.name); } };
  if($("pdBack")) $("pdBack").onclick=()=>{ S.screen=S.detailBack||"squad"; render(); };
  if(p) wireChat(p.name);
}

/* ---------- Straffekonkurranse (NM, ved uavgjort) ---------- */
function renderShootout(app){
  const so=S.shootout, opp=S.cup.opponent;
  const row=side=>so.log.filter(k=>k.side===side).map(k=>`<span class="pk ${k.scored?'sc':'ms'}">${k.scored?'⚽':'✗'}</span>`).join("")||'—';
  let html=`<div class="card live">
    <div class="lvtop">🥅 Straffekonkurranse · NM ${ROUND_NAMES[S.cup.roundIdx]}</div>
    <div class="lvteams"><span class="lvname me">${esc(S.userTeam)}</span><span class="lvscore"><b>${so.us}</b><i>-</i><b>${so.them}</b></span><span class="lvname">${esc(opp.name)}</span></div>
    <div class="penrows"><div><b>${esc(S.userTeam)}:</b> ${row("user")}</div><div><b>${esc(opp.name)}:</b> ${row("opp")}</div></div>`;
  if(!so.decided){
    html+=`<p class="muted2" style="text-align:center;margin-top:10px">Velg hvem som skal ta straffen (${so.ut<5?'runde '+(so.ut+1)+' av 5':'sudden death'}):</p>
      <div class="penpick">${userXI().slice().sort((a,b)=>b.rating-a.rating).map(p=>`<button class="btn small pentaker" data-t="${esc(p.name)}">${esc(p.name)} <span class="prt">${p.rating}</span></button>`).join("")}</div>`;
  } else {
    const won=so.decided==="user";
    html+=`<div class="endcard ${won?'gold':'releg'}" style="margin-top:12px"><h2>${won?'✅ Videre!':'❌ Ute av cupen'}</h2>
      <p>${won?`${esc(S.userTeam)} vant straffekonkurransen ${so.us}–${so.them}`:`${esc(opp.name)} vant ${so.them}–${so.us}`}</p>
      <button id="penDone" class="btn big primary">Fortsett ▶</button></div>`;
  }
  html+=`</div>`; app.innerHTML=html;
  document.querySelectorAll(".pentaker").forEach(b=>b.onclick=()=>takePenalty(b.dataset.t));
  if($("penDone")) $("penDone").onclick=finishShootout;
}

/* ---------- Trener legger opp etter 25 sesonger ---------- */
function renderManagerRetire(app){
  app.innerHTML=`<div class="card setup">
    <h1>🎖️ Karrieren er over</h1>
    <p class="sub">${esc(S.manager)} har lagt opp som trener etter 25 sesonger${S.userTeam?` – sist med ${esc(S.userTeam)}`:""}. Nå kan neste generasjon ta over ${esc(S.userTeam)}!</p>
    <label>Navn på sønnen/datteren din som overtar</label>
    <input id="heirName" placeholder="Skriv navnet"/>
    <button id="heirGo" class="btn big primary">Fortsett med barnet ditt ▶</button>
    <button id="randomHeir" class="btn link">…eller ta en tilfeldig person</button>
  </div>`;
  $("heirGo").onclick=()=>succeedManager($("heirName").value.trim());
  $("randomHeir").onclick=()=>succeedManager(randName());
}

/* ---------- Sparken: 5 klubbtilbud (med divisjon) ---------- */
function genSackOffers(){
  const offers=[], seen=new Set([S.userTeam]); let tries=0;
  while(offers.length<5 && tries++<300){
    const di=clamp(S.divIndex + ((Math.random()*5)|0)-1, 0, DIVISIONS.length-1); // klubber rundt nivået ditt
    const d=DIVISIONS[di], gi=(Math.random()*d.groups.length)|0, teams=curTeams(di,gi);
    const t=teams[(Math.random()*teams.length)|0];
    if(seen.has(t)) continue; seen.add(t);
    offers.push({team:t, divIndex:di, groupIndex:gi, div:d.name});
  }
  return offers;
}
function renderSacked(app){
  const f=S._lastFinish||{};
  if(!S._sackOffers || !S._sackOffers.length) S._sackOffers=genSackOffers();
  const offers=S._sackOffers;
  app.innerHTML=`<div class="card setup">
    <h1>📉 Du fikk sparken!</h1>
    <p class="sub">${esc(S.manager)} fikk sparken av ${esc(f.club||S.userTeam)}${f.pos?` etter ${f.pos}. plass`:""}. <b>Fem klubber</b> vil ha deg – velg én:</p>
    <div class="joblist">${offers.map((o,i)=>`<button class="joboffer" data-i="${i}">
      <span class="jteam">${esc(o.team)} <span class="str">${strength(o.team,o.divIndex)}</span></span>
      <span class="jdiv">${esc(o.div)}${DIVISIONS[o.divIndex].groups.length>1?' · '+esc(DIVISIONS[o.divIndex].groups[o.groupIndex].name||''):''}</span></button>`).join("")}</div>
  </div>`;
  document.querySelectorAll(".joboffer").forEach(b=>b.onclick=()=>{ const o=offers[+b.dataset.i]; S._sackOffers=null; takeNewClub(o.divIndex,o.groupIndex,o.team); });
}

/* ---------- Sesongslutt ---------- */
function renderSeasonEnd(app){
  const table=computeTable(S.teams,S.results), pos=table.findIndex(r=>r.team===S.userTeam)+1, n=table.length, d=DIVISIONS[S.divIndex];
  let title,msg,cls;
  if(S.divIndex===0&&pos===1){ title="🏆 SERIEMESTER!"; msg=`${S.userTeam} vant Eliteserien!`; cls="gold"; }
  else if(S.divIndex>0&&pos<=d.promote){ title="⬆ OPPRYKK!"; msg=`${pos}. plass – ${S.userTeam} rykker opp til ${DIVISIONS[S.divIndex-1].name}.`; cls="promo"; }
  else if(S.divIndex<DIVISIONS.length-1&&pos>n-d.relegate){ title="⬇ Nedrykk"; msg=`${pos}. plass – ${S.userTeam} rykker ned til ${DIVISIONS[S.divIndex+1].name}.`; cls="releg"; }
  else { title="Sesongen er over"; msg=`${S.userTeam} endte på ${pos}. plass.`; cls=""; }
  app.innerHTML=header()+`<div class="card endcard ${cls}"><h2>${title}</h2><p>${esc(msg)}</p><button id="next" class="btn big primary">Start neste sesong ▶</button></div>`+tableHtml(table);
  wireHeader(); $("next").onclick=nextSeason;
}

/* ---------- Ligaoversikt ---------- */
/* ---------- Klubbcasino: Plinko, kron/mynt og Mines – du vedder klubbkassa ---------- */
const PLINKO_ROWS=12, PLINKO_MULT=[15,6,2.5,1.6,1.1,0.7,0.5,0.7,1.1,1.6,2.5,6,15];
function minesMult(m,k){ let f=1; for(let i=0;i<k;i++) f*=(25-i)/(25-m-i); return 0.97*f; }
function casBet(){ const el=$("casBet"); return Math.round(el?+el.value||0:CAS.bet); }
function casCanBet(b){
  if(b<100){ FLASH="⚠ Minste innsats er 100 kr."; render(); return false; }
  if(b>S.budget){ FLASH="⚠ Du har ikke så mye i klubbkassa ("+kr(S.budget)+")."; render(); return false; }
  return true;
}
function fmtX(m){ return (Math.round(m*100)/100+"").replace(".",","); }
function renderCasino(app){
  const g=CAS.game, mn=S.casMines, lockBet=CAS.busy||(mn&&!mn.over&&g==="mines");
  let area="";
  if(g==="plinko"){
    let pegs=""; for(let r=0;r<PLINKO_ROWS;r++) for(let c=0;c<=r;c++)
      pegs+=`<span class="peg" style="left:${170+(c-r/2)*24-3}px;top:${20+r*26}px"></span>`;
    const res=CAS.res&&CAS.res.game==="plinko"?CAS.res:null;
    area=`<div class="plinkoWrap"><div id="plinkoBoard">${pegs}<span id="plinkoBall" style="display:none">⚽</span></div>
      <div class="plinkoSlots">${PLINKO_MULT.map((m,i)=>`<span class="pslot ${m>=6?'hi':''} ${res&&res.slot===i?'win':''}">${fmtX(m)}×</span>`).join("")}</div></div>
      <button id="plinkoDrop" class="btn big primary" ${CAS.busy?'disabled':''}>${CAS.busy?'Ballen faller…':'Slipp ballen 🎯'}</button>
      ${res?`<div class="casres ${res.win>=res.bet?'win':'lose'}">Ballen landet på ${fmtX(res.mult)}× – du fikk ${kr(res.win)} (innsats ${kr(res.bet)})</div>`:""}`;
  } else if(g==="coin"){
    const res=CAS.res&&CAS.res.game==="coin"?CAS.res:null;
    area=`<div class="coinface" id="coinFace">${res?res.face:"🪙"}</div>
      <div class="coinbtns"><button id="coinK" class="btn" ${CAS.busy?'disabled':''}>👑 Kron</button>
        <button id="coinM" class="btn" ${CAS.busy?'disabled':''}>🪙 Mynt</button></div>
      <p class="muted2" style="text-align:center">Velg side og vedd – riktig side gir 1,96× innsatsen.</p>
      ${res?`<div class="casres ${res.win?'win':'lose'}">Det ble ${res.face==="👑"?"kron":"mynt"}! ${res.win?"Du vant "+kr(res.win):"Du tapte "+kr(res.bet)}</div>`:""}`;
  } else { // mines
    if(mn){
      const openSet=new Set(mn.open), bombSet=new Set(mn.bombs), mult=minesMult(mn.m,mn.open.length);
      area=`<div class="minesgrid">${Array.from({length:25},(_,i)=>{
        let cls="mtile", txt="";
        if(openSet.has(i)){ cls+=" safe"; txt="💎"; }
        if(mn.over&&bombSet.has(i)){ cls="mtile boom"; txt=i===mn.boomIdx?"💥":"💣"; }
        return `<button class="${cls}" data-mt="${i}" ${mn.over||openSet.has(i)?'disabled':''}>${txt}</button>`; }).join("")}</div>`;
      if(mn.over) area+=`<div class="casres ${mn.win?'win':'lose'}">${mn.win?"💰 Du tok ut "+kr(mn.win)+" ("+fmtX(mn.winMult)+"×)!":"💥 Du traff en mine og tapte "+kr(mn.bet)+"."}</div>
        <button id="minesNew" class="btn big primary">Ny runde</button>`;
      else area+=`<div class="casres">💣 ${mn.m} miner · ${mn.open.length} åpnet · nå: ${fmtX(mult)}× av ${kr(mn.bet)}</div>`
        +(mn.open.length?`<button id="minesCash" class="btn big primary">Ta ut ${kr(Math.round(mn.bet*mult))} 💰</button>`
                        :`<p class="muted2" style="text-align:center">Trykk på rutene og finn 💎 – men unngå minene!</p>`);
    } else {
      area=`<div class="formpills" style="justify-content:center">${[2,5,10].map(n=>`<button class="tac ${CAS.minesN===n?'on':''}" data-mn="${n}">${n} miner</button>`).join("")}</div>
        <p class="muted2" style="text-align:center">Flere miner = høyere gevinst per rute. Ta ut når du vil – treffer du en mine, taper du alt.</p>
        <button id="minesStart" class="btn big primary">Start Mines 💣</button>`;
    }
  }
  app.innerHTML=header()+infobar()+flashBar()+`<div class="card casino">
    <h3>🎰 Klubbcasino</h3>
    <p class="muted2">Du vedder med klubbkassa (<b>${kr(S.budget)}</b>). Vinn stort – eller forklar tapet for styret…</p>
    <div class="formpills">${[["plinko","🎯 Plinko"],["coin","🪙 Kron eller mynt"],["mines","💣 Mines"]].map(([k,l])=>`<button class="tac ${g===k?'on':''}" data-cg="${k}">${l}</button>`).join("")}</div>
    <div class="betrow">Innsats: <input id="casBet" type="number" min="100" step="100" value="${CAS.bet}" ${lockBet?'disabled':''}/>
      <button class="btn small" data-bx="0.5" ${lockBet?'disabled':''}>½</button>
      <button class="btn small" data-bx="2" ${lockBet?'disabled':''}>2×</button>
      <button id="betMax" class="btn small" ${lockBet?'disabled':''}>Alt 😱</button></div>
    ${area}
  </div>`;
  wireHeader();
  document.querySelectorAll("[data-cg]").forEach(b=>b.onclick=()=>{ if(CAS.busy) return; CAS.game=b.dataset.cg; CAS.res=null; render(); });
  const bi=$("casBet");
  if(bi) bi.onchange=()=>{ CAS.bet=Math.max(100,Math.round(+bi.value||100)); };
  document.querySelectorAll("[data-bx]").forEach(b=>b.onclick=()=>{ CAS.bet=clamp(Math.round(casBet()*+b.dataset.bx),100,Math.max(100,S.budget)); render(); });
  if($("betMax")) $("betMax").onclick=()=>{ CAS.bet=Math.max(100,S.budget); render(); };
  if($("plinkoDrop")) $("plinkoDrop").onclick=()=>{
    if(CAS.busy) return; const b=casBet(); if(!casCanBet(b)) return;
    CAS.bet=b; S.budget-=b; save(); CAS.busy=true; CAS.res=null; render(); animatePlinko(b); };
  if($("coinK")) $("coinK").onclick=()=>flipCoin("K");
  if($("coinM")) $("coinM").onclick=()=>flipCoin("M");
  if($("minesStart")) $("minesStart").onclick=()=>{
    const b=casBet(); if(!casCanBet(b)) return;
    CAS.bet=b; S.budget-=b;
    const idx=Array.from({length:25},(_,i)=>i);
    for(let i=idx.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [idx[i],idx[j]]=[idx[j],idx[i]]; }
    S.casMines={bombs:idx.slice(0,CAS.minesN), open:[], bet:b, m:CAS.minesN, over:false, boomIdx:null, win:0, winMult:0};
    save(); render(); };
  document.querySelectorAll("[data-mn]").forEach(b=>b.onclick=()=>{ CAS.minesN=+b.dataset.mn; render(); });
  document.querySelectorAll("[data-mt]").forEach(b=>b.onclick=()=>minesPick(+b.dataset.mt));
  if($("minesCash")) $("minesCash").onclick=minesCash;
  if($("minesNew")) $("minesNew").onclick=()=>{ S.casMines=null; save(); render(); };
}
function animatePlinko(bet){
  const ball=$("plinkoBall");
  let k=0, r=-1;
  if(ball){ ball.style.display="block"; ball.style.left="162px"; ball.style.top="0px"; }
  const iv=setInterval(()=>{
    r++;
    if(r>=PLINKO_ROWS){ clearInterval(iv);
      const mult=PLINKO_MULT[k], win=Math.round(bet*mult);
      S.budget+=win; CAS.busy=false; CAS.res={game:"plinko",mult,win,bet,slot:k};
      save(); if(S&&S.screen==="casino") render();
      return; }
    if(Math.random()<0.5) k++;
    const el=$("plinkoBall");
    if(el){ el.style.left=(170+(k-(r+1)/2)*24-8)+"px"; el.style.top=(20+r*26)+"px"; }
  },130);
}
function flipCoin(choice){
  if(CAS.busy) return; const bet=casBet(); if(!casCanBet(bet)) return;
  CAS.bet=bet; S.budget-=bet; save(); CAS.busy=true; CAS.res=null; render();
  let t=0;
  const iv=setInterval(()=>{
    t++; const el=$("coinFace"); if(el) el.textContent=t%2?"👑":"🪙";
    if(t>=12){ clearInterval(iv);
      const resK=Math.random()<0.5, win=(resK?"K":"M")===choice?Math.round(bet*1.96):0;
      S.budget+=win; CAS.busy=false; CAS.res={game:"coin",face:resK?"👑":"🪙",win,bet};
      save(); if(S&&S.screen==="casino") render(); }
  },100);
}
function minesPick(i){
  const mn=S.casMines; if(!mn||mn.over||mn.open.includes(i)) return;
  if(mn.bombs.includes(i)){ mn.over=true; mn.boomIdx=i; mn.win=0; save(); render(); return; }
  mn.open.push(i);
  if(mn.open.length===25-mn.m){ mn.winMult=minesMult(mn.m,mn.open.length); mn.win=Math.round(mn.bet*mn.winMult); S.budget+=mn.win; mn.over=true; } // tømte brettet!
  save(); render();
}
function minesCash(){
  const mn=S.casMines; if(!mn||mn.over||!mn.open.length) return;
  mn.winMult=minesMult(mn.m,mn.open.length); mn.win=Math.round(mn.bet*mn.winMult);
  S.budget+=mn.win; mn.over=true; save(); render();
}

/* ---------- Innstillinger: brytere per karriere + juksekoder ---------- */
/* Advarsel før første juks i en karriere: merket kan ikke fjernes */
function cheatWarn(){
  if(S && S.cheated) return true; // allerede merket – ingen ny advarsel
  return confirm("⚠ JUKSEKODER\n\nBruker du dette, blir karrieren merket med «🎮 Jukset» – det vises i toppen og på lagringslisten, og kan ikke fjernes.\n\nVil du fortsette?");
}
function setSet(k,v){
  if(S){ S.settings=S.settings||{}; S.settings[k]=v; save(); }
  try{ const g=gsetGlobal(); g[k]=v; localStorage.setItem(GSET_KEY, JSON.stringify(g)); }catch(e){} // gjelder også andre/nye karrierer
  render();
}
function renderSettings(app){
  const row=(k,def,tittel,beskr)=>{ const on=gset(k,def);
    return `<div class="setrow"><div class="setinfo"><b>${tittel}</b><span>${beskr}</span></div>
      <button class="btn small ${on?'primary':''}" data-set="${k}" data-def="${def?1:0}">${on?'PÅ':'AV'}</button></div>`; };
  app.innerHTML=header()+infobar()+flashBar()+`<div class="card">
    <h3>⚙️ Innstillinger</h3>
    <p class="muted2">Lagres automatisk og gjelder <b>alle</b> karrierene dine – også nye. Du kan endre når som helst.</p>
    ${row("contracts",true,"Kontrakter","PÅ = kontrakter går ut og må fornyes. AV = du slipper å tenke på kontrakter – ingen forsvinner.")}
    ${row("youthMatches",true,"Ungdomskamper","PÅ = ungdomslagene spiller kamper på kalenderen. AV = ingen ungdomskamper eller varsler (du kan fortsatt se troppene).")}
    ${row("injuries",true,"Skader og utmattelse","PÅ = spillere kan bli skadet eller kollapse i kamp. AV = skadefritt lag.")}
    ${row("alwaysWindow",false,"Overgangsvindu alltid åpent","PÅ = kjøp og selg spillere hele året. AV = kun januar, juni, juli og august.")}
    ${row("sacking",true,"Sparken","PÅ = du kan få sparken etter nedrykk. AV = trygg i jobben uansett resultat.")}
    ${row("cheats",false,"Juksekoder","PÅ = viser jukse-knappene under: sett penger, helbred alle og superlag.")}
    ${gset("cheats",false)?`<h4>💰 Juksekoder <span class="muted2" style="font-weight:400">(bruker du dem, merkes karrieren med 🎮 Jukset)</span></h4>
      <div class="createform">
        <input id="chAmt" type="number" placeholder="Beløp (kr)" style="flex:1;min-width:130px"/>
        <button id="chMoney" class="btn small primary">Sett penger</button>
        <button id="chHeal" class="btn small">❤️ Helbred alle</button>
        <button id="chBoost" class="btn small">💪 Superlag +5</button>
      </div>
      <h4>⬆️ Oppgrader spiller (juks)</h4>
      <div class="createform">
        <select id="chPl" style="flex:1;min-width:150px"></select>
        <input id="chRat" type="number" min="20" max="99" style="width:80px" title="Ny styrke (20–99)"/>
        <button id="chUp" class="btn small primary">Oppgrader</button>
      </div>
      <p class="muted2">Velg en spiller i troppen og sett styrken hans (20–99).</p>
      <h4>🚀 Bytt klubb (juks)</h4>
      <div class="createform">
        <select id="chDiv"></select><select id="chGrp"></select><select id="chTeam"></select>
        <button id="chGo" class="btn small primary">Ta over klubben</button>
      </div>
      <p class="muted2">Du tar over klubben umiddelbart – sesongen starter på nytt 1. januar. Egne/signerte spillere blir igjen i gamleklubben som vanlig.</p>`:""}
  </div>`;
  wireHeader();
  document.querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{ const def=b.dataset.def==="1"; setSet(b.dataset.set, !gset(b.dataset.set,def)); });
  if($("chMoney")) $("chMoney").onclick=()=>{ if(!cheatWarn()) return; const v=Math.max(0,Math.round(+$("chAmt").value||0)); S.budget=v; S.cheated=true; FLASH="💰 Juksekode: penger satt til "+kr(v)+"."; save(); render(); };
  if($("chHeal")) $("chHeal").onclick=()=>{ if(!cheatWarn()) return; S.squad.forEach(p=>{ p.outDays=0; p.outReason=null; if(p.fit!=null) p.fit=100; }); S.cheated=true; FLASH="❤️ Juksekode: alle spillere er friske og uthvilte."; save(); render(); };
  if($("chBoost")) $("chBoost").onclick=()=>{ if(!cheatWarn()) return; S.squad.forEach(p=>{ p.rating=clamp(p.rating+5,20,99); p.value=playerValue(p.rating); }); S.cheated=true; FLASH="💪 Juksekode: hele troppen fikk +5 i styrke!"; save(); render(); };
  const pl=$("chPl");
  if(pl){
    S.squad.slice().sort((a,b)=>b.rating-a.rating).forEach(p=>pl.add(new Option(`${p.name} (${p.pos} · ${p.rating})`, p.name)));
    const syncR=()=>{ const p=squadByName(pl.value); if(p) $("chRat").value=p.rating; };
    pl.onchange=syncR; syncR();
    $("chUp").onclick=()=>{ if(!cheatWarn()) return;
      const p=squadByName(pl.value); if(!p){ FLASH="⚠ Velg en spiller."; render(); return; }
      const r=clamp(Math.round(+$("chRat").value||0),20,99);
      p.rating=r; p.value=playerValue(r); S.cheated=true;
      FLASH=`⬆️ Juksekode: ${p.name} har nå ${r} i styrke!`; save(); render(); };
  }
  const cd=$("chDiv"), cg=$("chGrp"), ct=$("chTeam");
  if(cd){
    DIVISIONS.forEach((d,i)=>cd.add(new Option(d.name,i)));
    const fillG=()=>{ cg.innerHTML=""; DIVISIONS[+cd.value].groups.forEach((g,i)=>cg.add(new Option(g.name||"Serien",i))); fillT(); };
    const fillT=()=>{ ct.innerHTML=""; DIVISIONS[+cd.value].groups[+cg.value].teams.forEach(t=>ct.add(new Option(t,t))); };
    cd.onchange=fillG; cg.onchange=fillT;
    cd.value=S.divIndex; fillG(); cg.value=S.groupIndex; fillT();
    $("chGo").onclick=()=>{
      const team=ct.value;
      if(team===S.userTeam){ FLASH="⚠ Du er allerede manager i "+team+"."; render(); return; }
      if(!cheatWarn()) return;
      S.cheated=true; FLASH="🚀 Juksekode: du har tatt over "+team+"!";
      takeNewClub(+cd.value, +cg.value, team);
    };
  }
}

/* ---------- Guide / Slik spiller du ---------- */
function renderGuide(app){
  const back=S._setup?"setup":"season";
  app.innerHTML=`
  <div class="topbar"><div><span class="club">📖 Guide</span><span class="meta">Slik spiller du Norsk Tippeliga</span></div><div class="actions"><button id="back" class="btn small">Tilbake</button></div></div>
  <div class="guide">
  <div class="card"><h3>⚽ Kom i gang</h3>
    <ul>
      <li>Skriv manager-navn, velg divisjon → avdeling → lag (eller bruk søkefeltet) – fra Eliteserien ned til 7. divisjon.</li>
      <li>Du kan også lage din <b>egen klubb</b> med egne spillere, eller starte en <b>spillerkarriere</b> som én enkelt spiller.</li>
      <li>Velg taktikk og trykk <b>Spill kamp (live)</b> – kampen spilles minutt for minutt (1 minutt = 1 sekund). 5× hastighet og «Hopp til slutt» finnes.</li>
      <li>Topp i tabellen = opprykk, bunn = nedrykk. Karrieren lagres automatisk i nettleseren, og du kan ha <b>flere lagringer</b> samtidig.</li>
    </ul></div>
  <div class="card"><h3>📅 Kalender og sesong</h3>
    <ul>
      <li>Sesongen starter <b>1. januar</b>. Eliteserien sparkes i gang ~15. mars, lavere divisjoner i april.</li>
      <li>Trykk <b>«Neste dag»</b> eller <b>«Hopp til neste kamp»</b> for å bevege deg gjennom året – det er ikke kamp hele tiden.</li>
      <li><b>Overgangsvindu:</b> du kan kun signere spillere i <b>januar, juni, juli og august</b>. Utenom vinduet er markedet stengt.</li>
      <li><b>NM-cupen</b> spilles på faste datoer (1. runde 8. mai … finale 31. juli) mot lag fra hele pyramiden – uavgjort gir straffekonkurranse.</li>
      <li><b>Budsjett</b> varierer med divisjon – du tjener mer jo høyere du spiller.</li>
    </ul></div>
  <div class="card"><h3>🎮 Kamper</h3>
    <ul>
      <li>Live-kamp med målscorere, assist og kort i en levende kampfeed – pluss straffe, VAR, nesten-mål, røde kort og rødt ved to gule.</li>
      <li><b>Bytter:</b> under kampen kan du bytte inn spillere fra benken, eller slå på <b>auto-bytte</b> så spillet bytter selv (rundt 64' og 74').</li>
      <li><b>Kamprating (keeper → spiss):</b> ditt lag til høyre, motstanderen til venstre. Alle starter på 6,0 og endres live: mål +1,0 · assist +0,7 · nestenmål +0,1 · gult −0,5 · rødt −1,5, og keeperen trekkes per baklengsmål. Etter kampen justeres alt etter resultatet – clean sheet løfter keeper/forsvar ekstra.</li>
      <li><b>Straffetaker:</b> i Lagledelse velger du hvem som tar straffene i kamp – han brukes så lenge han er på banen.</li>
      <li><b>Straffekonkurranse i NM:</b> blir det uavgjort, velger du selv hvem som tar hver straffe (best av 5, så sudden death).</li>
    </ul></div>
  <div class="card"><h3>👥 Tropp og lagledelse</h3>
    <ul>
      <li>Hvert lag har en spillerstall med posisjon, alder og styrke. ★ = på laget. Maks 32 spillere, minst 14.</li>
      <li><b>Lagledelse:</b> velg formasjon (4-4-2, 4-3-3, 4-5-1, 3-5-2, 5-3-2) og bestem hvor hver spiller skal spille – høyreback, venstreback, spiss osv. Spillere på feil plass svekkes (⚠ −10, keeper-bytter −20), og de som ikke er på banen sitter på benken. Det påvirker lagstyrke og hvem som scorer.</li>
      <li><b>Lag egne spillere</b> under Tropp: velg alder fra 14 år. En 14-åring starter på 15 i styrke, +5 per år opp til 18 (= 35).</li>
      <li><b>Spillerdetalj:</b> trykk på en spiller for fødselsår, kontraktslengde og ukelønn. Kontrakter går ut og må fornyes (pris etter rating og alder). Du kan også <b>chatte</b> med spilleren.</li>
      <li>Eliteserien og OBOS-ligaen (alle 32 lag) har <b>ekte spillere</b> med ekte posisjon og alder. Mange lag i 2.–5. divisjon har også ekte spillernavn – resten får genererte norske navn.</li>
      <li><b>Stjerneratinger:</b> ligaens beste spillere har håndsatte, realistiske ratinger – Zlatko Tripić (Viking) er best i Eliteserien med <b>94</b>, foran Patrick Berg (93) og Jens Petter Hauge (92). Vanlige spillere går aldri over 90.</li>
    </ul></div>
  <div class="card"><h3>💰 Overgangsmarked</h3>
    <ul>
      <li>Søk i <b>alle</b> klubber i hele Norge og by på hvem som helst. Selgende klubb sier ja eller nei – høyt bud gir større sjanse, men spillere i bedre divisjoner krever kraftig overbud.</li>
      <li>Legger du en egen spiller ut for salg, kommer det bud fra andre lag som du kan godta eller avslå.</li>
      <li><b>Filtre:</b> posisjon, maks alder, maks pris og klubb.</li>
      <li><b>Bytter du klubb</b> (f.eks. sparken): egenlagde og signerte spillere blir igjen i den gamle klubben – søk dem opp og kjøp dem tilbake. Du får varsel om hvem som ble igjen.</li>
    </ul></div>
  <div class="card"><h3>🧒 Speider og ungdomsakademi</h3>
    <ul>
      <li><b>Speider:</b> send ut en speider i 3, 6 eller 9 måneder (pris etter klubben din). Han finner talenter (10–17 år) til akademi-poolen – derfra setter du dem selv på ungdomslagene.</li>
      <li><b>Akademiet</b> har lag fra G6 til U21. Du kan opprette ekstra lag (f.eks. «G12 2»), lage egne spillere og flytte spillere mellom lag – eller ta dem opp til A-laget (fra 14 år).</li>
      <li>Lagene fra G13 til U21 spiller i <b>ungdomsligaer med tabell</b>, mot lokale lag fra samme område. Kamplengde etter alder: under 13 = 30 min, 13–16 = 75 min, 17–21 = 90 min.</li>
      <li>På faste dager er det <b>ungdomskamp</b> (du får varsel) – se kampen live minutt for minutt, eller spill treningskamp når som helst. Spillerne rykker opp et trinn hver sesong, og det kommer 1–3 nye spillere per år.</li>
    </ul></div>
  <div class="card"><h3>📊 Statistikk</h3>
    <ul>
      <li>Toppscorere, flest assist, gule/røde kort og keepernes redninger.</li>
      <li>Øverst ser du toppscorerne på <b>dine egne lag</b> (A-laget og hvert ungdomslag), og du kan velge aldersgruppe (G6–U21).</li>
      <li>Velg <b>hvilken som helst liga</b> (divisjon + avdeling) og se sesongstatistikken der – din egen serie viser faktiske kamper, øvrige simuleres.</li>
    </ul></div>
  <div class="card"><h3>📈 Karriere og utvikling</h3>
    <ul>
      <li><b>Spillerutvikling:</b> etter hver sesong går spillere litt opp/ned – unge stiger, eldre synker, og gode prestasjoner gir løft. Hele ligaen utvikler seg, ikke bare ditt lag.</li>
      <li><b>Aldring og pensjon:</b> spillerne blir ett år eldre hver sesong og legger opp når de er 33–43. Akademiet henter inn ny ungdom hvert år.</li>
      <li><b>Sparken:</b> gjør du det dårlig og rykker ned, kan du få sparken og må finne ny klubb.</li>
      <li><b>Trenerkarriere:</b> etter 25 sesonger legger du opp, og kan fortsette med din sønn/datter (du velger navnet) eller en tilfeldig person.</li>
    </ul></div>
  <div class="card"><h3>⚙️ Innstillinger</h3>
    <ul>
      <li>Trykk på <b>⚙️</b> i toppmenyen for å skru av/på: <b>kontrakter</b> (slipp å fornye), <b>ungdomskamper</b>, <b>skader</b>, <b>overgangsvindu alltid åpent</b> og <b>sparken</b>.</li>
      <li>Slår du på <b>juksekoder</b>, kan du sette penger, helbrede alle spillere, gi troppen +5 i styrke, <b>oppgradere enkeltspillere</b> (sett styrken 20–99) og <b>ta over hvilken som helst klubb</b> i hele landet. Første juks gir en advarsel – bruker du den, merkes karrieren med <b>🎮 Jukset</b> for alltid.</li>
      <li>Innstillingene lagres automatisk og gjelder alle karrierene dine – også nye.</li>
    </ul></div>
  <div class="card"><h3>🎰 Klubbcasino</h3>
    <ul>
      <li>Under <b>Casino</b> i toppmenyen kan du vedde klubbkassa på tre spill: <b>Plinko</b> (slipp ballen og se hvor den lander – kantene gir 15×!), <b>Kron eller mynt</b> (riktig side gir 1,96×) og <b>Mines</b> (finn 💎, unngå minene, og ta ut gevinsten før det smeller).</li>
      <li>Alt du vinner og taper går rett inn og ut av budsjettet – vedd forsiktig, styret følger med…</li>
    </ul></div>
  <div class="card"><h3>💬 Chat med spillerne (AI)</h3>
    <ul>
      <li>Trykk på en spiller (A-lag eller ungdom) og skriv en melding – spilleren svarer i karakter.</li>
      <li>Med AI slått på svarer en ekte Claude-modell på det du skriver. Uten oppsett brukes enkle innebygde svar – spillet fungerer helt fint uansett.</li>
      <li><b>Slå på AI:</b> legg Anthropic-nøkkelen din i fila <code>apikey.txt</code> i spillmappa og start serveren med <code>node server.js</code> – står det «AI-chat PÅ ✅» i konsollen, er den klar. Se README for detaljer.</li>
    </ul></div>
  <div class="card"><h3>🗺️ Lagdata (2026-sesongen)</h3>
    <ul>
      <li>Eliteserien, 1., 2. og 3. divisjon bruker de <b>ekte 2026-oppsettene</b>. 5. divisjon avd 2 er Pol Tastas ekte Rogaland-gruppe.</li>
      <li>Øvrige avdelinger i 4.–7. divisjon fylles med ekte norske klubber, men med omtrentlig avdelingsinndeling – lett å rette i <code>game.js</code> (<code>DIVISIONS</code>-listen, ekte tropper i <code>REAL_SQUADS</code>).</li>
    </ul></div>
  </div>`;
  $("back").onclick=()=>{ if(back==="setup"){ S=null; render(); } else { S.screen= S.round>=S.fixtures.length?"seasonend":"season"; render(); } };
}

function renderBrowse(app){
  const back=S._setup?"setup":"season";
  let html=`<div class="topbar"><div><span class="club">Ligaoversikt</span><span class="meta">Alle divisjoner og lag · sesong ${S&&S.season?S.season:2026}</span></div><div class="actions"><button id="back" class="btn small">Tilbake</button></div></div>`;
  DIVISIONS.forEach((d,di)=>{ html+=`<div class="card"><h3>${esc(d.name)}</h3>`;
    d.groups.forEach((g,gi)=>{ const list=curTeams(di,gi).map(t=>{ const me=(S.userTeam&&t===S.userTeam)?' class="me-tag"':''; return `<li${me}>${esc(t)} <span class="str">${strength(t,di)}</span></li>`; }).join("");
      html+=`${g.name?`<h4>${esc(g.name)}</h4>`:""}<ul class="teamlist">${list}</ul>`; }); html+=`</div>`; });
  app.innerHTML=html;
  $("back").onclick=()=>{ if(back==="setup"){ S=null; render(); } else { S.screen= S.round>=S.fixtures.length?"seasonend":"season"; render(); } };
}

/* ---------- Start ---------- */
/* ---------- Skjult juksekode: skriv «heipådeg» nede i venstre hjørne -> velg penger ---------- */
function wireCheat(){
  const box=document.getElementById("cheatBox"), panel=document.getElementById("cheatPanel"), amt=document.getElementById("cheatAmt"), set=document.getElementById("cheatSet");
  if(!box||!panel) return;
  const norm=s=>(s||"").toLowerCase().replace(/\s+/g,"").replace(/å/g,"a");
  box.addEventListener("input", ()=>{ if(norm(box.value)==="heipadeg"){ panel.classList.add("show"); box.value=""; if(amt){ amt.value=S?Math.round(S.budget):1000000000; amt.focus(); amt.select(); } } });
  const apply=()=>{ if(!S){ FLASH=""; panel.classList.remove("show"); alert("Start en karriere først – så kan du sette penger."); return; }
    if(!cheatWarn()) return;
    const v=Math.max(0, Math.round(+amt.value||0)); S.budget=v; S.cheated=true; save(); panel.classList.remove("show");
    FLASH="💰 Juksekode: penger satt til "+kr(v)+"."; render(); };
  if(set) set.onclick=apply;
  if(amt) amt.addEventListener("keydown", e=>{ if(e.key==="Enter") apply(); });
}
if(typeof document!=="undefined") document.addEventListener("DOMContentLoaded", ()=>{ render(); wireCheat();
  document.title="Norsk Tippeliga v"+GAME_VERSION; });
