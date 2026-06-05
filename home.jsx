/* ============================================================
   HOME PAGE — cinematic video hero, stats, craftsmanship, featured
   ============================================================ */

const SEQ_COUNT = 40;
const SEQ_SRC = (i) => `assets/seq/seq-${String(i).padStart(2, "0")}.jpg`;

function HeroVideo({ t, lang, go, onProgress }) {
  const sectionRef = useRef(null);   // tall scroll track
  const canvasRef = useRef(null);
  const spotRef = useRef(null);
  const hintRef = useRef(null);
  const [loaded, setLoaded] = useState(0);

  // ===== image-sequence scrubber: scroll → frame index → canvas (no video seeking = no judder) =====
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // preload all frames
    const imgs = new Array(SEQ_COUNT);
    let done = 0;
    for (let i = 0; i < SEQ_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { done++; setLoaded(done); };
      img.onerror = () => { done++; setLoaded(done); };
      img.src = SEQ_SRC(i);
      imgs[i] = img;
    }

    let targetF = 0, currentF = 0, raf = null, running = true, lastDrawn = -1;

    const sizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      lastDrawn = -1; // force redraw
    };

    // cover-fit draw of frame n
    const draw = (n) => {
      const img = imgs[n];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
      let dw, dh, dx, dy;
      if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
      else { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawn = n;
    };

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const track = section.offsetHeight - window.innerHeight;
      const p = track > 0 ? Math.min(1, Math.max(0, -rect.top / track)) : 0;
      targetF = p * (SEQ_COUNT - 1);
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 4));
      if (onProgress) onProgress(p);
    };

    const tick = () => {
      if (!running) return;
      currentF += (targetF - currentF) * (reduce ? 1 : 0.16);
      if (Math.abs(targetF - currentF) < 0.05) currentF = targetF;
      const n = Math.max(0, Math.min(SEQ_COUNT - 1, Math.round(currentF)));
      if (n !== lastDrawn) draw(n);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => computeTarget();
    const onResize = () => { sizeCanvas(); computeTarget(); };

    sizeCanvas();
    computeTarget();
    // draw first frame as soon as it decodes
    if (imgs[0].complete) draw(0); else imgs[0].onload = () => { done++; setLoaded(done); draw(0); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // cursor-follow gold spotlight (desktop)
  const onPointerMove = (e) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.opacity = "1";
  };
  const onPointerLeave = () => { if (spotRef.current) spotRef.current.style.opacity = "0"; };

  return (
    <section ref={sectionRef} className="relative bg-night" style={{ height: "230vh" }}>
      <div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}
        className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        {/* background frame sequence — scrubbed by scroll (car rotates as you scroll) */}
        <canvas ref={canvasRef}
          className="absolute inset-0 w-full h-full gpu"
          style={{ filter: "saturate(1.04)", opacity: loaded > 0 ? 1 : 0, transition: "opacity 0.6s" }}
        />
        {/* loading shimmer until first frame ready */}
        {loaded === 0 && <div className="absolute inset-0 bg-night" />}

        {/* cursor spotlight */}
        <div ref={spotRef} className="absolute inset-0 pointer-events-none mix-blend-screen"
             style={{ opacity: 0, transition: "opacity 0.4s",
                      background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 40%), rgba(230,201,140,0.22), transparent 70%)" }} />

        {/* scrims for legibility */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "linear-gradient(180deg, rgba(8,9,12,0.72) 0%, rgba(8,9,12,0.12) 32%, rgba(8,9,12,0.20) 62%, rgba(8,9,12,0.92) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(60% 50% at 50% 78%, rgba(230,201,140,0.10), transparent 70%)" }} />

        {/* top content */}
        <div className="relative z-10 h-full max-w-[1300px] mx-auto px-6 flex flex-col">
          <div className="pt-28 md:pt-32 text-center">
            <div className="flex items-center justify-center gap-3 text-goldhi/90 font-mono text-[11px] md:text-xs tracking-[0.4em]">
              <span className="w-8 h-px bg-goldhi/50" />
              {t.hero.kicker}
              <span className="w-8 h-px bg-goldhi/50" />
            </div>
            <h1 className="font-display text-white mt-5 leading-[0.92]"
                style={{ fontSize: "clamp(40px, 8vw, 104px)", fontWeight: 500, textShadow: "0 10px 50px rgba(0,0,0,0.6)" }}>
              <span className="block">{t.hero.title1}</span>
              <span className="block italic gold-text" style={{ fontWeight: 500 }}>{t.hero.title2}</span>
            </h1>
          </div>

          {/* bottom content */}
          <div className="mt-auto pb-12 md:pb-16 text-center">
            <p className="text-white/80 max-w-xl mx-auto text-[15px] md:text-lg leading-relaxed"
               style={{ textWrap: "pretty", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}>
              {t.hero.sub}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              <button onClick={() => go("showroom")}
                className="group inline-flex items-center gap-2 bg-goldhi text-night font-medium px-7 py-3.5 rounded-full text-[15px] transition-transform hover:scale-[1.03] active:scale-95"
                style={{ boxShadow: "0 10px 34px -8px var(--gold-glow)" }}>
                {t.cta.explore}
                <IconArrow size={18} />
              </button>
              <button onClick={() => go("contact")}
                className="inline-flex items-center gap-2 text-white border border-white/30 px-7 py-3.5 rounded-full text-[15px] hover:bg-white/10 transition-colors backdrop-blur-sm">
                {t.cta.book}
              </button>
            </div>
            <div ref={hintRef} className="flex flex-col items-center gap-2 mt-10 transition-opacity duration-300">
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase">{t.hero.scroll}</span>
              <span className="w-px h-10 bg-gradient-to-b from-goldhi/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar({ t, lang }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section ref={ref} className="bg-night relative">
      <div className="hairline opacity-40" />
      <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
        {t.stats.map((s, i) => <StatItem key={i} s={s} lang={lang} start={inView} delay={i * 120} />)}
      </div>
    </section>
  );
}

