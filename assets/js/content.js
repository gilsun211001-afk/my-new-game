/* ═══════════════════════════════════════════════════════════
   포트폴리오 콘텐츠 — 자기소개서 모드와 게임 모드가 같은 데이터를 씁니다.
   링크·문구 수정은 이 파일에서만 하면 됩니다.
   ═══════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const DOCS = global.DOCS || [];                       // assets/js/docs.js (manifest)
  const doc = slug => DOCS.find(d => d.slug === slug && d.pages && d.pages.length);
  const pageSrc = (d, i) => `assets/docs/${d.slug}/${d.pages[i]}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ext = u => `href="${esc(u)}" target="_blank" rel="noopener"`;

  const PROFILE = {
    name: "임창민", en: "LIM CHANG MIN",
    headline: "덕력과 분석력을 가진 기획자",
    role: "게임 기획자 · 콘텐츠 / 시스템",
    email: "gd30330@naver.com",
    facts: [
      ["학력", "대구대학교 산림자원학과 (2024.08 졸업)"],
      ["경력", "달콤소프트 운영 기획 (2025.10 – 2026.01)"],
      ["현재", "Project Joseon 팀 기획 (2026.08 –)"],
      ["수상", "교내 캡스톤 대회 우수상 (2023.12)"],
      ["도구", "Unity · Notion · Sheets · Slides · AI 활용"]
    ],
    goal: "시간이 흐른 뒤에도 유저의 기억에 남아 계속 떠올릴 수 있는 게임을 만드는 기획자가 되는 것이 저의 목표입니다."
  };

  const TIMELINE = [
    { w: "2026.08 –", t: "Project Joseon · 팀 기획", d: "조선 판타지 익스트랙션 액션. 아이템 49종, 전투·속성 체계, 캐릭터(무당·선비), 맵, UIUX 기획", g: 1 },
    { w: "2026.06 – 07", t: "Castle Survival: Chronicle", d: "1인 개발 · 코드 전량 AI 생성 · 기획/디렉팅. 비주얼노벨 + 전략 디펜스", g: 1 },
    { w: "2025.10 – 2026.01", t: "달콤소프트 · 운영 기획", d: "SuperStar 시리즈 라이브 서비스 개선안 기획, 점수 산출 로직 검증, 신규 시스템 도입 전 콘텐츠 테스트", g: 1 },
    { w: "2025.07 – 2026.01", t: "S.I 프로젝트 · 팀 (Unity)", d: "맵 동선·배치 기획과 QA 담당", g: 1 },
    { w: "2024 – 2025", t: "개인 기획서 작업", d: "오버워치2 신규 영웅, 원신 신규 보스, 림버스 컴퍼니 전투 기획서(인격·E.G.O), 아스가르드 폴 신규 모드, 테일즈런너 개선 기획서", g: 1 },
    { w: "2024.06 – 07", t: "보드게임 제작", d: "보드게임 카페를 돌며 수요층과 인기 장르를 조사, 특허를 통한 정식 출시를 목표로 제작", g: 1 },
    { w: "2024.08", t: "대구대학교 산림자원학과 졸업", d: "" },
    { w: "2023.12", t: "교내 캡스톤 대회 우수상", d: "" },
    { w: "2023 – 2024", t: "마케팅 · 이벤트 기획", d: "㈜에버이엔씨 마케팅, 현대백화점 이벤트 기획 스태프, 오비맥주 신제품 홍보" }
  ];

  const ACHV = [
    { big: "LIVE", t: "달콤소프트 · SuperStar 시리즈", d: "라이브 서비스 개선안을 기획하고, 점수 산출 로직을 코드 테스트로 검증했습니다. 신규 시스템 'themeplay' 도입 전 콘텐츠 테스트를 맡았습니다." },
    { big: "×1.2", t: "현대백화점 · 동선 제안", d: "대기 줄 옆에 행거를 배치하자고 제안해 매출이 약 1.2배 늘었습니다. 유저의 기다리는 시간을 콘텐츠로 바꾼 경험입니다." },
    { big: "×8", t: "블로그 마케팅 · 6개월 전담", d: "방문자 수를 8배로 늘렸고, 1억 원 규모 B2B 계약 체결에 기여했습니다." }
  ];

  const LETTER = [
    { k: "01 · 프로필 & 노력", h: "재미를 분해하는 습관", p: [
      "여러 장르를 직접 플레이하며 핵심 재미, 시스템, BM, 조작감을 리뷰로 남깁니다. 게임 뉴스를 스크랩해 시장 트렌드와 유저 동향을 함께 봅니다.",
      "2024년에는 보드게임 카페를 직접 돌며 수요층과 인기 장르를 조사해 보드게임을 만들었고, 2025년부터는 Unity 팀 프로젝트에서 맵 동선·배치와 QA를 맡았습니다."
    ], img: [["coverletter", 1], ["analysis", 2]] },
    { k: "02 · 작업물", h: "기존 게임에 새 콘텐츠를 얹는 연습", p: [
      "오버워치2 신규 힐러 영웅, 원신 신규 보스, 림버스 컴퍼니 신규 인격·E.G.O와 데이터 테이블, 아스가르드 폴 오리진스 신규 모드까지. 원작의 규칙을 먼저 분석하고, 그 안에서 새 콘텐츠가 설 자리를 찾는 방식으로 기획서를 썼습니다."
    ], img: [["coverletter", 3], ["asgard", 0]] },
    { k: "03 · 업무 성과", h: "현장에서 숫자로 확인한 제안", p: [
      "달콤소프트에서 SuperStar 시리즈 라이브 서비스 개선안을 기획하고 점수 산출 로직을 검증했습니다. 게임 밖에서도 현대백화점 동선 제안으로 매출 약 1.2배, 블로그 마케팅으로 방문자 8배를 만들었습니다."
    ], img: [["coverletter", 6]] },
    { k: "04 · 기획자가 된 이유", h: "기억에 남는 게임", p: [
      "창작자로서 콘텐츠를 만들고 유저의 반응에서 재미의 본질을 연구해 왔습니다. 입사 후에는 기획 감각을 실제 수익으로 연결하는 기획자가 되겠습니다."
    ], img: [["coverletter", 8], ["castle-units", 0]] },
  ];

  const NOTION = [
    { t: "My Game Design Insights", d: "플레이한 게임의 장단점과 분석 자료를 모은 메인 노션", u: "https://www.notion.so/23e5bb2a4bb380feaa84f6f4bd089b75?v=23e5bb2a4bb381e6ba11000c90f76c0c&source=copy_link" },
    { t: "게임 리뷰 데이터베이스", d: "리뷰 페이지를 한곳에 모은 노션 DB", u: "https://www.notion.so/123dac2a20db4e8490e230cb0841472f?v=2aee0f66b97845ebaa723d821230b502&source=copy_link" },
    { t: "게임 분석 자료 (허브)", d: "리뷰 · 업계 스크랩 · 제작 정보 · 용어 사전", u: "https://app.notion.com/p/314c1342e11f80aa9a65c7666a35977a" },
    { t: "캐주얼 모바일 게임 분석", d: "약 20종의 매출 · 논란 · 강점/개선점 표", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { t: "포인트 블랭크 정밀 리뷰", d: "모드별 분석과 '랜덤 믹스 모드' 제안", u: "https://app.notion.com/p/31cc1342e11f804c810ae37ed03c9a2c" },
    { t: "스타 세이비어 정밀 리뷰", d: "UI·BM 분석과 '용도별 분류 필터' 제안", u: "https://app.notion.com/p/335c1342e11f8022a0b2e3fe50b3d018" }
  ];
  const FOLDER = "https://drive.google.com/drive/folders/1eDNftRVk24wi-I0Kanss1-VjuLNKcqYf?usp=sharing";

  const REVIEWS = [
    { n: "포인트 블랭크", g: "FPS", m: "20시간", k: "모드는 많지만 데스매치·폭파 미션에 쏠린다. 매 라운드 모드가 바뀌는 '랜덤 믹스 모드'로 기존 리소스를 재활용하자고 제안.", u: "https://app.notion.com/p/31cc1342e11f804c810ae37ed03c9a2c" },
    { n: "스타 세이비어", g: "RPG", m: "45시간", k: "시스템 융합과 서사는 수작이지만 반복 피로와 복잡한 재화가 문제. 인벤토리 용도별 분류 필터를 제안.", u: "https://app.notion.com/p/335c1342e11f8022a0b2e3fe50b3d018" },
    { n: "로얄 킹덤", g: "퍼즐", m: "매치3 + 건설", k: "쉬운 구간 → 갑작스러운 벽 → 완화의 반복. 벽 구간이 곧 결제 유도 지점이다.", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { n: "화이트아웃 서바이벌", g: "SLG", m: "4X", k: "과금 보상이 길드 전체에 돌아가, 과금 거부감이 큰 서구권에서도 과금이 일어난다.", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { n: "라스트 워 서바이벌", g: "SLG", m: "전략", k: "승리 조건이 등급이 아니라 생존이라 스트레스가 적다. 초저가 패키지는 최대 다수 판매 전략.", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { n: "페르소나5: 더 팬텀 X", g: "RPG", m: "턴제", k: "천장은 낮추고 캐릭터와 전용 무기를 따로 뽑게 해, 부담은 줄이고 소비 항목은 늘린 이중 설계.", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { n: "메이플 키우기", g: "방치형", m: "방치 RPG", k: "방치 수익 상한 4~6시간으로 하루 2회 이상 접속을 유도한다.", u: "https://app.notion.com/p/375c1342e11f808f9ef9f5b12174c343" },
    { n: "언더다크: 디펜스", g: "디펜스", m: "TD + 뱀서", k: "건물 배치로 적 경로가 바뀌어 변수가 풍부. 다만 코인은 후반 사용처가 없다.", u: "https://app.notion.com/p/393c1342e11f80be8801d50691436e97" },
    { n: "데이브 더 다이브", g: "어드벤처", m: "80시간", k: "잠수와 레스토랑, 두 루프가 하나의 사이클로 맞물리고 지칠 즈음 새 자극이 온다.", u: "https://app.notion.com/p/314c1342e11f809cb2b1e2abb4bcb34a" },
    { n: "파티 애니멀즈", g: "파티", m: "약 100시간", k: "불편한 조작이 오히려 재미를 키우고, 탈락 후에도 참여할 거리를 준다.", u: "https://app.notion.com/p/314c1342e11f809cb2b1e2abb4bcb34a" },
    { n: "악마단 돌겨억", g: "RPG", m: "룰렛 전투", k: "세분화된 아웃게임이 초반 이탈 원인. D1·D7을 위해 7일 한정 육성 패키지를 제안.", u: "https://app.notion.com/p/38bc1342e11f80c28f2de2d65990efae" },
    { n: "협타디", g: "디펜스", m: "협동 TD", k: "후반엔 최종 유닛으로 칸이 차 방치형처럼 보이고, 재화 소모처가 부족하다.", u: "https://app.notion.com/p/38bc1342e11f8038ae22f1685e93a6bf" },
    { n: "Gear Defence", g: "디펜스", m: "전략", k: "기어로 오토마타를 전략화한 신선한 조합. 그러나 '아이디어는 좋은데 버그로 망했다'는 반응.", u: "https://app.notion.com/p/394c1342e11f80bfaa0ed0db7d703723" },
    { n: "드드드드릴", g: "캐주얼", m: "땅파기", k: "코인 외 성장 요소가 없어 콘텐츠 소비가 빠르고 장기 리텐션이 어렵다.", u: "https://app.notion.com/p/399c1342e11f80099fcbd18483ef952d" },
    { n: "Slice Master", g: "캐주얼", m: "하이퍼캐주얼", k: "슬라이싱에 배율 계산이라는 전략 요소를 더한 차별화. 소비 속도는 빠른 편.", u: "https://app.notion.com/p/39ac1342e11f80828ca1ec8c0278a553" },
    { n: "Octo Crush", g: "퍼즐", m: "색 매칭", k: "킬링타임에 최적화. 장기 리텐션엔 스테이지별 새 장애물과 조건 다양화가 필요.", u: "https://app.notion.com/p/396c1342e11f807d9a8ee59e7dee57c7" }
  ];

  /* library groups (슬러그 → 표시 정보). 이미지가 없는 슬러그는 자동으로 숨깁니다 */
  const LIB = [
    { slug: "coverletter", t: "자기소개서", s: "2026.03 · 덕력과 분석력을 가진 기획자", grp: "자기소개" },
    { slug: "resume", t: "이력서", s: "학력 · 경력 · 스킬", grp: "자기소개" },
    { slug: "item-v1", t: "아이템 기획서 v1.0", s: "Project Joseon · 49종 · 인접 효과", grp: "Project Joseon" },
    { slug: "combat-v2", t: "전투 시스템 · 속성 체계 v2.0", s: "Project Joseon · 상성 제거 · 공식", grp: "Project Joseon" },
    { slug: "mudang", t: "무당 캐릭터 기획 체크시트", s: "Project Joseon · 각성 메커닉", grp: "Project Joseon" },
    { slug: "seonbi", t: "선비 캐릭터 기획서 v1.1", s: "Project Joseon · 캐릭터", grp: "Project Joseon" },
    { slug: "coreloop", t: "코어루프 기획서 v0.3", s: "Project Joseon · 루프 구조", grp: "Project Joseon" },
    { slug: "map", t: "맵 기획서 v1.1", s: "Project Joseon · 스테이지 · 워프", grp: "Project Joseon" },
    { slug: "enemy", t: "적 유닛 기획서 v1.0", s: "Project Joseon · 몬스터", grp: "Project Joseon" },
    { slug: "weapon", t: "무기 · 스킬 기획서", s: "Project Joseon · 무기", grp: "Project Joseon" },
    { slug: "uiux", t: "UIUX 기획서 v2", s: "Project Joseon · 화면 설계", grp: "Project Joseon" },
    { slug: "castle-gdd", t: "Castle Survival GDD", s: "AI 1인 개발 · 기획/디렉팅", grp: "Castle Survival" },
    { slug: "castle-units", t: "Castle Survival 유닛 시스템", s: "유닛 트리 · 수치", grp: "Castle Survival" },
    { slug: "asgard", t: "아스가르드 폴 오리진스 신규 모드", s: "2024.12 · 라그나로크 모드", grp: "개인 기획서" },
    { slug: "limbus", t: "림버스 컴퍼니 전투 기획서", s: "인격 · E.G.O", grp: "개인 기획서" },
    { slug: "ow2", t: "오버워치2 신규 힐러 영웅", s: "2024 · 영웅 기획", grp: "개인 기획서" },
    { slug: "genshin", t: "원신 신규 보스", s: "2024 · 보스 기획", grp: "개인 기획서" },
    { slug: "analysis", t: "테일즈런너 개선 기획서", s: "2025 · 게임 분석 · 개선안", grp: "개인 기획서" }
  ];

  /* ── small render helpers ── */
  const img = (src, alt, cls = "") => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}">`;
  function strip(slug, max = 99) {
    const d = doc(slug); if (!d) return "";
    return `<div class="strip">${d.pages.slice(0, max).map((p, i) => `<button class="page" data-lb="${d.slug}" data-i="${i}" type="button">${img(pageSrc(d, i), `${d.title} ${i + 1}쪽`)}<span>${String(i + 1).padStart(2, "0")} / ${d.pages.length}</span></button>`).join("")}</div>`;
  }
  function shot(src, cap, lbKey, i) { return `<figure class="shot" ${lbKey ? `data-lb="${lbKey}" data-i="${i}"` : ""}>${img(src, cap)}<figcaption>${esc(cap)}</figcaption></figure>`; }
  function docPage(slug, i, cap) { const d = doc(slug); if (!d) return ""; i = Math.min(i, d.pages.length - 1); return `<figure class="shot" data-lb="${slug}" data-i="${i}">${img(pageSrc(d, i), cap || d.title)}<figcaption>${esc(cap || d.title + " · " + (i + 1) + "쪽")}</figcaption></figure>`; }

  const SHOTS = {
    castle: [
      ["assets/shots/cs-title.webp", "타이틀 화면"], ["assets/shots/cs-dialog.webp", "월간 결정 · 에이라와의 대화"],
      ["assets/shots/cs-choice.webp", "선택 결과와 자원 변동"], ["assets/shots/cs-command.webp", "전투 중 지휘 결정 카드"],
      ["assets/shots/cs-battle.webp", "방어전 · 구조물 배치와 웨이브"]
    ],
    proto: (global.PROTO_SHOTS || [])
  };

  /* ═══════════ SECTIONS ═══════════ */
  const S = {};

  S.cover = () => {
    const pics = ["coverletter", "item-v1", "combat-v2"].map(s => doc(s)).filter(Boolean).slice(0, 3);
    const alt = ["mudang", "map", "asgard"].map(s => doc(s)).filter(Boolean);
    while (pics.length < 3 && alt.length) pics.push(alt.shift());
    return `<div class="cover">
      <div>
        <div class="eyebrow">PORTFOLIO · 2026</div>
        <h2>${esc(PROFILE.headline.replace("기획자", ""))}<em>기획자</em>, ${PROFILE.name}입니다.</h2>
        <p>게임을 플레이하면 재미의 구조부터 뜯어 봅니다. 그 분석을 기획서와 데이터 테이블로 옮기고, 필요하면 AI로 직접 플레이 가능한 프로토타입까지 만듭니다.</p>
        <div class="metrics">
          <div class="metric"><b>${LIB.filter(l => doc(l.slug) && l.grp !== "자기소개").length}</b><span>수록 기획서</span></div>
          <div class="metric"><b>49</b><span>설계한 아이템</span></div>
          <div class="metric"><b>${REVIEWS.length}</b><span>분석한 게임</span></div>
        </div>
      </div>
      <div class="stack">${pics.map((d, i) => `<img src="${esc(pageSrc(d, 0))}" alt="${esc(d.title)} 표지" data-lb="${d.slug}" data-i="0">`).join("")}</div>
    </div>`;
  };

  S.letter = () => `<div class="letter">
    ${LETTER.map(l => {
      const hit = (l.img || []).find(([sl]) => doc(sl)); const d = hit && doc(hit[0]); const pi = d ? Math.min(hit[1], d.pages.length - 1) : 0;
      const pic = d ? `<figure class="shot" data-lb="${d.slug}" data-i="${pi}" style="margin:0">${img(pageSrc(d, pi), d.title)}<figcaption>${esc(d.title)} · ${pi + 1}쪽</figcaption></figure>` : "";
      return `<article class="card letter-item"><div><div class="eyebrow">${esc(l.k)}</div><h3>${esc(l.h)}</h3>${l.p.map(x => `<p>${esc(x)}</p>`).join("")}</div>${pic}</article>`;
    }).join("")}
    <blockquote class="pull" style="margin:0">${esc(PROFILE.goal)}<cite>— 자기소개서 · 기획자가 된 이유</cite></blockquote>
  </div>`;

  S.career = () => `<div class="card tl">${TIMELINE.map(r => `<div class="tl-row ${r.g ? "is-game" : ""}"><div class="when">${esc(r.w)}</div><span class="dot"></span><div><h4>${esc(r.t)}</h4>${r.d ? `<p>${esc(r.d)}</p>` : ""}</div></div>`).join("")}</div>
    <p class="note" style="margin-top:10px">채워진 점은 게임 관련 이력입니다.</p>`;

  S.achv = () => `<div class="achv">${ACHV.map(a => `<div class="card"><div class="big">${esc(a.big)}</div><h4>${esc(a.t)}</h4><p>${esc(a.d)}</p></div>`).join("")}</div>`;

  S.joseon = () => `<article class="card proj" data-proj="joseon">
    <div class="proj-top">
      <div><span class="chip em">TEAM · 조선 판타지</span>
        <h3>Project Joseon</h3>
        <p class="muted">조선을 배경으로 한 익스트랙션 액션. 캐릭터의 강함은 레벨이 아니라 그리드 인벤토리 「의식판」에 무엇을 어떻게 붙이느냐로만 정해집니다. 2026년 8월 기획자로 합류해 아이템·데이터·전투 체계와 캐릭터, 맵, UIUX 문서를 맡고 있습니다.</p>
      </div>
      <div class="spec"><div><span>ROLE</span><span>시스템 · 아이템 · 캐릭터 기획</span></div><div><span>JOINED</span><span>2026.08</span></div><div><span>진영</span><span>조정 · 반란군 · 귀</span></div><div><span>속성</span><span>요력 · 기력 · 신력</span></div><div><span>조작</span><span>WASD · 마우스 · 1/2/3 · Tab</span></div></div>
    </div>
    <div class="tabs" role="tablist">
      <button class="tab" role="tab" aria-selected="true" data-tab="item">아이템 v1.0</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="combat">전투·속성 v2.0</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="effects">Effects 스키마</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="chars">캐릭터</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="ui">AI UI 목업</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="docs">기획서 원본</button>
    </div>
    <div class="tabpanel" data-panel="item" role="tabpanel">
      <div class="grid2">
        <div class="box"><h4>기획 의도 <span class="chip">v1.0 · 상성은 v2.0에서 폐기</span></h4>
          <ul class="list"><li><b>인벤토리를 퍼즐로.</b> 칸수가 클수록 강하고, 옆에 붙이면 효과가 켜진다.</li><li><b>상성은 있지만 승부를 정하지 않는다.</b> 유리 +20% / 불리 −15%의 의도적 비대칭.</li><li><b>인접 효과를 무기에도.</b> 사인검은 칼끝, 귀검은 자루가 접합면.</li><li><b>세계관을 수치로.</b> 고증은 속성 배분에 설득력을 주는 수단.</li></ul>
          <p class="quote">큰 아이템일수록 조건을 넓게, 작은 아이템일수록 조건을 좁게.<cite>칸수와 인접 조건 · 아이템 기획서 v1.0</cite></p></div>
        <div class="box"><h4>직접 해보기 · 인접 효과</h4><p class="muted" style="font-size:.86rem;margin-bottom:12px">「부적」을 끌어 사인검 칼끝(오른쪽 칸)에 붙여 보세요. 방향키로도 움직일 수 있습니다.</p>
          <div class="inv" data-inv></div><p class="mono muted" data-inv-out style="margin-top:10px">사인검 공격력 5~7 · 인접 효과 꺼짐</p></div>
      </div>
      <div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>무기</th><th>크기</th><th>공격력</th><th>비고</th></tr></thead><tbody>
        <tr><td>단검</td><td>2×1</td><td>1~2</td><td class="muted">—</td></tr><tr><td>장검</td><td>4×1</td><td>4~6</td><td class="muted">밸런스 기준점</td></tr><tr><td>활</td><td>2×2</td><td>2~3</td><td class="muted">—</td></tr><tr><td>창</td><td>5×1</td><td>5~7</td><td class="muted">최고 화력 ↔ 최대 인벤토리 부담</td></tr><tr><td>사인검</td><td>4×1</td><td>5~7</td><td class="muted">신력 · 칼끝 퇴마 +8%</td></tr><tr><td>귀검</td><td>4×1</td><td>6~9</td><td class="muted">요력 · 자루 저주 +8%</td></tr>
      </tbody></table></div>
      <p class="note" style="margin-top:8px">총 49종 · 무기 6 / 방어구 9 / 장신구 2 / 유물 2 / 주술 20 / 귀물 10</p>
      <div style="margin-top:16px">${strip("item-v1")}</div>
    </div>
    <div class="tabpanel" data-panel="combat" role="tabpanel" hidden>
      <div class="grid2">
        <div class="box"><h4>기획 변경 이력</h4>
          <div class="seg" data-ver style="margin:4px 0 12px"><button data-v="1" aria-pressed="false">v1.0 상성</button><button data-v="2" aria-pressed="true">v2.0 상성 제거</button></div>
          <div data-ver-body></div></div>
        <div class="box"><h4>전투 공식 계산기 · v2.0</h4><p class="muted" style="font-size:.82rem">문서 공식 그대로 · 정수 · 최소 피해 1</p>
          <div style="display:grid;gap:8px;margin-top:10px">
            <div class="range"><label>무기 공격력 <output data-o="atk">8</output></label><input type="range" data-c="atk" min="1" max="20" value="8" aria-label="무기 공격력"></div>
            <div class="range"><label>속성 수치 n <output data-o="n">6</output></label><input type="range" data-c="n" min="0" max="12" value="6" aria-label="속성 수치"></div>
            <div class="range"><label>상대 방어력 <output data-o="def">5</output></label><input type="range" data-c="def" min="0" max="15" value="5" aria-label="상대 방어력"></div>
            <div class="chips" data-mon><button class="chip" data-def="4" type="button">몰이꾼형 4</button><button class="chip" data-def="3" type="button">잔주술형 3</button><button class="chip" data-def="5" type="button">두억신 5</button></div>
          </div><div class="res" data-calc></div></div>
      </div>
      <div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>몬스터</th><th>공격</th><th>방어</th><th>요 / 기 / 신</th><th>체력</th></tr></thead><tbody><tr><td>몰이꾼형</td><td>7</td><td>4</td><td>1 / 5 / 1</td><td>20</td></tr><tr><td>잔주술형</td><td>6</td><td>3</td><td>7 / 1 / 2</td><td>15</td></tr><tr><td>두억신 (보스)</td><td>12</td><td>5</td><td>9 / 4 / 3</td><td>200</td></tr></tbody></table></div>
      <div style="margin-top:16px">${strip("combat-v2")}</div>
    </div>
    <div class="tabpanel" data-panel="effects" role="tabpanel" hidden>
      <div class="grid2">
        <div class="box"><h4>한 행을 읽는 순서</h4><p class="muted" style="font-size:.88rem">아이템이 전투에 주는 모든 영향을 한 형식으로 적습니다. 기획서의 90종 확장 계획을 전제로, 구조는 두고 행만 추가하게 설계했습니다.</p>
          <div class="chips" style="margin-top:12px"><span class="chip em">언제 TriggerType</span>→<span class="chip em">누구 TargetType</span>→<span class="chip em">무엇 EffectType</span>→<span class="chip em">어떻게 Add·Multiply·Apply</span>→<span class="chip em">얼마나 ValueMin~Max</span>→<span class="chip em">확률 ChancePercent</span></div></div>
        <div class="box"><h4>설계 규칙</h4><ul class="list"><li>TriggerType 5종: Passive · OnHit · OnKill · OnUse · Adjacent</li><li>위치 기반 접합면: TriggerCellPosition (사인검 Right, 귀검 Left)</li><li>희귀 등급 = 일반 × 1.4</li><li>팀원의 스탯 공식 (Base+Item+Effect)×(1+Rate)에 6단계로 정렬</li><li>Adjacent는 배치가 바뀔 때만 재계산 · 매 프레임 판정 불필요</li><li>데이터 문제 7건을 직접 찾아 정리 (표기 불일치, OnDamaged 누락 등)</li></ul></div>
      </div>
    </div>
    <div class="tabpanel" data-panel="chars" role="tabpanel" hidden>
      <div class="grid2">
        <div class="box"><h4>무당 · 신을 제어하지 못하고 광기에 지배당한 무당</h4><p class="muted" style="font-size:.88rem">회로 노드 2개를 아이템으로 이으면 각성해 신력·요력이 ×2가 되고, 연결이 끊기면 즉시 풀립니다. 액티브 스킬과 레벨업이 없습니다.</p>
          <p class="quote">'연결을 지켜내는 행동' 자체가 무당의 광기 서사를 메커닉으로 체감시키는 것이 목표.<cite>핵심 재미 가설</cite></p>
          <p style="font-size:.86rem;margin-top:12px"><b>스스로 남긴 검수 메모</b> <span class="muted">페널티 없는 순수 버프는 '통제 상실' 서사와 이어지지 않는다 → 각성의 대가 설계가 다음 과제.</span></p></div>
        <div class="box"><h4>선비 캐릭터 기획서 v1.1</h4><p class="muted" style="font-size:.88rem">프로필 카드, 외형 키워드, 키아트 제작 사양, 삼각 소켓 격자, 장검 공격 범위 도해, 모션 표로 구성했습니다.</p>${docPage("seonbi", 0, "선비 캐릭터 기획서 · 표지")}</div>
      </div>
      <div style="margin-top:16px">${strip("mudang")}</div>
    </div>
    <div class="tabpanel" data-panel="ui" role="tabpanel" hidden>
      <p class="muted" style="margin-bottom:14px">UIUX 기획서의 인벤토리 화면을 AI로 HTML 목업까지 만들어, 문서로만 설명하던 배치·인접 규칙을 화면에서 바로 검토할 수 있게 했습니다. <span class="note">(inventory_uiux.html · 2026.08)</span></p>
      <div class="shotrow">${(global.PROTO_SHOTS || []).map((s, i) => shot(s[0], s[1], "proto", i)).join("") || `<p class="note">스크린샷 준비 중</p>`}</div>
      ${global.PROTO_SHOTS && global.PROTO_SHOTS.length ? `<p style="margin-top:12px"><a class="btn" href="assets/proto/inventory_uiux.html" target="_blank" rel="noopener">목업 직접 열어보기 ↗</a></p>` : ""}
      <div style="margin-top:16px">${strip("uiux")}</div>
    </div>
    <div class="tabpanel" data-panel="docs" role="tabpanel" hidden>
      <p class="muted" style="margin-bottom:12px">팀 프로젝트 중 본인 드라이브에 정리한 기획 문서입니다. 표지를 누르면 페이지를 넘겨 볼 수 있습니다.</p>
      <div class="shelf">${LIB.filter(l => l.grp === "Project Joseon" && doc(l.slug)).map(bookHTML).join("")}</div>
    </div>
  </article>`;

  function bookHTML(l) { const d = doc(l.slug); return `<button class="book" data-lb="${l.slug}" data-i="0" type="button">${img(`assets/docs/${l.slug}/${d.pages[0]}`, l.t + " 표지")}<span class="meta"><b>${esc(l.t)}</b><small>${esc(l.s)} · ${d.pageCount || d.pages.length}쪽</small></span></button>`; }

  S.castle = () => `<article class="card proj" data-proj="castle">
    <div class="proj-top">
      <div><span class="chip em">SOLO · AI 개발 · 플레이 가능</span>
        <h3>Castle Survival: Chronicle</h3>
        <p class="muted">마왕이 1년 뒤 쳐들어온다는 예언을 받은 작은 왕국. 매달 조언자 에이라와 징집·훈련·보급을 결정하고, 그 결과로 방어전을 치릅니다. 기획서(GDD)를 쓰고 AI에게 코드를 생성시키며 직접 디렉팅한 1인 프로젝트입니다.</p>
        <p class="quote">1인 개발 / 코드 전량 AI 생성 / 기획·디렉팅: 임창민<cite>Castle Survival GDD v1.5</cite></p>
      </div>
      <div class="spec"><div><span>ROLE</span><span>기획 · 디렉팅 (코드 AI 생성)</span></div><div><span>GENRE</span><span>비주얼노벨 + 전략 전투</span></div><div><span>PERIOD</span><span>2026.06.13 – 07.10 계획</span></div><div><span>AI TOOLS</span><span>Claude · Cursor · AI Studio</span></div><div><span>PLAN</span><span>Steam · 12챕터 · 엔딩 10종</span></div><div><span>WEB BUILD</span><span>1–2월 플레이 가능</span></div></div>
    </div>
    <div class="tabs" role="tablist">
      <button class="tab" role="tab" aria-selected="true" data-tab="play">플레이</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="design">설계 포인트</button>
      <button class="tab" role="tab" aria-selected="false" data-tab="shots">스크린샷</button>
    </div>
    <div class="tabpanel" data-panel="play" role="tabpanel">
      <div class="gameframe" data-gameframe><div class="scaler"></div>
        <div class="cover-play" style="background-image:linear-gradient(rgba(10,8,5,.35),rgba(10,8,5,.85)),url('assets/shots/cs-dialog.webp')"><div><div class="eyebrow" style="color:#e8c66a">CHAPTER 1 · 1월</div><h4>마왕까지 남은 시간, 1년</h4><p style="color:#d8cbb0;margin-bottom:14px">효과음이 있습니다. 휴대폰에서는 새 탭으로 여는 편이 편합니다.</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn em" data-boot type="button">▶ 여기서 플레이</button><a class="btn" href="games/castle-survival/index.html" target="_blank" rel="noopener">새 탭 ↗</a></div></div></div>
      </div>
    </div>
    <div class="tabpanel" data-panel="design" role="tabpanel" hidden>
      <div class="grid2">
        <div class="box"><h4>코어 루프</h4><div class="chips"><span class="chip em">월간 결정</span>→<span class="chip em">인망·자원·병력 변동</span>→<span class="chip em">방어전</span>→<span class="chip em">지휘 결정 카드</span>→<span class="chip em">다음 달</span></div>
          <ul class="list" style="margin-top:14px"><li><b>같은 목표, 다른 대가.</b> 대규모 징집은 병력 +30 · 인망 −2, 자원자만 받으면 병력 +10 · 인망 +1.</li><li><b>막을 수 없는 방벽.</b> 방벽은 경로를 유도할 뿐 완전히 막지 못하고, 골렘은 방벽을 부순다.</li><li><b>전투 중 결정.</b> 시간(초당 +0.6)과 처치(+1.2)로 게이지가 차면 카드 3장 중 하나를 고른다. 필요량은 9에서 5씩 증가.</li><li><b>병과 트리.</b> 2월 스토리 선택으로 궁수·기사·마법사 중 하나를 해금. 3단계 전직은 데이터까지 설계, 연동은 다음 과제.</li></ul></div>
        <div class="box"><h4>결말 설계 · 현재 웹 빌드 기준</h4><p class="note" style="margin-bottom:8px">GDD는 엔딩 10종(인망 6 · 히든 1 · 배드 3)을 계획합니다.</p><div class="table-wrap"><table><thead><tr><th>결말</th><th>조건</th></tr></thead><tbody>
          <tr><td>완전한 평화</td><td>성 유지 · 인망 10</td></tr><tr><td>영웅왕</td><td>인망 8–9</td></tr><tr><td>불완전한 승리</td><td>인망 6–7</td></tr><tr><td>상처뿐인 승리</td><td>인망 4–5</td></tr><tr><td>고독한 군주</td><td>인망 2–3</td></tr><tr><td>몰락한 폭군</td><td>인망 1</td></tr><tr><td>반란</td><td>인망 0</td></tr><tr><td>패배</td><td>성 함락</td></tr></tbody></table></div></div>
      </div>
      <div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>구조물</th><th>Lv1</th><th>Lv2</th><th>Lv3</th></tr></thead><tbody><tr><td>화살탑</td><td>ATK18 범위2.5</td><td>ATK30 범위3</td><td>ATK48 범위3.5</td></tr><tr><td>마법진</td><td>이속−60% 범위2</td><td>이속−80% ATK5</td><td>이속−90% ATK12</td></tr><tr><td>투석기</td><td>ATK40 충격파</td><td>ATK65</td><td>ATK90 광역</td></tr></tbody></table></div>
      <div style="margin-top:16px">${strip("castle-gdd")}${strip("castle-units")}</div>
    </div>
    <div class="tabpanel" data-panel="shots" role="tabpanel" hidden>
      <div class="shotrow">${SHOTS.castle.map((s, i) => shot(s[0], s[1], "castle", i)).join("")}</div>
    </div>
  </article>`;

  S.others = () => `<div class="grid2">
    <article class="card" style="padding:22px"><span class="chip em">SOLO · 2024.12</span><h3 style="font-size:1.4rem;margin:8px 0">아스가르드 폴 오리진스 · 라그나로크 모드</h3>
      <p class="muted" style="font-size:.9rem">반복 전투로 금세 지루해지는 로그라이크에, 확률로 터지는 돌발 퀘스트 3종(발키리의 가호 · 로키의 분신 · 발할라의 결투장)을 넣는 신규 모드 제안서.</p>
      <ul class="list" style="margin-top:12px"><li>발동 확률 10% → 5% → 1%, 실패 시 확률 20% 감소</li><li>누적 보상 1회 경험치 → 3회 스킬 레벨업 → 5회 특수 스킬</li></ul>
      <div style="margin-top:14px">${strip("asgard", 6)}</div></article>
    <article class="card" style="padding:22px"><span class="chip em">TEAM · 2025.07 – 2026.01</span><h3 style="font-size:1.4rem;margin:8px 0">S.I 프로젝트 (Unity)</h3>
      <p class="muted" style="font-size:.9rem">Unity 팀 프로젝트에서 맵 동선과 오브젝트 배치 기획, QA를 맡았습니다.</p>
      <h4 style="font-family:var(--f-body);font-size:.95rem;margin:18px 0 8px">이전 개인 기획서</h4>
      <div class="shelf" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${LIB.filter(l => l.grp === "개인 기획서" && l.slug !== "asgard" && doc(l.slug)).map(bookHTML).join("")}</div>
      <p class="note" style="margin-top:10px">오버워치2 신규 영웅, 원신 신규 보스, 림버스 컴퍼니 전투 기획서(인격 · E.G.O)는 <a ${ext(FOLDER)} style="color:var(--em)">포트폴리오 폴더</a>에서 볼 수 있습니다.</p></article>
  </div>`;

  S.process = () => {
    const P = global.PROTO_SHOTS || [];
    const steps = [
      { k: "플레이 & 분석", h: "재미를 분해해서 기록한다", p: `플레이한 게임을 인게임 · 아웃게임 · 재화 · BM으로 나눠 노션에 정리합니다. 지금까지 도감에 ${REVIEWS.length}종을 담았습니다. 분석에서 찾은 문제점이 신규 콘텐츠 제안서의 출발점이 됩니다.`, tools: ["Notion"], vis: docPage("asgard", 2, "문제점 분석 → 해결 방향 (아스가르드 폴 제안서)") },
      { k: "의도와 규칙", h: "한 줄 기획 의도부터 쓴다", p: "모든 아이템과 캐릭터에 기획 의도를 먼저 붙이고, 규칙은 그 의도를 지키는 방향으로만 추가합니다.", tools: ["Google Slides", "PowerPoint"], vis: docPage("item-v1", 1, "아이템 기획서 v1.0 · 기획 의도") },
      { k: "수치와 데이터", h: "공식과 테이블로 옮긴다", p: "장검 4~6을 기준점으로 수치를 파생하고, Effects 시트로 모든 효과를 한 형식의 데이터 행으로 적습니다. 팀 개발자가 바로 구현할 수 있는 형태가 목표입니다.", tools: ["Google Sheets", "Excel"], vis: docPage("combat-v2", 4, "전투 시스템 v2.0 · 속성과 공식") },
      { k: "화면으로 검증", h: "AI로 UI 목업을 만든다", p: "문서만으로 전달이 어려운 인벤토리 배치 규칙은 AI로 HTML 목업을 만들어 팀과 화면으로 확인했습니다.", tools: ["AI 코드 생성", "HTML"], vis: P[0] ? shot(P[0][0], "AI로 만든 인벤토리 UI 목업", "proto", 0) : docPage("uiux", 0) },
      { k: "플레이 가능한 결과물", h: "기획서를 게임으로 만든다", p: "Castle Survival은 GDD를 먼저 쓰고, AI에게 코드를 생성시키며 기획자로서 디렉팅했습니다. 문서의 수치가 실제 플레이에서 어떻게 느껴지는지 직접 확인할 수 있었습니다.", tools: ["GDD", "Claude · Cursor (GDD 기재)", "AI 픽셀아트", "플레이테스트"], vis: shot("assets/shots/cs-battle.webp", "Castle Survival · 방어전 화면", "castle", 4) },
      { k: "검수와 회고", h: "스스로 약점을 적는다", p: "체크시트에 확정/미정 상태를 표시하고, 서사와 메커닉이 어긋나는 지점을 검수 메모로 남깁니다. 피드백을 받으면 버전을 올려 방향을 바꿉니다 (예: 전투 v1.0 상성 → v2.0 상성 제거).", tools: ["체크시트", "버전 관리"], vis: docPage("mudang", 1, "무당 캐릭터 체크시트 · 확정/미정 표시") }
    ];
    return `<div class="pipe">${steps.map(s => `<article class="card step"><div><span class="k">${esc(s.k)}</span><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p><div class="chips tools">${s.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div></div><div>${s.vis || ""}</div></article>`).join("")}</div>`;
  };

  S.library = () => {
    const groups = [...new Set(LIB.map(l => l.grp))];
    return groups.map(g => { const items = LIB.filter(l => l.grp === g && doc(l.slug)); if (!items.length) return ""; return `<h3 style="font-family:var(--f-pixel);font-weight:400;font-size:.9rem;color:var(--em);margin:18px 0 10px">${esc(g)}</h3><div class="shelf">${items.map(bookHTML).join("")}</div>`; }).join("");
  };

  S.reviews = () => {
    const genres = ["전체", ...new Set(REVIEWS.map(r => r.g))];
    return `<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
      <div class="chips" data-genres>${genres.map(g => `<button class="chip" type="button" data-g="${g}" aria-pressed="${g === "전체"}">${g}</button>`).join("")}</div>
      <label class="search"><span class="sr">게임 검색</span><input type="search" data-q placeholder="게임 이름이나 키워드 (예: 리텐션)" autocomplete="off"></label></div>
      <div class="reviews" data-reviews></div><p class="note" data-empty hidden style="margin-top:12px">검색 결과가 없습니다.</p>`;
  };

  S.contact = () => `<div class="card contact"><div><div class="eyebrow">CONTACT</div><p class="addr" data-email>${esc(PROFILE.email)}</p><p class="muted" style="font-size:.88rem;margin-top:6px">함께 재미있는 게임을 만들 기회를 기다리고 있습니다.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn em" data-copy type="button">이메일 복사</button><a class="btn" href="mailto:${esc(PROFILE.email)}">메일 쓰기</a></div></div>
    <div class="links" style="margin-top:14px">${NOTION.map(n => `<a class="card lnk" ${ext(n.u)}><b>${esc(n.t)}</b><small>${esc(n.d)}</small><span class="go">노션 열기 ↗</span></a>`).join("")}
      <a class="card lnk" ${ext(FOLDER)}><b>포트폴리오 폴더</b><small>기획서 원본 (Google Drive)</small><span class="go">드라이브 열기 ↗</span></a></div>`;

  /* ═══════════ interactivity (scoped to a root element) ═══════════ */
  function bind(root, ui) {
    // tabs
    root.querySelectorAll("[role=tablist]").forEach(list => {
      const scope = list.parentElement;
      list.addEventListener("click", e => {
        const t = e.target.closest(".tab"); if (!t) return;
        list.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", x === t));
        scope.querySelectorAll(":scope > .tabpanel").forEach(p => p.hidden = p.dataset.panel !== t.dataset.tab);
        ui.sfx && ui.sfx("move");
        if (t.dataset.tab === "play") fitGame(scope);
      });
      list.addEventListener("keydown", e => {
        if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return; e.stopPropagation();
        const tabs = [...list.querySelectorAll(".tab")], i = tabs.findIndex(x => x.getAttribute("aria-selected") === "true");
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]; n.click(); n.focus();
      });
    });
    // lightbox triggers
    root.addEventListener("click", e => { const el = e.target.closest("[data-lb]"); if (!el) return; e.preventDefault(); ui.lightbox(el.dataset.lb, +el.dataset.i || 0); });
    // inventory
    root.querySelectorAll("[data-inv]").forEach(el => invWidget(el, root.querySelector("[data-inv-out]"), ui));
    // version compare
    root.querySelectorAll("[data-ver]").forEach(seg => {
      const body = seg.parentElement.querySelector("[data-ver-body]");
      const V = { 1: `<ul class="list"><li>속성 삼각구조 요력 → 기력 → 신력 → 요력</li><li>유리 +20% / 불리 −15% (문서 예시: 공격력 20 → 24 / 17)</li></ul><p class="quote">+20%/−15%는 의도적 비대칭이다. 상성 하나로 전투 결과가 결정되지 않게 했다.<cite>아이템 기획서 v1.0</cite></p>`,
                  2: `<ul class="list"><li><b>문제</b> 가위바위보식 상성 때문에 빌드 자유도가 준다는 회의 피드백</li><li><b>해결</b> 상성을 없애고, 속성은 켜지는 스킬의 종류만 정한다</li><li><b>장비 역할</b> 무기 = 공격력, 방어구 = 방어력, 장신구 = 속성 수치</li></ul><p class="quote">기력은 세게 밀어붙이고, 신력은 안정적으로 관리하고, 요력은 걸고 크게 딴다.<cite>전투 시스템 속성 체계 v2.0</cite></p>` };
      const paint = v => { seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v == v)); body.innerHTML = V[v]; };
      seg.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { paint(b.dataset.v); ui.sfx && ui.sfx("move"); } }); paint(2);
    });
    // calculator
    root.querySelectorAll("[data-calc]").forEach(out => {
      const box = out.parentElement, get = k => +box.querySelector(`[data-c="${k}"]`).value;
      const calc = () => {
        const a = get("atk"), n = get("n"), d = get("def");
        box.querySelector('[data-o="atk"]').textContent = a; box.querySelector('[data-o="n"]').textContent = n; box.querySelector('[data-o="def"]').textContent = d;
        box.querySelectorAll("[data-mon] .chip").forEach(c => c.setAttribute("aria-pressed", +c.dataset.def === d));
        out.innerHTML = `<div><b>${Math.max(1, a - d)}</b><span>평타</span><code>${a} − ${d}</code></div><div><b>${Math.max(1, a + n * 2 - d)}</b><span>공격 스킬</span><code>${a} + ${n}×2 − ${d}</code></div><div><b>${n * 100}ms</b><span>패링 구간</span><code>n × 100ms</code></div><div><b>${Math.ceil(n / 2)}/s</b><span>가호 회복</span><code>⌈n ÷ 2⌉</code></div><div><b>${n * 300}ms</b><span>봉인</span><code>n × 300ms</code></div><div><b>${n * 10}%</b><span>흡혈 (대가 −${n})</span><code>피해 × n×10%</code></div>`;
      };
      box.querySelectorAll("input[type=range]").forEach(r => r.addEventListener("input", calc));
      box.querySelector("[data-mon]").addEventListener("click", e => { const c = e.target.closest(".chip"); if (!c) return; box.querySelector('[data-c="def"]').value = c.dataset.def; calc(); });
      calc();
    });
    // game iframe
    root.querySelectorAll("[data-gameframe]").forEach(f => {
      const b = f.querySelector("[data-boot]"); if (!b) return;
      b.addEventListener("click", () => { f.querySelector(".scaler").innerHTML = `<iframe src="games/castle-survival/index.html" title="Castle Survival: Chronicle" allow="autoplay; fullscreen"></iframe>`; f.querySelector(".cover-play").hidden = true; fitGame(f.parentElement); ui.sfx && ui.sfx("ok"); });
      fitGame(f.parentElement);
    });
    // reviews
    root.querySelectorAll("[data-reviews]").forEach(list => {
      const wrap = list.parentElement; let g = "전체";
      const q = wrap.querySelector("[data-q]"), empty = wrap.querySelector("[data-empty]");
      const paint = () => {
        const s = q.value.trim().toLowerCase();
        const L = REVIEWS.filter(r => (g === "전체" || r.g === g) && (!s || (r.n + r.g + r.m + r.k).toLowerCase().includes(s)));
        list.innerHTML = L.map(r => `<article class="card review"><div style="display:flex;justify-content:space-between;gap:8px"><span class="chip em">${esc(r.g)}</span><span class="note">${esc(r.m)}</span></div><h4>${esc(r.n)}</h4><p>${esc(r.k)}</p><a ${ext(r.u)}>노션 원문 ↗</a></article>`).join("");
        empty.hidden = L.length > 0;
      };
      wrap.querySelector("[data-genres]").addEventListener("click", e => { const c = e.target.closest(".chip"); if (!c) return; g = c.dataset.g; wrap.querySelectorAll("[data-genres] .chip").forEach(x => x.setAttribute("aria-pressed", x === c)); paint(); });
      q.addEventListener("input", paint); q.addEventListener("keydown", e => e.stopPropagation()); paint();
    });
    // copy email
    root.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(PROFILE.email); ui.toast("이메일 주소를 복사했습니다"); }
      catch (e) { const el = root.querySelector("[data-email]"); const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); ui.toast("주소를 선택했습니다. 복사해서 쓰세요"); }
    }));
  }

  function fitGame(scope) {
    const f = scope && scope.querySelector && scope.querySelector("[data-gameframe]"); if (!f) return;
    requestAnimationFrame(() => { const w = f.clientWidth || 940, k = Math.min(1, w / 940); f.querySelector(".scaler").style.transform = `scale(${k})`; f.style.height = (820 * k) + "px"; });
  }
  addEventListener("resize", () => document.querySelectorAll("[data-gameframe]").forEach(f => fitGame(f.parentElement)));

  function invWidget(el, out, ui) {
    const INV = { cols: 6, rows: 4, items: [{ id: "sword", n: "사인검", x: 0, y: 1, w: 4, h: 1, c: "w" }, { id: "tal", n: "부적", x: 4, y: 3, w: 1, h: 1, c: "c" }] };
    let done = false;
    const can = (it, x, y) => x >= 0 && y >= 0 && x + it.w <= INV.cols && y + it.h <= INV.rows && !INV.items.some(o => o !== it && x < o.x + o.w && x + it.w > o.x && y < o.y + o.h && y + it.h > o.y);
    function paint(focusId) {
      el.innerHTML = ""; el.style.gridTemplateRows = `repeat(${INV.rows},1fr)`;
      for (let y = 0; y < INV.rows; y++) for (let x = 0; x < INV.cols; x++) { const c = document.createElement("div"); c.className = "cell"; c.style.gridArea = `${y + 1}/${x + 1}`; el.appendChild(c); }
      const [sw, tl] = INV.items, on = tl.y === sw.y && tl.x === sw.x + sw.w;
      INV.items.forEach(it => { const d = document.createElement("div"); d.className = `itm ${it.c} ${on ? "on" : ""}`; d.textContent = it.n; d.dataset.id = it.id; d.tabIndex = 0; d.style.gridArea = `${it.y + 1}/${it.x + 1}/span ${it.h}/span ${it.w}`; d.setAttribute("aria-label", `${it.n} ${it.x + 1}열 ${it.y + 1}행, 방향키로 이동`); el.appendChild(d); });
      if (out) out.innerHTML = on ? `<span style="color:var(--em)">접합 성공 · 사인검 5~7 → 5.4~7.6 (+8%, v1.0)</span>` : "사인검 공격력 5~7 · 인접 효과 꺼짐";
      if (on && !done) { done = true; ui.sfx && ui.sfx("ok"); }
      if (focusId) el.querySelector(`[data-id="${focusId}"]`).focus();
    }
    let drag = null;
    el.addEventListener("pointerdown", e => { const d = e.target.closest(".itm"); if (!d) return; drag = INV.items.find(i => i.id === d.dataset.id); d.setPointerCapture(e.pointerId); });
    el.addEventListener("pointerup", e => { if (!drag) return; const r = el.getBoundingClientRect(); const x = Math.floor((e.clientX - r.left) / (r.width / INV.cols)), y = Math.floor((e.clientY - r.top) / (r.height / INV.rows)); if (can(drag, x, y)) { drag.x = x; drag.y = y; } drag = null; paint(); });
    el.addEventListener("keydown", e => { const d = e.target.closest(".itm"); if (!d) return; const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!m) return; e.preventDefault(); e.stopPropagation(); const it = INV.items.find(i => i.id === d.dataset.id); if (can(it, it.x + m[0], it.y + m[1])) { it.x += m[0]; it.y += m[1]; } paint(it.id); });
    paint();
  }

  /* lightbox image sets */
  function images(key) {
    if (key === "castle") return SHOTS.castle.map(s => ({ src: s[0], cap: s[1] }));
    if (key === "proto") return (global.PROTO_SHOTS || []).map(s => ({ src: s[0], cap: s[1] }));
    const d = doc(key); if (!d) return [];
    return d.pages.map((p, i) => ({ src: pageSrc(d, i), cap: `${d.title} · ${i + 1} / ${d.pages.length}` }));
  }

  global.PF = { PROFILE, TIMELINE, REVIEWS, NOTION, LIB, S, bind, images, doc, esc };
})(window);
