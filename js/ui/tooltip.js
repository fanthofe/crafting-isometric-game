"use strict";
/* Infobulle et objet tenu en main. */

const elTip  = document.getElementById("tip");
const elHeld = document.getElementById("held");

function showTip(i){
  const s = slots[i];
  if(!s){ elTip.style.display="none"; return; }
  const it = ITEMS[s.id];
  let html = `<b>${it.name}</b> × ${s.qty}<br>Poids : ${(it.w*s.qty).toFixed(1)} (${it.w}/u) · Pile max : ${it.stack}`;
  if(it.food)   html += `<br><i>Double-clic pour consommer (+${it.heal||2} ♥${it.food>10?" · vitesse "+it.food+"s":""})</i>`;
  if(it.potion) html += `<br><i>Double-clic pour utiliser — ${it.bonus||it.potion}</i>`;
  if(it.equip)  html += `<br>${it.bonus||""}<br><i>Double-clic pour équiper</i>`;
  elTip.style.display = "block";
  elTip.innerHTML = html;
}
function showEquipTip(k){
  const cur = equip[k];
  if(!cur){
    elTip.innerHTML = `<b>${EQUIP_SLOTS.find(e=>e.key===k).label}</b><br><i>Double-clic sur un objet équipable<br>de l'inventaire pour le porter</i>`;
  } else {
    const it = ITEMS[cur.id];
    elTip.innerHTML = `<b>${it.name}</b><br>${it.bonus}<br><i>Double-clic pour retirer</i>`;
  }
  elTip.style.display = "block";
}
function updateHeld(){
  if(held){
    elHeld.style.display = "block";
    elHeld.querySelector(".ic").style.backgroundImage = `url(${ICON[held.id]})`;
    elHeld.querySelector(".q").textContent = held.qty>1 ? held.qty : "";
  } else elHeld.style.display = "none";
}
addEventListener("pointermove", e=>{
  elHeld.style.left = (e.clientX+8)+"px";  elHeld.style.top = (e.clientY+8)+"px";
  elTip.style.left  = (e.clientX+14)+"px"; elTip.style.top  = (e.clientY+18)+"px";
});
