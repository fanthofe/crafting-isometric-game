"use strict";
/* Scène de l'écran titre : Nouvelle partie · Continuer · Options (clavier, manette, son). */

/* ─── Étoiles (pseudo-aléatoire déterministe pour éviter Math.random) ─── */
const MENU_STARS = [];
{
  let s = 0xABCD4321;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = 0; i < 80; i++)
    MENU_STARS.push({ x: r() * LW, y: r() * (LH * 0.72), ph: r() * 6.28, big: r() < 0.15 });
}

/* ─── État du menu ─── */
const menuState = {
  scene:           "main",   // "main" | "options" | "keys" | "gamepad" | "sound"
  cursor:          0,
  listening:       false,    // en attente d'une touche à mapper
  listeningAction: null,
  soundCursor:     0,        // 0=master 1=music 2=sfx
  pauseCursor:     0,
  _fromPause:      false,    // options ouvertes depuis le menu pause
};

/* ─── Données statiques ─── */
const MAIN_ITEMS   = ["Nouvelle partie", "Continuer", "Options"];
const OPTS_ITEMS   = ["Clavier", "Manette", "Son", "Retour"];
const ACTION_ORDER = ["up","down","left","right","action","inventory","craft","fire"];
const ACTION_LABELS = {
  up:"Haut", down:"Bas", left:"Gauche", right:"Droite",
  action:"Action", inventory:"Inventaire", craft:"Fabrication", fire:"Poser feu",
};
const SOUND_LABELS = ["Volume général", "Musique", "Effets sonores"];
const SOUND_KEYS   = ["master", "music", "sfx"];
const PAUSE_ITEMS  = ["Reprendre", "Sauvegarder", "Options", "Menu principal"];

/* ─── Utilitaires ─── */
function _fmtKey(code) {
  if (!code) return "—";
  const m = {
    ArrowUp:"↑", ArrowDown:"↓", ArrowLeft:"←", ArrowRight:"→",
    Space:"ESPACE", Enter:"ENTRÉE", Escape:"ÉCHAP",
    ShiftLeft:"MAJ G", ShiftRight:"MAJ D",
    ControlLeft:"CTRL G", ControlRight:"CTRL D",
    AltLeft:"ALT G", AltRight:"ALT D",
  };
  if (m[code]) return m[code];
  if (code.startsWith("Key"))    return code.slice(3);
  if (code.startsWith("Digit"))  return code.slice(5);
  if (code.startsWith("Numpad")) return "N" + code.slice(6);
  return code;
}

/* ─── Transitions vers le jeu ─── */
function startNewGame() {
  player.x = spawn.x; player.y = spawn.y;
  player.hp = 10; player.maxHp = 10;
  player.dir = "down"; player.walking = false; player.animT = 0;
  player.swing = 0; player.hurtT = 0; player.battleCD = 0;
  player.boat = null; player._wasOnWater = false;
  camInit = false;
  for (let i = 0; i < SLOT_COUNT; i++) slots[i] = null;
  for (const k in equip) equip[k] = null;
  for (const k in SKILLS) { SKILLS[k].lvl = 1; SKILLS[k].xp = 0; }
  deleteSave();
  document.body.classList.remove("in-menu");
  gameMode = "explore";
  refreshUI();
}

function continueGame() {
  if (!hasSave() || !loadGame()) return;
  document.body.classList.remove("in-menu");
  gameMode = "explore";
  refreshUI();
}

/* ─── Initialisation (appelée une fois tous les scripts chargés) ─── */
function initMenu() {
  document.body.classList.add("in-menu");
  menuState.scene   = "main";
  menuState.cursor  = 0;
  menuState.listening = false;
}

/* ═══════════════════════════════════════════════════════
   RENDU
   ═══════════════════════════════════════════════════════ */