function StatItem({ s, lang, start, delay }) {
  const v = useCountUp(s.value, { start, duration: 1700 });
  return (
    <div className="text-center reveal in" style={{ animationDelay: `${delay}ms` }}>
      <div className="font-display text-goldhi" style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 600 }}>
        {fmt(lang, v)}<span className="text-white/80">{s.suffix}</span>
      </div>
      <div className="font-mono text-white/55 text-[11px] md:text-xs tracking-[0.18em] uppercase mt-2">{s.label}</div>
    </div>
  );
}

function BrandMarquee({ t }) {
  const row = [...t.marquee, ...t.marquee];
  return (
    <section className="bg-charcoal py-7 overflow-hidden border-y border-white/5">
      <div className="flex gap-16 whitespace-nowrap"
           style={{ animation: "marquee 28s linear infinite", width: "max-content" }}>
        {row.map((b, i) => (
          <span key={i} className="font-display text-white/30 tracking-[0.2em] text-xl md:text-2xl">{b}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* Craftsmanship band — wheel detail video */
function CraftBand({ t, lang, go }) {
  return (
    <section className="bg-night text-white">
      <div className="max-w-[1300px] mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* video */}
        <div className="relative">
          <Reveal>
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-white/10"
                 style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.8)" }}>
              <video className="w-full h-full object-cover aspect-[4/3] gpu"
                src="assets/video2.mp4" autoPlay muted loop playsInline preload="metadata" />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: "linear-gradient(120deg, transparent 55%, rgba(230,201,140,0.12))" }} />
            </div>
          </Reveal>
          {/* floating badge */}
          <div className="absolute -bottom-5 -right-3 md:right-6 bg-goldhi text-night rounded-2xl px-5 py-3 font-display text-lg"
               style={{ boxShadow: "0 16px 40px -14px rgba(0,0,0,0.6)" }}>
            {t.craft.badge}
          </div>
        </div>

        {/* copy */}
        <Reveal delay={120}>
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-4">{t.craft.kicker}</div>
          <h2 className="font-display" style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 600, lineHeight: 1.04 }}>
            {t.craft.title}
          </h2>
          <p className="text-white/65 mt-5 leading-relaxed text-[15px] md:text-base max-w-md" style={{ textWrap: "pretty" }}>
            {t.craft.body}
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
            {t.craft.points.map((p, i) => (
              <div key={i} className="border-l border-white/15 pl-3">
                <div className="font-display text-goldhi text-2xl">{p.v}</div>
                <div className="font-mono text-white/50 text-[10px] tracking-[0.12em] uppercase mt-1">{p.l}</div>
              </div>
            ))}
          </div>
          <button onClick={() => go("services")}
            className="mt-9 inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
            {t.craft.cta} <IconArrow size={17} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   EXPLODED VIEW — scroll-scrub image sequence (car parts separate)
   ============================================================ */
const EXP_COUNT = 34;
const EXP_SRC = (i) => `assets/seq3/x-${String(i).padStart(2, "0")}.jpg`;

function ExplodedView({ t }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const imgs = new Array(EXP_COUNT);
    let done = 0;
    for (let i = 0; i < EXP_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { done++; setLoaded(done); if (i === 0) draw(0); };
      img.onerror = () => { done++; setLoaded(done); };
      img.src = EXP_SRC(i);
      imgs[i] = img;
    }

    let targetF = 0, currentF = 0, raf = null, running = true, lastDrawn = -1;

    const sizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      lastDrawn = -1;
    };

    // CONTAIN-fit: parts fly outward, so never crop
    const draw = (n) => {
      const img = imgs[n];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
      let dw, dh, dx, dy;
      if (cr > ir) { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
      else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawn = n;
    };

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const track = section.offsetHeight - window.innerHeight;
      const p = track > 0 ? Math.min(1, Math.max(0, -rect.top / track)) : 0;
      targetF = p * (EXP_COUNT - 1);
      setProg(p);
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 5));
    };

    const tick = () => {
      if (!running) return;
      currentF += (targetF - currentF) * (reduce ? 1 : 0.16);
      if (Math.abs(targetF - currentF) < 0.05) currentF = targetF;
      const n = Math.max(0, Math.min(EXP_COUNT - 1, Math.round(currentF)));
      if (n !== lastDrawn) draw(n);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => computeTarget();
    const onResize = () => { sizeCanvas(); computeTarget(); };

    sizeCanvas();
    computeTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const parts = t.exploded.parts;
  // reveal parts progressively between 25%..100% scroll
  const activeParts = parts.map((_, i) => prog >= 0.22 + (i / parts.length) * 0.7);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh", background: "linear-gradient(180deg, #f0eee8, #e7e4dc)" }}>
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden flex flex-col">
        {/* heading band */}
        <div className="relative z-20 pt-24 md:pt-28 px-6 text-center pointer-events-none">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.exploded.kicker}</div>
          <h2 className="font-display text-ink mx-auto max-w-3xl" style={{ fontSize: "clamp(28px,4.4vw,52px)", fontWeight: 600, lineHeight: 1.05 }}>
            {t.exploded.title}
          </h2>
        </div>

        {/* canvas stage */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full gpu"
                style={{ opacity: loaded > 0 ? 1 : 0, transition: "opacity 0.6s" }} />
        {loaded === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-inkmute text-xs tracking-[0.3em] animate-pulse">LOADING…</div>
          </div>
        )}

        {/* part labels — left column, revealed as you scroll */}
        <div className="relative z-20 mt-auto mb-10 px-6 w-full max-w-[1200px] mx-auto pointer-events-none">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {parts.map((p, i) => (
              <div key={i}
                   className="rounded-2xl border px-4 py-3 backdrop-blur-sm transition-all duration-500"
                   style={{
                     background: activeParts[i] ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.32)",
                     borderColor: activeParts[i] ? "var(--gold)" : "var(--line)",
                     opacity: activeParts[i] ? 1 : 0.45,
                     transform: activeParts[i] ? "translateY(0)" : "translateY(10px)",
                   }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
                        style={{ background: activeParts[i] ? "var(--gold)" : "var(--ink-mute)" }} />
                  <span className="font-display text-ink text-[15px] md:text-base">{p.l}</span>
                </div>
                <div className="font-mono text-inkmute text-[10px] tracking-[0.1em] uppercase mt-1 pl-3.5">{p.d}</div>
              </div>
            ))}
          </div>

          {/* progress rail + hint */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-px bg-line relative overflow-hidden rounded-full">
              <div className="absolute inset-y-0 left-0 bg-gold rounded-full" style={{ width: `${prog * 100}%` }} />
            </div>
            <span ref={hintRef} className="font-mono text-[10px] tracking-[0.2em] uppercase text-inkmute whitespace-nowrap transition-opacity duration-300">
              ↓ {t.exploded.hint}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedStrip({ t, lang, go, openCar }) {
  const picks = CARS.slice(0, 3);
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal className="text-center mb-12">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.featured.kicker}</div>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(30px,4.5vw,52px)", fontWeight: 600 }}>
            {t.featured.title}
          </h2>
          <p className="text-inksoft mt-3">{t.featured.sub}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {picks.map((car, i) => (
            <Reveal key={car.id} delay={i * 120}>
              <CarPhotoCard car={car} t={t} lang={lang} openCar={openCar} />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center mt-12">
          <button onClick={() => go("showroom")}
            className="inline-flex items-center gap-2 border border-ink/15 text-ink px-7 py-3.5 rounded-full hover:bg-ink hover:text-white transition-colors">
            {t.cta.explore} <IconArrow size={17} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Home({ t, lang, go, openCar, onHeroProgress }) {
  return (
    <div className="page-enter">
      <HeroVideo t={t} lang={lang} go={go} onProgress={onHeroProgress} />
      <StatsBar t={t} lang={lang} />
      <BrandMarquee t={t} />
      <CraftBand t={t} lang={lang} go={go} />
      <ExplodedView t={t} />
      <FeaturedStrip t={t} lang={lang} go={go} openCar={openCar} />
    </div>
  );
}

Object.assign(window, { Home });
