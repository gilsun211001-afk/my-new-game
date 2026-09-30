/* ═══════════════════════════════════════════════════════════
   전시관 — 건물에 들어가면 좌우로 걸으며 작품(기획서)을 감상하는 갤러리
   DOM 기반 · 카메라가 벽을 따라 이동 · 가까운 작품의 해설이 카드로 뜬다
   ═══════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const GAP = 440, START = 360;

  const G = {
    open: false, x: 0, vx: 0, dir: 3, frame: 0, anim: 0, keys: {}, hall: null, items: [], active: -1, raf: 0, last: 0, target: null,
    cb: {},
    init(cb) {
      this.cb = cb;
      const view = $("#galView");
      addEventListener("keydown", e => {
        if (!this.open || e.defaultPrevented || !$("#lb").hidden || !$("#scroll").hidden) return;
        const k = e.key;
        if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(k)) { this.keys[k.toLowerCase()] = true; this.target = null; e.preventDefault(); }
        else if (k === " " || k === "Enter" || k === "e") { e.preventDefault(); this.inspect(); }
        else if (k === "Escape") { e.preventDefault(); this.close(); }
      });
      addEventListener("keyup", e => { this.keys[e.key.toLowerCase()] = false; });
      addEventListener("blur", () => { this.keys = {}; });
      view.addEventListener("click", e => {
        const f = e.target.closest("[data-ex]"); if (!f) return;
        const i = +f.dataset.ex;
        if (i === this.active) this.inspect(); else this.target = this.items[i].x;
      });
      const hold = (id, key) => { const b = $(id); const on = e => { e.preventDefault(); this.keys[key] = true; this.target = null; }; const off = () => { this.keys[key] = false; }; b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off); };
      hold("#galL", "arrowleft"); hold("#galR", "arrowright");
      $("#galExit").onclick = () => this.close();
      $("#galPrev").onclick = () => this.jump(-1);
      $("#galNext").onclick = () => this.jump(1);
      // swipe on the wall
      let sx = null; view.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
      view.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) this.jump(dx < 0 ? 1 : -1); sx = null; });
      addEventListener("resize", () => this.open && this.render());
    },
    enter(hall) {
      this.hall = hall; this.open = true; this.items = hall.items.map((it, i) => Object.assign({}, it, { x: START + i * GAP }));
      this.len = START + (this.items.length - 1) * GAP + 420;
      this.x = 120; this._cam = undefined; this.dir = 3; this.active = -1; this.target = this.items[0] ? this.items[0].x : null;
      $("#galName").innerHTML = `${hall.name}<small>${hall.sub}</small>`;
      $("#galWall").innerHTML = `<div class="door" aria-hidden="true"><span>출구</span></div>` + this.items.map((it, i) => this.frameHTML(it, i)).join("") + `<div class="wall-end" style="left:${this.len - 60}px"></div>`;
      $("#galWall").style.width = this.len + "px";
      $("#gallery").hidden = false;
      this.banner(hall);
      this.last = 0; cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(t => this.loop(t));
      setTimeout(() => $("#galView").focus({ preventScroll: true }), 30);
    },
    frameHTML(it, i) {
      const cls = it.kind === "text" ? "frame text" : it.kind === "widget" ? "frame widget" : "frame";
      const inner = it.img ? `<img src="${it.img}" alt="${this.cb.esc(it.title)}" loading="lazy" decoding="async">`
        : `<div class="plate"><b>${this.cb.esc(it.title)}</b>${it.lede ? `<p>${this.cb.esc(it.lede)}</p>` : ""}</div>`;
      return `<figure class="ex ${it.tall ? "tall" : ""}" style="left:${it.x}px" data-ex="${i}">
        <div class="spot"></div><div class="${cls}">${inner}</div>
        <figcaption class="plaque"><span class="no">${String(i + 1).padStart(2, "0")}</span><b>${this.cb.esc(it.title)}</b><small>${this.cb.esc(it.meta || "")}</small></figcaption></figure>`;
    },
    banner(hall) {
      const b = $("#galBanner"); b.innerHTML = `<div class="eyebrow">${this.cb.esc(hall.sub)}</div><h3>${this.cb.esc(hall.name)}</h3><p>${this.cb.esc(hall.intro)}</p>`;
      b.hidden = false; b.classList.remove("out"); clearTimeout(this._bt); this._bt = setTimeout(() => b.classList.add("out"), 3200); setTimeout(() => { if (b.classList.contains("out")) b.hidden = true; }, 3900);
    },
    jump(d) { const n = Math.max(0, Math.min(this.items.length - 1, (this.active < 0 ? (d > 0 ? -1 : 0) : this.active) + d)); this.target = this.items[n].x; },
    loop(t) {
      if (!this.open) return;
      this.raf = requestAnimationFrame(tt => this.loop(tt));
      const dt = Math.min(.05, this.last ? (t - this.last) / 1000 : 0); this.last = t;
      let v = 0; if (this.keys.arrowleft || this.keys.a) v -= 1; if (this.keys.arrowright || this.keys.d) v += 1;
      if (!v && this.target !== null) { const d = this.target - this.x; if (Math.abs(d) < 6) { this.x = this.target; this.target = null; } else v = Math.sign(d) * Math.min(1, Math.abs(d) / 60 + .35); }
      if (v) { this.x = Math.max(60, Math.min(this.len - 120, this.x + v * 300 * dt)); this.dir = v < 0 ? 2 : 3; this.anim += dt * 9; this.frame = Math.floor(this.anim) % 2; if (Math.floor(this.anim) !== this._ls) { this._ls = Math.floor(this.anim); this.cb.step && this._ls % 2 === 0 && this.cb.step(); } }
      else this.frame = 0;
      if (this.x <= 62 && v < 0) { this.close(); return; }
      // nearest exhibit
      let best = -1, bd = 190; this.items.forEach((it, i) => { const d = Math.abs(it.x - this.x); if (d < bd) { bd = d; best = i; } });
      if (best !== this.active) this.setActive(best);
      this.render();
    },
    render() {
      const vw = $("#galView").clientWidth;
      const bias = vw > 760 && this.active >= 0 ? .36 : .5;
      this._cam = this._cam === undefined ? this.x - vw * bias : this._cam + ((this.x - vw * bias) - this._cam) * .12;
      const cam = Math.max(0, Math.min(this.len - vw, this._cam));
      $("#galWall").style.transform = `translate3d(${-Math.round(cam)}px,0,0)`;
      const hero = $("#galHero"); hero.style.transform = `translate3d(${Math.round(this.x - cam - 40)}px,0,0)`;
      if (this._hf !== this.frame + ":" + this.dir) { this._hf = this.frame + ":" + this.dir; const g = hero.getContext("2d"); g.imageSmoothingEnabled = false; g.clearRect(0, 0, hero.width, hero.height); g.setTransform(5, 0, 0, 5, 0, 0); World.person(g, 0, 0, this.dir, this.frame, this.cb.style); g.setTransform(1, 0, 0, 1, 0, 0); }
    },
    setActive(i) {
      this.active = i;
      document.querySelectorAll("#galWall .ex").forEach((el, j) => el.classList.toggle("on", j === i));
      const c = $("#galCard");
      if (i < 0) { c.classList.remove("show"); return; }
      const it = this.items[i];
      c.innerHTML = `<div class="gc-head"><span class="no">${String(i + 1).padStart(2, "0")} / ${this.items.length}</span><span class="kind">${this.cb.esc(it.tag || "")}</span></div>
        <h4>${this.cb.esc(it.title)}</h4>${it.meta ? `<p class="meta">${this.cb.esc(it.meta)}</p>` : ""}
        ${it.summary ? `<p class="sum">${this.cb.esc(it.summary)}</p>` : ""}
        ${it.points && it.points.length ? `<ul>${it.points.slice(0, 4).map(p => `<li>${this.cb.esc(p)}</li>`).join("")}</ul>` : ""}
        ${it.html || ""}
        <div class="gc-act">${it.lb ? `<button class="btn em" type="button" data-gact="lb">▶ 페이지 넘겨 보기</button>` : ""}${it.open ? `<button class="btn em" type="button" data-gact="open">${this.cb.esc(it.openLabel || "자세히 보기")}</button>` : ""}${it.url ? `<a class="btn" href="${it.url}" target="_blank" rel="noopener">원본 열기 ↗</a>` : ""}</div>`;
      c.classList.add("show");
      c.querySelectorAll("[data-gact]").forEach(b => b.onclick = () => this.inspect(b.dataset.gact));
      this.cb.move && this.cb.move();
    },
    inspect(which) {
      const it = this.items[this.active]; if (!it) return;
      if ((which === "lb" || !which) && it.lb) return this.cb.lightbox(it.lb, 0);
      if ((which === "open" || !which) && it.open) return this.cb.openPanel(it.open);
      if (!which && it.url) window.open(it.url, "_blank", "noopener");
    },
    close() {
      if (!this.open) return; this.open = false; cancelAnimationFrame(this.raf); this.keys = {};
      $("#gallery").hidden = true; $("#galCard").classList.remove("show");
      this.cb.exit && this.cb.exit(this.hall);
    }
  };
  global.Gallery = G;
})(window);
