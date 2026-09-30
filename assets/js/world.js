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

  /* ── layout: 기획서관을 마을 정중앙에, 앞마당(광장)을 둘러 나머지 전시관을 원형 배치 ──
     광장 중심(22,19)에서 각 문까지 직선거리 11~12칸 */
  const PLAZA = { x: 16, y: 17, w: 13, h: 5 }, CENTER = { x: 22, y: 19 };
  fillRect(PLAZA.x, PLAZA.y, PLAZA.w, PLAZA.h, 4);
  for (let x = 1; x < MAP_W - 1; x++) { const y = 29 + Math.round(Math.sin(x * .35) * 1); fillRect(x, y, 1, 2, 2); }
  fillRect(20, 27, 4, 4, 3);
  for (let x = 0; x < MAP_W; x++) { solid[idx(x, 0)] = 1; solid[idx(x, MAP_H - 1)] = 1; }
  for (let y = 0; y < MAP_H; y++) { solid[idx(0, y)] = 1; solid[idx(MAP_W - 1, y)] = 1; }
  for (let i = 0; i < tiles.length; i++) if (tiles[i] === 2) solid[i] = 1;

  const BUILDINGS = [
    { id: "seogo",    name: "기획서관", sub: "개인 기획서 전시", x: 17, y: 11, w: 10, h: 6, roof: "#1b2733", trim: "#e8c66a", main: true },
    { id: "seodang",  name: "서당",     sub: "자기소개서 · 경력", x: 9,  y: 6,  w: 8, h: 5, roof: C.roof, trim: C.dancheongG },
    { id: "gongbang", name: "공방",     sub: "조선 프로젝트 기획서", x: 27, y: 6,  w: 9, h: 5, roof: "#2a2320", trim: C.dancheongR },
    { id: "jumak",    name: "주막",     sub: "게임 분석 도감", x: 6,  y: 16, w: 8, h: 5, roof: "#2d2418", trim: C.dancheongR },
    { id: "seoru",    name: "관아",     sub: "경험 · 성과 기록", x: 29, y: 16, w: 8, h: 5, roof: "#2b1f2a", trim: C.dancheongB },
    { id: "yeokcham", name: "역참",     sub: "연락처 · 노션", x: 27, y: 23, w: 6, h: 4, roof: "#1f2b33", trim: C.dancheongG }
  ];
  BUILDINGS.forEach(b => { fillRect(b.x, b.y, b.w, b.h, 1, solid); b.door = { x: b.x + Math.floor(b.w / 2), y: b.y + b.h }; });
  const road = (x, y, w, h) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (inb(i, j) && !solid[idx(i, j)] && tiles[idx(i, j)] !== 2) tiles[idx(i, j)] = tiles[idx(i, j)] === 4 ? 4 : 1; };
  road(12, 11, 2, 6); road(12, 15, 5, 2); road(15, 15, 2, 3);   // 서당: 아래로 → 기획서관 왼편 → 광장
  road(30, 11, 2, 6); road(27, 15, 5, 2); road(27, 15, 2, 3);   // 공방: 아래로 → 기획서관 오른편 → 광장
  road(9, 21, 8, 2);                           // 주막
  road(28, 21, 6, 2);                          // 관아
  road(25, 22, 2, 6); road(25, 27, 6, 1);      // 역참
  road(21, 22, 3, 5);                          // 입구 다리 → 광장
  BUILDINGS.forEach(b => { tiles[idx(b.door.x, b.door.y)] = 1; tiles[idx(b.door.x - 1, b.door.y)] = 1; });

  /* props (trees, lanterns, well, sign) */
  const PROPS = [];
  const R = rng(7);
  function freeFor(x, y) { return inb(x, y) && !solid[idx(x, y)] && tiles[idx(x, y)] === 0; }
  const nearDoor = (x, y) => BUILDINGS.some(b => Math.abs(b.door.x - x) <= 2 && y >= b.door.y - 1 && y <= b.door.y + 2);
  for (let i = 0; i < 160; i++) {
    const x = Math.floor(R() * MAP_W), y = Math.floor(R() * MAP_H);
    const edge = x < 5 || x > MAP_W - 6 || y < 3 || y > MAP_H - 5;
    if (!edge && R() > .1) continue;
    if (freeFor(x, y) && freeFor(x, y + 1) && !nearDoor(x, y)) { PROPS.push({ t: R() > .82 ? "blossom" : "pine", x, y }); solid[idx(x, y)] = 1; }
  }
  // stone lanterns: two per road, lit one by one as halls are visited
  // stone lanterns: two beside each hall's road — lit as that hall is visited
  [["seogo", 16, 13], ["seogo", 27, 13], ["seodang", 11, 13], ["seodang", 14, 13], ["gongbang", 29, 13], ["gongbang", 32, 13],
   ["jumak", 8, 23], ["jumak", 15, 23], ["seoru", 36, 23], ["seoru", 34, 23], ["yeokcham", 24, 26], ["yeokcham", 33, 26]]
    .forEach(([hall, x, y]) => { if (inb(x, y) && !solid[idx(x, y)] && tiles[idx(x, y)] !== 2) { tiles[idx(x, y)] = 0; PROPS.push({ t: "lantern", x, y, hall }); solid[idx(x, y)] = 1; } });
  PROPS.push({ t: "well", x: 17, y: 19 }); fillRect(17, 19, 2, 2, 1, solid);
  PROPS.push({ t: "sign", x: 20, y: 25 }); solid[idx(20, 25)] = 1;
  [[16, 9], [27, 12], [5, 14], [38, 14], [15, 26], [34, 26]].forEach(([x, y]) => { if (freeFor(x, y) && !nearDoor(x, y)) { PROPS.push({ t: "blossom", x, y }); solid[idx(x, y)] = 1; } });
  const FLOWERS = [];
  for (let i = 0; i < 90; i++) { const x = Math.floor(R() * MAP_W), y = Math.floor(R() * MAP_H); if (freeFor(x, y)) FLOWERS.push({ x, y, c: R() > .5 ? C.blossomHi : "#f2e29b", o: R() * 12 }); }

  /* collectibles: 기획 조각 (scroll pieces) scattered off the roads */
  // reachable tiles from the entrance (BFS) — every scroll must be collectable
  const REACH = new Uint8Array(MAP_W * MAP_H); (function () { const q = [idx(22, 25)]; REACH[q[0]] = 1; while (q.length) { const c = q.shift(), cx = c % MAP_W, cy = (c / MAP_W) | 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = cx + dx, ny = cy + dy, n = idx(nx, ny); if (inb(nx, ny) && !REACH[n] && !solid[n]) { REACH[n] = 1; q.push(n); } }); } })();
  const nearestReach = (x, y) => { let best = null, bd = 1e9; for (let j = 1; j < MAP_H - 1; j++) for (let i = 1; i < MAP_W - 1; i++) { const n = idx(i, j); if (!REACH[n] || tiles[n] !== 0) continue; const d = (i - x) ** 2 + (j - y) ** 2; if (d < bd) { bd = d; best = [i, j]; } } return best; };
  // 기획자를 만나면 그 옆에 나타나는 한 개 — 나머지 두 조각은 건물 안에 숨어 있다
  const SCROLLS = [[24, 21]] // 기획자 옆
    .map(([x, y], i) => { const [tx, ty] = REACH[idx(x, y)] ? [x, y] : nearestReach(x, y); return { i, x: tx, y: ty, got: false, hidden: true }; });
  /* wandering villagers & a cat — decoration that makes the village feel alive */
  const CRITTERS = [
    { kind: "kid", x: 20 * T, y: 20 * T, style: { robe: "#c9a227", robeHi: "#e3be45", hat: "topknot", hair: "#1a1410" } },
    { kind: "kid", x: 26 * T, y: 20 * T, style: { robe: "#b8452f", robeHi: "#d05e46", hat: "bun", hair: "#1a1410" } },
    { kind: "cat", x: 23 * T, y: 24 * T },
    { kind: "elder", x: 14 * T, y: 24 * T, style: { robe: "#e9e3d2", robeHi: "#fff8e8", hat: "gat", accent: "#6b4431", hair: "#9a9a9a" } }
  ].map(c => Object.assign(c, { hx: c.x, hy: c.y, tx: c.x, ty: c.y, dir: 0, anim: 0, wait: Math.random() * 2 }));
  const PARTS = [];

  const WATER = []; for (let i = 0; i < tiles.length; i++) if (tiles[i] === 2) WATER.push(i);
  const LANTERNS = PROPS.filter(p => p.t === "lantern");

  /* ── NPCs ── */
  const NPCS = [];
  function addNPC(o) { NPCS.push(Object.assign({ dir: 0, frame: 0, t: 0 }, o)); solid[idx(o.x, o.y)] = 1; }

  /* ── state ── */
  const S = {
    canvas: null, ctx: null, scale: 3, W: 0, H: 0,
    player: { x: 22 * T, y: 25 * T, dir: 1, frame: 0, anim: 0, moving: false },
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
      if (p.lit) { const flick = .75 + Math.sin(t / 180 + p.x) * .12; g.fillStyle = C.lanternGlow; g.globalAlpha = flick; g.fillRect(x - 3, y - 9, 22, 22); g.globalAlpha = flick * .6; g.fillRect(x - 6, y - 5, 28, 14); g.globalAlpha = 1; }
      g.fillStyle = C.stoneSh; g.fillRect(x + 4, y + 11, 8, 4);
      g.fillStyle = C.stone; g.fillRect(x + 6, y + 5, 4, 7); g.fillRect(x + 3, y - 3, 10, 3);
      g.fillStyle = C.stoneHi; g.fillRect(x + 4, y - 5, 8, 2);
      g.fillStyle = p.lit ? C.lantern : "#2a3431"; g.fillRect(x + 5, y, 6, 5);
      g.fillStyle = p.lit ? "#b8ffe4" : "#3b4744"; g.fillRect(x + 7, y + 1, 2, 2);
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

  function drawKid(g, c, f) { g.save(); g.translate(Math.round(c.x) + 3, Math.round(c.y) + (c.kind === "kid" ? 4 : 0)); if (c.kind === "kid") g.scale(.78, .78); drawPerson(g, 0, 0, c.dir, f, c.style); g.restore(); }
  function drawCat(g, px, py, dir, f) {
    const x = Math.round(px) + 4, y = Math.round(py) + 8;
    g.fillStyle = C.shadow; g.fillRect(x, y + 6, 9, 2);
    g.fillStyle = "#e8e2d6"; g.fillRect(x + 1, y + 2, 7, 4); g.fillRect(dir === 2 ? x : x + 6, y, 3, 3);
    g.fillStyle = "#c98a4a"; g.fillRect(x + 3, y + 2, 3, 2);
    g.fillStyle = "#1a1410"; g.fillRect(dir === 2 ? x : x + 8, y + 1, 1, 1);
    g.fillStyle = "#e8e2d6"; g.fillRect(dir === 2 ? x + 8 : x - 1, y + 1 + f, 1, 3);
    g.fillRect(x + 1 + f, y + 6, 1, 1); g.fillRect(x + 6 - f, y + 6, 1, 1);
  }
  function drawScroll(g, x, y, t) {
    const a = .5 + .3 * Math.sin(t / 300);
    g.fillStyle = `rgba(255,222,140,${a * .35})`; g.fillRect(x - 3, y - 3, 14, 14);
    g.fillStyle = "#5a3b28"; g.fillRect(x, y + 1, 1, 7); g.fillRect(x + 7, y + 1, 1, 7);
    g.fillStyle = "#f4ecd8"; g.fillRect(x + 1, y + 2, 6, 5);
    g.fillStyle = "#b8452f"; g.fillRect(x + 3, y + 3, 2, 1); g.fillStyle = "#6b4431"; g.fillRect(x + 2, y + 5, 4, 1);
  }
  function burst(x, y, c, n) { for (let k = 0; k < n; k++) { const a = Math.random() * 6.283, v = 20 + Math.random() * 40; PARTS.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: .9, max: .9, c, s: Math.random() > .6 ? 2 : 1 }); } }

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
    const cy = Math.max(0, Math.min(MAP_H * T - vh, pl.y + 8 - vh * .56));
    S.cam.x += (cx - S.cam.x) * Math.min(1, dt * 8); S.cam.y += (cy - S.cam.y) * Math.min(1, dt * 8);
    if (MAP_W * T < vw) S.cam.x = (MAP_W * T - vw) / 2;
    if (MAP_H * T < vh) S.cam.y = (MAP_H * T - vh) / 2;
    // wandering villagers
    CRITTERS.forEach(c => {
      if (c.wait > 0) { c.wait -= dt; c.anim = 0; return; }
      const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy);
      if (d < 1) { c.wait = 1 + Math.random() * 3; for (let k = 0; k < 8; k++) { const nx = c.hx + (Math.random() - .5) * 6 * T, ny = c.hy + (Math.random() - .5) * 4 * T, tx = Math.floor((nx + 8) / T), ty = Math.floor((ny + 13) / T); if (blocked(nx, ny) || BUILDINGS.some(b => Math.abs(b.door.x - tx) <= 1 && Math.abs(b.door.y - ty) <= 1) || NPCS.some(n => Math.abs(n.x - tx) <= 1 && Math.abs(n.y - ty) <= 1)) continue; c.tx = nx; c.ty = ny; break; } return; }
      const sp = (c.kind === "cat" ? 34 : c.kind === "elder" ? 16 : 26) * dt, mx = dx / d * sp, my = dy / d * sp;
      if (blocked(c.x + mx, c.y + my)) { c.tx = c.x; c.ty = c.y; return; }
      c.x += mx; c.y += my; c.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0); c.anim += dt * 7;
    });
    // collectibles
    SCROLLS.forEach(sc => { if (sc.got || sc.hidden) return; if (Math.hypot(pl.x + 8 - (sc.x * T + 8), pl.y + 12 - (sc.y * T + 8)) < 12) { sc.got = true; burst(sc.x * T + 8, sc.y * T + 6, "#f3dea0", 18); S.onPickup && S.onPickup(sc.i); } });
    // dust when running
    if (pl.moving && k.Shift && Math.random() < .5) PARTS.push({ x: pl.x + 8 + (Math.random() - .5) * 6, y: pl.y + 15, vx: (Math.random() - .5) * 10, vy: -8, life: .4, max: .4, c: "#8a7d62", s: 1 });
    // particles
    for (let i = PARTS.length - 1; i >= 0; i--) { const q = PARTS[i]; q.life -= dt; if (q.life <= 0) { PARTS.splice(i, 1); continue; } q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 30 * dt; }
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
    for (const i of WATER) if ((i * 7 + Math.floor(t / 300)) % 11 === 0) { const x = (i % MAP_W) * T, y = ((i / MAP_W) | 0) * T; g.globalAlpha = .6; g.fillRect(x + ((t / 90 + i) % 12), y + 6, 3, 1); g.globalAlpha = 1; }
    // flowers sway
    FLOWERS.forEach(f => { g.fillStyle = f.c; const s = Math.sin(t / 500 + f.o) > 0 ? 1 : 0; g.fillRect(f.x * T + 5 + s, f.y * T + 9, 2, 2); g.fillRect(f.x * T + 11, f.y * T + 5 + s, 1, 1); });
    // depth-sorted sprites
    const list = [];
    PROPS.forEach(p => list.push({ y: p.y * T + (p.t === "well" ? 24 : 12), d: () => drawProp(g, p, t) }));
    NPCS.forEach(n => list.push({ y: n.y * T + 12, d: () => { drawPerson(g, n.x * T, n.y * T - 4 + (Math.sin(n.t * 2.4) > .6 ? -1 : 0), n.dir, 0, n.style); } }));
    CRITTERS.forEach(c => list.push({ y: c.y + 12, d: () => c.kind === "cat" ? drawCat(g, c.x, c.y, c.dir, Math.floor(c.anim) % 2) : drawKid(g, c, Math.floor(c.anim) % 2) }));
    SCROLLS.forEach(sc => { if (sc.got || sc.hidden) return; const bob = Math.round(Math.sin(t / 260 + sc.i) * 1.5); list.push({ y: sc.y * T + 8, d: () => drawScroll(g, sc.x * T + 4, sc.y * T + 2 + bob, t) }); });
    const pl = S.player; list.push({ y: pl.y + 12, d: () => drawPerson(g, pl.x, pl.y, pl.dir, pl.frame, S.playerStyle) });
    list.sort((a, b) => a.y - b.y).forEach(o => o.d());
    PARTS.forEach(q => { g.globalAlpha = Math.max(0, q.life / q.max); g.fillStyle = q.c; g.fillRect(Math.round(q.x), Math.round(q.y), q.s, q.s); }); g.globalAlpha = 1;
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
    const dprL = S.W / Math.max(1, S.canvas.clientWidth), fs = Math.round(18 * dprL), fs2 = Math.round(14 * dprL);
    g.textAlign = "center"; g.textBaseline = "middle";
    BUILDINGS.forEach(b => {
      const sx = Math.round(((b.x + b.w / 2) * T - S.cam.x) * sc), top = Math.round(((b.y - 1.2) * T - S.cam.y) * sc);
      if (sx < -160 || sx > S.W + 160 || top < -80 || top > S.H + 60) return;
      const done = S.visited && S.visited.includes(b.id), title = (b.main ? "★ " : "") + b.name, sub = (done ? "✓ " : "") + b.sub;
      g.font = `700 ${b.main ? Math.round(fs * 1.2) : fs}px Galmuri11, 'IBM Plex Sans KR', sans-serif`; const w1 = g.measureText(title).width;
      g.font = `400 ${fs2}px Galmuri11, 'IBM Plex Sans KR', sans-serif`; const w2 = g.measureText(sub).width;
      const w = Math.max(w1, w2) + fs * 1.4, h = fs * 1.35 + fs2 * 1.6, x0 = Math.round(sx - w / 2), y0 = Math.round(top - h);
      g.fillStyle = b.main ? "rgba(40,28,8,.92)" : "rgba(6,14,11,.86)"; g.fillRect(x0, y0, Math.round(w), Math.round(h));
      g.fillStyle = b.main ? "#e8c66a" : done ? "#2ee6a6" : "#3b5a4e"; g.fillRect(x0, y0 + Math.round(h) - 2, Math.round(w), 2);
      g.font = `700 ${b.main ? Math.round(fs * 1.2) : fs}px Galmuri11, 'IBM Plex Sans KR', sans-serif`; g.fillStyle = b.main ? "#ffe39a" : "#f3dea0"; g.fillText(title, sx, y0 + fs * .85);
      g.font = `400 ${fs2}px Galmuri11, 'IBM Plex Sans KR', sans-serif`; g.fillStyle = done ? "#8ff0c8" : "#9fe7c9"; g.fillText(sub, sx, y0 + fs * 1.35 + fs2 * .75);
    });
    S.fireflies.forEach(f => {
      const sx = (f.x - S.cam.x) * sc, sy = (f.y - S.cam.y) * sc; if (sx < -10 || sy < -10 || sx > S.W + 10 || sy > S.H + 10) return;
      const a = .35 + .45 * Math.abs(Math.sin(f.a * 2)); g.fillStyle = `rgba(140,255,210,${a})`; g.fillRect(sx, sy, sc, sc);
      g.fillStyle = `rgba(52,224,161,${a * .25})`; g.fillRect(sx - sc, sy - sc, sc * 3, sc * 3);
    });
    if (!S.vg || S.vgW !== S.W || S.vgH !== S.H) { S.vg = g.createRadialGradient(S.W / 2, S.H / 2, Math.min(S.W, S.H) * .35, S.W / 2, S.H / 2, Math.max(S.W, S.H) * .75); S.vg.addColorStop(0, "rgba(4,10,8,0)"); S.vg.addColorStop(1, "rgba(4,10,8,.55)"); S.vgW = S.W; S.vgH = S.H; }
    g.fillStyle = S.vg; g.fillRect(0, 0, S.W, S.H);
    if (S.dark > 0) { g.fillStyle = `rgba(6,12,20,${S.dark})`; g.fillRect(0, 0, S.W, S.H); }
  }

  function loop(ts) {
    if (!S.running) { S.rafOn = false; return; }
    requestAnimationFrame(loop);
    if (document.hidden) return;
    if (S.paused && ts - (S.lastDraw || 0) < 200) return;         // ~5fps while a panel/dialogue is open
    const dt = Math.min(.05, (ts - (S.lastTs || ts)) / 1000); S.lastTs = ts; S.t = ts; S.lastDraw = ts;
    if (S.needResize) resize();
    if (!S.paused) update(dt); else { S.fireflies.forEach(f => { f.a += dt * f.s; }); NPCS.forEach(n => n.t += dt); }
    draw();
  }

  function resize() {
    S.needResize = false;
    const r = S.canvas.getBoundingClientRect(); if (r.width < 2 || r.height < 2) { S.needResize = true; return; }
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    S.W = S.canvas.width = Math.max(1, Math.floor(r.width * dpr)); S.H = S.canvas.height = Math.max(1, Math.floor(r.height * dpr));
    // integer scale so ~22 tiles fit horizontally on desktop, ~11 on phones
    const cssScale = r.width < 520 ? 2.2 : r.width < 900 ? 2.8 : 3.2;
    S.scale = Math.max(2, Math.round(cssScale * dpr));
  }

  /* ── public API ── */
  const World = {
    T, MAP_W, MAP_H, BUILDINGS, NPCS, C,
    init(canvas, opts = {}) {
      S.canvas = canvas; S.ctx = canvas.getContext("2d");
      S.playerStyle = opts.playerStyle || { robe: "#1f7a5c", robeHi: "#2fae84", hat: "gat", accent: C.lantern, collar: "#f4efe2", belt: "#0f1a16", tie: "#e8c66a" };
      (opts.npcs || []).forEach(addNPC);
      S.onInteract = opts.onInteract; S.onNear = opts.onNear; S.stepSfx = opts.onStep; S.onPickup = opts.onPickup;
      for (let i = 0; i < 46; i++) S.fireflies.push({ x: Math.random() * MAP_W * T, y: Math.random() * MAP_H * T, a: Math.random() * 6, s: .4 + Math.random() * .8 });
      renderStatic();
      if (document.fonts && document.fonts.load) document.fonts.load("10px Galmuri11").then(renderStatic).catch(() => {});
      resize(); addEventListener("resize", () => { S.needResize = true; });
      if (window.ResizeObserver) new ResizeObserver(() => { S.needResize = true; }).observe(canvas);
      this.bindInput();
      S.running = true; S.rafOn = true; requestAnimationFrame(loop);
    },
    /* stop drawing entirely while another full-screen view is shown */
    sleep(v) { S.running = !v; if (!v) { S.needResize = true; if (!S.rafOn) { S.rafOn = true; S.lastTs = 0; requestAnimationFrame(loop); } } },
    resize() { S.needResize = true; },
    person: (g, x, y, dir, frame, style) => drawPerson(g, x, y, dir, frame, style),
    /* story: light n of the lanterns (0..6 halls visited) */
    setVisited(v) { S.visited = v.slice(); },
    debugMap: () => S.staticLayer.toDataURL(),
    warp(tx, ty) { S.player.x = tx * T; S.player.y = ty * T - 5; S.path = null; },
    debugInfo: () => ({ scrolls: SCROLLS.map(sc => [sc.x, sc.y, !!REACH[idx(sc.x, sc.y)]]), lanterns: LANTERNS.map(p => [p.x, p.y, p.hall]), doors: BUILDINGS.map(b => [b.id, b.door.x, b.door.y, !!REACH[idx(b.door.x, b.door.y)], tiles[idx(b.door.x, b.door.y)]]), npcs: NPCS.map(n => [n.id, n.x, n.y, tiles[idx(n.x, n.y)]]) }),
    scrolls: () => SCROLLS.map(sc => ({ i: sc.i, got: sc.got })),
    drawScrollIcon(c) { const g = c.getContext("2d"), k = c.width / 12; g.imageSmoothingEnabled = false; g.clearRect(0, 0, c.width, c.height); g.setTransform(k, 0, 0, k, 0, 0); drawScroll(g, 2, 1, 0); g.setTransform(1, 0, 0, 1, 0, 0); },
    // 첫 만남 직후: 플레이어 바로 옆 빈 칸에 조각을 만든다
    spawnScrollNear(i) {
      const sc = SCROLLS[i]; if (!sc || sc.got) return; const p = tileOf(S.player);
      const free = (x, y) => inb(x, y) && REACH[idx(x, y)] && !solid[idx(x, y)] && !NPCS.some(n => n.x === x && n.y === y);
      const c = [[1, 0], [-1, 0], [0, 1], [2, 0], [-2, 0], [0, 2]].map(([dx, dy]) => [p.x + dx, p.y + dy]).find(([x, y]) => free(x, y)) || nearestReach(p.x + 1, p.y);
      sc.x = c[0]; sc.y = c[1]; sc.hidden = false; burst(sc.x * T + 8, sc.y * T + 6, "#f3dea0", 26);
    },
    revealScroll(i, on = true) { const sc = SCROLLS[i]; if (!sc) return; if (on && sc.hidden && !sc.got) burst(sc.x * T + 8, sc.y * T + 6, "#f3dea0", 22); sc.hidden = !on; },
    setScrolls(got) { SCROLLS.forEach(sc => sc.got = got.includes(sc.i)); },
    setLit(n, total = 6) { const v = S.visited || []; LANTERNS.forEach(p => { const was = p.lit; p.lit = !!p.hall && v.includes(p.hall); if (p.lit && !was && S.litOnce) burst(p.x * T + 8, p.y * T + 2, "#8ff0c8", 22); }); S.litOnce = true; S.dark = .38 * (1 - Math.min(1, n / total)); },
    bindInput() {
      addEventListener("keydown", e => {
        if (S.paused || e.defaultPrevented) return;
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
      // already standing at the destination (or right beside the target): act now
      const nb = nearest(); if ((p.x === dest.x && p.y === dest.y) || (nb && nb.id === id)) { S.path = null; const f = S.pathThen; S.pathThen = null; f(); }
    },
    /* draw a portrait of a person style into a small canvas (for dialogue box) */
    portrait(canvas, style, dir = 0) {
      const g = canvas.getContext("2d"); g.imageSmoothingEnabled = false; g.clearRect(0, 0, canvas.width, canvas.height);
      const bust = canvas.width >= 48, k = bust ? Math.floor(canvas.width / 11) : Math.floor(canvas.width / 16);
      if (bust) g.setTransform(k, 0, 0, k, Math.round(-2.5 * k), Math.round(3.6 * k)); else g.setTransform(k, 0, 0, k, 0, Math.round(k * 2));
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