function renderMenu(t) {
  _drawBackground(t);
  _drawIsland(t);
  _drawTitle(t);

  switch (menuState.scene) {
    case "main":    _drawMainMenu(t); break;
    case "options": _drawOptions();   break;
    case "keys":    _drawKeys(t);     break;
    case "gamepad": _drawGamepad();   break;
    case "sound":   _drawSound();     break;
  }

  /* Indication manette (coin bas droit) */
  const gp = navigator.getGamepads?.()[0];
  if (gp) {
    cx.font = "bold 6px 'Courier New', monospace";
    cx.textAlign = "right";
    cx.fillStyle = "#283848";
    cx.fillText("🎮 " + (gp.id?.slice(0, 26) || "Manette"), LW - 4, LH - 4);
  }
  cx.textAlign = "center";
}

/* ── Fond étoilé ── */
function _drawBackground(t) {
  const sky = cx.createLinearGradient(0, 0, 0, LH);
  sky.addColorStop(0, "#080d1e");
  sky.addColorStop(1, "#18204a");
  cx.fillStyle = sky;
  cx.fillRect(0, 0, LW, LH);

  for (const s of MENU_STARS) {
    const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + s.ph));
    cx.globalAlpha = a;
    cx.fillStyle = "#cce4ff";
    const sx = Math.floor(s.x), sy = Math.floor(s.y);
    if (s.big) {
      cx.fillRect(sx,     sy,     1, 1);
      cx.fillRect(sx - 1, sy,     1, 1);
      cx.fillRect(sx + 1, sy,     1, 1);
      cx.fillRect(sx,     sy - 1, 1, 1);
      cx.fillRect(sx,     sy + 1, 1, 1);
    } else {
      cx.fillRect(sx, sy, 1, 1);
    }
  }
  cx.globalAlpha = 1;
}

/* ── Silhouette île + vagues ── */
function _drawIsland(t) {
  const baseY = LH - 30;

  /* Vagues animées */
  cx.fillStyle = "#0b1828";
  cx.fillRect(0, baseY + 10, LW, LH);

  for (let x = 0; x < LW; x += 2) {
    const h = 9 + Math.sin(x * 0.045 + t * 0.5) * 4 + Math.sin(x * 0.12 + t * 0.28) * 2;
    cx.fillStyle = "#0d1e30";
    cx.fillRect(x, Math.round(baseY + 10 - h), 2, Math.ceil(h) + 1);
  }

  /* Reflets */
  cx.fillStyle = "rgba(60,120,160,0.12)";
  for (let x = 0; x < LW; x += 4) {
    const h = 1 + Math.sin(x * 0.06 + t * 1.1) * 1;
    cx.fillRect(x, Math.round(baseY + 11 - h), 3, 1);
  }

  /* Palmiers silhouette */
  _drawPalmSil(Math.round(LW * 0.14), baseY + 5, t);
  _drawPalmSil(Math.round(LW * 0.86), baseY + 5, t);
}

function _drawPalmSil(x, y, t) {
  cx.fillStyle = "#090f18";
  for (let i = 0; i < 20; i++) {
    const lean = Math.floor(i * 0.12);
    cx.fillRect(x + lean, Math.round(y - i * 1.5), 2, 2);
  }
  const tx = x + 3, ty = Math.round(y - 30);
  const sw = Math.round(Math.sin(t * 0.65) * 1.5);
  cx.fillRect(tx - 9 + sw, ty,     9, 1);
  cx.fillRect(tx - 13 + sw, ty - 2, 6, 1);
  cx.fillRect(tx + 1 + sw, ty - 1,  8, 1);
  cx.fillRect(tx + 5 + sw, ty - 3,  5, 1);
  cx.fillRect(tx - 4,      ty - 5,  4, 1);
}

