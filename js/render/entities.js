"use strict";
/* Sprites pré-rendus des animaux. */

const ANIMAL_IMG = {
  lapin: frames2(12,10,(g,f)=>{
    g.fillStyle="#cfd2d6"; g.fillRect(2,4,8,4); g.fillRect(8,2,3,4);
    g.fillRect(8,0,1,3); g.fillRect(10,f,1,3);
    g.fillStyle="#e8b4c0"; g.fillRect(8,1,1,1);
    g.fillStyle="#ffffff"; g.fillRect(1,4,2,2);
    g.fillStyle="#2b2026"; g.fillRect(10,3,1,1);
    g.fillStyle="#9fa4ab";
    if(f){ g.fillRect(3,8,2,2); g.fillRect(7,8,2,2); }
    else { g.fillRect(2,8,2,2); g.fillRect(8,8,2,2); }
  }),
  faisan: frames2(12,10,(g,f)=>{
    g.fillStyle="#7a4a2b"; g.fillRect(0,3,4,1); g.fillRect(1,4,3,1);
    g.fillStyle="#a33b2e"; g.fillRect(3,3,6,4);
    g.fillStyle="#2e6e3e"; g.fillRect(8,1,3,3);
    g.fillStyle="#ffffff"; g.fillRect(8,3,2,1);
    g.fillStyle="#e0463f"; g.fillRect(9,1,1,1);
    g.fillStyle="#e3b95c"; g.fillRect(11,2,1,1);
    g.fillStyle="#5b3a23";
    if(f){ g.fillRect(5,7,1,3); g.fillRect(7,7,1,3); }
    else { g.fillRect(4,7,1,3); g.fillRect(8,7,1,3); }
  }),
  renard: frames2(14,10,(g,f)=>{
    g.fillStyle="#f3e8d8"; g.fillRect(0,4,2,2);
    g.fillStyle="#d9762e"; g.fillRect(1,3,4,3); g.fillRect(4,3,7,4); g.fillRect(10,1,3,4);
    g.fillRect(10,0,1,2); g.fillRect(12,0,1,2);
    g.fillStyle="#f3e8d8"; g.fillRect(9,5,2,2);
    g.fillStyle="#2b2026"; g.fillRect(11,2,1,1); g.fillRect(13,3,1,1);
    g.fillStyle="#5b3a23";
    if(f){ g.fillRect(5,7,1,3); g.fillRect(9,7,1,3); }
    else { g.fillRect(4,7,1,3); g.fillRect(10,7,1,3); }
  }),
  cerf: frames2(14,13,(g,f)=>{
    g.fillStyle="#6f4c30"; g.fillRect(9,0,1,3); g.fillRect(12,0,1,3); g.fillRect(8,1,2,1); g.fillRect(11,1,2,1);
    g.fillStyle="#b08968"; g.fillRect(9,3,4,3); g.fillRect(8,5,3,3); g.fillRect(2,6,9,4);
    g.fillStyle="#e8ddcf"; g.fillRect(1,6,1,2); g.fillRect(3,8,6,2);
    g.fillStyle="#2b2026"; g.fillRect(11,4,1,1);
    g.fillStyle="#8a6850";
    if(f){ g.fillRect(4,10,1,3); g.fillRect(9,10,1,3); }
    else { g.fillRect(3,10,1,3); g.fillRect(10,10,1,3); }
  }),
  sanglier: frames2(14,10,(g,f)=>{
    g.fillStyle="#3e2d20"; g.fillRect(2,2,9,1);
    g.fillStyle="#5b4332"; g.fillRect(1,3,10,5); g.fillRect(10,4,3,4);
    g.fillStyle="#8c6a52"; g.fillRect(13,6,1,2);
    g.fillStyle="#e8e4da"; g.fillRect(12,7,1,1);
    g.fillStyle="#2b2026"; g.fillRect(11,5,1,1);
    g.fillStyle="#3e2d20";
    if(f){ g.fillRect(3,8,2,2); g.fillRect(9,8,2,2); }
    else { g.fillRect(2,8,2,2); g.fillRect(10,8,2,2); }
  }),
  requin: frames2(16,8,(g,f)=>{
    g.fillStyle="#4a6878"; g.fillRect(0,3,14,3); g.fillRect(13,3,2,2);
    g.fillStyle="#6a8898"; g.fillRect(1,3,10,1);
    g.fillStyle="#c8d8e0"; g.fillRect(0,4,3,1);
    g.fillStyle="#2b3a44"; g.fillRect(13,3,1,1);
    g.fillStyle="#4a6878"; g.fillRect(6,1,2,2); g.fillRect(5,2,1,1); g.fillRect(8,2,1,1);
    g.fillStyle="#3a5060";
    if(f){ g.fillRect(14,2,2,2); g.fillRect(14,5,2,2); }
    else  { g.fillRect(15,2,1,2); g.fillRect(15,5,1,2); }
  }),
  corbeau: frames2(12,10,(g,f)=>{
    g.fillStyle="#1a1a2e"; g.fillRect(2,3,7,4); g.fillRect(8,2,3,3);
    g.fillStyle="#2e2e52"; g.fillRect(3,3,5,2);
    g.fillStyle="#e8f0ff"; g.fillRect(9,3,1,1);
    g.fillStyle="#1a1a2e"; g.fillRect(10,2,2,1); g.fillRect(11,3,1,1);
    g.fillStyle="#2b2040";
    if(f){ g.fillRect(4,7,1,3); g.fillRect(7,7,1,3); }
    else { g.fillRect(3,7,1,3); g.fillRect(8,7,1,3); }
    g.fillStyle="#1a1a2e";
    if(f){ g.fillRect(2,2,3,1); g.fillRect(6,1,3,1); }
    else  { g.fillRect(2,4,3,1); g.fillRect(6,4,3,1); }
  }),
};
