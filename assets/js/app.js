/* ═══════════════════════════════════════════════════════════
   앱 — 타이틀 · 자기소개서 모드 · 마을 탐험 모드 · 대화 · 두루마리 · 라이트박스
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k, d) { try { const v = localStorage.getItem("lcm3." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem("lcm3." + k, JSON.stringify(v)); } catch (e) { } } };
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
    toast(msg, ms = 2400) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(ui._t); ui._t = setTimeout(() => t.classList.remove("show"), ms); },
    lightbox: (key, i) => LB.open(key, i)
  };

  /* ── theme (document mode only; game is always night) ── */
  function setTheme(t) { document.documentElement.dataset.theme = t; store.set("theme", t); }
  const th = store.get("theme", null); if (th) document.documentElement.dataset.theme = th;
  function curTheme() { return document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }

  /* ═════════ RESUME MODE ═════════ */
  const CHAPTERS = [
    ["letter", "자기소개서", "자기소개서", "게임 리뷰와 보드게임 제작에서 시작해 팀 프로젝트와 운영 기획까지. 항목마다 자기소개서에 걸어 둔 원본을 그대로 연결했습니다."],
    ["career", "경력", "경력 · 학력", null],
    ["achv", "성과", "업무 성과", "게임 운영 현장과 게임 밖 현장에서 숫자로 확인한 제안들입니다."],
    ["joseon", "Project Joseon", "대표 프로젝트 · Project Joseon", "지금 참여 중인 조선 판타지 팀 프로젝트. 기획서마다 어떤 내용을 담았는지 요약과 함께 보여드립니다."],
    ["others", "개인 기획서", "개인 기획서", "기존 게임을 분석하고 새 콘텐츠를 얹어 본 기획서들입니다."],
    ["exp", "경험", "경험 자료", "팀 프로젝트, 보드게임 제작, 업무 성과 자료입니다."],
    ["process", "작업 방식", "어떻게 만드는가", "분석부터 기획서, 데이터, AI 목업, 검수까지. 실제 문서 화면으로 작업 과정을 보여드립니다."],
    ["reviews", "게임 분석", "게임 분석 도감", "플레이한 게임을 구조 · 재화 · BM 관점으로 정리한 기록입니다."],
    ["contact", "연락", "연락처 · 링크", null]
  ];
  let resumeBuilt = false;
  function buildResume() {
    if (resumeBuilt) return; resumeBuilt = true;
    $("#pfFacts").innerHTML = PROFILE.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("#siteNav").innerHTML = CHAPTERS.filter(c => ["letter", "career", "joseon", "others", "process", "reviews", "contact"].includes(c[0])).map(([id, label]) => `<a href="#c-${id}" data-toc="${id}">${esc(label)}</a>`).join("");
    $("#heroPdf").href = PF.LETTER_PDF;
    $("#chapters").innerHTML = CHAPTERS.map(([id, , title, lede], i) => `<section class="band ${i % 2 ? "alt" : ""}" id="c-${id}"><div class="wrap">${title ? `<div class="ch-head"><span class="ch-no">${String(i + 1).padStart(2, "0")}</span><h2>${esc(title)}</h2>${lede ? `<p>${esc(lede)}</p>` : ""}</div>` : ""}${S[id]()}</div></section>`).join("");
    PF.bind($("#chapters"), ui);
    const links = $$("#siteNav a");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id.slice(2))); }), { rootMargin: "-35% 0px -60% 0px" });
    $$("#chapters .band").forEach(c => io.observe(c));
    const goTo = id => { const el = document.getElementById("c-" + id); el && el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
    $("#siteNav").addEventListener("click", e => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); goTo(a.dataset.toc); $("#resume").classList.remove("nav-open"); });
    $$("[data-goto]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); goTo(b.dataset.goto); }));
    $("#navToggle").onclick = () => $("#resume").classList.toggle("nav-open");
    drawAvatar();
    $("#totop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }
  let avatarVisible = true, avatarLoop = false, avatarKick = () => {};
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
      if (!document.hidden && mode === "resume" && avatarVisible) setTimeout(() => requestAnimationFrame(frame), 90); else avatarLoop = false;
    }
    avatarKick = () => { if (!avatarLoop && mode === "resume" && avatarVisible) { avatarLoop = true; frame(); } };
    new IntersectionObserver(es => { avatarVisible = es[0].isIntersecting; avatarKick(); }).observe(cv);
    avatarLoop = true; frame();
  }

  /* ═════════ GAME MODE ═════════ */
  const DESIGNER_STYLE = { robe: "#1f7a5c", robeHi: "#2fae84", hat: "gat", accent: "#34e0a1", collar: "#f4efe2", belt: "#0f1a16", tie: "#e8c66a" };
  const VISITOR_STYLE = { robe: "#3b4a6b", robeHi: "#56688f", hat: "topknot", hair: "#1a1410", collar: "#e9e3d2", belt: "#1c1a17", pants: "#d9d2bf" };

  const PLACES = { seogo: "기획서관", seodang: "서당", gongbang: "공방", seoru: "관아", jumak: "주막", yeokcham: "역참" };
  const uniq = (a, ok) => (Array.isArray(a) ? a : []).filter((x, i, arr) => ok(x) && arr.indexOf(x) === i);
  let visited = uniq(store.get("visited", []), x => x in PLACES);
  let gotScrolls = uniq(store.get("scrolls", []), x => [0, 1, 2].includes(x));
  // 조각 0 = 기획자 옆, 조각 1·2 = 네 건물 중 무작위 두 곳 — 들어가면 바로 앞에 놓여 있다
  const SCROLL_POOL = ["seodang", "gongbang", "jumak", "seoru"]; // 역참에는 조각이 없다
  const rollHalls = () => { const a = SCROLL_POOL.slice().sort(() => Math.random() - .5).slice(0, 2); store.set("scrollHalls", a); return a; };
  let scrollHalls = store.get("scrollHalls", null);
  if (!Array.isArray(scrollHalls) || scrollHalls.length !== 2 || !scrollHalls.every(x => SCROLL_POOL.includes(x)) || scrollHalls[0] === scrollHalls[1]) scrollHalls = rollHalls();
  let pendingReward = null;
  let met = !!store.get("met", false), pendingWalk = null;
  // 기획자와의 첫 대화가 끝나면 플레이어 바로 옆에 첫 조각이 생긴다 (대화 중 고른 이동은 조각을 주운 뒤로 미룬다)
  function afterFirstMeet() {
    met = true; store.set("met", true); World.spawnScrollNear(0); Snd.fx("quest"); paintQuest();
    ui.toast("바로 옆에 기획 조각이 나타났습니다! 걸어가서 주워 보세요", 3600); announce();
  }
  function resumeWalk() { if (pendingWalk && mode === "game") { const w = pendingWalk; pendingWalk = null; setTimeout(() => World.walkTo(w, () => World.interact()), 300); } }
  // 등불 기록 — 건물에 들어가 등불을 켤 때마다 기획자에 대한 기록 한 장
  const LORE = {
    seogo: { t: "개인 기획서 5종", d: "오버워치 2 · 원신 · 림버스 컴퍼니 등 기존 게임의 규칙을 분석하고 새 콘텐츠를 얹은 기획서들.", act: ["기획서 서가 보기", "open:library"] },
    seodang: { t: "대구대학교 산림자원학과", d: "2024.08 졸업. 전공은 달라도 게임을 하면 재미의 구조부터 뜯어 보는 습관으로 기획자의 길을 골랐다.", act: ["자기소개서 원본", "act:pdf"] },
    gongbang: { t: "Project Joseon · 2026.08 –", d: "조선 판타지 탑뷰 액션 팀 프로젝트. 아이템 · 전투 체계 · 캐릭터 · 맵 · UIUX 문서를 맡고 있다.", act: ["프로젝트 보기", "open:joseon"] },
    seoru: { t: "달콤소프트 운영 기획", d: "2025.10 – 2026.01. SuperStar 시리즈 라이브 서비스 개선안을 기획하고 점수 산출 로직을 코드 테스트로 검증했다.", act: ["경력 연표 보기", "open:career"] },
    jumak: { t: `게임 분석 ${PF.REVIEWS.length}종`, d: "플레이한 게임마다 장단점과 개선안을 노션에 기록한다. 장르를 가리지 않고 파고드는 덕력이 무기.", act: ["분석 도감 보기", "open:reviews"] },
    yeokcham: { t: "연락 창구", d: `이메일 ${PROFILE.email} · 노션 기록과 포트폴리오 폴더도 역참에서 바로 열 수 있다.`, act: ["연락처 · 링크", "open:contact"] }
  };
  // 기획 조각 보상 — 모은 순서대로 노션 → 리뷰 DB → 연락처
  const SCROLL_REWARDS = [
    { t: "게임 리뷰", d: "직접 플레이한 게임마다 장단점과 개선안을 정리한 리뷰 노션입니다.", u: "https://app.notion.com/p/314c1342e11f809cb2b1e2abb4bcb34a?source=copy_link", btn: "게임 리뷰 열기" },
    { t: "기사 스크랩", d: "게임 업계 기사를 스크랩하고 기획자 관점의 생각을 덧붙인 노션입니다.", u: "https://app.notion.com/p/314c1342e11f80fb9f1bdc77e817ad26?source=copy_link", btn: "기사 스크랩 열기" },
    { t: "연락처", d: "마지막 조각 · 기획자의 이메일과 전화번호", contact: true }
  ];

  let mode = "title", worldReady = false, updateMini = null;

  const NPC_DEFS = [
    { id: "designer", name: "임창민", sub: "기획자", x: 22, y: 20, style: DESIGNER_STYLE, node: "hello" },
    { id: "hunjang", name: "훈장", sub: "서당", x: 15, y: 11, style: { robe: "#e9e3d2", robeHi: "#fff8e8", hat: "gat", accent: "#b8452f", collar: "#fff", belt: "#6b4431", hair: "#8a8a8a" }, node: "seodang" },
    { id: "jangin", name: "장인", sub: "공방", x: 33, y: 11, style: { robe: "#5a3b28", robeHi: "#7a543b", hat: "cap", collar: "#d9cdb0", belt: "#2b1d14" }, node: "gongbang" },
    { id: "mudang", name: "무당", sub: "신당", x: 36, y: 12, style: { robe: "#f1ece0", robeHi: "#fff", hat: "shaman", collar: "#b8452f", belt: "#b8452f", tie: "#2d6f9e", hair: "#15100d" }, node: "mudang" },
    { id: "satto", name: "사또", sub: "관아", x: 35, y: 21, style: { robe: "#6b2d3a", robeHi: "#8a3c4c", hat: "gat", accent: "#e8c66a", collar: "#f4efe2", belt: "#e8c66a" }, node: "seoru" },
    { id: "saseo", name: "사서", sub: "기획서관", x: 25, y: 17, style: { robe: "#2d4f6e", robeHi: "#3f6a90", hat: "gat", accent: "#e8c66a", collar: "#e9e3d2", belt: "#1c2733" }, node: "seogo" },
    { id: "jumo", name: "주모", sub: "주막", x: 8, y: 21, style: { robe: "#9a4a3a", robeHi: "#b8604e", hat: "bun", hair: "#1a1410", collar: "#f4efe2", belt: "#f4efe2" }, node: "jumak" },
    { id: "pabal", name: "파발꾼", sub: "역참", x: 32, y: 27, style: { robe: "#3b3f3d", robeHi: "#555b58", hat: "helmet", collar: "#b8452f", belt: "#b8452f" }, node: "yeokcham" }
  ];

  /* dialogue script: text | choices [label, action] ; action: "node:x" | "open:a,b" | "end" | fn */
  const REVIEW_LINES = PF.REVIEWS.map(r => `「${r.n}」 말이우? "${r.k}"`);
  const D = {
    hello: [{ t: () => `오셨군요! 저는 이 마을의 기록을 걸어 둔 기획자 ${PROFILE.name}입니다.` + (met ? "" : "\n이야기가 끝나면 첫 번째 기획 조각을 바로 옆에 놓아 드릴게요.") },
      { t: "기획서관 · 서당 · 공방 · 관아 · 주막에는 전시관을, 역참에는 연락 창구를 두었어요. 한 곳을 둘러보실 때마다 마을의 등불이 하나씩 다시 켜집니다.\n여섯 곳을 모두 밝혀 주시면, 광장에서 마지막 이야기를 들려드릴게요.\n참, '기획 조각'은 모두 세 개예요. 하나는 제가 드리고, 둘은 건물 안에 숨겨 두었어요.", c: [["가운데 기획서관부터 볼게요", "walk:seogo"], ["어디부터 가면 좋을까요?", "node:route"], ["당신은 어떤 기획자인가요?", "node:who"], ["혼자 둘러볼게요", "end"]] }],
    route: [{ t: "바로 뒤, 마을 한가운데가 제 대표 기획서를 모아 둔 기획서관입니다.\n왼쪽 위 서당에는 자기소개서, 오른쪽 위 공방에는 지금 하고 있는 조선 판타지 프로젝트가 있어요.", c: [["기획서관으로 데려다 줘요", "walk:seogo"], ["서당으로 데려다 줘요", "walk:seodang"], ["공방으로 데려다 줘요", "walk:gongbang"], ["혼자 돌아볼게요", "end"]] }],
    who: [{ t: `"${PROFILE.headline}"\n게임을 하면 재미의 구조부터 뜯어 보고, 그걸 표와 공식으로 옮기는 게 제 일이에요.` },
      { t: "문서로 끝내지 않고, 필요하면 AI로 화면 목업까지 만들어 팀과 같은 그림을 봅니다.", c: [["자기소개서를 보여줘요", "open:letter,career"], ["고마워요", "end"]] }],
    finale: [{ t: "보세요, 마을의 등불이 전부 켜졌습니다.\n누군가 제 기록을 끝까지 봐 준 덕분이에요. 정말 감사합니다." }, { t: () => gotScrolls.length >= 3 ? "기획 조각까지 모두 모으셨군요! 이 마을의 모든 이야기를 아는 분은 당신이 처음입니다." : `기획 조각은 ${gotScrolls.length}/3개 모으셨네요. 남은 조각은 마을 건물 안 어딘가에 숨어 있어요.` }, { t: "마음에 드셨다면 편하게 연락 주세요. 함께 기억에 남는 게임을 만들고 싶습니다.", c: [["연락처 보기", "open:contact"], ["자기소개서 전체 보기", "act:resume"], ["마을을 더 둘러볼게요", "end"]] }],
    seodang: [{ t: "허허, 서당에 온 걸 환영하네. 안쪽 전시관에 그 기획자의 자기소개서가 한 폭씩 걸려 있지." },
      { t: `이 사람의 목표가 무엇인지 아는가?\n"${PROFILE.goal}"`, c: [["전시관에 들어간다", "hall:seodang"], ["자기소개서 원본 PDF", "act:pdf"], ["다음에 올게요", "end"]] }],
    gongbang: [{ t: "여긴 Project Joseon 공방이오. 조선 판타지 탑뷰 액션이지.\n캐릭터 강함은 레벨이 아니라 인벤토리에 뭘 붙이느냐로만 정해진다네." },
      { t: "그 기획자가 코어루프부터 아이템, 전투 공식, 캐릭터, 맵, UI까지 공방 안에 다 걸어 뒀소. 들어가 보겠소?", c: [["전시관에 들어간다", "hall:gongbang"], ["전투 설계만 볼래요", "open:joseon#combat"], ["나중에", "end"]] }],
    mudang: [{ t: "...연결이 끊기면... 나는 다시 멍해져...\n(회로 노드 두 개를 아이템으로 이어야 각성한다는 무당 캐릭터다.)" },
      { t: "기획자는 '연결을 지켜내는 행동' 자체로 내 광기를 느끼게 하고 싶었대.\n...그런데 벌이 없는 힘은 광기가 아니라고, 스스로 적어 두었더군.", c: [["무당 캐릭터 기획서 보기", "open:joseon#chars"], ["물러난다", "end"]] }],
    seoru: [{ t: "에헴, 관아에 온 걸 환영하오. 이 기획자가 현장에서 무슨 일을 했는지 여기 기록이 다 있소." },
      { t: "달콤소프트에서는 SuperStar 시리즈 라이브 서비스 개선안을 기획하고 점수 산출 로직을 검증했지.\n팀 프로젝트와 보드게임 제작 기록도 안쪽에 걸려 있소.", c: [["전시관에 들어간다", "hall:seoru"], ["경력 · 학력 보기", "open:career"], ["물러가겠습니다", "end"]] }],
    seogo: [{ t: "쉿, 기획서관입니다. 마을 한가운데, 그분이 가장 아끼는 곳이지요. 그분이 기존 게임에 새 콘텐츠를 얹어 본 기획서들이 걸려 있어요.\n몇 권은 너무 두꺼워서, 해설과 원본 링크로만 모셔 두었지요." },
      { t: "오버워치2, 원신, 림버스 컴퍼니, 테일즈런너, 아스가르드 폴… 작품 앞에 서면 어떤 내용인지 해설이 열립니다.", c: [["전시관에 들어간다", "hall:seogo"], ["작업 방식을 보고 싶어요", "open:process"], ["조용히 나간다", "end"]] }],
    jumak: [{ t: "어서 오시우! 우리 기획자 양반은 게임만 하면 꼭 여기 앉아서 분석을 적더라고." },
      { t: () => REVIEW_LINES[Math.floor(Math.random() * REVIEW_LINES.length)], c: [["주막 안으로 들어간다", "hall:jumak"], ["다른 얘기도 해줘요", "node:jumak2"], ["잘 먹고 갑니다", "end"]] }],
    jumak2: [{ t: () => REVIEW_LINES[Math.floor(Math.random() * REVIEW_LINES.length)], c: [["분석 도감 전부 보기", "open:reviews"], ["하나 더!", "node:jumak2"], ["잘 먹고 갑니다", "end"]] }],
    yeokcham: [{ t: "파발이오! 기획자에게 전할 말이 있으면 내가 날라다 주지." }, { t: `이메일은 ${PROFILE.email}.\n노션 기록과 포트폴리오 폴더도 여기서 바로 열 수 있소.`, c: [["연락처 · 링크 보기", "open:contact"], ["이메일 복사", "act:copy"], ["괜찮소", "end"]] }],
    sign: [{ t: "【기획마을 안내판】\n① 가운데 기획서관으로 이동해 개인 기획서를 감상해 보시오.\n② 서당 · 공방 · 관아 · 주막 · 역참을 돌며 등불 6개를 모두 밝혀 보시오. 등불마다 기획자의 기록이 📖 기록첩에 쌓이오." },
      { t: "③ 광장의 기획자를 만나면 나타나는 기획 조각 하나, 그리고 서당 · 공방 · 관아 · 주막 중 두 곳에 숨은 조각을 찾아 모두 기획 조각 3개를 얻어 보시오. 조각마다 기획자의 기록이 하나씩 들어 있소.\n④ 모두 마치면 광장의 기획자에게 가서 마지막 이야기를 들어 보시오." },
      { t: "【조작법】 이동: 방향키 · WASD · 화면 탭 · 조이스틱 (Shift 달리기)\n대화 · 입장: Space · Enter · E · 대상 탭 / 전시관: ← → 걷기 · Esc 나가기", c: [["알겠소", "end"], ["처음부터 다시 (등불 · 조각 초기화)", "act:reset"]] }],
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
        if (it.kind === "npc") { const def = NPC_DEFS.find(n => n.id === it.id); if (def.id === "designer" && !met) Dlg.firstMeet = true; if (!HALL_IDS.includes(NPC_PLACE[it.id])) markVisit(NPC_PLACE[it.id]); return Dlg.run(def.id === "designer" && visited.length >= 6 ? "finale" : def.node, def); }
        if (it.kind === "building") { if (HALL_IDS.includes(it.id)) return enterHall(it.id); const npc = NPC_DEFS.find(n => NPC_PLACE[n.id] === it.id); markVisit(it.id); return Dlg.run(DOOR_NODE[it.id], npc); }
      },
      onNear: it => {
        const p = $("#prompt");
        if (!it || !Dlg.closed) { p.hidden = true; return; }
        p.hidden = false; p.innerHTML = `<kbd>${matchMedia("(pointer: coarse)").matches ? "탭" : "Space"}</kbd>${esc(it.name)}${it.sub ? ` <span style="color:#93b3a6">· ${esc(it.sub)}</span>` : ""}`;
      },
      onStep: () => Snd.fx("step"),
      onPickup: () => { awardScroll(0); setTimeout(flushReward, 700); }
    });
    updateMini = World.minimap($("#mini"));
    setInterval(() => { if (mode === "game" && Dlg.closed && $("#scroll").hidden) updateMini(visited); }, 250);
    syncWorldScrolls(); World.revealScroll(0, met); World.setVisited(visited); paintQuest(); paintTravel(); World.setLit(visited.length);
    Gallery.init({ esc, style: VISITOR_STYLE, pickup: hall => { const n = hallScroll(hall.id); if (n) awardScroll(n, PLACES[hall.id]); }, step: () => Snd.fx("step"), move: () => Snd.fx("move"), lightbox: (k, i) => LB.open(k, i), openPanel: a => Scroll.open(a, null),
      exit: hall => { setTimeout(announce, 500); mode = "game"; World.sleep(false); World.pause(false); $("#game").hidden = false; Snd.fx("close"); $("#world").focus({ preventScroll: true }); flushReward(); } });
  }

  /* ── halls (전시관) ── */
  const HALL_IDS = ["seodang", "gongbang", "seogo", "seoru", "jumak"];
  let HALLS = null;
  function enterHall(id) {
    HALLS = HALLS || PF.halls();
    const h = HALLS[id]; if (!h || !h.items.length) return; h.id = id;
    markVisit(id); mode = "gallery"; World.pause(true); World.sleep(true); Snd.fx("open");
    Gallery.enter(h, { scroll: hallScroll(id) > 0 });
  }

  const hallScroll = id => { const k = scrollHalls.indexOf(id); return k >= 0 && !gotScrolls.includes(k + 1) ? k + 1 : 0; };
  function syncWorldScrolls() { World.setScrolls(gotScrolls.includes(0) ? [0] : []); }
  function awardScroll(i, where) {
    if (gotScrolls.includes(i)) return;
    gotScrolls.push(i); store.set("scrolls", gotScrolls); syncWorldScrolls(); Snd.fx("quest"); paintQuest();
    const n = gotScrolls.length, r = SCROLL_REWARDS[n - 1];
    ui.toast(`${where ? where + "에서 " : ""}기획 조각 ${n}/3 발견 · ${r.t}`, 3200); pendingReward = n; if (where) setTimeout(flushReward, 400);
  }
  // 대화 · 전시관 · 문서 창이 모두 닫혀 마을로 돌아왔을 때 보상 창을 띄운다
  function flushReward() {
    if (!pendingReward || mode !== "game" || !Dlg.closed || !$("#scroll").hidden || !$("#reward").hidden || !$("#journal").hidden) return;
    const n = pendingReward, r = SCROLL_REWARDS[n - 1]; pendingReward = null;
    setTimeout(() => r.contact ? showContact() : showLink(r, n), 350);
  }
  function markVisit(place) {
    const fresh = place && !visited.includes(place);
    if (!fresh) return;
    visited.push(place); store.set("visited", visited); paintQuest(); paintTravel();
    World.setVisited(visited); World.setLit(visited.length); Snd.fx("quest"); ui.toast(`등불 ${visited.length}/6 · ${PLACES[place]} — 기록 「${LORE[place].t}」이 📖 기록첩에 담겼습니다`, 3600);
    if (visited.length === 6) setTimeout(() => { ui.toast("모든 등불이 켜졌습니다! 광장의 기획자에게 안내합니다"); World.walkTo("designer", () => World.interact()); }, 2200);
  }
  const OBJ_ORDER = [
    ["seogo", "가운데 기획서관으로 이동해 개인 기획서를 감상해 보시오"],
    ["seodang", "왼쪽 위 서당으로 이동해 자기소개서를 읽어 보시오"],
    ["gongbang", "오른쪽 위 공방으로 이동해 조선 프로젝트 기획서를 살펴보시오"],
    ["seoru", "오른쪽 관아로 이동해 경험과 성과 기록을 확인해 보시오"],
    ["jumak", "왼쪽 주막으로 이동해 게임 분석 도감을 읽어 보시오"],
    ["yeokcham", "입구 옆 역참으로 이동해 연락 수단을 알아보시오"]
  ];
  function objective() {
    const next = OBJ_ORDER.find(([id]) => !visited.includes(id));
    if (!met) return { step: "시작", text: "광장의 기획자 임창민에게 말을 걸어 보시오", id: "designer" };
    if (!gotScrolls.includes(0)) return { step: "기획 조각 0/3", text: "바로 옆에 나타난 기획 조각을 주워 보시오" };
    if (next) return { step: `등불 ${visited.length}/6`, text: next[1], id: next[0] };
    if (gotScrolls.length < 3) { const h = scrollHalls.find((x, k) => !gotScrolls.includes(k + 1)); return { step: `기획 조각 ${gotScrolls.length}/3`, text: `${PLACES[h]}에 들어가 숨은 기획 조각을 주워 보시오`, id: h }; }
    return { step: "마지막", text: "광장의 기획자에게 가서 마지막 이야기를 들어 보시오", id: "designer" };
  }
  function paintObjective(flash) {
    const o = objective(); $("#objStep").textContent = o.step; $("#objText").textContent = o.text;
    const el = $("#objective"); el.dataset.go = o.id || "";
    if (flash) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  }
  function announce() { const o = objective(); const b = $("#objBanner"); b.innerHTML = `<small>할 일 · ${esc(o.step)}</small>${esc(o.text)}`; b.hidden = false; b.classList.remove("out"); clearTimeout(announce._t); announce._t = setTimeout(() => { b.classList.add("out"); setTimeout(() => b.hidden = true, 600); }, 4200); }
  function paintQuest() { paintObjective(true); $("#journalCount").textContent = `${visited.length + gotScrolls.length}/9`; if (!$("#journal").hidden) paintJournal(); $("#qText").innerHTML = `등불 <b>${visited.length}</b>/6 · 기획 조각 <b>${gotScrolls.length}</b>/3`; $("#qBar").style.width = (visited.length / 6 * 100) + "%"; }
  function paintTravel() {
    $("#travel").innerHTML = `<button class="hbtn" data-walk="designer" type="button">${visited.length >= 6 ? '<span class="v">★</span>' : "·"} 광장 <span style="color:#6a8a7e">기획자 임창민</span></button>` + Object.entries(PLACES).map(([id, n]) => `<button class="hbtn" data-walk="${id}" type="button">${visited.includes(id) ? '<span class="v">✓</span>' : "·"} ${n} <span style="color:#6a8a7e">${World.BUILDINGS.find(b => b.id === id).sub}</span></button>`).join("");
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
      this._iv = setInterval(() => { k += 2; el.textContent = this.full.slice(0, k); if (k % 8 === 0) Snd.fx("tick"); if (k >= this.full.length) { clearInterval(this._iv); this.done(); } }, 22);
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
      else if (kind === "walk") { if (this.firstMeet) pendingWalk = arg; this.close(); if (!pendingWalk) World.walkTo(arg, () => { }); }
      else if (kind === "hall") { this.close(true); enterHall(arg); }
      else if (kind === "act") { this.close(); if (arg === "reset") { resetProgress(); return; } if (arg === "resume") go("resume"); if (arg === "pdf") window.open(PF.LETTER_PDF, "_blank", "noopener"); if (arg === "copy") { navigator.clipboard && navigator.clipboard.writeText(PROFILE.email).then(() => ui.toast("이메일을 복사했습니다")).catch(() => ui.toast(PROFILE.email)); } }
    },
    moveSel(d) { const bs = $$("#dlgChoices button"); if (!bs.length) return; this.sel = (this.sel + d + bs.length) % bs.length; bs.forEach((b, j) => b.classList.toggle("sel", j === this.sel)); bs[this.sel].focus({ preventScroll: true }); Snd.fx("move"); },
    close(keepPaused) { clearInterval(this._iv); this.closed = true; $("#dlg").hidden = true; if (this.firstMeet) { this.firstMeet = false; afterFirstMeet(); } if (!keepPaused) { World.pause(false); flushReward(); } Snd.fx("close"); }
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
      $("#scroll").hidden = false; if (mode !== "gallery") World.pause(true); Snd.fx("open");
      setTimeout(() => $("#scrollClose").focus(), 30);
    },
    close() { $("#scroll").hidden = true; $("#scrollBody").innerHTML = ""; Snd.fx("close"); if (mode === "gallery") { $("#galView").focus({ preventScroll: true }); return; } if (mode === "game") { World.pause(false); flushReward(); } $("#world").focus({ preventScroll: true }); }
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

  /* ═════════ 연락처 보상 · 조작 안내 ═════════ */
  function showContact() {
    World.pause(true); Snd.fx("quest");
    $("#rewardEye").textContent = "기획 조각 3/3 · 보상"; $("#rewardTitle").textContent = "연락하기"; $("#rewardText").textContent = "모든 조각을 모으셨습니다. 끝까지 봐 주셔서 감사합니다. 함께 기억에 남는 게임을 만들고 싶습니다."; $("#rewardLink").hidden = true; $("#rewardContact").hidden = false;
    $("#reward").hidden = false; $("#rewardMail").textContent = PROFILE.email; $("#rewardPhone").textContent = PROFILE.phone; $("#rewardTel").href = "tel:" + PROFILE.phone.replace(/-/g, ""); $("#rewardMailA").href = "mailto:" + PROFILE.email;
    setTimeout(() => $("#rewardCopy").focus(), 30);
  }
  function showLink(r, n) {
    World.pause(true); Snd.fx("quest");
    $("#rewardEye").textContent = `기획 조각 ${n}/3 · 보상`; $("#rewardTitle").textContent = r.t; $("#rewardText").textContent = r.d;
    $("#rewardLinkA").href = r.u; $("#rewardLinkA").textContent = r.btn + " ↗"; $("#rewardLink").hidden = false; $("#rewardContact").hidden = true;
    $("#reward").hidden = false; setTimeout(() => $("#rewardLinkA").focus(), 30);
  }
  $("#rewardLinkClose").onclick = () => closeReward();
  function closeReward() { $("#reward").hidden = true; if (mode === "game" && Dlg.closed && $("#scroll").hidden) { World.pause(false); resumeWalk(); } }
  $("#rewardClose").onclick = closeReward;
  $("#rewardCopy").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(PROFILE.email).then(() => ui.toast("이메일 주소를 복사했습니다")).catch(() => ui.toast(PROFILE.email)); };
  $("#rewardMore").onclick = () => { closeReward(); Scroll.open("contact", null); };
  /* ═════════ 기록첩 · 다시하기 ═════════ */
  function paintJournal() {
    $("#jLampN").textContent = `${visited.length}/6`; $("#jScrollN").textContent = `${gotScrolls.length}/3`;
    $("#jLamps").innerHTML = Object.keys(PLACES).map(id => { const on = visited.includes(id), L = LORE[id]; return on
      ? `<article class="jcard on"><span class="jtag">🏮 ${esc(PLACES[id])}</span><b>${esc(L.t)}</b><p>${esc(L.d)}</p><button class="btn sm" type="button" data-jact="${L.act[1]}">${esc(L.act[0])}</button></article>`
      : `<article class="jcard"><span class="jtag">· ${esc(PLACES[id])}</span><b>???</b><p>${esc(PLACES[id])}에 들어가 등불을 켜면 기록이 드러납니다.</p><button class="btn sm" type="button" data-jact="walk:${id}">여기로 이동</button></article>`; }).join("");
    $("#jScrolls").innerHTML = SCROLL_REWARDS.map((r, k) => k < gotScrolls.length
      ? `<article class="jcard on gold"><span class="jtag">📜 조각 ${k + 1}</span><b>${esc(r.t)}</b><p>${esc(r.d)}</p>${r.contact ? `<button class="btn sm" type="button" data-jact="act:contact">연락처 보기</button>` : `<a class="btn sm" href="${r.u}" target="_blank" rel="noopener">${esc(r.btn)} ↗</a>`}</article>`
      : `<article class="jcard"><span class="jtag">· 조각 ${k + 1}</span><b>???</b><p>${k === 0 ? "입구 바로 앞에서 반짝이고 있습니다." : "네 건물 중 어딘가에 들어가면 바로 앞에 놓여 있습니다."}</p></article>`).join("");
  }
  function openJournal() { World.pause(true); paintJournal(); $("#journal").hidden = false; Snd.fx("open"); setTimeout(() => $("#journalClose").focus(), 30); }
  function closeJournal() { $("#journal").hidden = true; Snd.fx("close"); if (mode === "game" && Dlg.closed && $("#scroll").hidden) World.pause(false); }
  $("#journalBtn").onclick = openJournal; $("#journalClose").onclick = closeJournal;
  $("#journal").addEventListener("click", e => {
    if (e.target.id === "journal") return closeJournal();
    const b = e.target.closest("[data-jact]"); if (!b) return; const [k, v] = b.dataset.jact.split(":"); closeJournal();
    if (k === "walk") World.walkTo(v, () => World.interact());
    else if (k === "open") Scroll.open(v, null);
    else if (v === "contact") showContact();
    else if (v === "pdf") window.open(PF.LETTER_PDF, "_blank", "noopener");
  });
  function resetProgress() {
    visited = []; gotScrolls = []; pendingReward = null; met = false; pendingWalk = null; store.set("met", false); World.revealScroll(0, false); store.set("visited", []); store.set("scrolls", []); scrollHalls = rollHalls(); syncWorldScrolls(); World.warp(22, 25);
    World.setVisited([]); World.setLit(0); paintQuest(); paintTravel(); updateMini && updateMini(visited);
    Snd.fx("close"); ui.toast("등불과 기획 조각을 모두 초기화했습니다. 처음부터 다시 시작해 보세요"); $("#travel").hidden = true; showGuide(() => announce());
  }
  (function () {
    const b = $("#resetBtn"), lbl = $("#resetLbl"); let armed = 0;
    const disarm = () => { armed = 0; b.classList.remove("warn"); lbl.textContent = "다시하기"; };
    b.onclick = () => {
      if (!armed) { armed = setTimeout(disarm, 3000); b.classList.add("warn"); lbl.textContent = "한 번 더 누르면 초기화"; if (!matchMedia("(min-width: 700px)").matches) ui.toast("한 번 더 누르면 등불과 조각이 초기화됩니다"); Snd.fx("move"); return; }
      clearTimeout(armed); disarm(); resetProgress();
    };
  })();
  function showGuide(then) {
    World.pause(true); $("#guide").hidden = false; setTimeout(() => $("#guideGo").focus(), 30);
    $("#guideGo").onclick = () => { $("#guide").hidden = true; World.pause(false); Snd.fx("ok"); then && then(); };
  }

  /* ═════════ STORY (prologue) ═════════ */
  const Story = {
    lines: [
      "오래전, 이 마을의 등불은 '재미'를 연료로 타올랐다.",
      "사람들이 재미를 잊자 등불은 하나둘 꺼졌고, 마을은 긴 밤에 잠겼다.",
      "떠돌이 기획자 임창민은 자신의 기록을 마을 곳곳에 걸어 두었다.\n누군가 그 기록을 봐 준다면, 등불이 다시 켜질 거라 믿으며.",
      "그리고 오늘 밤, 한 손님이 마을 어귀의 다리를 건넌다."
    ], i: 0, then: null,
    play(then) { this.then = then; this.i = 0; World.pause(true); $("#story").hidden = false; this.show(); },
    show() { const el = $("#storyLine"); el.classList.remove("in"); void el.offsetWidth; el.textContent = this.lines[this.i]; el.classList.add("in"); $("#storyDots").innerHTML = this.lines.map((_, j) => `<i class="${j <= this.i ? "on" : ""}"></i>`).join(""); Snd.fx("tick"); },
    next() { if (this.i < this.lines.length - 1) { this.i++; this.show(); } else this.end(); },
    end() { $("#story").hidden = true; World.pause(false); const f = this.then; this.then = null; f && setTimeout(f, 300); }
  };
  $("#story").addEventListener("click", e => { if (e.target.closest("#storySkip")) Story.end(); else Story.next(); });

  /* ═════════ MODES ═════════ */
  function go(m) {
    mode = m;
    $("#title").hidden = m !== "title";
    $("#game").hidden = !(m === "game" || m === "title");
    if (m !== "gallery" && window.Gallery && Gallery.open) { Gallery.open = false; $("#gallery").hidden = true; }
    $("#resume").hidden = m !== "resume";
    document.body.style.overflow = m === "resume" ? "" : "hidden";
    if (m === "title") { initWorld(); World.sleep(false); World.pause(true); setTimeout(() => $("#startResume").focus(), 50); }
    if (m === "game") { initWorld(); World.sleep(false); World.pause(false); $("#world").focus(); paintObjective(); store.set("greeted", true); showGuide(() => announce()); }
    if (m === "resume") { buildResume(); avatarKick(); if (worldReady) { World.pause(true); World.sleep(true); } window.scrollTo(0, 0); }
    try { history.replaceState(null, "", m === "title" ? location.pathname + location.search : "#" + m); } catch (e) { }
  }

  $("#startGame").onclick = () => { Snd.fx("ok"); go("game"); };
  $("#startResume").onclick = () => { Snd.fx("ok"); go("resume"); };
  $("#toResume").onclick = () => go("resume");
  $("#toGame").onclick = () => go("game");
  $("#toGame2").onclick = () => go("game");
  $("#travelBtn").onclick = () => { const t = $("#travel"); t.hidden = !t.hidden; Snd.fx("move"); };
  $("#travel").addEventListener("click", e => { const b = e.target.closest("[data-walk]"); if (!b) return; $("#travel").hidden = true; World.walkTo(b.dataset.walk, () => World.interact()); });
  $("#helpBtn").onclick = () => showGuide();
  $("#prompt").onclick = () => World.interact();
  $("#objective").onclick = () => { const id = $("#objective").dataset.go; if (id && mode === "game") { Snd.fx("move"); World.walkTo(id, () => World.interact()); } };
  $("#act").addEventListener("click", () => { if (!Dlg.closed) Dlg.advance(); else World.interact(); });
  function paintSnd() { $$("[data-snd]").forEach(b => { b.innerHTML = `♪<span class="hide-sm"> 소리 ${Snd.on ? "켬" : "끔"}</span>`; b.setAttribute("aria-pressed", Snd.on); }); }
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
    if (!$("#scroll").hidden && mode !== "game") { if (e.key === "Escape") { e.preventDefault(); Scroll.close(); } else if (e.key === "Tab") trap(e, $("#scroll")); return; }
    if (!$("#reward").hidden) { if (e.key === "Escape") { e.preventDefault(); closeReward(); } return; }
    if (!$("#journal").hidden) { if (e.key === "Escape") { e.preventDefault(); closeJournal(); } return; }
    if (!$("#guide").hidden) { if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); $("#guideGo").click(); } return; }
    if (!$("#story").hidden) { if ([" ", "Enter", "Escape"].includes(e.key)) { e.preventDefault(); e.key === "Escape" ? Story.end() : Story.next(); } return; }
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

  // pixel-art emblem (title seal + homepage logo): the designer's bust
  [["#sealArt"], ["#logoArt"]].forEach(([sel]) => { const c = $(sel); if (c) World.portrait(c, DESIGNER_STYLE, 0); });
  // boot
  const h = location.hash.slice(1);
  if (h === "resume" || h.startsWith("c-")) { go("resume"); if (h.startsWith("c-")) setTimeout(() => { const el = document.getElementById(h); el && el.scrollIntoView(); }, 60); }
  else if (h === "game") go("game");
  else go("title");
})();
