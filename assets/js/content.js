/* ═══════════════════════════════════════════════════════════
   포트폴리오 콘텐츠 — 자기소개서 모드와 게임 모드가 같은 데이터를 씁니다.
   링크·문구 수정은 이 파일에서만 하면 됩니다.
   ═══════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const DOCS = global.DOCS || [];                       // assets/js/docs.js (manifest)
  const doc = slug => DOCS.find(d => d.slug === slug && d.pages && d.pages.length);
  const info = slug => DOCS.find(d => d.slug === slug) || {};              // 요약·포인트 (이미지 없어도 있음)
  const pageSrc = (d, i) => `assets/docs/${d.slug}/${d.pages[i]}`;
  const srcNo = (d, i) => (d.sourcePages && d.sourcePages[i]) || i + 1;          // 원본 쪽 번호
  const total = d => d.pageCount || d.pages.length;
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
    { w: "2026.08 –", t: "Project Joseon · 팀 기획", d: "조선 판타지 탑뷰 액션. 아이템 49종, 전투·속성 체계, 캐릭터(무당·선비), 맵, UIUX 기획", g: 1 },
    { w: "2025.10 – 2026.01", t: "달콤소프트 · 운영 기획", d: "SuperStar 시리즈 라이브 서비스 개선안 기획, 점수 산출 로직 검증, 신규 시스템 도입 전 콘텐츠 테스트", g: 1 },
    { w: "2025.07 – 2026.01", t: "스트레인지 아일랜드 · 팀 (Unity)", d: "맵·아이템 기획, QA", g: 1 },
    { w: "2024 – 2025", t: "개인 기획서 작업", d: "오버워치2 신규 영웅, 원신 신규 보스, 림버스 컴퍼니 전투 기획서(인격·E.G.O), 아스가르드 폴 신규 모드, 테일즈런너 개선 기획서", g: 1 },
    { w: "2024.06 – 07", t: "보드게임 제작", d: "보드게임 카페를 돌며 수요층과 인기 장르를 조사, 특허를 통한 정식 출시를 목표로 제작", g: 1 },
    { w: "2024.08", t: "대구대학교 산림자원학과 졸업", d: "" },
    { w: "2023.12", t: "교내 캡스톤 대회 우수상", d: "" },
    { w: "2024.03 – 06", t: "대구직업전문학교 · 인턴", d: "행정" },
    { w: "2023.09 – 2024.02", t: "한국 청소년 체험 세상", d: "체험 프로그램 기획·운영" },
    { w: "2023.03 – 08", t: "㈜에버이엔씨 · 마케팅", d: "" },
    { w: "2022.05 – 2023.07", t: "오비맥주 · 신제품 홍보", d: "" },
    { w: "~ 2024", t: "현대백화점 · 이벤트 기획 스태프", d: "대기 줄 옆 행거 배치 제안" }
  ];  TIMELINE.sort((a, b) => b.w.replace(/[^0-9.]/g, " ").trim().split(/\s+/)[0].localeCompare(a.w.replace(/[^0-9.]/g, " ").trim().split(/\s+/)[0]));


  const ACHV = [
    { big: "LIVE", t: "달콤소프트 · SuperStar 시리즈", d: "라이브 서비스 개선안을 기획하고, 점수 산출 로직을 코드 테스트로 검증했습니다. 신규 시스템 'themeplay' 도입 전 콘텐츠 테스트를 맡았습니다." },
    { big: "×1.2", t: "현대백화점 · 행거 배치 제안", d: "이벤트 기획 스태프로 일하며 대기 줄 옆에 행거를 배치하자고 제안했고, 매출이 약 1.2배 늘었습니다." },
    { big: "×8", t: "블로그 마케팅 · 6개월 전담", d: "방문자 수를 8배로 늘렸고, 1억 원 규모 B2B 계약 체결에 기여했습니다." }
  ];

  /* 자기소개서 (2026.03) — 링크는 자기소개서 PDF에 걸린 원본 링크 그대로 */
  const LETTER_PDF = "https://drive.google.com/file/d/1YOwp8sBHujCVGqjmKeSPkcS6Vp6gIxGU/view?usp=sharing";
  const LETTER = [
    { k: "01 · 프로필 & 나의 노력", h: "재미를 분해하는 습관", p: [
      "여러 장르를 직접 플레이하며 핵심 재미, 시스템, BM, 조작감을 리뷰로 남깁니다. 게임 뉴스를 스크랩해 시장 트렌드와 유저 동향을 함께 봅니다.",
      "2024년에는 보드게임 카페를 직접 돌며 수요층과 인기 장르를 조사해 보드게임을 만들었고, 2025년부터는 Unity 팀 프로젝트에서 맵 동선·배치와 QA를 맡았습니다."
    ], links: [
      ["N", "게임 리뷰", "노션 · 플레이한 게임 분석", "https://www.notion.so/314c1342e11f809cb2b1e2abb4bcb34a?source=copy_link"],
      ["N", "게임 뉴스 스크랩", "노션 · 기사 요약과 기획자 관점 평가", "https://www.notion.so/314c1342e11f80fb9f1bdc77e817ad26?source=copy_link"],
      ["PDF", "팀 프로젝트 참여", "스트레인지 아일랜드 · Unity · 맵·아이템 기획", "https://drive.google.com/file/d/1zEZ9e29S3KzFOrEZQTkzvTfG4Pe1veZN/view?usp=sharing"],
      ["PDF", "보드게임 제작", "창작 · 수요 조사", "https://drive.google.com/file/d/1V0NM4Gp8b2TkJB7V0dHh-dZOG2nfIail/view?usp=sharing"]
    ] },
    { k: "02 · 작업물 소개", h: "기존 게임에 새 콘텐츠를 얹는 연습", p: [
      "원작의 규칙을 먼저 분석하고, 그 안에서 새 콘텐츠가 설 자리를 찾는 방식으로 기획서를 썼습니다. 림버스 컴퍼니는 기획서와 함께 데이터 테이블까지 만들었습니다."
    ], links: [
      ["PDF", "오버워치 신규 캐릭터", "신규 힐러 영웅 기획서 · 2024.03 기준", "https://drive.google.com/file/d/1hTsQkzpTS0nTeOEd9FquwBNMDyd0Hia1/view?usp=sharing"],
      ["PDF", "원신 신규 보스", "보스 기획서 · 2024.04 기준", "https://drive.google.com/file/d/1Ye6kY5oeJlRN58VWjsg_8-1baIatwgTN/view?usp=drive_link"],
      ["PDF", "림버스 컴퍼니 · 신규 인격", "전투 기획서", "https://drive.google.com/file/d/1RkD9e_qikzJ0Rv8Rm60oHN7cjbtL3_Zz/view?usp=sharing"],
      ["표", "림버스 컴퍼니 · 데이터 테이블", "인격 수치 테이블 · Google Sheets", "https://docs.google.com/spreadsheets/d/1vKzbgrPZM8aoS0spboptimiaCJ6sKiG3/edit?usp=drive_link"],
      ["폴더", "게임 분석 · 개선안", "테일즈런너 개선안 · 아스가르드 폴 신규 모드", "https://drive.google.com/drive/folders/1txIbPbRUl7rjOJAChjvF5g6DN9DyqBtb?usp=sharing"]
    ] },
    { k: "03 · 업무 성과", h: "현장에서 숫자로 확인한 제안", p: [
      "달콤소프트에서 SuperStar 시리즈 라이브 서비스 개선안을 기획하고 점수 산출 로직을 검증했습니다. 게임 밖에서도 현대백화점 행거 배치 제안으로 매출 약 1.2배, 블로그 마케팅으로 방문자 8배를 만들었습니다."
    ], links: [
      ["PDF", "업무 성과 자료", "게임 분석 · BM", "https://drive.google.com/file/d/1pYRTqgzR--ud9-5VTFH4w3K_mllYZK59/view?usp=drive_link"]
    ] },
    { k: "04 · 기획자가 된 이유", h: "기억에 남는 게임", p: [
      "창작자로서 콘텐츠를 만들고 유저의 반응에서 재미의 본질을 연구해 왔습니다. 입사 후에는 기획 감각을 실제 수익으로 연결하는 기획자가 되겠습니다."
    ], links: [] }
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
    { slug: "coreloop", t: "코어루프 기획서", s: "게임의 한 판이 도는 구조", grp: "Project Joseon" },
    { slug: "item-v1", t: "아이템 기획서 v1.0", s: "49종 · 인벤토리 인접 효과", grp: "Project Joseon", note: "상성(+20%/−15%) 규칙은 이후 전투 v2.0에서 폐기" },
    { slug: "combat-v2", t: "전투 시스템 · 속성 체계", s: "상성 제거 · 전투 공식", grp: "Project Joseon" },
    { slug: "effects", t: "Effects 시트 기획 의도", s: "이펙트 데이터 스키마", grp: "Project Joseon" },
    { slug: "mudang", t: "무당 캐릭터 기획", s: "각성 메커닉 · 체크시트", grp: "Project Joseon" },
    { slug: "seonbi", t: "선비 캐릭터 기획서", s: "캐릭터 · 모션 · 판정", grp: "Project Joseon" },
    { slug: "map", t: "맵 기획서", s: "스테이지 · 워프 · 동선", grp: "Project Joseon" },
    { slug: "enemy", t: "적 유닛 기획서", s: "몬스터 · 보스 패턴", grp: "Project Joseon" },
    { slug: "weapon", t: "무기 · 스킬 기획서", s: "무기별 판정과 스킬", grp: "Project Joseon" },
    { slug: "uiux", t: "UIUX 기획서", s: "의식판 화면 구성 · 조작", grp: "Project Joseon" },
    { slug: "ow2", t: "오버워치2 신규 힐러 영웅", s: "2024.03 기준 · 영웅 기획", grp: "개인 기획서" },
    { slug: "genshin", t: "원신 신규 보스", s: "2024.04 기준 · 보스 기획", grp: "개인 기획서" },
    { slug: "limbus", t: "림버스 컴퍼니 신규 인격", s: "전투 기획서 · 데이터 테이블", grp: "개인 기획서", table: "limbus-table", url2: ["데이터 테이블", "https://docs.google.com/spreadsheets/d/1vKzbgrPZM8aoS0spboptimiaCJ6sKiG3/edit?usp=drive_link"] },
    { slug: "analysis", t: "테일즈런너 개선 기획서", s: "2025 · 게임 분석 · 개선안", grp: "개인 기획서" },
    { slug: "asgard", t: "아스가르드 폴 오리진스 신규 모드", s: "2024.12 작성 · 라그나로크 모드", grp: "개인 기획서" },
    { slug: "teamproj", t: "스트레인지 아일랜드 (팀 프로젝트)", s: "Unity · 맵·아이템 기획", grp: "경험 · 성과" },
    { slug: "boardgame", t: "보드게임 제작", s: "2024 · 창작 · 수요 조사", grp: "경험 · 성과" },
    { slug: "work", t: "SSWO 분석서 (슈퍼스타 웨이크원)", s: "게임 분석 · BM · 자기소개서 업무 성과 항목 첨부", grp: "경험 · 성과" }
  ];

  /* 원본 링크 (자기소개서에 걸린 링크) */
  const LINKS = { ow2: "https://drive.google.com/file/d/1hTsQkzpTS0nTeOEd9FquwBNMDyd0Hia1/view?usp=sharing", genshin: "https://drive.google.com/file/d/1Ye6kY5oeJlRN58VWjsg_8-1baIatwgTN/view?usp=drive_link", limbus: "https://drive.google.com/file/d/1RkD9e_qikzJ0Rv8Rm60oHN7cjbtL3_Zz/view?usp=sharing", teamproj: "https://drive.google.com/file/d/1zEZ9e29S3KzFOrEZQTkzvTfG4Pe1veZN/view?usp=sharing", boardgame: "https://drive.google.com/file/d/1V0NM4Gp8b2TkJB7V0dHh-dZOG2nfIail/view?usp=sharing", work: "https://drive.google.com/file/d/1pYRTqgzR--ud9-5VTFH4w3K_mllYZK59/view?usp=drive_link", analysis: "https://drive.google.com/drive/folders/1txIbPbRUl7rjOJAChjvF5g6DN9DyqBtb?usp=sharing", asgard: "https://drive.google.com/drive/folders/1txIbPbRUl7rjOJAChjvF5g6DN9DyqBtb?usp=sharing" };
  const has = l => doc(l.slug) || info(l.slug).summary;

  /* ── small render helpers ── */
  const img = (src, alt, cls = "") => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}">`;
  function strip(slug, max = 99) {
    const d = doc(slug); if (!d) return "";
    return `<div class="strip">${d.pages.slice(0, max).map((p, i) => `<button class="page" data-lb="${d.slug}" data-i="${i}" type="button">${img(pageSrc(d, i), `${d.title} ${i + 1}쪽`)}<span>원본 ${srcNo(d, i)}쪽 / ${total(d)}</span></button>`).join("")}</div>`;
  }
  function shot(src, cap, lbKey, i) { return `<figure class="shot" ${lbKey ? `data-lb="${lbKey}" data-i="${i}"` : ""}>${img(src, cap)}<figcaption>${esc(cap)}</figcaption></figure>`; }
  function docPage(slug, i, cap) { const d = doc(slug); if (!d) return ""; i = Math.min(i, d.pages.length - 1); return `<figure class="shot" data-lb="${slug}" data-i="${i}">${img(pageSrc(d, i), cap || d.title)}<figcaption>${esc(cap || d.title + " · 원본 " + srcNo(d, i) + "쪽")}</figcaption></figure>`; }

  const SHOTS = {
    proto: (global.PROTO_SHOTS || [])
  };

  /* ═══════════ SECTIONS ═══════════ */
  const S = {};

  S.cover = () => {
    const pics = ["item-v1", "combat-v2", "coreloop"].map(s => doc(s)).filter(Boolean).slice(0, 3);
    const alt = ["mudang", "map", "asgard"].map(s => doc(s)).filter(Boolean);
    while (pics.length < 3 && alt.length) pics.push(alt.shift());
    return `<div class="cover">
      <div>
        <div class="eyebrow">PORTFOLIO · 2026</div>
        <h2>${esc(PROFILE.headline.replace("기획자", ""))}<em>기획자</em>, ${PROFILE.name}입니다.</h2>
        <p>게임을 플레이하면 재미의 구조부터 뜯어 봅니다. 그 분석을 기획서와 데이터 테이블로 옮기고, 필요하면 AI로 화면 목업까지 만들어 검증합니다.</p>
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
    <div class="card letter-head"><div><div class="eyebrow">자기소개서 · 2026.03</div><h3>덕력과 분석력을 가진 기획자 ${PROFILE.name}입니다</h3><p class="muted">01 프로필 & 노력 · 02 작업물 소개 · 03 업무 성과 · 04 기획자가 된 이유. 항목마다 자기소개서에 걸어 둔 원본 링크를 그대로 붙였습니다.</p></div>
      <a class="btn em" ${ext(LETTER_PDF)}>자기소개서 원본 PDF ↗</a></div>
    ${LETTER.map(l => `<article class="card letter-item ${l.links.length ? "" : "solo"}"><div><div class="eyebrow">${esc(l.k)}</div><h3>${esc(l.h)}</h3>${l.p.map(x => `<p>${esc(x)}</p>`).join("")}</div>
      ${l.links.length ? `<ul class="doclinks">${l.links.map(([ty, t, sub, u]) => `<li><a ${ext(u)}><span class="ty">${esc(ty)}</span><span class="tx"><b>${esc(t)}</b><small>${esc(sub)}</small></span><span class="go">↗</span></a></li>`).join("")}</ul>` : ""}</article>`).join("")}
    <blockquote class="pull" style="margin:0">${esc(PROFILE.goal)}<cite>— 자기소개서 · 기획자가 된 이유</cite></blockquote>
  </div>`;

  S.career = () => `<div class="card tl">${TIMELINE.map(r => `<div class="tl-row ${r.g ? "is-game" : ""}"><div class="when">${esc(r.w)}</div><span class="dot"></span><div><h4>${esc(r.t)}</h4>${r.d ? `<p>${esc(r.d)}</p>` : ""}</div></div>`).join("")}</div>
    <p class="note" style="margin-top:10px">채워진 점은 게임 관련 이력입니다.</p>`;

  S.achv = () => `<div class="achv">${ACHV.map(a => `<div class="card"><div class="big">${esc(a.big)}</div><h4>${esc(a.t)}</h4><p>${esc(a.d)}</p></div>`).join("")}</div>`;

  S.joseon = () => `<article class="card proj" data-proj="joseon">
    <div class="proj-top">
      <div><span class="chip em">TEAM · 조선 판타지</span>
        <h3>Project Joseon</h3>
        <p class="muted">조선을 배경으로 한 탑뷰 액션(하데스류 런 구조 프로토타입). 캐릭터의 강함은 레벨이 아니라 그리드 인벤토리 「의식판」에 무엇을 어떻게 붙이느냐로만 정해집니다. 2026년 8월 기획자로 합류해 아이템·데이터·전투 체계와 캐릭터, 맵, UIUX 문서를 맡고 있습니다.</p>
      </div>
      <div class="spec"><div><span>ROLE</span><span>시스템 · 아이템 · 캐릭터 기획</span></div><div><span>JOINED</span><span>2026.08</span></div><div><span>진영</span><span>조정 · 반란군 · 귀</span></div><div><span>속성</span><span>요력 · 기력 · 신력</span></div><div><span>ENGINE</span><span>언리얼 (팀 문서 기준)</span></div><div><span>조작</span><span>WASD · 마우스 · 1/2/3 · Tab</span></div></div>
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
      <div class="shelf wide">${LIB.filter(l => l.grp === "Project Joseon" && has(l)).map(bookHTML).join("")}</div>
    </div>
  </article>`;

  function bookHTML(l) {
    const d = doc(l.slug), m = info(l.slug), link = LINKS[l.slug];
    const pages = d ? (d.pages.length < total(d) ? `${total(d)}쪽 중 ${d.pages.length}쪽` : `${total(d)}쪽`) : "";
    return `<article class="book">
      ${d ? `<button class="cover" data-lb="${l.slug}" data-i="0" type="button" aria-label="${esc(l.t)} 넘겨 보기">${img(`assets/docs/${l.slug}/${d.pages[0]}`, l.t + " 표지")}<span class="peek">▶ 넘겨 보기</span></button>` : `<div class="cover ph" aria-hidden="true"><span>${esc(l.t)}</span><small>원본 PDF로 열람</small></div>`}
      <div class="meta"><small class="eyebrow">${esc(l.grp)}${m.updated ? ` · ${esc(String(m.updated).slice(0, 7).replace("-", "."))}` : ""}</small><b>${esc(l.t)}</b><small>${esc(l.s)}${pages ? " · " + pages : ""}</small>
        ${l.note ? `<p class="note-badge">${esc(l.note)}</p>` : ""}
        ${m.summary ? `<p class="sum">${esc(m.summary)}</p>` : ""}
        ${l.table && info(l.table).summary ? `<p class="table-note"><b>데이터 테이블</b> ${esc(info(l.table).summary)}</p>` : ""}
        ${m.points && m.points.length ? `<ul class="pts">${m.points.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <div class="acts">${d ? `<button class="btn em sm" data-lb="${l.slug}" data-i="0" type="button">페이지 보기</button>` : ""}${link ? `<a class="btn sm" ${ext(link)}>원본 ↗</a>` : ""}${l.url2 ? `<a class="btn sm" ${ext(l.url2[1])}>${esc(l.url2[0])} ↗</a>` : ""}</div></div></article>`;
  }

  S.others = () => `<div class="shelf wide">${LIB.filter(l => l.grp === "개인 기획서" && has(l)).map(bookHTML).join("")}</div>`;
  S.exp = () => `<div class="shelf wide">${LIB.filter(l => l.grp === "경험 · 성과" && has(l)).map(bookHTML).join("")}</div>`;

  S.process = () => {
    const P = global.PROTO_SHOTS || [];
    const steps = [
      { k: "플레이 & 분석", h: "재미를 분해해서 기록한다", p: `플레이한 게임을 인게임 · 아웃게임 · 재화 · BM으로 나눠 노션에 정리합니다. 지금까지 도감에 ${REVIEWS.length}종을 담았습니다. 분석에서 찾은 문제점이 신규 콘텐츠 제안서의 출발점이 됩니다.`, tools: ["Notion"], vis: docPage("asgard", 2, "문제점 분석 → 해결 방향 (아스가르드 폴 제안서)") },
      { k: "의도와 규칙", h: "한 줄 기획 의도부터 쓴다", p: "모든 아이템과 캐릭터에 기획 의도를 먼저 붙이고, 규칙은 그 의도를 지키는 방향으로만 추가합니다.", tools: ["Google Slides", "PowerPoint"], vis: docPage("item-v1", 1, "아이템 기획서 v1.0 · 기획 의도") },
      { k: "수치와 데이터", h: "공식과 테이블로 옮긴다", p: "장검 4~6을 기준점으로 수치를 파생하고, Effects 시트로 모든 효과를 한 형식의 데이터 행으로 적습니다. 팀 개발자가 바로 구현할 수 있는 형태가 목표입니다.", tools: ["Google Sheets", "Excel"], vis: docPage("combat-v2", 4, "전투 시스템 v2.0 · 속성과 공식") },
      { k: "화면으로 검증", h: "AI로 UI 목업을 만든다", p: "문서만으로 전달이 어려운 인벤토리 배치 규칙을 AI로 HTML 목업까지 만들어, 화면으로 바로 검토할 수 있게 했습니다.", tools: ["AI 코드 생성", "HTML"], vis: P[0] ? shot(P[0][0], "AI로 만든 인벤토리 UI 목업", "proto", 0) : docPage("uiux", 0) },
      { k: "팀 협업", h: "구현할 사람의 언어로 맞춘다", p: "팀 개발자의 스탯 공식에 맞춰 Effects 시트의 연산 순서를 6단계로 정렬하고, 적 유닛은 전조-판정-후딜 도해와 판정 반경까지 그려 개발자가 바로 구현할 수 있게 합니다.", tools: ["Discord", "Google Drive", "Notion"], vis: docPage("enemy", 3, "적 유닛 기획서 · 판정 도해") },
      { k: "검수와 회고", h: "스스로 약점을 적는다", p: "체크시트에 확정/미정 상태를 표시하고, 서사와 메커닉이 어긋나는 지점을 검수 메모로 남깁니다. 피드백을 받으면 버전을 올려 방향을 바꿉니다 (예: 전투 v1.0 상성 → v2.0 상성 제거).", tools: ["체크시트", "버전 관리"], vis: docPage("mudang", 1, "무당 캐릭터 체크시트 · 확정/미정 표시") }
    ];
    return `<div class="pipe">${steps.map(s => `<article class="card step"><div><span class="k">${esc(s.k)}</span><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p><div class="chips tools">${s.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div></div><div>${s.vis || ""}</div></article>`).join("")}</div>`;
  };

  S.library = () => {
    const groups = [...new Set(LIB.map(l => l.grp))];
    return groups.map(g => { const items = LIB.filter(l => l.grp === g && has(l)); if (!items.length) return ""; return `<h3 style="font-family:var(--f-pixel);font-weight:400;font-size:.9rem;color:var(--em);margin:18px 0 10px">${esc(g)}</h3><div class="shelf wide">${items.map(bookHTML).join("")}</div>`; }).join("");
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
    if (key === "proto") return (global.PROTO_SHOTS || []).map(s => ({ src: s[0], cap: s[1] }));
    const d = doc(key); if (!d) return [];
    return d.pages.map((p, i) => ({ src: pageSrc(d, i), cap: `${d.title} · 원본 ${srcNo(d, i)}쪽 / ${total(d)}${d.pages.length < total(d) ? ` (발췌 ${i + 1}/${d.pages.length})` : ""}` }));
  }

  /* ═══════════ 전시관 구성 ═══════════ */
  function docItem(slug, tag) {
    const l = LIB.find(x => x.slug === slug) || { t: slug, s: "" }, d = doc(slug), m = info(slug);
    if (!d && !m.summary) return null;
    const extra = (l.note ? `<p class="gc-note">${esc(l.note)}</p>` : "") + (l.table && info(l.table).summary ? `<p class="gc-note"><b>데이터 테이블</b> ${esc(info(l.table).summary)}</p>` : "") + (l.url2 ? `<p><a class="btn" ${ext(l.url2[1])}>${esc(l.url2[0])} 열기 ↗</a></p>` : "");
    return { kind: "doc", tag: tag || l.grp, title: l.t, meta: l.s + (d ? ` · ${d.pages.length < total(d) ? total(d) + "쪽 중 " + d.pages.length + "쪽" : total(d) + "쪽"}` : " · 원본 PDF로 열람"), img: d ? pageSrc(d, 0) : null, summary: m.summary, points: m.points, html: extra, lb: d ? slug : null, url: LINKS[slug] };
  }
  function halls() {
    const L = LETTER;
    return {
      seodang: { name: "서당 · 자기소개서관", sub: "자기소개서", intro: "기획자가 걸어온 길을 자기소개서 순서대로 걸어 두었습니다. 작품 앞에 서면 해설이 열립니다.", items: [
        { kind: "text", tag: "표지", title: PROFILE.headline, lede: PROFILE.name + " · 게임 기획자", summary: "자기소개서 표지 문장입니다. 게임을 하면 재미의 구조부터 분해하고, 그 분석을 기획서와 데이터로 옮기는 기획자입니다.", url: LETTER_PDF, meta: "자기소개서 원본 PDF" },
        ...L.map((x, i) => ({ kind: "text", tag: "자기소개서", title: x.h, lede: x.k, meta: x.k, summary: x.p.join(" "), html: x.links.length ? `<ul class="gc-links">${x.links.map(([ty, t, sub, u]) => `<li><a ${ext(u)}><span>${esc(ty)}</span>${esc(t)}</a></li>`).join("")}</ul>` : "" })),
        { kind: "text", tag: "목표", title: "기억에 남는 게임", lede: "기획자가 된 이유", summary: PROFILE.goal },
        { kind: "widget", tag: "연표", title: "경력 · 학력", lede: "2022 – 2026", summary: "달콤소프트 운영 기획, Unity 팀 프로젝트, 보드게임 제작, 그리고 지금의 Project Joseon까지.", open: "career", openLabel: "연표 펼치기" }
      ] },
      gongbang: { name: "공방 · Project Joseon관", sub: "조선 판타지 팀 프로젝트", intro: "조선을 배경으로 한 탑뷰 액션(하데스류 런 구조 프로토타입). 캐릭터의 강함은 레벨이 아니라 인벤토리 「의식판」에 무엇을 붙이느냐로 정해집니다.", items: [
        { kind: "text", tag: "프로젝트", title: "Project Joseon", lede: "2026.08 합류 · 팀 기획", summary: "조정 · 반란군 · 귀 세 진영이 등장하는 조선 판타지 탑뷰 액션입니다. 아이템 · 데이터 · 전투 체계, 캐릭터, 맵, UIUX 문서를 맡고 있습니다.", open: "joseon", openLabel: "프로젝트 자세히" },
        ...["coreloop", "item-v1", "combat-v2", "effects", "mudang", "seonbi", "map", "enemy", "weapon", "uiux"].map(x => docItem(x, "기획서")).filter(Boolean),
        (global.PROTO_SHOTS || [])[0] ? { kind: "doc", tag: "AI 목업", title: "AI로 만든 인벤토리 UI 목업", meta: "inventory_uiux.html · 2026.08", img: global.PROTO_SHOTS[0][0], summary: "UIUX 기획서의 의식판(인벤토리) 화면을 AI로 HTML 목업까지 만들어, 배치와 인접 규칙을 화면에서 바로 검토할 수 있게 했습니다.", lb: "proto" } : null,
        { kind: "widget", tag: "체험", title: "전투 공식 계산기", lede: "v2.0 공식 그대로", summary: "무기 공격력, 속성 수치, 상대 방어력을 바꾸면 평타 · 스킬 · 패링 · 봉인 수치가 바로 계산됩니다.", open: "joseon#combat", openLabel: "계산기 열기" },
        { kind: "widget", tag: "체험", title: "인벤토리 인접 효과 퍼즐", lede: "부적을 칼끝에", summary: "퇴마 아이템을 사인검 칼끝에 붙이면 공격력 +8%가 켜지는 인접 규칙을 직접 만져 볼 수 있습니다.", open: "joseon#item", openLabel: "퍼즐 열기" }
      ].filter(Boolean) },
      seogo: { name: "장서각 · 개인 기획서관", sub: "기존 게임에 새 콘텐츠를 얹은 기획서", intro: "원작의 규칙을 먼저 분석하고, 그 안에서 새 콘텐츠가 설 자리를 찾은 기획서들입니다.", items:
        ["ow2", "genshin", "limbus", "analysis", "asgard"].map(x => docItem(x, "개인 기획서")).filter(Boolean) },
      seoru: { name: "관아 · 경험과 성과관", sub: "현장에서 확인한 기획", intro: "팀 프로젝트, 보드게임 제작, 그리고 현장 업무에서 숫자로 확인한 제안들입니다.", items: [
        ...["teamproj", "boardgame", "work"].map(x => docItem(x, "경험")).filter(Boolean),
        ...ACHV.map(a => ({ kind: "text", tag: "성과", title: a.big, lede: a.t, meta: a.t, summary: a.d }))
      ] }
    };
  }

  global.PF = { halls, LETTER_PDF, PROFILE, TIMELINE, REVIEWS, NOTION, LIB, S, bind, images, doc, esc };
})(window);