/* ── Titre KAIMANA ── */
function _drawTitle(t) {
  const TY = 56;
  cx.textAlign = "center";
  cx.font = "bold 22px 'Courier New', monospace";

  /* Lueur */
  const glowA = 0.10 + 0.06 * Math.sin(t * 1.5);
  cx.fillStyle = `rgba(80,180,255,${glowA})`;
  for (const [dx, dy] of [[-2,0],[2,0],[0,-2],[0,2]]) cx.fillText("KAIMANA", LW/2 + dx, TY + dy);

  /* Ombre */
  cx.fillStyle = "#06080f";
  cx.fillText("KAIMANA", LW/2 + 1, TY + 1);

  /* Texte principal — teinte bleue animée */
  const cr = 160 + Math.round(20 * Math.sin(t * 0.6));
  const cg = 210 + Math.round(16 * Math.sin(t * 0.8 + 1));
  cx.fillStyle = `rgb(${cr},${cg},255)`;
  cx.fillText("KAIMANA", LW/2, TY);

  /* Sous-titre */
  cx.font = "bold 7px 'Courier New', monospace";
  cx.fillStyle = "#4a6880";
  cx.fillText("Île  ·  Survie  ·  Artisanat", LW/2, TY + 14);
}

/* ── Menu principal ── */
function _drawMainMenu(t) {
  const ITEMS_Y = 112, STEP = 22;
  const save = hasSave();
  cx.font = "bold 9px 'Courier New', monospace";
  cx.textAlign = "center";

  for (let i = 0; i < MAIN_ITEMS.length; i++) {
    const sel  = menuState.cursor === i;
    const dis  = (i === 1 && !save);
    const y    = ITEMS_Y + i * STEP;

    if (sel && !dis) {
      cx.fillStyle = "rgba(50,110,200,0.18)";
      cx.fillRect(LW/2 - 82, y - 10, 164, 14);
    }

    /* Curseur gemme */
    if (sel) _drawGem(LW/2 - 70, y - 2, dis ? "#303848" : "#4adde0");

    /* Label */
    if (dis)      cx.fillStyle = "#2e3848";
    else if (sel) cx.fillStyle = "#a0e8ff";
    else          cx.fillStyle = "#6888a8";

    cx.fillText(MAIN_ITEMS[i], LW/2 + 8, y);

    if (i === 1 && !save && sel) {
      cx.font = "bold 6px 'Courier New', monospace";
      cx.fillStyle = "#2a3445";
      cx.fillText("(aucune sauvegarde)", LW/2 + 8, y + 11);
      cx.font = "bold 9px 'Courier New', monospace";
    }
  }

  /* Aide touches */
  cx.font = "bold 6px 'Courier New', monospace";
  cx.fillStyle = "#1e2d40";
  cx.fillText("↕  Naviguer     Entrée / E : Confirmer", LW/2, LH - 16);
  cx.fillStyle = "#141c28";
  cx.fillText("v0.1-alpha  ·  2026", LW/2, LH - 7);
}

/* ── Options ── */
function _drawOptions() {
  cx.font = "bold 8px 'Courier New', monospace";
  cx.fillStyle = "#304560";
  cx.textAlign = "center";
  cx.fillText("OPTIONS", LW/2, 92);

  const ITEMS_Y = 116, STEP = 22;
  const gp = navigator.getGamepads?.()[0];

  for (let i = 0; i < OPTS_ITEMS.length; i++) {
    const sel = menuState.cursor === i;
    const dis = (i === 1 && !gp);
    const y   = ITEMS_Y + i * STEP;

    if (sel && !dis) {
      cx.fillStyle = "rgba(50,110,200,0.18)";
      cx.fillRect(LW/2 - 72, y - 10, 144, 14);
    }

    if (sel && !dis) {
      cx.font = "bold 9px 'Courier New', monospace";
      cx.textAlign = "left";
      cx.fillStyle = "#4adde0";
      cx.fillText("▶", LW/2 - 58, y);
      cx.textAlign = "center";
    }

    cx.font = "bold 9px 'Courier New', monospace";
    if (dis)      cx.fillStyle = "#252e3a";
    else if (sel) cx.fillStyle = "#a0e8ff";
    else          cx.fillStyle = "#5878a0";
    cx.fillText(OPTS_ITEMS[i], LW/2 + 8, y);

    if (i === 1 && !gp) {
      cx.font = "bold 6px 'Courier New', monospace";
      cx.fillStyle = "#202830";
      cx.fillText("(aucune manette détectée)", LW/2 + 8, y + 10);
    }
  }

  cx.font = "bold 6px 'Courier New', monospace";
  cx.fillStyle = "#1e2d40";
  cx.textAlign = "center";
  cx.fillText("↕  Naviguer     Entrée : Confirmer     Échap : Retour", LW/2, LH - 16);
}

