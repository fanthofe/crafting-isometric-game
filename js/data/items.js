"use strict";
/* Données des objets (définitions pures, pas de logique). */

const ITEMS = {
  /* ── Ressources de base ── */
  bois:      {name:"Bois",             c:"#8a6240", stack:50, w:2},
  pierre:    {name:"Pierre",           c:"#9aa2a6", stack:50, w:4},
  planche:   {name:"Planche",          c:"#d2a763", stack:50, w:1.5},
  feu:       {name:"Feu de camp",      c:"#e8743f", stack:5,  w:6,  place:"feu"},

  /* ── Fruits ── */
  pomme:     {name:"Pomme",            c:"#e0463f", stack:20, w:0.5, food:8},
  prune:     {name:"Prune",            c:"#8e5bc8", stack:20, w:0.5, food:8},
  cerise:    {name:"Cerise",           c:"#c22b48", stack:20, w:0.3, food:6},
  poire:     {name:"Poire",            c:"#c9c440", stack:20, w:0.5, food:8},
  orange:    {name:"Orange",           c:"#f08c1d", stack:20, w:0.5, food:10},
  peche:     {name:"Pêche",            c:"#f2a07b", stack:20, w:0.5, food:10},

  /* ── Nourriture basique ── */
  salade:    {name:"Salade de fruits", c:"#f4a3b8", stack:10, w:1,   food:20, heal:4},
  viande:    {name:"Viande",           c:"#b5483a", stack:20, w:1},
  brochette: {name:"Brochette",        c:"#d97f5e", stack:10, w:1,   food:16, heal:8},

  /* ── Matières animales ── */
  cuir:            {name:"Cuir",             c:"#a3754d", stack:30, w:1},
  plume:           {name:"Plume",            c:"#e8e4da", stack:30, w:0.1},
  os:              {name:"Os",               c:"#ddd8c8", stack:30, w:0.5},

  /* ── Drops kobolds ── */
  griffe:          {name:"Griffe de kobold", c:"#8ab0c0", stack:10, w:0.3},
  fourrure_lunaire:{name:"Fourrure lunaire", c:"#7080b0", stack:5,  w:1.5},
  plume_noire:     {name:"Plume noire",      c:"#2e2e42", stack:30, w:0.1},

  /* ── Divers ── */
  torche:    {name:"Torche",           c:"#e8a030", stack:10, w:0.8},

  /* ── Ressources minières ── */
  charbon:        {name:"Charbon",          c:"#3a3a3a", stack:30, w:3},
  obsidienne:     {name:"Obsidienne",       c:"#1a1a2e", stack:20, w:5},
  basalte:        {name:"Basalte",          c:"#4a4a5a", stack:20, w:5},
  serpentine:     {name:"Serpentine",       c:"#4a7a5a", stack:10, w:4},
  jade:           {name:"Jade pounamu",     c:"#2a7a4a", stack:5,  w:3},
  cristal_lunaire:{name:"Cristal lunaire",  c:"#7070d0", stack:5,  w:2},
  bois_dur:       {name:"Bois dur",         c:"#6b4a2d", stack:30, w:2},

  /* ── Ressources marines & tropicales ── */
  fibre_coco:   {name:"Fibre de coco",    c:"#c4a46a", stack:30, w:0.5},
  noix_coco:    {name:"Noix de coco",     c:"#7a5a38", stack:10, w:1,   food:15, heal:3},
  dent_requin:  {name:"Dent de requin",   c:"#ddd8d0", stack:20, w:0.3},
  viande_requin:{name:"Viande de requin", c:"#c06060", stack:10, w:1.5, food:12, heal:5},
  graisse:      {name:"Graisse",          c:"#e8d8a0", stack:15, w:1},
  poisson:      {name:"Poisson",          c:"#6a9ab0", stack:20, w:0.8, food:10, heal:4},
  poisson_rare: {name:"Poisson rare",     c:"#6a7ad0", stack:10, w:1,   food:18, heal:8},
  voile:        {name:"Voile",            c:"#e8e0c8", stack:3,  w:3},
  rame:         {name:"Rame",             c:"#a07840", stack:3,  w:2},

  /* ── Outils de bûcheronnage ── */
  hache_pierre:     {name:"Hache de pierre",  c:"#9aa2a6", stack:1, w:3,   equip:"arme",     def:0, dmg:1, woodBonus:1, bonus:"+1 dégât bûcheron · arme de base"},
  hache_obsidienne: {name:"Hache obsidienne", c:"#1a1a2e", stack:1, w:2.5, equip:"bucheron", def:0,        woodBonus:2, bonus:"Bûcheronnage ×1.4 · +2 bois/arbre"},
  hache_jade:       {name:"Hache de jade",    c:"#2a7a4a", stack:1, w:2,   equip:"bucheron", def:0,        woodBonus:3, bonus:"Bûcheronnage ×1.8 · +3 bois · inusable"},

  /* ── Outils de cueillette ── */
  panier:           {name:"Panier",           c:"#c4a46a", stack:1, w:1,   equip:"cueillette", bonus:"Cueillette rapide · capacité fruits ×1.5"},
  serpe_pierre:     {name:"Serpe en pierre",  c:"#9aa2a6", stack:1, w:1.5, equip:"cueillette", bonus:"+1 fruit par cueillette"},
  serpe_obsidienne: {name:"Serpe obsidienne", c:"#1a1a2e", stack:1, w:1.5, equip:"cueillette", bonus:"+2 fruits · arbre régénère plus vite"},

  /* ── Outils de minage ── */
  pioche_pierre:    {name:"Pioche de pierre",  c:"#9aa2a6", stack:1, w:3,   equip:"minage", mineTier:1, bonus:"Mine : pierre · charbon · obsidienne · basalte"},
  pioche_basalte:   {name:"Pioche de basalte", c:"#4a4a5a", stack:1, w:3,   equip:"minage", mineTier:2, bonus:"Mine : + serpentine"},
  pioche_obsidienne:{name:"Pioche obsidienne", c:"#1a1a2e", stack:1, w:2.5, equip:"minage", mineTier:3, bonus:"Mine : + jade · cristal lunaire"},

  /* ── Carquois ── */
  carquois_cuir: {name:"Carquois en cuir", c:"#a3754d", stack:1, w:1,   equip:"carquois", bonus:"20 flèches max"},
  carquois_os:   {name:"Carquois en os",  c:"#ddd8c8", stack:1, w:1.2, equip:"carquois", bonus:"30 flèches · rechargement rapide"},

  /* ── Flèches ── */
  fleche:           {name:"Flèche",            c:"#d2a763", stack:30, w:0.2},
  fleche_obsidienne:{name:"Flèche obsidienne", c:"#1a1a2e", stack:20, w:0.3},
  fleche_noire:     {name:"Flèche noire",      c:"#2e2e42", stack:15, w:0.2},
  fleche_lunaire:   {name:"Flèche lunaire",    c:"#7070d0", stack:10, w:0.2},

  /* ── Armes Tier 1 : primitives ── */
  massue_bois: {name:"Massue en bois",c:"#8a6240", stack:1, w:3,   equip:"arme", def:0, dmg:2, bonus:"2 dégâts · étourdit 1 tour"},
  sagaie:      {name:"Sagaie",        c:"#c4cacd", stack:1, w:1.5, equip:"arme", def:0, dmg:2, bonus:"2 dégâts · jet portée 4 cases · récupérable"},
  fronde:      {name:"Fronde",        c:"#a3754d", stack:1, w:0.8, equip:"arme", def:0, dmg:2, bonus:"2 dégâts · pierre illimitée · portée 4 cases"},
  lance:       {name:"Lance",         c:"#c4cacd", stack:1, w:2.5, equip:"arme", def:0, dmg:1, bonus:"+1 dégât chasse · portée 2 cases"},

  /* ── Armes Tier 2 : pierre & os ── */
  patu_pierre:      {name:"Patu en pierre",           c:"#9aa2a6", stack:1, w:2,   equip:"arme", def:0, dmg:3, bonus:"3 dégâts · frappe ultrarapide · cooldown 0.4s (Māori)"},
  patu_os:          {name:"Patu en os",               c:"#ddd8c8", stack:1, w:2,   equip:"arme", def:0, dmg:3, bonus:"3 dégâts · saigne −1 PV/tour × 2 tours (Māori)"},
  casse_tete_bec:   {name:"Casse-tête bec d'oiseau",  c:"#8a6240", stack:1, w:3,   equip:"arme", def:0, dmg:3, bonus:"3 dégâts · ignore 1 défense (Kanak)"},
  casse_tete_champ: {name:"Casse-tête champignon",    c:"#8a6240", stack:1, w:4,   equip:"arme", def:0, dmg:4, bonus:"4 dégâts · étourdit 2 tours (Kanak)"},
  ula:              {name:"Ula",                      c:"#8a6240", stack:1, w:3,   equip:"arme", def:0, dmg:3, bonus:"3 dégâts · jet portée 3 cases (Fidji)"},
  pahoa:            {name:"Pāhoa",                    c:"#9aa2a6", stack:1, w:1,   equip:"arme", def:0, dmg:3, bonus:"3 dégâts · très rapide · cooldown 0.35s (Hawaï)"},
  ihe:              {name:"Ihe",                      c:"#c4cacd", stack:1, w:1.8, equip:"arme", def:0, dmg:3, bonus:"3 dégâts · jet portée 4 cases · récupérable (Hawaï)"},
  arc:              {name:"Arc",                      c:"#8a6240", stack:1, w:1.5, equip:"arme", def:0, dmg:3, bonus:"3–5 dégâts · distance · nécessite flèches"},

  /* ── Armes Tier 3 : bois sculpté & obsidienne ── */
  taiaha:         {name:"Taiaha",            c:"#6b4a2d", stack:1, w:4,   equip:"arme", def:0, dmg:4, bonus:"4 dégâts · portée 2 cases · +1 combo (Māori)"},
  tewhatewha:     {name:"Tewhatewha",        c:"#6b4a2d", stack:1, w:4.5, equip:"arme", def:0, dmg:4, bonus:"4 dégâts · zone arc 180° (Māori)"},
  u_u:            {name:"U'u",              c:"#6b4a2d", stack:1, w:5,   equip:"arme", def:0, dmg:5, bonus:"5 dégâts · étourdit 2 tours (Marquises)"},
  akau_tau:       {name:"Akau tau",          c:"#6b4a2d", stack:1, w:4,   equip:"arme", def:0, dmg:4, bonus:"4 dégâts · +1/coup consécutif max +3 (Tonga)"},
  totokia:        {name:"Totokia",           c:"#4a4a5a", stack:1, w:4,   equip:"arme", def:0, dmg:4, bonus:"4 dégâts · perce armure · ignore 2 défense (Fidji)"},
  lame_obsidienne:{name:"Lame d'obsidienne", c:"#1a1a2e", stack:1, w:2,   equip:"arme", def:0, dmg:4, bonus:"4 dégâts · saigne 3 tours"},

  /* ── Armes Tier 4 : dents de requin ── */
  leiomano:    {name:"Leiomano",       c:"#ddd8d0", stack:1, w:2.5, equip:"arme", def:0, dmg:5, bonus:"5 dégâts · saigne 3 tours · +2 vs armure cuir (Hawaï)"},
  epee_requin: {name:"Épée à dents",   c:"#ddd8d0", stack:1, w:3,   equip:"arme", def:0, dmg:6, bonus:"6 dégâts · touche 2 ennemis · saigne (Kiribati)"},
  dague_requin:{name:"Dague à dents",  c:"#ddd8d0", stack:1, w:1.5, equip:"arme", def:0, dmg:4, bonus:"4 dégâts · rapide 0.4s · saigne (Kiribati)"},
  lance_requin:{name:"Lance à dents",  c:"#ddd8d0", stack:1, w:2.5, equip:"arme", def:0, dmg:5, bonus:"5 dégâts · portée 2 cases · saigne (Kiribati)"},

  /* ── Armes Tier 5 : jade & serpentine ── */
  mere_serpentine: {name:"Mere serpentine",  c:"#4a7a5a", stack:1, w:2.5, equip:"arme", def:0, dmg:5, bonus:"5 dégâts · repousse ennemi 1 case (Māori)"},
  totokia_basalte: {name:"Totokia basalte",  c:"#4a4a5a", stack:1, w:4,   equip:"arme", def:0, dmg:5, bonus:"5 dégâts · perce toute armure (Fidji)"},
  patu_jade:       {name:"Patu pounamu",     c:"#2a7a4a", stack:1, w:2,   equip:"arme", def:0, dmg:6, bonus:"6 dégâts · attaque éclair 0.3s · prestige (Māori)"},
  hache_ostensoir: {name:"Hache-ostensoir",  c:"#2a7a4a", stack:1, w:3.5, equip:"arme", def:0, dmg:6, bonus:"6 dégâts · zone · kobolds hésitent 1s (Kanak)"},
  totokia_jade:    {name:"Totokia jade",     c:"#2a7a4a", stack:1, w:3.5, equip:"arme", def:0, dmg:7, bonus:"7 dégâts · ignore toute défense (Fidji)"},

  /* ── Armes Tier 6 : lunaires ── */
  taiaha_lunaire:   {name:"Taiaha lunaire",   c:"#7070d0", stack:1, w:4,   equip:"arme", def:0, dmg:8, bonus:"8 dégâts · +4 la nuit · portée 3 cases"},
  leiomano_lunaire: {name:"Leiomano lunaire", c:"#7070d0", stack:1, w:3,   equip:"arme", def:0, dmg:9, bonus:"9 dégâts · magique · saigne + poison"},
  u_u_lunaire:      {name:"U'u lunaire",     c:"#7070d0", stack:1, w:5,   equip:"arme", def:0, dmg:8, bonus:"8 dégâts · étourdit 3 tours · zone 2×2"},
  arc_lunaire:      {name:"Arc lunaire",      c:"#7070d0", stack:1, w:2,   equip:"arme", def:0, dmg:7, bonus:"7 dégâts · magique · portée 10 cases"},

  /* ── Armures ── */
  chapeau:          {name:"Chapeau de plumes",    c:"#e8e4da", stack:1, w:1,   equip:"tete",  def:1, bonus:"défense +1 · animaux fuient plus loin"},
  casque_poisson:   {name:"Casque poisson-globe", c:"#c4a46a", stack:1, w:2,   equip:"tete",  def:3, bonus:"défense +3 · dégâts de tête −50% (Kiribati)"},
  cape_plumes:      {name:"Cape de plumes",       c:"#e8e4da", stack:1, w:1.5, equip:"tete",  def:1, bonus:"défense +1 · animaux fuient plus loin · XP +10%"},
  tunique:          {name:"Tunique de cuir",      c:"#a3754d", stack:1, w:4,   equip:"torse", def:2, bonus:"défense +2 · +25 de charge max", carryBonus:25},
  armure_fibre_coco:{name:"Armure fibre tressée", c:"#c4a46a", stack:1, w:5,   equip:"torse", def:5, bonus:"défense +5 · meilleure armure non-magique (Kiribati)"},
  bottes:           {name:"Bottes de cuir",       c:"#7c5836", stack:1, w:2,   equip:"pieds", def:1, bonus:"défense +1 · +15% de vitesse"},
  jupe_fibre:       {name:"Jupe de combat",       c:"#c4a46a", stack:1, w:2,   equip:"pieds", def:2, bonus:"défense +2 · +10% vitesse · résiste eau"},

  /* ── Ancienne dague kobold ── */
  dague: {name:"Dague de griffes", c:"#8ab0c0", stack:1, w:1.5, equip:"arme", def:0, dmg:2, bonus:"+2 dégâts · attaque rapide contre les kobolds"},

  /* ── Nourriture avancée (marmite) ── */
  ragout:          {name:"Ragoût de viande",   c:"#c87050", stack:5, w:1,   food:180, heal:30},
  bouillon_fruits: {name:"Bouillon de fruits", c:"#f4a3b8", stack:5, w:1,   food:120, heal:15},
  soupe_os:        {name:"Soupe à l'os",       c:"#d8c8a0", stack:5, w:1,   food:240, heal:20},
  festin_chasseur: {name:"Festin du chasseur", c:"#b5483a", stack:3, w:2,   food:300, heal:50},
  confit_sanglier: {name:"Confit de sanglier", c:"#8a4030", stack:3, w:2,   food:360, heal:40},
  noix_rotie:      {name:"Noix de coco rôtie", c:"#8a6040", stack:5, w:1,   food:180, heal:25},
  poisson_grille:  {name:"Poisson grillé",     c:"#d0a060", stack:5, w:1,   food:240, heal:30},
  soupe_requin:    {name:"Soupe de requin",    c:"#c06060", stack:5, w:1,   food:300, heal:35},
  elixir_fruit:    {name:"Élixir polynésien",  c:"#f0d060", stack:5, w:0.5, food:480, heal:10},

  /* ── Potions (atelier alchimie) ── */
  potion_soin:      {name:"Potion de soin",            c:"#e04040", stack:5, w:0.5, potion:"soin",      food:1,   heal:25},
  potion_vigueur:   {name:"Potion de vigueur",         c:"#4040e0", stack:5, w:0.5, potion:"vigueur",   food:300, heal:0},
  potion_force:     {name:"Potion de force",           c:"#e08040", stack:5, w:0.5, potion:"force",     food:180, heal:0},
  potion_rapidite:  {name:"Potion de rapidité",        c:"#40e0a0", stack:5, w:0.5, potion:"rapidite",  food:120, heal:0},
  potion_antivenin: {name:"Antidote",                  c:"#40c040", stack:5, w:0.5, potion:"antivenin", food:1,   heal:0},
  potion_nuit:      {name:"Potion de vision nocturne", c:"#202040", stack:5, w:0.5, potion:"nuit",      food:300, heal:0},
  bombe_fumee:      {name:"Bombe de fumée",            c:"#808080", stack:5, w:1,   potion:"fumee"},
  bombe_feu:        {name:"Fiole de feu",              c:"#e06020", stack:5, w:1,   potion:"feu"},

  /* ── Constructions (posables) ── */
  cloture_bois:    {name:"Clôture en bois",    c:"#8a6240", stack:10, w:3,  place:"barriere", placeHp:5},
  palissade:       {name:"Palissade",          c:"#6b4a2d", stack:5,  w:8,  place:"barriere", placeHp:20},
  mur_basalte:     {name:"Mur de basalte",     c:"#4a4a5a", stack:5,  w:15, place:"barriere", placeHp:50},
  portail_bois:    {name:"Portail en bois",    c:"#8a6240", stack:5,  w:8,  place:"portail",  placeHp:15},
  pieu_piege:      {name:"Piège à pieu",       c:"#8a6240", stack:5,  w:4,  place:"piege"},
  filet_chasse:    {name:"Filet de fibres",    c:"#c4a46a", stack:3,  w:5,  place:"filet"},
  etabli:          {name:"Établi",             c:"#d2a763", stack:1,  w:30, place:"atelier",    workshop:"etabli"},
  atelier_taille:  {name:"Atelier de taille",  c:"#4a4a5a", stack:1,  w:40, place:"atelier",    workshop:"atelier_taille"},
  atelier_alchimie:{name:"Atelier d'alchimie", c:"#8ab0c0", stack:1,  w:35, place:"atelier",    workshop:"atelier_alchimie"},
  marmite:         {name:"Marmite",            c:"#3a3a3a", stack:1,  w:15, place:"marmite"},
  embarcadere:     {name:"Embarcadère",        c:"#d2a763", stack:1,  w:50, place:"embarcadere"},

  /* ── Bateaux ── */
  radeau:       {name:"Radeau",           c:"#8a6240", stack:1, w:30, place:"bateau", boatTier:1},
  pirogue:      {name:"Pirogue",          c:"#6b4a2d", stack:1, w:40, place:"bateau", boatTier:2},
  vaa_balancier:{name:"Va'a à balancier", c:"#5a3a1a", stack:1, w:50, place:"bateau", boatTier:3},
  proa:         {name:"Proa micronésien", c:"#6b4a2d", stack:1, w:60, place:"bateau", boatTier:4},
  waka_taua:    {name:"Waka taua",        c:"#3a2a1a", stack:1, w:80, place:"bateau", boatTier:5},
};
