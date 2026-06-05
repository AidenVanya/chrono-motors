/* ============================================================
   SHOWROOM — category filter + real-photo car cards
   ============================================================ */
import { useState } from 'react';
import { CARS, photo, money } from '../data';
import { HeartButton } from '../hooks';
import { IconPower, IconGauge, IconTop, IconArrow } from '../icons';

export function SpecPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-goldhi">{icon}</span>
      <span className="font-mono text-white text-sm font-bold leading-none">{value}</span>
      <span className="font-mono text-white/45 text-[9px] tracking-[0.15em] uppercase">{label}</span>
    </div>
  );
}

/* Shared photo card — used in Showroom grid AND Home featured */
export function CarPhotoCard({ car, t, lang, openCar, idx = 0 }) {
  return (
    <div onClick={() => openCar(car)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") openCar(car); }}
      className="car-card group relative w-full text-left bg-surface rounded-[var(--radius-lg)] overflow-hidden border border-line cursor-pointer"
      style={{ boxShadow: "0 14px 44px -24px rgba(0,0,0,0.4)", animationDelay: `${idx * 70}ms`, animation: "reveal-up 0.6s var(--ease) both" }}>
      {/* photo */}
      <div className="relative overflow-hidden aspect-[16/11] bg-charcoal2">
        <img src={photo(car.img, 760)} alt={`${car.brand} ${car.model}`} loading="lazy"
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07] gpu" />
        <div className="neon-back absolute inset-0"
             style={{ background: `linear-gradient(180deg, transparent 40%, ${car.c1}22 75%, ${car.c1}55)` }} />
        <div className="absolute inset-x-0 bottom-0 h-1/3"
             style={{ background: "linear-gradient(180deg, transparent, rgba(8,9,12,0.55))" }} />
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] uppercase text-night bg-goldhi/95 px-2.5 py-1 rounded-full">
          {t.cats[car.cat]}
        </span>
        <div className="absolute top-3 right-3">
          <HeartButton id={car.id} dark size={17} />
        </div>

        <div className="spec-panel absolute inset-x-0 bottom-0 bg-night/92 backdrop-blur-sm px-5 py-4 flex gap-2 border-t border-white/10">
          <SpecPill icon={<IconPower size={18} />} label={t.spec.power} value={`${car.hp}`} />
          <SpecPill icon={<IconGauge size={18} />} label={t.spec.accel} value={`${car.accel}s`} />
          <SpecPill icon={<IconTop size={18} />} label={t.spec.top} value={`${car.top}`} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <div className="font-mono text-[11px] tracking-[0.3em] text-gold uppercase">{car.brand}</div>
          <span className="font-mono text-inkmute text-xs">{car.year}</span>
        </div>
        <div className="font-display text-xl text-ink mt-0.5">{car.model}</div>
        <div className="hairline my-4 opacity-60" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-ink font-bold">{money(lang, lang === "tr" ? car.priceTRY : car.priceUSD)}</span>
          <span className="inline-flex items-center gap-1.5 text-gold text-sm font-medium group-hover:gap-2.5 transition-all">
            {t.cta.view} <IconArrow size={15} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function Showroom({ t, lang, openCar }) {
  const [cat, setCat] = useState("all");
  const cats = ["all", "hypercar", "sport", "sedan", "electric"];
  const list = cat === "all" ? CARS : CARS.filter((c) => c.cat === cat);

  return (
    <div className="page-enter min-h-screen bg-bg pt-28 pb-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="text-center mb-10">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.nav.showroom.toUpperCase()}</div>
          <h1 className="font-display text-ink" style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 600 }}>{t.showroom.title}</h1>
          <p className="text-inksoft mt-3">{t.showroom.sub}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
          {cats.map((c) => {
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)}
                className={`chip font-mono text-xs tracking-[0.16em] uppercase px-5 py-2.5 rounded-full border ${
                  active ? "bg-ink text-white border-ink" : "bg-surface text-inksoft border-line hover:border-gold hover:text-ink"
                }`}>
                {t.cats[c]}
              </button>
            );
          })}
        </div>
        <div className="text-center font-mono text-inkmute text-xs mb-10">
          {list.length} {t.showroom.results}
        </div>

        <div key={cat} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((car, i) => (
            <CarPhotoCard key={car.id} car={car} t={t} lang={lang} openCar={openCar} idx={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