/* ── Remappage clavier ── */
function _drawKeys(t) {
  cx.font = "bold 8px 'Courier New', monospace";
  cx.fillStyle = "#304560";
  cx.textAlign = "center";
  cx.fillText("TOUCHES CLAVIER", LW/2, 87);

  const START_Y = 100, STEP = 16;
  const blink = Math.floor(t * 3) % 2 === 0;

  for (let i = 0; i < ACTION_ORDER.length; i++) {
    const action  = ACTION_ORDER[i];
    const codes   = options.bindings[action] || [];
    const sel     = menuState.cursor === i;
    const active  = menuState.listening && menuState.listeningAction === action;
    const y       = START_Y + i * STEP;

    if (sel) {
      cx.fillStyle = "rgba(50,110,200,0.15)";
      cx.fillRect(LW/2 - 102, y - 8, 204, 12);
    }

    cx.font = "bold 7px 'Courier New', monospace";
    cx.textAlign = "left";
    cx.fillStyle = sel ? "#90c8e0" : "#506070";
    cx.fillText(ACTION_LABELS[action], LW/2 - 98, y);

    /* Badge touche principale (cliquable) */
    const showPrimary = !active || blink;
    const primaryLabel = active ? "_ _ _" : _fmtKey(codes[0]);
    _drawKeyBadge(LW/2 + 14, y, showPrimary ? primaryLabel : "_ _ _", active, sel);

    /* Badge touche secondaire (lecture seule) */
    _drawKeyBadge(LW/2 + 62, y, _fmtKey(codes[1]), false, false);
  }

  /* Boutons Réinitialiser + Retour */
  const extraY = START_Y + ACTION_ORDER.length * STEP + 8;
  const resetSel = menuState.cursor === ACTION_ORDER.length;
  const backSel  = menuState.cursor === ACTION_ORDER.length + 1;

  cx.font = "bold 7px 'Courier New', monospace";
  cx.textAlign = "center";
  cx.fillStyle = resetSel ? "#ffa040" : "#3a3060";
  cx.fillText("[Réinitialiser]", LW/2 - 40, extraY);
  cx.fillStyle = backSel ? "#a0e8ff" : "#304858";
  cx.fillText("[Retour]", LW/2 + 48, extraY);

  /* Aide */
  cx.font = "bold 6px 'Courier New', monospace";
  cx.textAlign = "center";
  if (menuState.listening) {
    cx.fillStyle = "#50a860";
    cx.fillText("Appuie sur une touche…     Échap : Annuler", LW/2, LH - 16);
  } else {
    cx.fillStyle = "#1e2d40";
    cx.fillText("Entrée : Remapper     Échap : Retour", LW/2, LH - 16);
  }
}

function _drawKeyBadge(cx_x, y, label, active, sel) {
  const w = Math.max(28, label.length * 5 + 8);
  cx.fillStyle   = active ? "#182818" : sel ? "#141e28" : "#0c1018";
  cx.fillRect(cx_x - w/2, y - 7, w, 10);
  cx.strokeStyle = active ? "#40a040" : sel ? "#2a4860" : "#181e28";
  cx.lineWidth = 1;
  cx.strokeRect(cx_x - w/2 + 0.5, y - 6.5, w - 1, 9);
  cx.font = "bold 6px 'Courier New', monospace";
  cx.textAlign = "center";
  cx.fillStyle  = active ? "#70d870" : sel ? "#6090b8" : "#384858";
  cx.fillText(label, cx_x, y);
}

