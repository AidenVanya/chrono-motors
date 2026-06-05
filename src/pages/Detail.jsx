/* ============================================================
   CAR DETAIL — real photo stage, interactive hotspots, zoom gallery
   ============================================================ */
import { useState } from 'react';
import { CARS, photo, money } from '../data';
import { HeartButton } from '../hooks';
import { IconPower, IconGauge, IconTop, IconCal, IconArrow, IconArrowL, IconClose } from '../icons';

const HOTSPOTS = [
  { x: "70%", y: "60%", i: 0 },
  { x: "46%", y: "40%", i: 1 },
  { x: "30%", y: "74%", i: 2 },
  { x: "84%", y: "56%", i: 3 },
];

export function CarDetail({ car, t, lang, openCar, back }) {
  const [active, setActive] = useState(null);
  const [view, setView] = useState(0);
  if (!car) return null;

  const views = [
    { label: t.detail.views[0], pos: "50% 50%", scale: 1 },
    { label: t.detail.views[1], pos: "20% 62%", scale: 1.7 },
    { label: t.detail.views[2], pos: "82% 68%", scale: 1.9 },
  ];
  const v = views[view];

  const specs = [
    { icon: <IconPower size={22} />, label: t.spec.power, value: `${car.hp} HP` },
    { icon: <IconGauge size={22} />, label: t.spec.accel, value: `${car.accel} s` },
    { icon: <IconTop size={22} />, label: t.spec.top, value: `${car.top} km/h` },
    { icon: <IconCal size={22} />, label: t.spec.year, value: `${car.year}` },
  ];

  return (
    <div className="page-enter min-h-screen bg-bg pt-24 pb-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <button onClick={back}
          className="inline-flex items-center gap-2 text-inksoft hover:text-ink font-mono text-xs tracking-[0.16em] uppercase mb-8 transition-colors">
          <IconArrowL size={16} /> {t.detail.back}
        </button>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
          {/* Photo stage with hotspots */}
          <div>
            <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-line bg-charcoal2 aspect-[16/10]">
              <img src={photo(car.img, 1500)} alt={`${car.brand} ${car.model}`}
                   className="absolute inset-0 w-full h-full object-cover gpu"
                   style={{ objectPosition: v.pos, transform: `scale(${v.scale})`, transition: "transform 0.8s var(--ease), object-position 0.8s var(--ease)" }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: "radial-gradient(80% 80% at 50% 40%, transparent 55%, rgba(8,9,12,0.4))" }} />

              {view === 0 && HOTSPOTS.map((h) => (
                <button key={h.i} onClick={() => setActive(active === h.i ? null : h.i)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: h.x, top: h.y }} aria-label={t.detail.hotspots[h.i].t}>
                  <span className="relative block w-5 h-5">
                    <span className="hotspot-pulse absolute inset-0" />
                    <span className={`absolute inset-0 rounded-full border-2 transition-colors ${
                      active === h.i ? "bg-goldhi border-goldhi" : "bg-goldhi/90 border-white/70"
                    }`} style={{ boxShadow: "0 0 14px var(--gold-glow)" }} />
                    <span className="absolute inset-[6px] rounded-full bg-night" />
                  </span>
                </button>
              ))}

              {active !== null && view === 0 && (
                <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-4 w-[88%] max-w-sm"
                     style={{ animation: "reveal-up 0.35s var(--ease) both" }}>
                  <div className="bg-night/95 backdrop-blur border border-goldhi/30 rounded-2xl p-5 text-left"
                       style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-display text-goldhi text-lg">{t.detail.hotspots[active].t}</div>
                      <button onClick={() => setActive(null)} className="text-white/50 hover:text-white"><IconClose size={18} /></button>
                    </div>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">{t.detail.hotspots[active].d}</p>
                  </div>
                </div>
              )}

              {view === 0 && (
                <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.22em] text-white/80 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
                  {t.detail.hotspotHint}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {views.map((vw, i) => (
                <button key={i} onClick={() => { setView(i); setActive(null); }}
                  className={`relative flex-1 h-20 rounded-xl border overflow-hidden transition-all ${
                    view === i ? "border-gold ring-2 ring-gold/30" : "border-line opacity-70 hover:opacity-100"}`}>
                  <img src={photo(car.img, 360)} alt="" className="w-full h-full object-cover"
                       style={{ objectPosition: vw.pos, transform: `scale(${Math.min(vw.scale, 1.5)})` }} />
                  <span className="absolute bottom-1 left-1.5 font-mono text-[9px] tracking-[0.12em] uppercase text-white bg-black/50 px-1.5 py-0.5 rounded">{vw.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info column */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs tracking-[0.3em] text-gold uppercase">{car.brand}</div>
                <h1 className="font-display text-ink mt-1" style={{ fontSize: "clamp(34px,5vw,56px)", fontWeight: 600 }}>{car.model}</h1>
              </div>
              <div className="shrink-0 mt-1"><HeartButton id={car.id} size={22} /></div>
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="font-mono text-2xl text-ink font-bold">{money(lang, lang === "tr" ? car.priceTRY : car.priceUSD)}</span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-night bg-goldhi px-2.5 py-1 rounded-full">{t.cats[car.cat]}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-7">
              {specs.map((s, i) => (
                <div key={i} className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-gold">{s.icon}</span>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-inkmute">{s.label}</div>
                    <div className="font-display text-lg text-ink leading-tight">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-inksoft mt-6 leading-relaxed text-[15px]" style={{ textWrap: "pretty" }}>
              {t.detail.hotspots[0].d} {t.detail.hotspots[2].d}
            </p>

            <button onClick={back}
              className="w-full mt-7 inline-flex items-center justify-center gap-2 bg-ink text-white font-medium px-7 py-4 rounded-full hover:bg-night transition-colors"
              style={{ boxShadow: "0 14px 34px -16px rgba(0,0,0,0.5)" }}>
              {t.detail.reserve} <IconArrow size={18} />
            </button>

            <div className="mt-8">
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-inkmute mb-3">{t.featured.kicker}</div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                {CARS.filter((c) => c.id !== car.id).slice(0, 5).map((c) => (
                  <button key={c.id} onClick={() => { openCar(c); }}
                    className="shrink-0 w-44 bg-surface border border-line rounded-2xl overflow-hidden text-left hover:border-gold transition-colors">
                    <div className="aspect-[16/11] overflow-hidden bg-charcoal2">
                      <img src={photo(c.img, 380)} alt={`${c.brand} ${c.model}`} loading="lazy"
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <div className="font-mono text-[9px] tracking-[0.2em] text-gold uppercase">{c.brand}</div>
                      <div className="font-display text-sm text-ink">{c.model}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
