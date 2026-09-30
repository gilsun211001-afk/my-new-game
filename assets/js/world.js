/* ═══════════════════════════════════════════════════════════
   기획마을 — 조선 판타지 탐험 엔진
   타일 16px · 정수 배율 픽셀 렌더 · 충돌 · NPC 대화 · 모바일 조작
   ═══════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  const T = 16;                       // tile size (px, before scale)
  const MAP_W = 44, MAP_H = 32;

  /* palette — emerald night village */
  const C = {
    grass1: "#1d3a2c", grass2: "#224434", grass3: "#2a5240", grassHi: "#3c7258",
    path1: "#6b6250", path2: "#7d735d", pathEdge: "#4e4839",
    water1: "#0f3a45", water2: "#15505c", waterHi: "#4fd1c5",
    wood: "#4a2f22", woodHi: "#6b4431", plaster: "#d9d2bf", plasterSh: "#b3ab96",
    stone: "#5a5f5c", stoneHi: "#7c827e", stoneSh: "#3b3f3d",
    roof: "#1f2b33", roofHi: "#35505a", roofRidge: "#0f171b", roofEm: "#1c8f6c",
    pine: "#123326", pineHi: "#1f5a40", trunk: "#3a2618",
    blossom: "#e8a0b4", blossomHi: "#f7c9d6",
    lantern: "#34e0a1", lanternGlow: "rgba(52,224,161,.22)", fire: "#ffcf6b",
    dancheongR: "#b8452f", dancheongG: "#2fae84", dancheongB: "#2d6f9e",
    shadow: "rgba(0,0,0,.28)", ink: "#0a1210"
  };

  /* ── seeded rng ── */
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  /* ── map construction ── */
  // tile codes: 0 grass 1 path 2 water 3 bridge 4 plaza stone 9 void
  const tiles = new Uint8Array(MAP_W * MAP_H);
  const solid = new Uint8Array(MAP_W * MAP_H);
  const idx = (x, y) => y * MAP_W + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < MAP_W && y < MAP_H;

  function fillRect(x, y, w, h, v, arr = tiles) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (inb(i, j)) arr[idx(i, j)] = v; }

  // paths
  fillRect(20, 4, 4, 26, 1);           // north-south main road
  fillRect(4, 15, 36, 3, 1);            // east-west road
  fillRect(17, 12, 10, 9, 4);           // central plaza
  fillRect(8, 8, 3, 8, 1); fillRect(33, 8, 3, 8, 1);
  fillRect(8, 17, 3, 7, 1); fillRect(33, 17, 3, 7, 1);
  // stream (west→south)
  for (let y = 0; y < MAP_H; y++) { const x = 2 + Math.round(Math.sin(y * .45) * 1.2); fillRect(x, y, 2, 1, 2); }
  for (let x = 0; x < MAP_W; x++) { const y = 27 + Math.round(Math.sin(x * .35) * 1); if (x > 3) fillRect(x, y, 1, 2, 2); }
  // bridges
  fillRect(20, 26, 4, 4, 3); fillRect(1, 15, 5, 3, 3);
  // map border solid
  for (let x = 0; x < MAP_W; x++) { solid[idx(x, 0)] = 1; solid[idx(x, MAP_H - 1)] = 1; }
  for (let y = 0; y < MAP_H; y++) { solid[idx(0, y)] = 1; solid[idx(MAP_W - 1, y)] = 1; }
  for (let i = 0; i < tiles.length; i++) if (tiles[i] === 2) solid[i] = 1;

  /* buildings: x,y = top-left tile, w,h in tiles, door = tile offset */
  const BUILDINGS = [
    { id: "seodang",  name: "서당",   sub: "자기소개서", x: 18, y: 2,  w: 8, h: 5, roof: C.roof, trim: C.dancheongG },
    { id: "gongbang", name: "공방",   sub: "Project Joseon", x: 30, y: 3, w: 9, h: 5, roof: "#2a2320", trim: C.dancheongR },
    { id: "seoru",    name: "성루",   sub: "Castle Survival", x: 31, y: 19, w: 8, h: 5, roof: "#2b1f2a", trim: C.dancheongB },
    { id: "seogo",    name: "장서각", sub: "기획서 서고", x: 5, y: 3, w: 9, h: 5, roof: "#1b2733", trim: C.dancheongB },
    { id: "jumak",    name: "주막",   sub: "게임 분석 도감", x: 5, y: 19, w: 8, h: 5, roof: "#2d2418", trim: C.dancheongR },
    { id: "yeokcham", name: "역참",   sub: "연락 · 노션", x: 25, y: 23, w: 6, h: 4, roof: "#1f2b33", trim: C.dancheongG }
  ];
  BUILDINGS.forEach(b => {
    fillRect(b.x, b.y, b.w, b.h, 1, solid);
    b.door = { x: b.x + Math.floor(b.w / 2), y: b.y + b.h };  // tile in front of door
    fillRect(b.door.x - 1, b.door.y, 2, Math.max(1, 0), 1);     // doorstep path
    tiles[idx(b.door.x, b.door.y)] = 1; tiles[idx(b.door.x - 1, b.door.y)] = 1;
  });

  /* props (trees, lanterns, rocks, fences, sign) */
  const PROPS = [];
  const R = rng(7);
  function freeFor(x, y) { return inb(x, y) && !solid[idx(x, y)] && tiles[idx(x, y)] === 0; }
  // pine forest edge
  for (let i = 0; i < 140; i++) {
    const x = Math.floor(R() * MAP_W), y = Math.floor(R() * MAP_H);
    const edge = x < 5 || x > MAP_W - 5 || y < 2 || y > MAP_H - 4;
    if (!edge && R() > .12) continue;
    if (freeFor(x, y) && freeFor(x, y + 1)) { PROPS.push({ t: R() > .82 ? "blossom" : "pine", x, y }); solid[idx(x, y)] = 1; }
  }
  // stone lanterns lining roads
  [[19, 6], [24, 6], [19, 11], [24, 11], [19, 22], [24, 22], [16, 14], [27, 14], [16, 18], [27, 18], [12, 14], [31, 14], [12, 18], [31, 18]]
    .forEach(([x, y]) => { if (!solid[idx(x, y)]) { PROPS.push({ t: "lantern", x, y }); solid[idx(x, y)] = 1; } });
  // plaza features
  PROPS.push({ t: "well", x: 21, y: 15 }); fillRect(21, 15, 2, 2, 1, solid);
  PROPS.push({ t: "sign", x: 19, y: 20 }); solid[idx(19, 20)] = 1;
  // blossom accents near buildings
  [[16, 4], [28, 4], [15, 21], [29, 20], [14, 9], [29, 10]].forEach(([x, y]) => { if (freeFor(x, y)) { PROPS.push({ t: "blossom", x, y }); solid[idx(x, y)] = 1; } });
  // flowers (non-solid)
  const FLOWERS = [];
  for (let i = 0; i < 90; i++) { const x = Math.floor(R() * MAP_W), y = Math.floor(R() * MAP_H); if (freeFor(x, y)) FLOWERS.push({ x, y, c: R() > .5 ? C.blossomHi : "#f2e29b", o: R() * 12 }); }

  /* ── NPCs ── */
  const NPCS = [];
  function addNPC(o) { NPCS.push(Object.assign({ dir: 0, frame: 0, t: 0 }, o)); solid[idx(o.x, o.y)] = 1; }

  /* ── state ── */
  const S = {
    canvas: null, ctx: null, scale: 3, W: 0, H: 0,
    player: { x: 22 * T, y: 28 * T, dir: 1, frame: 0, anim: 0, moving: false },
    keys: {}, cam: { x: 0, y: 0 }, t: 0, running: false, paused: true,
    target: null, path: null, nearby: null, onInteract: null, onNear: null,
    stick: { x: 0, y: 0 }, fireflies: [], staticLayer: null, lastTs: 0, stepSfx: null
  };

  /* ── static layer (ground + buildings) pre-render ── */
  function renderStatic() {
    const cv = document.createElement("canvas"); cv.width = MAP_W * T; cv.height = MAP_H * T;
    const g = cv.getContext("2d"); const r = rng(42);
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      const t = tiles[idx(x, y)], px = x * T, py = y * T;
      if (t === 0) {
        g.fillStyle = (x + y) % 2 ? C.grass1 : C.grass2; g.fillRect(px, py, T, T);
        for (let k = 0; k < 5; k++) { g.fillStyle = r() > .6 ? C.grass3 : C.grassHi; g.fillRect(px + Math.floor(r() * 15), py + Math.floor(r() * 15), 1, r() > .5 ? 2 : 1); }
      } else if (t === 1 || t === 4) {
        g.fillStyle = t === 4 ? "#5d5a4e" : C.path1; g.fillRect(px, py, T, T);
        g.fillStyle = t === 4 ? "#6d6a5c" : C.path2;
        const o = (y % 2) * 4;
        for (let s = 0; s < 2; s++) g.fillRect(px + ((s * 8 + o) % 16), py + 1 + (s ? 8 : 0), 7, 6);
        g.fillStyle = C.pathEdge; g.fillRect(px, py + 15, T, 1);
      } else if (t === 2) {
        g.fillStyle = C.water1; g.fillRect(px, py, T, T);
        g.fillStyle = C.water2; g.fillRect(px, py + 5, T, 3);
      } else if (t === 3) {
        g.fillStyle = C.water1; g.fillRect(px, py, T, T);
        g.fillStyle = C.wood; g.fillRect(px, py + 1, T, 14);
        g.fillStyle = C.woodHi; for (let k = 0; k < 16; k += 4) g.fillRect(px + k, py + 1, 3, 14);
        g.fillStyle = C.ink; g.fillRect(px, py + 1, T, 1); g.fillRect(px, py + 14, T, 1);
      }
      // grass edge softening next to path
      if (t === 0 && inb(x, y + 1) && tiles[idx(x, y + 1)] === 1) { g.fillStyle = C.grass3; g.fillRect(px, py + 14, T, 2); }
    }
    BUILDINGS.forEach(b => drawBuilding(g, b));
    S.staticLayer = cv;
  }

  function drawBuilding(g, b) {
    const x = b.x * T, y = b.y * T, w = b.w * T, h = b.h * T;
    // stone base
    g.fillStyle = C.stoneSh; g.fillRect(x - 2, y + h - 10, w + 4, 10);
    g.fillStyle = C.stone; g.fillRect(x - 2, y + h - 10, w + 4, 7);
    g.fillStyle = C.stoneHi; for (let k = 0; k < w + 4; k += 10) g.fillRect(x - 2 + k, y + h - 10, 8, 2);
    // walls: plaster with wood frame
    const wy = y + 22, wh = h - 32;
    g.fillStyle = C.plaster; g.fillRect(x + 4, wy, w - 8, wh);
    g.fillStyle = C.plasterSh; g.fillRect(x + 4, wy + wh - 3, w - 8, 3);
    g.fillStyle = C.wood;
    for (let k = x + 4; k <= x + w - 6; k += 16) g.fillRect(k, wy, 3, wh);
    g.fillRect(x + 4, wy, w - 8, 3);
    // lattice windows
    for (let k = x + 10; k < x + w - 20; k += 32) {
      if (Math.abs(k + 8 - (b.door.x * T)) < 18) continue;
      g.fillStyle = "#e9dfc3"; g.fillRect(k, wy + 7, 12, 10);
      g.fillStyle = C.woodHi; g.fillRect(k, wy + 11, 12, 1); g.fillRect(k + 5, wy + 7, 1, 10); g.fillRect(k, wy + 7, 12, 1); g.fillRect(k, wy + 16, 12, 1);
      g.fillStyle = "rgba(255,210,120,.35)"; g.fillRect(k + 1, wy + 8, 4, 3);
    }
    // door
    const dx = b.door.x * T - 8, dy = y + h - 26;
    g.fillStyle = C.wood; g.fillRect(dx, dy, 16, 17);
    g.fillStyle = "#e9dfc3"; g.fillRect(dx + 2, dy + 2, 5, 13); g.fillRect(dx + 9, dy + 2, 5, 13);
    g.fillStyle = C.woodHi; g.fillRect(dx + 2, dy + 8, 12, 1);
    g.fillStyle = "rgba(255,200,110,.5)"; g.fillRect(dx + 3, dy + 3, 3, 4);
    // roof — curved eaves
    const ry = y - 2, rh = 26;
    for (let j = 0; j < rh; j++) {
      const k = j / rh;
      const inset = Math.round((1 - k) * 14 - Math.sin(k * Math.PI) * 2);
      const lift = j > rh - 5 ? (rh - j) : 0;
      g.fillStyle = j % 4 === 0 ? C.roofRidge : (j % 4 === 1 ? shade(b.roof, 18) : b.roof);
      g.fillRect(x - 6 + inset, ry + j, w + 12 - inset * 2, 1);
      if (lift) { g.fillStyle = b.roof; g.fillRect(x - 8, ry + j - lift, 3, 1); g.fillRect(x + w + 5, ry + j - lift, 3, 1); }
    }
    // tile ribs
    g.fillStyle = shade(b.roof, 26);
    for (let k = x + 4; k < x + w - 2; k += 5) g.fillRect(k, ry + 6, 1, rh - 8);
    // ridge
    g.fillStyle = C.roofRidge; g.fillRect(x + 8, ry - 2, w - 16, 4);
    g.fillStyle = shade(b.roof, 30); g.fillRect(x + 8, ry - 2, w - 16, 1);
    g.fillRect(x + 4, ry - 5, 4, 4); g.fillRect(x + w - 8, ry - 5, 4, 4);
    // eave shadow + dancheong trim
    g.fillStyle = C.ink; g.fillRect(x - 4, ry + rh, w + 8, 2);
    for (let k = x - 2; k < x + w + 2; k += 6) {
      g.fillStyle = b.trim; g.fillRect(k, ry + rh - 3, 4, 2);
      g.fillStyle = C.dancheongG; g.fillRect(k + 4, ry + rh - 3, 2, 2);
    }
    // hanging sign board
    const sw = Math.max(30, b.name.length * 9 + 12), sx = x + w / 2 - sw / 2, sy = ry + rh + 2;
    g.fillStyle = C.ink; g.fillRect(sx - 1, sy - 1, sw + 2, 13);
    g.fillStyle = "#23150e"; g.fillRect(sx, sy, sw, 11);
    g.fillStyle = "#e8c66a"; g.fillRect(sx, sy, sw, 1); g.fillRect(sx, sy + 10, sw, 1);
    b.label = { x: sx + sw / 2, y: sy + 6 };
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n >> 16) + amt), gg = Math.min(255, ((n >> 8) & 255) + amt), b = Math.min(255, (n & 255) + amt);
    return "#" + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1);
  }

  /* ── props ── */
  function drawProp(g, p, t) {
    const x = p.x * T, y = p.y * T;
    if (p.t === "pine") {
      g.fillStyle = C.shadow; g.fillRect(x + 2, y + 13, 12, 3);
      g.fillStyle = C.trunk; g.fillRect(x + 7, y + 8, 3, 7);
      const layers = [[1, -6, 14], [2, -12, 12], [4, -17, 8]];
      layers.forEach(([ox, oy, w], i) => { g.fillStyle = C.pine; g.fillRect(x + ox, y + oy + 6, w, 7); g.fillStyle = C.pineHi; g.fillRect(x + ox + 1, y + oy + 6, w - 5, 2); });
    } else if (p.t === "blossom") {
      g.fillStyle = C.shadow; g.fillRect(x + 1, y + 13, 14, 3);
      g.fillStyle = C.trunk; g.fillRect(x + 7, y + 6, 3, 9); g.fillRect(x + 4, y + 6, 3, 2);
      g.fillStyle = C.blossom; g.fillRect(x - 1, y - 6, 18, 12); g.fillRect(x + 2, y - 9, 12, 3);
      g.fillStyle = C.blossomHi; g.fillRect(x + 1, y - 7, 6, 3); g.fillRect(x + 9, y - 3, 5, 3);
      if (Math.floor(t / 400 + p.x) % 7 === 0) { g.fillStyle = C.blossomHi; g.fillRect(x + 4 + ((t / 60) % 10), y + 8 + ((t / 90) % 6), 1, 1); }
    } else if (p.t === "lantern") {
      const flick = .75 + Math.sin(t / 180 + p.x) * .12;
      g.fillStyle = C.lanternGlow; g.globalAlpha = flick; g.beginPath(); g.arc(x + 8, y + 2, 13, 0, 6.283); g.fill(); g.globalAlpha = 1;
      g.fillStyle = C.stoneSh; g.fillRect(x + 4, y + 11, 8, 4);
      g.fillStyle = C.stone; g.fillRect(x + 6, y + 5, 4, 7); g.fillRect(x + 3, y - 3, 10, 3);
      g.fillStyle = C.stoneHi; g.fillRect(x + 4, y - 5, 8, 2);
      g.fillStyle = C.lantern; g.fillRect(x + 5, y, 6, 5);
      g.fillStyle = "#b8ffe4"; g.fillRect(x + 7, y + 1, 2, 2);
    } else if (p.t === "well") {
      g.fillStyle = C.shadow; g.fillRect(x, y + 28, 32, 4);
      g.fillStyle = C.stoneSh; g.fillRect(x + 2, y + 14, 28, 16);
      g.fillStyle = C.stone; g.fillRect(x + 2, y + 12, 28, 6);
      g.fillStyle = C.water2; g.fillRect(x + 6, y + 13, 20, 4);
      g.fillStyle = C.waterHi; g.fillRect(x + 8 + Math.floor((t / 200) % 12), y + 14, 3, 1);
      g.fillStyle = C.wood; g.fillRect(x + 3, y - 4, 3, 18); g.fillRect(x + 26, y - 4, 3, 18);
      g.fillStyle = b_roof(); g.fillRect(x - 1, y - 8, 34, 5);
      g.fillStyle = C.roofRidge; g.fillRect(x - 1, y - 4, 34, 1);
    } else if (p.t === "sign") {
      g.fillStyle = C.shadow; g.fillRect(x + 3, y + 13, 10, 3);
      g.fillStyle = C.wood; g.fillRect(x + 7, y + 5, 2, 10);
      g.fillStyle = C.woodHi; g.fillRect(x + 1, y - 2, 14, 8);
      g.fillStyle = "#e8d9ae"; g.fillRect(x + 3, y, 10, 4);
      g.fillStyle = C.wood; g.fillRect(x + 4, y + 1, 8, 1); g.fillRect(x + 4, y + 3, 6, 1);
    }
  }
  function b_roof() { return C.roofEm; }

  /* ── people (procedural pixel sprites) ── */
  // dir: 0 down, 1 up, 2 left, 3 right
  function drawPerson(g, px, py, dir, frame, st) {
    const x = Math.round(px), y = Math.round(py);
    const step = frame % 2 === 1;
    g.fillStyle = C.shadow; g.fillRect(x + 3, y + 14, 10, 2);
    // legs / feet
    g.fillStyle = st.pants || "#e9e3d2";
    if (dir < 2) { g.fillRect(x + 5, y + 12, 2, step ? 2 : 3); g.fillRect(x + 9, y + 12, 2, step ? 3 : 2); }
    else { g.fillRect(x + 6 + (step ? -1 : 0), y + 12, 2, 3); g.fillRect(x + 8 + (step ? 1 : 0), y + 12, 2, 3); }
    g.fillStyle = "#1b1410"; g.fillRect(x + 5, y + 14, 2, 1); g.fillRect(x + 9, y + 14, 2, 1);
    // robe
    g.fillStyle = st.robe; g.fillRect(x + 4, y + 7, 8, 6); g.fillRect(x + 3, y + 10, 10, 3);
    g.fillStyle = st.robeHi || shade(st.robe, 22); g.fillRect(x + 4, y + 7, 8, 1);
    if (dir === 0) { g.fillStyle = st.collar || "#f4efe2"; g.fillRect(x + 6, y + 7, 4, 2); g.fillStyle = st.belt || "#1c1a17"; g.fillRect(x + 4, y + 10, 8, 1); }
    if (st.tie && dir === 0) { g.fillStyle = st.tie; g.fillRect(x + 8, y + 10, 1, 3); }
    // arms swing
    g.fillStyle = st.robe;
    if (dir === 2) g.fillRect(x + 6 + (step ? 1 : -1), y + 8, 3, 4);
    else if (dir === 3) g.fillRect(x + 7 + (step ? -1 : 1), y + 8, 3, 4);
    else { g.fillRect(x + 2, y + 8 + (step ? 1 : 0), 2, 4); g.fillRect(x + 12, y + 8 + (step ? 0 : 1), 2, 4); g.fillStyle = "#e8c4a0"; g.fillRect(x + 2, y + 12 + (step ? 1 : 0), 2, 1); g.fillRect(x + 12, y + 12 + (step ? 0 : 1), 2, 1); }
    // head
    g.fillStyle = "#e8c4a0"; g.fillRect(x + 5, y + 2, 6, 5);
    g.fillStyle = st.hair || "#17120f";
    if (dir === 1) g.fillRect(x + 5, y + 2, 6, 5);
    else { g.fillRect(x + 5, y + 2, 6, 2); if (dir === 2) g.fillRect(x + 9, y + 2, 2, 4); if (dir === 3) g.fillRect(x + 5, y + 2, 2, 4); }
    if (dir === 0) { g.fillStyle = "#1a1210"; g.fillRect(x + 6, y + 4, 1, 1); g.fillRect(x + 9, y + 4, 1, 1); g.fillStyle = "#d99a88"; g.fillRect(x + 6, y + 5, 1, 1); g.fillRect(x + 9, y + 5, 1, 1); }
    if (dir === 2) { g.fillStyle = "#1a1210"; g.fillRect(x + 5, y + 4, 1, 1); }
    if (dir === 3) { g.fillStyle = "#1a1210"; g.fillRect(x + 10, y + 4, 1, 1); }
    // headwear
    if (st.hat === "gat") { // 갓: wide brim + crown
      g.fillStyle = "#0c0c0e"; g.fillRect(x + 1, y + 2, 14, 1); g.fillRect(x + 5, y - 2, 6, 4);
      g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x + 2, y + 2, 12, 1);
      g.fillStyle = st.accent || C.lantern; g.fillRect(x + 5, y + 1, 6, 1);
    } else if (st.hat === "topknot") { g.fillStyle = st.hair || "#17120f"; g.fillRect(x + 7, y, 2, 2); }
    else if (st.hat === "bun") { g.fillStyle = st.hair; g.fillRect(x + 6, y, 4, 2); g.fillStyle = "#e8c66a"; g.fillRect(x + 10, y + 1, 2, 1); }
    else if (st.hat === "shaman") { g.fillStyle = "#b8452f"; g.fillRect(x + 4, y, 8, 3); g.fillStyle = "#e8c66a"; g.fillRect(x + 4, y + 2, 8, 1); g.fillStyle = C.lantern; g.fillRect(x + 7, y - 1, 2, 1); }
    else if (st.hat === "helmet") { g.fillStyle = "#3b3f3d"; g.fillRect(x + 4, y, 8, 3); g.fillStyle = "#b8452f"; g.fillRect(x + 7, y - 2, 2, 2); }
    else if (st.hat === "cap") { g.fillStyle = "#2d2418"; g.fillRect(x + 4, y + 1, 8, 2); }
  }

  /* ── collision & movement ── */
  function blocked(px, py) {
    // feet box: 8×5 at bottom center of a 16px sprite
    const pts = [[px + 4, py + 11], [px + 12, py + 11], [px + 4, py + 15], [px + 12, py + 15]];
    return pts.some(([x, y]) => { const tx = Math.floor(x / T), ty = Math.floor(y / T); return !inb(tx, ty) || solid[idx(tx, ty)]; });
  }
  function tileOf(p) { return { x: Math.floor((p.x + 8) / T), y: Math.floor((p.y + 13) / T) }; }

  /* BFS path for tap-to-move */
  function findPath(sx, sy, tx, ty) {
    if (!inb(tx, ty)) return null;
    // if target solid, retarget to nearest free neighbour
    if (solid[idx(tx, ty)]) {
      let best = null, bd = 1e9;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const x = tx + dx, y = ty + dy; if (inb(x, y) && !solid[idx(x, y)]) { const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = [x, y]; } }
      }
      if (!best) return null; [tx, ty] = best;
    }
    const prev = new Int32Array(MAP_W * MAP_H).fill(-1); const q = [idx(sx, sy)]; prev[q[0]] = q[0];
    while (q.length) {
      const c = q.shift(); if (c === idx(tx, ty)) break;
      const cx = c % MAP_W, cy = (c / MAP_W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy; if (!inb(nx, ny)) continue; const n = idx(nx, ny);
        if (prev[n] !== -1 || solid[n]) continue; prev[n] = c; q.push(n);
      }
    }
    if (prev[idx(tx, ty)] === -1) return null;
    const path = []; let c = idx(tx, ty); while (c !== idx(sx, sy)) { path.unshift({ x: c % MAP_W, y: (c / MAP_W) | 0 }); c = prev[c]; }
    return path;
  }

  /* ── interaction targets ── */
  function interactables() {
    const list = BUILDINGS.map(b => ({ kind: "building", id: b.id, name: b.name, sub: b.sub, x: b.door.x, y: b.door.y - 1, ref: b }));
    NPCS.forEach(n => list.push({ kind: "npc", id: n.id, name: n.name, sub: n.sub, x: n.x, y: n.y, ref: n }));
    list.push({ kind: "sign", id: "sign", name: "안내판", sub: "조작법", x: 19, y: 20 });
    return list;
  }
  function nearest() {
    const p = tileOf(S.player); let best = null, bd = 2.3;
    interactables().forEach(it => { const d = Math.hypot(it.x - p.x, (it.y - p.y) * 1.1); if (d < bd) { bd = d; best = it; } });
    return best;
  }

  /* ── main loop ── */
  function update(dt) {
    const pl = S.player; let vx = 0, vy = 0;
    const k = S.keys;
    if (k.ArrowLeft || k.a) vx -= 1; if (k.ArrowRight || k.d) vx += 1;
    if (k.ArrowUp || k.w) vy -= 1; if (k.ArrowDown || k.s) vy += 1;
    if (S.stick.x || S.stick.y) { vx = S.stick.x; vy = S.stick.y; }
    if (vx || vy) S.path = null;
    // follow tap path
    if (!vx && !vy && S.path && S.path.length) {
      const n = S.path[0], tx = n.x * T, ty = n.y * T - 5;
      const dx = tx - pl.x, dy = ty - pl.y;
      if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) { pl.x = tx; pl.y = ty; S.path.shift(); if (!S.path.length && S.pathThen) { const f = S.pathThen; S.pathThen = null; f(); } }
      else { vx = Math.abs(dx) > 1 ? Math.sign(dx) : 0; vy = Math.abs(dy) > 1 && !vx ? Math.sign(dy) : 0; }
    }
    const len = Math.hypot(vx, vy);
    pl.moving = len > 0.1;
    if (pl.moving) {
      const sp = (k.Shift ? 120 : 78) * dt;
      const mx = vx / Math.max(1, len) * sp, my = vy / Math.max(1, len) * sp;
      if (!blocked(pl.x + mx, pl.y)) pl.x += mx;
      if (!blocked(pl.x, pl.y + my)) pl.y += my;
      if (Math.abs(vx) > Math.abs(vy)) pl.dir = vx < 0 ? 2 : 3; else pl.dir = vy < 0 ? 1 : 0;
      pl.anim += dt * (k.Shift ? 12 : 8); pl.frame = Math.floor(pl.anim) % 2 ? 1 : 0;
      if (S.stepSfx && Math.floor(pl.anim) !== S._lastStep) { S._lastStep = Math.floor(pl.anim); if (S._lastStep % 2 === 0) S.stepSfx(); }
    } else pl.frame = 0;
    // NPC idle bob / face player when close
    NPCS.forEach(n => { n.t += dt; const p = tileOf(pl); if (Math.hypot(n.x - p.x, n.y - p.y) < 3) { const dx = p.x - n.x, dy = p.y - n.y; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0); } });
    // nearby prompt
    const nb = nearest();
    if ((nb && nb.id) !== (S.nearby && S.nearby.id)) { S.nearby = nb; S.onNear && S.onNear(nb); }
    // camera
    const vw = S.W / S.scale, vh = S.H / S.scale;
    const cx = Math.max(0, Math.min(MAP_W * T - vw, pl.x + 8 - vw / 2));
    const cy = Math.max(0, Math.min(MAP_H * T - vh, pl.y + 8 - vh / 2));
    S.cam.x += (cx - S.cam.x) * Math.min(1, dt * 8); S.cam.y += (cy - S.cam.y) * Math.min(1, dt * 8);
    if (MAP_W * T < vw) S.cam.x = (MAP_W * T - vw) / 2;
    if (MAP_H * T < vh) S.cam.y = (MAP_H * T - vh) / 2;
    // fireflies
    S.fireflies.forEach(f => { f.a += dt * f.s; f.x += Math.cos(f.a) * 6 * dt; f.y += Math.sin(f.a * 1.3) * 5 * dt; });
  }

  function draw() {
    const g = S.ctx, sc = S.scale, t = S.t;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#07100d"; g.fillRect(0, 0, S.W, S.H);
    g.setTransform(sc, 0, 0, sc, -Math.round(S.cam.x * sc), -Math.round(S.cam.y * sc));
    g.imageSmoothingEnabled = false;
    g.drawImage(S.staticLayer, 0, 0);
    // animated water shimmer
    g.fillStyle = C.waterHi;
    for (let i = 0; i < tiles.length; i++) if (tiles[i] === 2 && (i * 7 + Math.floor(t / 300)) % 11 === 0) { const x = (i % MAP_W) * T, y = ((i / MAP_W) | 0) * T; g.globalAlpha = .6; g.fillRect(x + ((t / 90 + i) % 12), y + 6, 3, 1); g.globalAlpha = 1; }
    // flowers sway
    FLOWERS.forEach(f => { g.fillStyle = f.c; const s = Math.sin(t / 500 + f.o) > 0 ? 1 : 0; g.fillRect(f.x * T + 5 + s, f.y * T + 9, 2, 2); g.fillRect(f.x * T + 11, f.y * T + 5 + s, 1, 1); });
    // depth-sorted sprites
    const list = [];
    PROPS.forEach(p => list.push({ y: p.y * T + (p.t === "well" ? 24 : 12), d: () => drawProp(g, p, t) }));
    NPCS.forEach(n => list.push({ y: n.y * T + 12, d: () => { drawPerson(g, n.x * T, n.y * T - 4 + (Math.sin(n.t * 2.4) > .6 ? -1 : 0), n.dir, 0, n.style); } }));
    const pl = S.player; list.push({ y: pl.y + 12, d: () => drawPerson(g, pl.x, pl.y, pl.dir, pl.frame, S.playerStyle) });
    list.sort((a, b) => a.y - b.y).forEach(o => o.d());
    // interaction marker
    if (S.nearby) {
      const it = S.nearby, bx = it.x * T + 8, by = it.y * T - (it.kind === "npc" ? 12 : 6) + Math.sin(t / 180) * 1.5;
      g.fillStyle = C.ink; g.fillRect(bx - 5, by - 7, 10, 9);
      g.fillStyle = C.lantern; g.fillRect(bx - 4, by - 6, 8, 7);
      g.fillStyle = C.ink; g.fillRect(bx - 1, by - 5, 2, 3); g.fillRect(bx - 1, by - 1, 2, 1);
    }
    // path dots
    if (S.path && S.path.length) { g.fillStyle = "rgba(52,224,161,.55)"; S.path.forEach((n, i) => { if (i % 2 === 0) g.fillRect(n.x * T + 7, n.y * T + 7, 2, 2); }); const l = S.path[S.path.length - 1]; g.strokeStyle = C.lantern; g.lineWidth = 1; g.strokeRect(l.x * T + 2.5, l.y * T + 2.5, 11, 11); }
    // night vignette + fireflies (screen space)
    g.setTransform(1, 0, 0, 1, 0, 0);
    const fs = Math.max(12, Math.round(sc * 3.6));
    g.font = `700 ${fs}px Galmuri11, 'IBM Plex Sans KR', sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    BUILDINGS.forEach(b => { if (!b.label) return; const sx = Math.round((b.label.x - S.cam.x) * sc), sy = Math.round((b.label.y - S.cam.y) * sc) + 1; if (sx < -80 || sx > S.W + 80 || sy < -40 || sy > S.H + 40) return; g.fillStyle = "#0a0604"; g.fillText(b.name, sx + 1, sy + 1); g.fillStyle = "#f3dea0"; g.fillText(b.name, sx, sy); });
    S.fireflies.forEach(f => {
      const sx = (f.x - S.cam.x) * sc, sy = (f.y - S.cam.y) * sc; if (sx < -10 || sy < -10 || sx > S.W + 10 || sy > S.H + 10) return;
      const a = .35 + .45 * Math.abs(Math.sin(f.a * 2)); g.fillStyle = `rgba(140,255,210,${a})`; g.fillRect(sx, sy, sc, sc);
      g.fillStyle = `rgba(52,224,161,${a * .25})`; g.fillRect(sx - sc, sy - sc, sc * 3, sc * 3);
    });
    const vg = g.createRadialGradient(S.W / 2, S.H / 2, Math.min(S.W, S.H) * .35, S.W / 2, S.H / 2, Math.max(S.W, S.H) * .75);
    vg.addColorStop(0, "rgba(4,10,8,0)"); vg.addColorStop(1, "rgba(4,10,8,.55)"); g.fillStyle = vg; g.fillRect(0, 0, S.W, S.H);
  }

  function loop(ts) {
    if (!S.running) return;
    const dt = Math.min(.05, (ts - (S.lastTs || ts)) / 1000); S.lastTs = ts; S.t = ts;
    if (!S.paused) update(dt); else { S.fireflies.forEach(f => { f.a += dt * f.s; }); NPCS.forEach(n => n.t += dt); }
    draw();
    requestAnimationFrame(loop);
  }

  function resize() {
    const r = S.canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    S.W = S.canvas.width = Math.max(1, Math.floor(r.width * dpr)); S.H = S.canvas.height = Math.max(1, Math.floor(r.height * dpr));
    // integer scale so ~22 tiles fit horizontally on desktop, ~11 on phones
    const cssScale = r.width < 520 ? 2.6 : r.width < 900 ? 3 : 3.2;
    S.scale = Math.max(2, Math.round(cssScale * dpr));
  }

  /* ── public API ── */
  const World = {
    T, MAP_W, MAP_H, BUILDINGS, NPCS, C,
    init(canvas, opts = {}) {
      S.canvas = canvas; S.ctx = canvas.getContext("2d");
      S.playerStyle = opts.playerStyle || { robe: "#1f7a5c", robeHi: "#2fae84", hat: "gat", accent: C.lantern, collar: "#f4efe2", belt: "#0f1a16", tie: "#e8c66a" };
      (opts.npcs || []).forEach(addNPC);
      S.onInteract = opts.onInteract; S.onNear = opts.onNear; S.stepSfx = opts.onStep;
      for (let i = 0; i < 46; i++) S.fireflies.push({ x: Math.random() * MAP_W * T, y: Math.random() * MAP_H * T, a: Math.random() * 6, s: .4 + Math.random() * .8 });
      renderStatic();
      if (document.fonts && document.fonts.load) document.fonts.load("10px Galmuri11").then(renderStatic).catch(() => {});
      resize(); addEventListener("resize", resize);
      this.bindInput();
      S.running = true; requestAnimationFrame(loop);
    },
    bindInput() {
      addEventListener("keydown", e => {
        if (S.paused) return;
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
        if (k === " " || k === "Enter" || k === "e") { this.interact(); return; }
        S.keys[k] = true; if (e.key === "Shift") S.keys.Shift = true;
      });
      addEventListener("keyup", e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; S.keys[k] = false; if (e.key === "Shift") S.keys.Shift = false; });
      addEventListener("blur", () => { S.keys = {}; });
      // tap / click to move (or interact if tapping the highlighted target)
      S.canvas.addEventListener("pointerdown", e => {
        if (S.paused) return;
        const r = S.canvas.getBoundingClientRect(), dpr = S.W / r.width;
        const wx = ((e.clientX - r.left) * dpr) / S.scale + S.cam.x, wy = ((e.clientY - r.top) * dpr) / S.scale + S.cam.y;
        const tx = Math.floor(wx / T), ty = Math.floor(wy / T);
        const hit = interactables().find(it => {
          if (it.kind === "building") { const b = it.ref; return tx >= b.x && tx < b.x + b.w && ty >= b.y - 1 && ty <= b.y + b.h; }
          return Math.abs(it.x - tx) <= 0 && Math.abs(it.y - ty) <= 1;
        });
        const p = tileOf(S.player);
        const dest = hit ? { x: hit.x, y: hit.kind === "npc" ? hit.y + 1 : hit.y + 1 } : { x: tx, y: ty };
        if (hit && S.nearby && S.nearby.id === hit.id) { this.interact(); return; }
        S.path = findPath(p.x, p.y, dest.x, dest.y);
        S.pathThen = hit ? () => { S.nearby = nearest(); if (S.nearby && S.nearby.id === hit.id) this.interact(); } : null;
      });
    },
    interact() { if (S.paused) return; const nb = nearest(); if (nb && S.onInteract) { S.keys = {}; S.path = null; S.onInteract(nb); } },
    setStick(x, y) { S.stick.x = x; S.stick.y = y; },
    pause(v) { S.paused = v; if (v) { S.keys = {}; S.stick.x = S.stick.y = 0; } },
    get paused() { return S.paused; },
    teleport(id) {
      const b = BUILDINGS.find(b => b.id === id); let tx, ty;
      if (b) { tx = b.door.x; ty = b.door.y; } else { const n = NPCS.find(n => n.id === id); if (!n) return; tx = n.x; ty = n.y + 1; }
      S.player.x = tx * T; S.player.y = ty * T - 5; S.player.dir = 1; S.path = null;
      S.nearby = null;
    },
    walkTo(id, then) {
      const b = BUILDINGS.find(b => b.id === id), n = NPCS.find(n => n.id === id);
      const dest = b ? { x: b.door.x, y: b.door.y } : n ? { x: n.x, y: n.y + 1 } : null; if (!dest) return;
      const p = tileOf(S.player); S.path = findPath(p.x, p.y, dest.x, dest.y);
      S.pathThen = () => { S.player.dir = 1; S.nearby = nearest(); then && then(); };
    },
    /* draw a portrait of a person style into a small canvas (for dialogue box) */
    portrait(canvas, style, dir = 0) {
      const g = canvas.getContext("2d"); g.imageSmoothingEnabled = false; g.clearRect(0, 0, canvas.width, canvas.height);
      const bust = canvas.width >= 48, k = bust ? Math.floor(canvas.width / 11) : Math.floor(canvas.width / 16);
      if (bust) g.setTransform(k, 0, 0, k, Math.round(-2.5 * k), Math.round(3 * k)); else g.setTransform(k, 0, 0, k, 0, Math.round(k * 2));
      drawPerson(g, 0, 0, dir, 0, style); g.setTransform(1, 0, 0, 1, 0, 0);
    },
    minimap(canvas) {
      const g = canvas.getContext("2d"), k = canvas.width / MAP_W;
      g.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
        const t = tiles[idx(x, y)]; g.fillStyle = t === 2 ? "#1d5f6b" : t === 1 || t === 4 || t === 3 ? "#6b6250" : "#1f4232"; g.fillRect(x * k, y * k, k + .5, k + .5);
      }
      BUILDINGS.forEach(b => { g.fillStyle = "#c9b98a"; g.fillRect(b.x * k, b.y * k, b.w * k, b.h * k); });
      return (visited) => {
        const p = tileOf(S.player);
        BUILDINGS.forEach(b => { g.fillStyle = visited.includes(b.id) ? "#34e0a1" : "#c9b98a"; g.fillRect(b.x * k, b.y * k, b.w * k, b.h * k); });
        g.fillStyle = "#fff"; g.fillRect(p.x * k - 1, p.y * k - 1, k + 2, k + 2);
      };
    }
  };
  global.World = World;
})(window);