/* ── Manette ── */
function _drawGamepad() {
  cx.font = "bold 8px 'Courier New', monospace";
  cx.fillStyle = "#304560";
  cx.textAlign = "center";
  cx.fillText("MANETTE", LW/2, 92);

  const gp = navigator.getGamepads?.()[0];
  if (!gp) {
    cx.font = "bold 8px 'Courier New', monospace";
    cx.fillStyle = "#2a3848";
    cx.fillText("Aucune manette détectée.", LW/2, 140);
    cx.font = "bold 6px 'Courier New', monospace";
    cx.fillStyle = "#1e2d3c";
    cx.fillText("Branchez une manette USB ou Bluetooth", LW/2, 155);
    cx.fillText("et appuyez sur un bouton.", LW/2, 164);
  } else {
    cx.font = "bold 6px 'Courier New', monospace";
    cx.fillStyle = "#304050";
    cx.fillText(gp.id?.slice(0, 48) || "Manette standard", LW/2, 102);

    const rows = [
      ["Se déplacer",  "Stick G / Croix direc."],
      ["Action (A)",   "Bouton 0"],
      ["Inventaire",   "Bouton 1  ou  Start"],
      ["Feu de camp",  "Bouton 2"],
      ["Confirmer",    "Bouton 0"],
      ["Annuler",      "Bouton 1"],
    ];
    const START_Y = 116, STEP = 16;
    for (let i = 0; i < rows.length; i++) {
      const y = START_Y + i * STEP;
      cx.font = "bold 7px 'Courier New', monospace";
      cx.textAlign = "left";
      cx.fillStyle = "#486080";
      cx.fillText(rows[i][0], LW/2 - 90, y);
      cx.textAlign = "right";
      cx.fillStyle = "#283848";
      cx.fillText(rows[i][1], LW/2 + 90, y);
    }
  }

  cx.font = "bold 6px 'Courier New', monospace";
  cx.fillStyle = "#1e2d40";
  cx.textAlign = "center";
  cx.fillText("Échap : Retour", LW/2, LH - 16);
}

/* ── Réglage son ── */
function _drawSound() {
  cx.font = "bold 8px 'Courier New', monospace";
  cx.fillStyle = "#304560";
  cx.textAlign = "center";
  cx.fillText("SON", LW/2, 92);

  const START_Y = 120, STEP = 30;

  for (let i = 0; i < 3; i++) {
    const key = SOUND_KEYS[i];
    const val = options.sound[key];
    const sel = menuState.soundCursor === i;
    const y   = START_Y + i * STEP;

    cx.font = "bold 7px 'Courier New', monospace";
    cx.textAlign = "left";
    cx.fillStyle = sel ? "#90d0e8" : "#506070";
    cx.fillText(SOUND_LABELS[i], LW/2 - 90, y);

    /* Barre de réglage */
    const BX = LW/2 - 90, BY = y + 7, BW = 180, BH = 6;
    cx.fillStyle = "#0c1018";
    cx.fillRect(BX, BY, BW, BH);
    cx.strokeStyle = sel ? "#2a4a70" : "#151d28";
    cx.lineWidth = 1;
    cx.strokeRect(BX + 0.5, BY + 0.5, BW - 1, BH - 1);
    cx.fillStyle = sel ? "#3070b8" : "#1c2d48";
    cx.fillRect(BX + 1, BY + 1, Math.round((BW - 2) * val), BH - 2);

    /* Curseur */
    const thumbX = BX + 1 + Math.round((BW - 2) * val);
    cx.fillStyle = sel ? "#70b0e8" : "#283848";
    cx.fillRect(thumbX - 2, BY - 1, 4, BH + 2);

    /* Valeur % */
    cx.font = "bold 6px 'Courier New', monospace";
    cx.textAlign = "right";
    cx.fillStyle = sel ? "#6898b8" : "#283848";
    cx.fillText(Math.round(val * 100) + "%", LW/2 + 96, y);
  }

  cx.font = "bold 6px 'Courier New', monospace";
  cx.fillStyle = "#1e2d40";
  cx.textAlign = "center";
  cx.fillText("↕ Choisir   ←→ Régler   Échap : Retour", LW/2, LH - 16);
}

