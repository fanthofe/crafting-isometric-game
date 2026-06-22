"use strict";
/* Support manette via la Gamepad API (Standard Gamepad layout). */

const GAMEPAD_DEADZONE  = 0.25;
const GAMEPAD_REPEAT_MS = 180;

const _prev = {};
const _dirT = { up: 0, down: 0, left: 0, right: 0 };

function _rising(idx, pressed) {
  const was = !!_prev[idx];
  _prev[idx] = pressed;
  return pressed && !was;
}

function pollGamepad() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return;

  const now = performance.now();

  /* ─── MODE EXPLORATION ─── */
  if (gameMode === "explore") {
    keys.left  = gp.axes[0] < -GAMEPAD_DEADZONE || !!gp.buttons[14]?.pressed;
    keys.right = gp.axes[0] >  GAMEPAD_DEADZONE || !!gp.buttons[15]?.pressed;
    keys.up    = gp.axes[1] < -GAMEPAD_DEADZONE || !!gp.buttons[12]?.pressed;
    keys.down  = gp.axes[1] >  GAMEPAD_DEADZONE || !!gp.buttons[13]?.pressed;

    // A (0) : action
    if (_rising(0, gp.buttons[0]?.pressed)) actionQueued = true;

    // B (1) ou Start (9) : inventaire
    if (_rising(10, gp.buttons[1]?.pressed || gp.buttons[9]?.pressed)) toggleInv();

    // X (2) : feu de camp
    if (_rising(2, gp.buttons[2]?.pressed)) placeFire();
  }

  /* ─── MODE COMBAT ─── */
  if (gameMode === "battle" && battle.phase === "player") {
    const dirs = {
      up:    gp.axes[1] < -GAMEPAD_DEADZONE || !!gp.buttons[12]?.pressed,
      down:  gp.axes[1] >  GAMEPAD_DEADZONE || !!gp.buttons[13]?.pressed,
      left:  gp.axes[0] < -GAMEPAD_DEADZONE || !!gp.buttons[14]?.pressed,
      right: gp.axes[0] >  GAMEPAD_DEADZONE || !!gp.buttons[15]?.pressed,
    };
    for (const [d, active] of Object.entries(dirs)) {
      const wasActive = !!_prev["dir_" + d];
      if (active && (!wasActive || now - _dirT[d] >= GAMEPAD_REPEAT_MS)) {
        battleInput({ [d]: true });
        _dirT[d] = now;
      }
      _prev["dir_" + d] = active;
    }

    // A (0) : confirmer
    if (_rising(20, gp.buttons[0]?.pressed)) battleInput({ ok: true });

    // B (1) : annuler
    if (_rising(21, gp.buttons[1]?.pressed)) battleInput({ back: true });
  }
}

window.addEventListener("gamepadconnected",    e => console.info("[Gamepad] connectée :", e.gamepad.id));
window.addEventListener("gamepaddisconnected", e => console.info("[Gamepad] déconnectée :", e.gamepad.id));
