/* ============================================================
   SERVICES & FINANCING — tilt cards + loan calculator
   ============================================================ */

const SERVICE_ICONS = [
  (p) => <IconWallet {...p} />,
  (p) => <IconSwap {...p} />,
  (p) => <IconStar {...p} />,
  (p) => <IconShield {...p} />,
];

function TiltCard({ children }) {
  const tilt = useTilt(8);
  return (
    <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
         className="tilt bg-surface border border-line rounded-[var(--radius-lg)] p-7 h-full"
         style={{ boxShadow: "0 14px 44px -26px rgba(0,0,0,0.4)" }}>
      {children}
    </div>
  );
}

function LoanCalculator({ t, lang }) {
  const base = lang === "tr" ? 14500000 : 380000;
  const cur = lang === "tr" ? 50000 : 1000;
  const [price, setPrice] = useState(base);
  const [downPct, setDownPct] = useState(25);
  const [term, setTerm] = useState(48);
  const [rate, setRate] = useState(2.4);

  const down = price * (downPct / 100);
  const principal = price - down;
  const r = rate / 100;
  const monthly = r === 0 ? principal / term : (principal * r) / (1 - Math.pow(1 + r, -term));
  const total = monthly * term + down;

  // animated monthly value
  const mref = useRef(monthly);
  const [shown, setShown] = useState(monthly);
  useEffect(() => {
    const from = mref.current; const to = monthly; const t0 = performance.now(); const dur = 500;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick); else mref.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [monthly]);

  const Range = ({ label, value, min, max, step, onChange, display }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/55">{label}</span>
        <span className="font-mono text-goldhi text-sm font-bold">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="chrono-range w-full" />
    </div>
  );

  return (
    <div className="bg-night rounded-[var(--radius-lg)] p-7 md:p-9 border border-white/10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, var(--gold-glow), transparent 70%)", opacity: 0.4 }} />
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="font-display text-white text-2xl">{t.services.calc.title}</h3>
          <Range label={t.services.calc.price} value={price} min={base * 0.4} max={base * 2.2} step={cur}
                 onChange={setPrice} display={money(lang, price)} />
          <Range label={t.services.calc.down} value={downPct} min={10} max={70} step={1}
                 onChange={setDownPct} display={`%${downPct} · ${money(lang, down)}`} />
          <Range label={t.services.calc.term} value={term} min={12} max={72} step={6}
                 onChange={setTerm} display={`${term} ${lang === "tr" ? "ay" : "mo"}`} />
          <Range label={t.services.calc.rate} value={rate} min={0.8} max={4.5} step={0.1}
                 onChange={setRate} display={`%${rate.toFixed(1)}`} />
        </div>
        <div className="text-center md:text-left md:pl-8 md:border-l border-white/10">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50">{t.services.calc.monthly}</div>
          <div className="font-display text-goldhi mt-2" style={{ fontSize: "clamp(40px,6vw,68px)", fontWeight: 600 }}>
            {money(lang, shown)}
          </div>
          <div className="hairline my-5 opacity-50" />
          <div className="flex items-center justify-between text-white/70 text-sm">
            <span className="font-mono uppercase tracking-[0.12em] text-[11px]">{t.services.calc.total}</span>
            <span className="font-mono font-bold text-white">{money(lang, total)}</span>
          </div>
        </div>
      </div>
      <style>{`
        .chrono-range { -webkit-appearance:none; appearance:none; height:4px; border-radius:99px;
          background: linear-gradient(90deg, var(--gold-hi), var(--gold) 60%, rgba(255,255,255,0.12) 60%); outline:none; }
        .chrono-range::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%;
          background:#fff; border:3px solid var(--gold); cursor:pointer; box-shadow:0 0 12px var(--gold-glow); transition:transform .15s; }
        .chrono-range::-webkit-slider-thumb:active { transform:scale(1.2); }
        .chrono-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid var(--gold); cursor:pointer; }
      `}</style>
    </div>
  );
}

function Services({ t, lang }) {
  return (
    <div className="page-enter min-h-screen bg-bg pt-28 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.nav.services.toUpperCase()}</div>
          <h1 className="font-display text-ink" style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 600 }}>{t.services.title}</h1>
          <p className="text-inksoft mt-3">{t.services.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16" style={{ perspective: 1000 }}>
          {t.services.items.map((s, i) => {
            const Ic = SERVICE_ICONS[i];
            return (
              <Reveal key={i} delay={i * 90} className="h-full">
                <TiltCard>
                  <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center text-gold mb-5">
                    <Ic size={24} />
                  </div>
                  <h3 className="font-display text-xl text-ink">{s.t}</h3>
                  <p className="text-inksoft text-sm mt-2 leading-relaxed" style={{ textWrap: "pretty" }}>{s.d}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <LoanCalculator t={t} lang={lang} />
        </Reveal>
      </div>
    </div>
  );
}

Object.assign(window, { Services });