/* ── Curseur gemme pixel art ── */
function _drawGem(x, y, color) {
  cx.fillStyle = color;
  cx.fillRect(x,     y - 3, 1, 1);
  cx.fillRect(x - 1, y - 2, 3, 1);
  cx.fillRect(x - 2, y - 1, 5, 3);
  cx.fillRect(x - 1, y + 2, 3, 1);
  cx.fillRect(x,     y + 3, 1, 1);
}

/* ═══════════════════════════════════════════════════════
   MENU PAUSE (overlay sur le jeu en cours)
   ═══════════════════════════════════════════════════════ */
function renderPauseOverlay(t) {
  /* Assombrir la scène derrière */
  cx.fillStyle = "rgba(4,8,20,0.72)";
  cx.fillRect(0, 0, LW, LH);

  /* Panneau central */
  const PW = 172, PH = 118;
  const PX = Math.floor((LW - PW) / 2);
  const PY = Math.floor((LH - PH) / 2) - 8;

  cx.fillStyle = "#050b18";
  cx.fillRect(PX, PY, PW, PH);
  cx.strokeStyle = "#1a2e50";
  cx.lineWidth = 1;
  cx.strokeRect(PX + 0.5, PY + 0.5, PW - 1, PH - 1);
  /* Bord intérieur décoratif */
  cx.strokeStyle = "#0f1e38";
  cx.strokeRect(PX + 2.5, PY + 2.5, PW - 5, PH - 5);

  /* Titre PAUSE */
  cx.font = "bold 10px 'Courier New', monospace";
  cx.textAlign = "center";
  const pulse = 0.88 + 0.12 * Math.sin(t * 2.2);
  cx.fillStyle = `rgba(80,160,240,${pulse * 0.9})`;
  cx.fillText("PAUSE", LW / 2 + 1, PY + 18);
  cx.fillStyle = "#5090d8";
  cx.fillText("PAUSE", LW / 2, PY + 17);

  /* Séparateur */
  cx.fillStyle = "#111e34";
  cx.fillRect(PX + 12, PY + 22, PW - 24, 1);

  /* Items */
  const START_Y = PY + 36, STEP = 19;
  for (let i = 0; i < PAUSE_ITEMS.length; i++) {
    const sel = menuState.pauseCursor === i;
    const y   = START_Y + i * STEP;
    const danger = i === 3; // "Menu principal" = destructif

    if (sel) {
      cx.fillStyle = "rgba(40,90,180,0.22)";
      cx.fillRect(PX + 6, y - 9, PW - 12, 13);
    }

    if (sel) _drawGem(PX + 20, y - 2, danger ? "#e07830" : "#4adde0");

    cx.font = "bold 8px 'Courier New', monospace";
    if (danger)     cx.fillStyle = sel ? "#ffaa60" : "#503820";
    else if (sel)   cx.fillStyle = "#a0e8ff";
    else            cx.fillStyle = "#4a6888";
    cx.fillText(PAUSE_ITEMS[i], LW / 2 + 8, y);
  }

  /* Pied */
  cx.font = "bold 6px 'Courier New', monospace";
  cx.fillStyle = "#162030";
  cx.fillText("Échap : Reprendre", LW / 2, PY + PH - 7);
}

