"use strict";
/* Persistence : sauvegarde de partie et options (bindings clavier, volumes). */

const SAVE_KEY = "kaimana_save";
const OPTS_KEY = "kaimana_options";

/* ─── Sauvegarde partie ─── */

function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

function saveGame() {
  const data = {
    v: 1,
    player: { x: player.x, y: player.y, hp: player.hp, maxHp: player.maxHp },
    slots: slots.map(s => s ? { id: s.id, qty: s.qty } : null),
    equip: {},
    skills: {},
  };
  for (const k in equip) data.equip[k] = equip[k] ? { id: equip[k].id, qty: equip[k].qty } : null;
  for (const k in SKILLS) data.skills[k] = { lvl: SKILLS[k].lvl, xp: SKILLS[k].xp };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const d = JSON.parse(raw);
    if (d.v !== 1) return false;
    if (d.player) {
      player.x = d.player.x;   player.y = d.player.y;
      player.hp = d.player.hp; player.maxHp = d.player.maxHp;
    }
    if (d.slots) for (let i = 0; i < SLOT_COUNT; i++) slots[i] = d.slots[i] || null;
    if (d.equip)  for (const k in equip)  equip[k]  = d.equip[k]  || null;
    if (d.skills) for (const k in SKILLS) if (d.skills[k]) {
      SKILLS[k].lvl = d.skills[k].lvl;
      SKILLS[k].xp  = d.skills[k].xp;
    }
    return true;
  } catch (e) { return false; }
}

function deleteSave() { localStorage.removeItem(SAVE_KEY); }

/* ─── Options (bindings + son) ─── */

const DEFAULT_BINDINGS = {
  up:        ["ArrowUp",    "KeyW"],
  down:      ["ArrowDown",  "KeyS"],
  left:      ["ArrowLeft",  "KeyA"],
  right:     ["ArrowRight", "KeyD"],
  action:    ["KeyE",       "Space"],
  inventory: ["KeyI"],
  craft:     ["KeyC"],
  fire:      ["KeyF"],
};

const DEFAULT_SOUND = { master: 0.8, music: 0.6, sfx: 1.0 };

const options = {
  bindings: JSON.parse(JSON.stringify(DEFAULT_BINDINGS)),
  sound:    { ...DEFAULT_SOUND },
};

function loadOptions() {
  const raw = localStorage.getItem(OPTS_KEY);
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (d.bindings) {
      for (const k in DEFAULT_BINDINGS)
        if (Array.isArray(d.bindings[k])) options.bindings[k] = d.bindings[k];
    }
    if (d.sound) {
      for (const k in DEFAULT_SOUND)
        if (typeof d.sound[k] === "number") options.sound[k] = d.sound[k];
    }
  } catch (e) {}
}

function saveOptions() { localStorage.setItem(OPTS_KEY, JSON.stringify(options)); }

loadOptions();

/* Auto-save à la fermeture de l'onglet (seulement si une partie est en cours). */
window.addEventListener("beforeunload", () => {
  if (typeof gameMode !== "undefined" && gameMode === "explore") saveGame();
});
