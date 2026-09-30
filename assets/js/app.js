/* ═══════════════════════════════════════════════════════════
   앱 — 타이틀 · 자기소개서 모드 · 마을 탐험 모드 · 대화 · 두루마리 · 라이트박스
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k, d) { try { const v = localStorage.getItem("lcm2." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem("lcm2." + k, JSON.stringify(v)); } catch (e) { } } };
  const { S, PROFILE, esc } = PF;

  /* ── sound ── */
  const Snd = {
    on: store.get("snd", true), ctx: null,
    tone(f, d = .06, type = "square", v = .03, slide = 1.4) {
      if (!this.on) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const o = this.ctx.createOscillator(), g = this.ctx.createGain(), t = this.ctx.currentTime;
        o.type = type; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * slide, t + d);
        g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d + .05); o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + d + .06);
      } catch (e) { }
    },
    fx(k) {
      if (k === "move") this.tone(520, .035, "square", .018);
      else if (k === "tick") this.tone(880 + Math.random() * 120, .015, "square", .008, 1);
      else if (k === "ok") [660, 880, 1175].forEach((f, i) => setTimeout(() => this.tone(f, .07, "triangle", .035), i * 70));
      else if (k === "open") this.tone(392, .12, "triangle", .04, 1.5);
      else if (k === "close") this.tone(440, .08, "triangle", .03, .7);
      else if (k === "step") this.tone(140, .02, "triangle", .01, .8);
      else if (k === "quest") [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, .1, "triangle", .04), i * 90));
    }
  };
  const ui = {
    sfx: k => Snd.fx(k),
    toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(ui._t); ui._t = setTimeout(() => t.classList.remove("show"), 2400); },
    lightbox: (key, i) => LB.open(key, i)
  };

  /* ── theme (document mode only; game is always night) ── */
  function setTheme(t) { document.documentElement.dataset.theme = t; store.set("theme", t); }
  const th = store.get("theme", null); if (th) document.documentElement.dataset.theme = th;
  function curTheme() { return document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }

  /* ═════════ RESUME MODE ═════════ */
  const CHAPTERS = [
    ["cover", "표지", null, null],
    ["letter", "자기소개서", "자기소개서", "게임 리뷰와 보드게임 제작에서 시작해 팀 프로젝트와 운영 기획까지, 기획자가 되기 위해 걸어온 길입니다."],
    ["career", "경력 · 학력", "경력 · 학력", null],
    ["achv", "업무 성과", "업무 성과", "게임 운영 현장과 게임 밖 현장에서 숫자로 확인한 제안들입니다."],
    ["joseon", "Project Joseon", "대표 프로젝트 ① Project Joseon", "지금 참여 중인 조선 판타지 팀 프로젝트. 표를 만지고, 계산기를 돌리고, 기획서 원본을 넘겨 볼 수 있습니다."],
    ["others", "그 밖의 작업", "그 밖의 작업", null],
    ["process", "제작 과정", "어떻게 만들었나", "분석부터 기획서, 데이터, AI 프로토타입, 검수까지. 실제 문서 화면으로 작업 과정을 보여드립니다."],
    ["library", "기획서 서고", "기획서 서고", "모든 기획서를 페이지 단위로 넘겨 볼 수 있습니다."],
    ["reviews", "게임 분석 도감", "게임 분석 도감", "플레이한 게임을 구조 · 재화 · BM 관점으로 정리한 기록입니다."],
    ["contact", "연락처", "연락처 · 링크", null]
  ];
  let resumeBuilt = false;
  function buildResume() {
    if (resumeBuilt) return; resumeBuilt = true;
    $("#pfName").textContent = PROFILE.name;
    $("#pfHead").textContent = PROFILE.headline;
    $("#pfFacts").innerHTML = PROFILE.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
    $("#toc").innerHTML = CHAPTERS.map(([id, label], i) => `<a href="#c-${id}" data-toc="${id}"><span class="n">${String(i).padStart(2, "0")}</span>${esc(label)}</a>`).join("");
    $("#chapters").innerHTML = CHAPTERS.map(([id, , title, lede], i) => `<section class="chapter" id="c-${id}">${title ? `<div class="ch-head"><span class="ch-no">${String(i).padStart(2, "0")}</span><h2>${esc(title)}</h2>${lede ? `<p>${esc(lede)}</p>` : ""}</div>` : ""}${S[id]()}</section>`).join("");
    PF.bind($("#chapters"), ui);
    // scrollspy
    const links = $$("#toc a");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id.slice(2))); }), { rootMargin: "-40% 0px -55% 0px" });
    $$("#chapters .chapter").forEach(c => io.observe(c));
    $("#toc").addEventListener("click", e => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); document.getElementById("c-" + a.dataset.toc).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); });
    drawAvatar();
    $("#mnav").innerHTML = `<option value="">목차로 이동…</option>` + CHAPTERS.map(([id, label]) => `<option value="${id}">${esc(label)}</option>`).join("");
    $("#mnav").onchange = e => { const v = e.target.value; if (v) document.getElementById("c-" + v).scrollIntoView(); e.target.value = ""; };
    $("#totop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function drawAvatar() {
    const cv = $("#avatar"), g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
    const style = DESIGNER_STYLE; let t = 0;
    const flies = Array.from({ length: 10 }, () => ({ x: Math.random() * 48, y: Math.random() * 30, a: Math.random() * 6 }));
    function frame() {
      t++; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
      const k = cv.width / 48; g.setTransform(k, 0, 0, k, 0, -k * 3);
      // moon + hills + roof silhouette
      g.fillStyle = "#cfeee0"; g.fillRect(36, 6, 5, 5); g.fillStyle = "#e8fff5"; g.fillRect(37, 6, 3, 1);
      g.fillStyle = "#0b2219"; g.fillRect(0, 30, 48, 18);
      g.fillStyle = "#133a2c"; for (let x = 0; x < 48; x++) { const h = 4 + Math.round(Math.sin(x * .3) * 2); g.fillRect(x, 30 - h, 1, h); }
      g.fillStyle = "#0a1813"; g.fillRect(2, 22, 16, 2); g.fillRect(4, 20, 12, 2); g.fillRect(5, 24, 10, 6);
      g.fillStyle = "#34e0a1"; g.fillRect(8, 26, 2, 2);
      // character (3× portrait)
      g.save(); g.translate(21, 10 + (Math.floor(t / 40) % 2 ? 0 : -0.5)); g.scale(1.3, 1.3);
      window.World && World._draw && World._draw(g, 0, 0, 0, 0, style); g.restore();
      flies.forEach(f => { f.a += .03; const a = .4 + .5 * Math.abs(Math.sin(f.a)); g.fillStyle = `rgba(140,255,210,${a})`; g.fillRect(Math.round(f.x + Math.cos(f.a) * 2), Math.round(f.y + Math.sin(f.a * 1.3) * 2), 1, 1); });
      if (!document.hidden && mode === "resume") requestAnimationFrame(frame); else setTimeout(() => requestAnimationFrame(frame), 400);
    }
    frame();
  }

  /* ═════════ GAME MODE ═════════ */
  const DESIGNER_STYLE = { robe: "#1f7a5c", robeHi: "#2fae84", hat: "gat", accent: "#34e0a1", collar: "#f4efe2", belt: "#0f1a16", tie: "#e8c66a" };
  const VISITOR_STYLE = { robe: "#3b4a6b", robeHi: "#56688f", hat: "topknot", hair: "#1a1410", collar: "#e9e3d2", belt: "#1c1a17", pants: "#d9d2bf" };

  const PLACES = { seodang: "서당", gongbang: "공방", seoru: "관아", seogo: "장서각", jumak: "주막", yeokcham: "역참" };
  let visited = store.get("visited", []);
  let mode = "title", worldReady = false, updateMini = null;

  const NPC_DEFS = [
    { id: "designer", name: "임창민", sub: "기획자", x: 23, y: 19, style: DESIGNER_STYLE, node: "hello" },
    { id: "hunjang", name: "훈장", sub: "서당", x: 25, y: 8, style: { robe: "#e9e3d2", robeHi: "#fff8e8", hat: "gat", accent: "#b8452f", collar: "#fff", belt: "#6b4431", hair: "#8a8a8a" }, node: "seodang" },
    { id: "jangin", name: "장인", sub: "공방", x: 37, y: 9, style: { robe: "#5a3b28", robeHi: "#7a543b", hat: "cap", collar: "#d9cdb0", belt: "#2b1d14" }, node: "gongbang" },
    { id: "mudang", name: "무당", sub: "신당", x: 29, y: 12, style: { robe: "#f1ece0", robeHi: "#fff", hat: "shaman", collar: "#b8452f", belt: "#b8452f", tie: "#2d6f9e", hair: "#15100d" }, node: "mudang" },
    { id: "satto", name: "사또", sub: "관아", x: 37, y: 25, style: { robe: "#6b2d3a", robeHi: "#8a3c4c", hat: "gat", accent: "#e8c66a", collar: "#f4efe2", belt: "#e8c66a" }, node: "seoru" },
    { id: "saseo", name: "사서", sub: "장서각", x: 12, y: 9, style: { robe: "#2d4f6e", robeHi: "#3f6a90", hat: "gat", accent: "#e8c66a", collar: "#e9e3d2", belt: "#1c2733" }, node: "seogo" },
    { id: "jumo", name: "주모", sub: "주막", x: 11, y: 25, style: { robe: "#9a4a3a", robeHi: "#b8604e", hat: "bun", hair: "#1a1410", collar: "#f4efe2", belt: "#f4efe2" }, node: "jumak" },
    { id: "pabal", name: "파발꾼", sub: "역참", x: 30, y: 28, style: { robe: "#3b3f3d", robeHi: "#555b58", hat: "helmet", collar: "#b8452f", belt: "#b8452f" }, node: "yeokcham" }
  ];

  /* dialogue script: text | choices [label, action] ; action: "node:x" | "open:a,b" | "end" | fn */
  const REVIEW_LINES = PF.REVIEWS.map(r => `「${r.n}」 말이우? "${r.k}"`);
  const D = {
    hello: [{ t: `어서 오세요! 저는 게임 기획자 ${PROFILE.name}입니다.\n이 마을은 제 기획서와 게임으로 지은 '기획마을'이에요.` },
      { t: "건물마다 제 작업이 하나씩 들어 있습니다. 여섯 곳을 모두 둘러보신 뒤 광장으로 돌아오시면 마지막 이야기를 들려드릴게요.", c: [["자기소개서부터 볼게요", "open:letter"], ["어디부터 가면 좋을까요?", "node:route"], ["당신은 어떤 기획자인가요?", "node:who"], ["둘러볼게요", "end"]] }],
    route: [{ t: "처음이시라면 북쪽 서당에서 제 자기소개서를 먼저 읽어 주세요.\n그다음 동쪽 공방에서 지금 하고 있는 조선 판타지 프로젝트를 보시면 됩니다.", c: [["서당으로 데려다 줘요", "walk:seodang"], ["공방으로 데려다 줘요", "walk:gongbang"], ["관아로 데려다 줘요", "walk:seoru"], ["혼자 돌아볼게요", "end"]] }],
    who: [{ t: `"${PROFILE.headline}"\n게임을 하면 재미의 구조부터 뜯어 보고, 그걸 표와 공식으로 옮기는 게 제 일이에요.` },
      { t: "문서로 끝내지 않고, 필요하면 AI로 화면 목업까지 만들어 팀과 같은 그림을 봅니다.", c: [["자기소개서를 보여줘요", "open:letter,career"], ["고마워요", "end"]] }],
    finale: [{ t: "마을을 전부 둘러보셨군요! 끝까지 봐주셔서 정말 감사합니다." }, { t: "마음에 드셨다면 편하게 연락 주세요. 함께 기억에 남는 게임을 만들고 싶습니다.", c: [["연락처 보기", "open:contact"], ["자기소개서 전체 보기", "act:resume"], ["마을을 더 둘러볼게요", "end"]] }],
    seodang: [{ t: "허허, 서당에 온 걸 환영하네. 이 마을을 지은 기획자의 이력이 여기 다 적혀 있지." },
      { t: `이 사람의 목표가 무엇인지 아는가?\n"${PROFILE.goal}"`, c: [["자기소개서를 읽어볼래요", "open:letter"], ["원본 PDF로 볼래요", "act:pdf"], ["경력과 학력은요?", "open:career"], ["다음에 올게요", "end"]] }],
    gongbang: [{ t: "여긴 Project Joseon 공방이오. 조선 판타지 익스트랙션 액션이지.\n캐릭터 강함은 레벨이 아니라 인벤토리에 뭘 붙이느냐로만 정해진다네." },
      { t: "그 기획자가 아이템 49종, 전투 공식, 이펙트 데이터 구조까지 짰소. 한번 보겠소?", c: [["아이템과 인벤토리 퍼즐 보기", "open:joseon"], ["전투 공식 계산기", "open:joseon#combat"], ["AI로 만든 UI 목업", "open:joseon#ui"], ["나중에", "end"]] }],
    mudang: [{ t: "...연결이 끊기면... 나는 다시 멍해져...\n(회로 노드 두 개를 아이템으로 이어야 각성한다는 무당 캐릭터다.)" },
      { t: "기획자는 '연결을 지켜내는 행동' 자체로 내 광기를 느끼게 하고 싶었대.\n...그런데 벌이 없는 힘은 광기가 아니라고, 스스로 적어 두었더군.", c: [["무당 캐릭터 기획서 보기", "open:joseon#chars"], ["물러난다", "end"]] }],
    seoru: [{ t: "에헴, 관아에 온 걸 환영하오. 이 기획자가 현장에서 무슨 일을 했는지 여기 기록이 다 있소." },
      { t: "달콤소프트에서는 SuperStar 시리즈 라이브 서비스 개선안을 기획하고 점수 산출 로직을 검증했지.\n게임 밖에서도 제안 하나로 매출을 약 1.2배 올린 적이 있다더군.", c: [["업무 성과 보기", "open:achv"], ["경력 · 학력 보기", "open:career"], ["물러가겠습니다", "end"]] }],
    seogo: [{ t: "쉿, 장서각입니다. 이곳엔 그분이 쓴 기획서 원본이 페이지째 보관되어 있어요." },
      { t: "오버워치2, 원신, 림버스 컴퍼니 같은 기존 게임에 새 콘텐츠를 얹은 기획서부터 조선 판타지 문서까지 있죠.", c: [["기획서 서고 열기", "open:library"], ["작업 과정을 보고 싶어요", "open:process"], ["그 밖의 작업", "open:others"], ["조용히 나간다", "end"]] }],
    jumak: [{ t: "어서 오시우! 우리 기획자 양반은 게임만 하면 꼭 여기 앉아서 분석을 적더라고." },
      { t: () => REVIEW_LINES[Math.floor(Math.random() * REVIEW_LINES.length)], c: [["분석 도감 전부 보기", "open:reviews"], ["다른 얘기도 해줘요", "node:jumak2"], ["잘 먹고 갑니다", "end"]] }],
    jumak2: [{ t: () => REVIEW_LINES[Math.floor(Math.random() * REVIEW_LINES.length)], c: [["분석 도감 전부 보기", "open:reviews"], ["하나 더!", "node:jumak2"], ["잘 먹고 갑니다", "end"]] }],
    yeokcham: [{ t: "파발이오! 기획자에게 전할 말이 있으면 내가 날라다 주지." }, { t: `이메일은 ${PROFILE.email}.\n노션 기록과 포트폴리오 폴더도 여기서 바로 열 수 있소.`, c: [["연락처 · 링크 보기", "open:contact"], ["이메일 복사", "act:copy"], ["괜찮소", "end"]] }],
    sign: [{ t: "【기획마을 안내판】\n이동: 방향키 · WASD (Shift 달리기) · 화면 탭\n대화: Space · Enter · E · 가까이서 탭\n패널 닫기: Esc", c: [["알겠다", "end"]] }]
  };
  // building doors map to the NPC's node
  const DOOR_NODE = { seodang: "seodang", gongbang: "gongbang", seoru: "seoru", seogo: "seogo", jumak: "jumak", yeokcham: "yeokcham" };
  const NPC_PLACE = { hunjang: "seodang", jangin: "gongbang", satto: "seoru", saseo: "seogo", jumo: "jumak", pabal: "yeokcham" };

  function initWorld() {
    if (worldReady) return; worldReady = true;
    const npcs = NPC_DEFS.map(n => ({ id: n.id, name: n.name, sub: n.sub, x: n.x, y: n.y, style: n.style }));
    World.init($("#world"), {
      playerStyle: VISITOR_STYLE, npcs,
      onInteract: it => {
        if (it.kind === "sign") return Dlg.run("sign", { name: "안내판", style: null });
        if (it.kind === "npc") { const def = NPC_DEFS.find(n => n.id === it.id); markVisit(NPC_PLACE[it.id]); return Dlg.run(def.id === "designer" && visited.length >= 6 ? "finale" : def.node, def); }
        if (it.kind === "building") { const npc = NPC_DEFS.find(n => NPC_PLACE[n.id] === it.id); markVisit(it.id); return Dlg.run(DOOR_NODE[it.id], npc); }
      },
      onNear: it => {
        const p = $("#prompt");
        if (!it || !Dlg.closed) { p.hidden = true; return; }
        p.hidden = false; p.innerHTML = `<kbd>${matchMedia("(pointer: coarse)").matches ? "탭" : "Space"}</kbd>${esc(it.name)}${it.sub ? ` <span style="color:#93b3a6">· ${esc(it.sub)}</span>` : ""}`;
      },
      onStep: () => Snd.fx("step")
    });
    updateMini = World.minimap($("#mini"));
    setInterval(() => { if (mode === "game") updateMini(visited); }, 250);
    paintQuest(); paintTravel();
  }

  function markVisit(place) {
    if (!place || visited.includes(place)) return;
    visited.push(place); store.set("visited", visited); paintQuest(); paintTravel();
    Snd.fx("quest"); ui.toast(`탐방 기록 · ${PLACES[place]} (${visited.length}/6)`);
    if (visited.length === 6) setTimeout(() => ui.toast("모든 곳을 둘러봤습니다! 광장의 기획자에게 가 보세요"), 2600);
  }
  function paintQuest() { $("#qText").innerHTML = `마을 탐방 <b>${visited.length}</b>/6`; $("#qBar").style.width = (visited.length / 6 * 100) + "%"; }
  function paintTravel() {
    $("#travel").innerHTML = Object.entries(PLACES).map(([id, n]) => `<button class="hbtn" data-walk="${id}" type="button">${visited.includes(id) ? '<span class="v">✓</span>' : "·"} ${n} <span style="color:#6a8a7e">${World.BUILDINGS.find(b => b.id === id).sub}</span></button>`).join("");
  }

  /* ── dialogue ── */
  const Dlg = {
    closed: true, lines: null, i: 0, typing: false, full: "", sel: 0, who: null,
    run(node, who) {
      this.lines = D[node]; this.i = 0; this.who = who; this.closed = false;
      World.pause(true); $("#prompt").hidden = true; $("#dlg").hidden = false;
      $("#dlgWho").innerHTML = `${esc(who ? who.name : "안내판")}${who && who.sub ? `<small>${esc(who.sub)}</small>` : ""}`;
      const face = $("#dlgFace canvas");
      if (who && who.style) World.portrait(face, who.style, 0); else { const g = face.getContext("2d"); g.clearRect(0, 0, face.width, face.height); g.fillStyle = "#6b4431"; g.fillRect(24, 36, 48, 30); g.fillStyle = "#e8d9ae"; g.fillRect(30, 42, 36, 18); g.fillStyle = "#4a2f22"; g.fillRect(45, 66, 6, 20); }
      Snd.fx("open"); this.show();
    },
    show() {
      const L = this.lines[this.i]; this.full = typeof L.t === "function" ? L.t() : L.t;
      const el = $("#dlgLine"); el.textContent = ""; $("#dlgChoices").innerHTML = ""; $("#dlgMore").hidden = true;
      this.typing = true; let k = 0; const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      clearInterval(this._iv);
      if (reduce) { el.textContent = this.full; this.done(); return; }
      this._iv = setInterval(() => { k += 2; el.textContent = this.full.slice(0, k); if (k % 4 === 0) Snd.fx("tick"); if (k >= this.full.length) { clearInterval(this._iv); this.done(); } }, 22);
    },
    done() {
      this.typing = false; $("#dlgLine").textContent = this.full;
      const L = this.lines[this.i];
      if (L.c) {
        this.sel = 0;
        $("#dlgChoices").innerHTML = L.c.map(([t], j) => `<button type="button" data-j="${j}" class="${j === 0 ? "sel" : ""}"><span class="n">${j + 1}</span>${esc(t)}</button>`).join("");
        $("#dlgChoices button").focus({ preventScroll: true });
      } else $("#dlgMore").hidden = false;
    },
    advance() {
      if (this.typing) { clearInterval(this._iv); this.done(); return; }
      const L = this.lines[this.i]; if (L.c) return;
      if (this.i < this.lines.length - 1) { this.i++; this.show(); } else this.close();
    },
    choose(j) {
      const L = this.lines[this.i]; if (!L.c || !L.c[j]) return; const [, a] = L.c[j]; Snd.fx("ok");
      if (a === "end") return this.close();
      const [kind, arg] = a.split(":");
      if (kind === "node") { this.lines = D[arg]; this.i = 0; this.show(); }
      else if (kind === "open") { this.close(true); Scroll.open(arg, this.who); }
      else if (kind === "walk") { this.close(); World.walkTo(arg, () => { }); }
      else if (kind === "act") { this.close(); if (arg === "resume") go("resume"); if (arg === "pdf") window.open(PF.LETTER_PDF, "_blank", "noopener"); if (arg === "copy") { navigator.clipboard && navigator.clipboard.writeText(PROFILE.email).then(() => ui.toast("이메일을 복사했습니다")).catch(() => ui.toast(PROFILE.email)); } }
    },
    moveSel(d) { const bs = $$("#dlgChoices button"); if (!bs.length) return; this.sel = (this.sel + d + bs.length) % bs.length; bs.forEach((b, j) => b.classList.toggle("sel", j === this.sel)); bs[this.sel].focus({ preventScroll: true }); Snd.fx("move"); },
    close(keepPaused) { clearInterval(this._iv); this.closed = true; $("#dlg").hidden = true; if (!keepPaused) World.pause(false); Snd.fx("close"); }
  };
  $("#dlgChoices").addEventListener("click", e => { const b = e.target.closest("button"); if (b) Dlg.choose(+b.dataset.j); });
  $("#dlg").addEventListener("click", e => { if (!e.target.closest("button")) Dlg.advance(); });

  /* ── scroll panel (두루마리) ── */
  const TITLES = { letter: "자기소개서", career: "경력 · 학력", achv: "업무 성과", joseon: "Project Joseon", others: "그 밖의 작업", process: "어떻게 만들었나", library: "기획서 서고", reviews: "게임 분석 도감", contact: "연락처 · 링크" };
  const Scroll = {
    open(arg, who) {
      const [ids, tab] = arg.split("#"); const list = ids.split(",");
      $("#scrollPlace").innerHTML = `${esc(TITLES[list[0]] || "")}${who ? `<small>${esc(who.sub || who.name)}</small>` : ""}`;
      const body = $("#scrollBody");
      body.innerHTML = list.map((id, i) => `${i ? `<h2 style="font-size:1.6rem;margin:38px 0 18px">${esc(TITLES[id])}</h2>` : ""}${S[id]()}`).join("");
      PF.bind(body, ui); body.scrollTop = 0;
      if (tab) { const t = body.querySelector(`.tab[data-tab="${tab}"]`); t && t.click(); }
      $("#scroll").hidden = false; World.pause(true); Snd.fx("open");
      setTimeout(() => $("#scrollClose").focus(), 30);
    },
    close() { $("#scroll").hidden = true; $("#scrollBody").innerHTML = ""; World.pause(false); Snd.fx("close"); $("#world").focus({ preventScroll: true }); }
  };
  $("#scrollClose").onclick = () => Scroll.close();
  $("#scroll").addEventListener("click", e => { if (e.target.id === "scroll") Scroll.close(); });

  function trap(e, box) {
    const f = [...box.querySelectorAll('button,a[href],input,[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  /* ── lightbox ── */
  const LB = {
    set: [], i: 0,
    open(key, i) { this.set = PF.images(key); if (!this.set.length) return; this.i = i; this.back = document.activeElement; $("#lb").hidden = false; this.paint(); Snd.fx("open"); $("#lbClose").focus(); },
    paint() {
      const it = this.set[this.i]; $("#lbImg").src = it.src; $("#lbImg").alt = it.cap; $("#lbCap").textContent = it.cap;
      $("#lbThumbs").innerHTML = this.set.map((s, j) => `<button type="button" data-j="${j}" class="${j === this.i ? "on" : ""}" aria-label="${j + 1}번째"><img src="${esc(s.src)}" alt="" loading="lazy"></button>`).join("");
      const on = $("#lbThumbs .on"); on && on.scrollIntoView({ block: "nearest", inline: "center" });
    },
    step(d) { this.i = (this.i + d + this.set.length) % this.set.length; this.paint(); Snd.fx("move"); },
    close() { $("#lb").hidden = true; Snd.fx("close"); if (this.back && this.back.focus) this.back.focus({ preventScroll: true }); }
  };
  $("#lbPrev").onclick = () => LB.step(-1); $("#lbNext").onclick = () => LB.step(1); $("#lbClose").onclick = () => LB.close();
  $("#lbThumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { LB.i = +b.dataset.j; LB.paint(); } });
  (function () { let x0 = null; const st = $("#lbStage"); st.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true }); st.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) LB.step(dx < 0 ? 1 : -1); x0 = null; }); st.addEventListener("click", e => { if (e.target === st) LB.close(); }); })();

  /* ═════════ MODES ═════════ */
  function go(m) {
    mode = m;
    $("#title").hidden = m !== "title";
    $("#game").hidden = !(m === "game" || m === "title");
    $("#resume").hidden = m !== "resume";
    document.body.style.overflow = m === "resume" ? "" : "hidden";
    if (m === "title") { initWorld(); World.pause(true); setTimeout(() => $("#startResume").focus(), 50); }
    if (m === "game") { initWorld(); World.pause(false); $("#world").focus(); if (!store.get("greeted", false)) { store.set("greeted", true); setTimeout(() => Dlg.run("hello", NPC_DEFS[0]), 500); } }
    if (m === "resume") { buildResume(); if (worldReady) World.pause(true); window.scrollTo(0, 0); }
    try { history.replaceState(null, "", m === "title" ? location.pathname + location.search : "#" + m); } catch (e) { }
  }

  $("#startGame").onclick = () => { Snd.fx("ok"); go("game"); };
  $("#startResume").onclick = () => { Snd.fx("ok"); go("resume"); };
  $("#toResume").onclick = () => go("resume");
  $("#toGame").onclick = () => go("game");
  $("#toGame2").onclick = () => go("game");
  $("#travelBtn").onclick = () => { const t = $("#travel"); t.hidden = !t.hidden; Snd.fx("move"); };
  $("#travel").addEventListener("click", e => { const b = e.target.closest("[data-walk]"); if (!b) return; $("#travel").hidden = true; World.walkTo(b.dataset.walk, () => World.interact()); });
  $("#helpBtn").onclick = () => Dlg.run("sign", { name: "안내판", style: null });
  $("#prompt").onclick = () => World.interact();
  $("#act").addEventListener("click", () => { if (!Dlg.closed) Dlg.advance(); else World.interact(); });
  function paintSnd() { $$("[data-snd]").forEach(b => { b.textContent = Snd.on ? "♪ 소리 켬" : "♪ 소리 끔"; b.setAttribute("aria-pressed", Snd.on); }); }
  $$("[data-snd]").forEach(b => b.onclick = () => { Snd.on = !Snd.on; store.set("snd", Snd.on); paintSnd(); Snd.fx("ok"); }); paintSnd();
  $("#themeBtn").onclick = () => setTheme(curTheme() === "dark" ? "light" : "dark");

  // virtual stick
  (function () {
    const pad = $("#pad"), knob = pad.querySelector("i"); let id = null, cx = 0, cy = 0;
    pad.addEventListener("pointerdown", e => { id = e.pointerId; pad.setPointerCapture(id); const r = pad.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; move(e); });
    pad.addEventListener("pointermove", e => { if (e.pointerId === id) move(e); });
    const end = () => { id = null; knob.style.transform = ""; World.setStick(0, 0); };
    pad.addEventListener("pointerup", end); pad.addEventListener("pointercancel", end);
    function move(e) { let dx = e.clientX - cx, dy = e.clientY - cy; const m = Math.hypot(dx, dy), R = 40; if (m > R) { dx *= R / m; dy *= R / m; } knob.style.transform = `translate(${dx}px,${dy}px)`; const nx = dx / R, ny = dy / R; World.setStick(Math.abs(nx) > .25 ? nx : 0, Math.abs(ny) > .25 ? ny : 0); }
  })();

  // global keys
  addEventListener("keydown", e => {
    if (!$("#lb").hidden) { if (e.key === "Escape") { e.preventDefault(); LB.close(); } if (e.key === "ArrowLeft") LB.step(-1); if (e.key === "ArrowRight") LB.step(1); if (e.key === "Tab") trap(e, $("#lb")); return; }
    if (mode === "resume" && !$("#scroll").hidden && e.key === "Escape") { Scroll.close(); return; }
    if (mode === "title") { if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") { $("#startResume").click(); } return; }
    if (mode !== "game") return;
    if (!$("#scroll").hidden) { if (e.key === "Escape") { e.preventDefault(); Scroll.close(); } else if (e.key === "Tab") trap(e, $("#scroll")); return; }
    if (!Dlg.closed) {
      const handled = ["Escape", "ArrowDown", "ArrowUp", "s", "w", " ", "Enter", "e", "1", "2", "3", "4"].includes(e.key);
      if (!handled) return;
      e.preventDefault(); e.stopPropagation();
      if (e.key === "Escape") return Dlg.close();
      if (e.key === "ArrowDown" || e.key === "s") return Dlg.moveSel(1);
      if (e.key === "ArrowUp" || e.key === "w") return Dlg.moveSel(-1);
      if (/^[1-4]$/.test(e.key)) return Dlg.choose(+e.key - 1);
      if (e.key === " " || e.key === "Enter" || e.key === "e") { if (!Dlg.typing && Dlg.lines[Dlg.i].c) return Dlg.choose(Dlg.sel); return Dlg.advance(); }
      return;
    }
    if (e.key === "Escape") { const t = $("#travel"); t.hidden = !t.hidden; }
  }, true);

  // expose portrait drawer for the resume avatar
  World._draw = function (g, x, y, dir, frame, style) { const c = document.createElement("canvas"); };
  (function patch() { // reuse World.portrait via an offscreen canvas
    const off = document.createElement("canvas"); off.width = off.height = 16;
    World._draw = (g, x, y, dir, f, style) => { World.portrait(off, style, dir); g.drawImage(off, x, y - 2); };
  })();

  // boot
  const h = location.hash.slice(1);
  if (h === "resume" || h.startsWith("c-")) { go("resume"); if (h.startsWith("c-")) setTimeout(() => { const el = document.getElementById(h); el && el.scrollIntoView(); }, 60); }
  else if (h === "game") go("game");
  else go("title");
})();