function pauseKeyDown(e) {
  const up   = e.code === "ArrowUp"   || e.code === "KeyW";
  const down = e.code === "ArrowDown" || e.code === "KeyS";
  const ok   = e.code === "Enter"  || e.code === "KeyE" || e.code === "Space";
  const back = e.code === "Escape";
  const n    = PAUSE_ITEMS.length;

  if (back) { gameMode = "explore"; e.preventDefault(); return; }
  if (up)   menuState.pauseCursor = (menuState.pauseCursor - 1 + n) % n;
  if (down) menuState.pauseCursor = (menuState.pauseCursor + 1)     % n;

  if (ok) {
    switch (menuState.pauseCursor) {
      case 0: // Reprendre
        gameMode = "explore";
        break;
      case 1: { // Sauvegarder
        saveGame();
        const ps = toScreen(player.x, player.y);
        floats.push({ sx: ps.x, sy: ps.y - 30, t: 2.2, str: "Partie sauvegardée !", c: "#70c870" });
        gameMode = "explore";
        break;
      }
      case 2: // Options
        menuState._fromPause = true;
        menuState.scene  = "options";
        menuState.cursor = 0;
        document.body.classList.add("in-menu");
        gameMode = "menu";
        break;
      case 3: // Menu principal
        document.body.classList.add("in-menu");
        gameMode = "menu";
        initMenu();
        break;
    }
  }
  e.preventDefault();
}

/* Tick manette pour le menu pause (réutilise _mgpState) */
const _pgpState = {};
function pauseTick(now) {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return;
  const inputs = {
    up:   gp.axes[1] < -0.4 || !!gp.buttons[12]?.pressed,
    down: gp.axes[1] >  0.4 || !!gp.buttons[13]?.pressed,
    ok:   !!gp.buttons[0]?.pressed,
    back: !!gp.buttons[1]?.pressed,
  };
  const CODE = { up:"ArrowUp", down:"ArrowDown", ok:"Enter", back:"Escape" };
  for (const [key, active] of Object.entries(inputs)) {
    const prev = _pgpState[key] ?? 0;
    if (active && (prev === 0 || now - prev >= MENU_GP_DELAY)) {
      _pgpState[key] = now;
      pauseKeyDown({ code: CODE[key], preventDefault() {} });
    } else if (!active) { _pgpState[key] = 0; }
  }
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION CLAVIER
   ═══════════════════════════════════════════════════════ */
function menuKeyDown(e) {
  /* Mode écoute (remappage) */
  if (menuState.listening) {
    if (e.code === "Escape") {
      menuState.listening = false;
      menuState.listeningAction = null;
    } else {
      const action = menuState.listeningAction;
      const codes  = options.bindings[action] ? [...options.bindings[action]] : [];
      codes[0] = e.code;
      options.bindings[action] = codes;
      saveOptions();
      menuState.listening = false;
      menuState.listeningAction = null;
    }
    e.preventDefault();
    return;
  }

  const up    = e.code === "ArrowUp"    || e.code === "KeyW";
  const down  = e.code === "ArrowDown"  || e.code === "KeyS";
  const left  = e.code === "ArrowLeft"  || e.code === "KeyA";
  const right = e.code === "ArrowRight" || e.code === "KeyD";
  const ok    = e.code === "Enter"   || e.code === "KeyE" || e.code === "Space";
  const back  = e.code === "Escape";

  switch (menuState.scene) {
    case "main": {
      const n = MAIN_ITEMS.length;
      if (up)   menuState.cursor = (menuState.cursor - 1 + n) % n;
      if (down) menuState.cursor = (menuState.cursor + 1)     % n;
      if (ok)   _confirmMain();
      break;
    }
    case "options": {
      const n = OPTS_ITEMS.length;
      if (up)   menuState.cursor = (menuState.cursor - 1 + n) % n;
      if (down) menuState.cursor = (menuState.cursor + 1)     % n;
      if (ok || right) _confirmOptions();
      if (back) {
        if (menuState._fromPause) {
          menuState._fromPause = false;
          document.body.classList.remove("in-menu");
          gameMode = "pause";
        } else {
          menuState.scene = "main"; menuState.cursor = 2;
        }
      }
      break;
    }
    case "keys": {
      const n = ACTION_ORDER.length + 2;
      if (up)   menuState.cursor = (menuState.cursor - 1 + n) % n;
      if (down) menuState.cursor = (menuState.cursor + 1)     % n;
      if (ok)   _confirmKeys();
      if (back) { menuState.scene = "options"; menuState.cursor = 0; }
      break;
    }
    case "gamepad": {
      if (back) { menuState.scene = "options"; menuState.cursor = 0; }
      break;
    }
    case "sound": {
      if (up)   menuState.soundCursor = (menuState.soundCursor - 1 + 3) % 3;
      if (down) menuState.soundCursor = (menuState.soundCursor + 1)      % 3;
      if (left || right) {
        const key   = SOUND_KEYS[menuState.soundCursor];
        const delta = left ? -0.1 : 0.1;
        options.sound[key] = Math.round(Math.max(0, Math.min(1, options.sound[key] + delta)) * 10) / 10;
        saveOptions();
      }
      if (back) { menuState.scene = "options"; menuState.cursor = 0; }
      break;
    }
  }

  e.preventDefault();
}

function _confirmMain() {
  switch (menuState.cursor) {
    case 0: startNewGame(); break;
    case 1: if (hasSave()) continueGame(); break;
    case 2: menuState.scene = "options"; menuState.cursor = 0; break;
  }
}

function _confirmOptions() {
  const gp = navigator.getGamepads?.()[0];
  switch (menuState.cursor) {
    case 0: menuState.scene = "keys";   menuState.cursor = 0; break;
    case 1: if (gp) { menuState.scene = "gamepad"; menuState.cursor = 0; } break;
    case 2: menuState.scene = "sound";  menuState.soundCursor = 0; break;
    case 3:
      if (menuState._fromPause) {
        menuState._fromPause = false;
        document.body.classList.remove("in-menu");
        gameMode = "pause";
      } else {
        menuState.scene = "main"; menuState.cursor = 2;
      }
      break;
  }
}

function _confirmKeys() {
  const n = ACTION_ORDER.length;
  if (menuState.cursor < n) {
    menuState.listening      = true;
    menuState.listeningAction = ACTION_ORDER[menuState.cursor];
  } else if (menuState.cursor === n) {
    options.bindings = JSON.parse(JSON.stringify(DEFAULT_BINDINGS));
    saveOptions();
  } else {
    menuState.scene = "options"; menuState.cursor = 0;
  }
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION MANETTE (tick du menu)
   ═══════════════════════════════════════════════════════ */
const _mgpState = {};
const MENU_GP_DELAY = 200;

function menuTick(_dt, _t) {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return;

  const now = performance.now();
  const inputs = {
    up:    gp.axes[1] < -0.4 || !!gp.buttons[12]?.pressed,
    down:  gp.axes[1] >  0.4 || !!gp.buttons[13]?.pressed,
    left:  gp.axes[0] < -0.4 || !!gp.buttons[14]?.pressed,
    right: gp.axes[0] >  0.4 || !!gp.buttons[15]?.pressed,
    ok:    !!gp.buttons[0]?.pressed,
    back:  !!gp.buttons[1]?.pressed,
  };

  const CODE = { up:"ArrowUp", down:"ArrowDown", left:"ArrowLeft", right:"ArrowRight", ok:"Enter", back:"Escape" };

  for (const [key, active] of Object.entries(inputs)) {
    const prev = _mgpState[key] ?? 0;
    if (active && (prev === 0 || now - prev >= MENU_GP_DELAY)) {
      _mgpState[key] = now;
      menuKeyDown({ code: CODE[key], preventDefault() {} });
    } else if (!active) {
      _mgpState[key] = 0;
    }
  }
}
