/* ============================================================
   APP SHELL — nav, language toggle, router, footer, mount
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CARS, I18N, photo, money } from './data';
import { Logo, IconHeart, IconMenu, IconClose, IconArrow, IconTrash, IconPhone, IconMail, IconGlobe } from './icons';
import { useFavorites, ScrollProgress } from './hooks';
import { Home } from './pages/Home';
import { Showroom } from './pages/Showroom';
import { CarDetail } from './pages/Detail';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';

function Nav({ page, go, lang, setLang, t, openGarage, heroDone }) {
  const [open, setOpen] = useState(false);
  // heroDone is pre-computed in App: true = show solid nav, false = transparent dark nav
  const onDark = !heroDone;
  const { count } = useFavorites();

  const links = [
    ["home", t.nav.home],
    ["showroom", t.nav.showroom],
    ["services", t.nav.services],
    ["contact", t.nav.contact],
  ];

  const txt = onDark ? "text-white" : "text-ink";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      onDark ? "bg-transparent" : "nav-glass border-b border-line"}`}
      style={ onDark ? {} : { background: "rgba(246,245,241,0.82)" } }>
      <div className="max-w-[1300px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <button onClick={() => go("home")} className="shrink-0">
          <Logo light={onDark} size={36} />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => go(id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                page === id ? "text-gold" : `${txt} hover:text-gold`}`}>
              {label}
              {page === id && <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gold" />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-full border overflow-hidden text-xs font-mono ${
            onDark ? "border-white/20" : "border-line"}`}>
            {["tr", "en"].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 uppercase tracking-[0.1em] transition-colors ${
                  lang === l ? "bg-goldhi text-night" : `${txt} hover:text-gold`}`}>
                {l}
              </button>
            ))}
          </div>

          <button onClick={() => go("contact")}
            className="hidden sm:inline-flex items-center gap-1.5 bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-night transition-colors">
            {t.cta.book}
          </button>

          <button onClick={openGarage} aria-label={t.garage.title}
            className={`relative grid place-items-center w-10 h-10 rounded-full border transition-colors ${
              onDark ? "border-white/20 text-white hover:bg-white/10" : "border-line text-ink hover:border-gold"}`}>
            <IconHeart size={19} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-goldhi text-night font-mono text-[10px] font-bold"
                    style={{ animation: "reveal-up 0.3s var(--ease) both" }}>
                {count}
              </span>
            )}
          </button>

          <button onClick={() => setOpen(true)} className={`md:hidden ${txt}`} aria-label="menu">
            <IconMenu size={26} />
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-[200] md:hidden overflow-hidden" onClick={() => setOpen(false)}>
          {/* backdrop */}
          <div className="absolute inset-0 bg-night/55 backdrop-blur-sm"
               style={{ animation: "x-fade 0.25s both" }} />

          {/* panel — slides in from right, fully above the page */}
          <div className="absolute top-0 right-0 bottom-0 w-[82%] max-w-[320px] bg-surface flex flex-col"
               style={{ boxShadow: "-24px 0 80px rgba(0,0,0,0.28)", animation: "slide-from-right 0.32s var(--ease) both" }}
               onClick={(e) => e.stopPropagation()}>

            {/* header — same height as navbar */}
            <div className="h-[72px] flex items-center justify-between px-5 border-b border-line shrink-0">
              <Logo size={30} />
              <button onClick={() => setOpen(false)}
                className="w-9 h-9 grid place-items-center rounded-full text-inksoft hover:text-ink hover:bg-surface2 transition-colors">
                <IconClose size={20} />
              </button>
            </div>

            {/* nav links */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {links.map(([id, label]) => {
                const isActive = page === id || (page === "detail" && id === "showroom");
                return (
                  <button key={id} onClick={() => { go(id); setOpen(false); }}
                    className={`w-full text-left flex items-center justify-between px-4 py-3.5 rounded-2xl font-display text-xl mb-1 transition-colors ${
                      isActive ? "text-gold bg-goldhi/10" : "text-ink hover:bg-surface2"
                    }`}>
                    {label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                  </button>
                );
              })}
            </nav>

            {/* language toggle */}
            <div className="px-5 pb-4 flex items-center gap-2">
              {["tr", "en"].map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 py-2 rounded-full font-mono text-xs tracking-[0.12em] uppercase border transition-colors ${
                    lang === l ? "bg-ink text-white border-ink" : "text-inksoft border-line hover:border-gold"
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-8 shrink-0">
              <button onClick={() => { go("contact"); setOpen(false); }}
                className="w-full inline-flex items-center justify-center gap-2 bg-ink text-white font-medium px-6 py-3.5 rounded-full hover:bg-night transition-colors">
                {t.cta.book} <IconArrow size={17} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

function Footer({ t, go, lang }) {
  const links = [
    ["home", t.nav.home], ["showroom", t.nav.showroom],
    ["services", t.nav.services], ["contact", t.nav.contact],
  ];
  return (
    <footer className="bg-night text-white pt-16 pb-8">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-12">
          <div>
            <Logo light size={40} />
            <p className="text-white/55 mt-5 max-w-sm leading-relaxed">{t.footer.tag}</p>
            <div className="flex gap-3 mt-6">
              <a className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-goldhi hover:border-goldhi/50 transition-colors" href="#"><IconPhone size={18} /></a>
              <a className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-goldhi hover:border-goldhi/50 transition-colors" href="#"><IconMail size={18} /></a>
              <a className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-goldhi hover:border-goldhi/50 transition-colors" href="#"><IconGlobe size={18} /></a>
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-4">{t.footer.links}</div>
            <ul className="space-y-2.5">
              {links.map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => go(id)} className="text-white/65 hover:text-white transition-colors text-sm">{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-4">{t.contact.addr}</div>
            <p className="text-white/65 text-sm leading-relaxed">{t.contact.addrVal}</p>
            <p className="text-white/65 text-sm mt-3 font-mono">+90 212 000 00 00</p>
            <p className="text-white/65 text-sm font-mono">hello@chronomotors.co</p>
          </div>
        </div>
        <div className="hairline opacity-30" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-white/40 text-xs font-mono">
          <span>© {new Date().getFullYear()} CHRONO MOTORS — {t.footer.rights}</span>
          <span>{t.footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}

function GarageDrawer({ open, onClose, t, lang, openCar, go }) {
  const { ids, remove, count } = useFavorites();
  const cars = CARS.filter((c) => ids.has(c.id));

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose}
        className="absolute inset-0 bg-night/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }} />

      <aside
        className="absolute top-0 right-0 bottom-0 w-[90%] max-w-md bg-bg flex flex-col"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)",
                 transition: "transform 0.5s var(--ease)", boxShadow: "-30px 0 80px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="text-gold"><IconHeart size={22} /></span>
            <div>
              <div className="font-display text-xl text-ink leading-none">{t.garage.title}</div>
              <div className="font-mono text-[11px] text-inkmute mt-1">{count} {t.garage.count}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-inksoft hover:text-ink p-2"><IconClose size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
          {cars.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-surface2 grid place-items-center text-inkmute mb-5">
                <IconHeart size={28} />
              </div>
              <p className="font-display text-xl text-ink">{t.garage.empty}</p>
              <p className="text-inksoft text-sm mt-2 max-w-[220px]" style={{ textWrap: "pretty" }}>{t.garage.emptyHint}</p>
              <button onClick={() => { onClose(); go("showroom"); }}
                className="mt-6 inline-flex items-center gap-2 bg-ink text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-night transition-colors">
                {t.garage.browse} <IconArrow size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cars.map((c) => (
                <div key={c.id}
                  className="group flex items-center gap-4 bg-surface border border-line rounded-2xl p-3 hover:border-gold transition-colors"
                  style={{ animation: "reveal-up 0.4s var(--ease) both" }}>
                  <button onClick={() => openCar(c)} className="shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-charcoal2">
                    <img src={photo(c.img, 280)} alt={`${c.brand} ${c.model}`}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </button>
                  <button onClick={() => openCar(c)} className="flex-1 text-left min-w-0">
                    <div className="font-mono text-[9px] tracking-[0.24em] text-gold uppercase truncate">{c.brand}</div>
                    <div className="font-display text-base text-ink truncate">{c.model}</div>
                    <div className="font-mono text-ink text-sm font-bold mt-0.5">{money(lang, lang === "tr" ? c.priceTRY : c.priceUSD)}</div>
                  </button>
                  <button onClick={() => remove(c.id)} aria-label={t.garage.remove}
                    className="shrink-0 w-9 h-9 grid place-items-center rounded-full text-inkmute hover:text-red-500 hover:bg-red-50 transition-colors">
                    <IconTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cars.length > 0 && (
          <div className="px-5 py-4 border-t border-line">
            <button onClick={() => { onClose(); go("contact"); }}
              className="w-full inline-flex items-center justify-center gap-2 bg-goldhi text-night font-medium px-6 py-3.5 rounded-full hover:scale-[1.02] transition-transform">
              {t.cta.book} <IconArrow size={17} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState("tr");
  const [page, setPage] = useState("home");
  const [car, setCar] = useState(null);
  const [garageOpen, setGarageOpen] = useState(false);
  const [heroDone, setHeroDone] = useState(false);
  const [contactHeroDone, setContactHeroDone] = useState(false);
  const heroDoneRef = useRef(false);
  const t = I18N[lang];

  const setDone = (done) => {
    if (done !== heroDoneRef.current) { heroDoneRef.current = done; setHeroDone(done); }
  };
  const onHeroProgress = (p) => setDone(p >= 0.96);

  useEffect(() => {
    // Reset contact hero state when navigating to contact page
    if (page === "contact") setContactHeroDone(false);

    const onScroll = () => {
      if (page === "home") {
        const hero = document.querySelector("main section");
        if (!hero) return;
        const end = hero.offsetTop + hero.offsetHeight - window.innerHeight - 8;
        setDone(window.scrollY >= end);
      } else if (page === "contact") {
        // Contact hero is ~300px tall — transition nav to solid after scrolling past it
        setContactHeroDone(window.scrollY > 260);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [page]);

  const go = (p) => { setDone(false); setPage(p); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); };
  const openCar = (c) => { setCar(c); setPage("detail"); setGarageOpen(false); window.scrollTo({ top: 0 }); };
  const back = () => { setPage("showroom"); window.scrollTo({ top: 0 }); };

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Momentum coasting: tracks scroll velocity and extends the glide after the user
  // stops scrolling. Uses passive scroll events — never blocks native scroll.
  useEffect(() => {
    let prevY = window.scrollY;
    let prevT = performance.now();
    let vel = 0;
    let raf = null;
    let coasting = false;
    let stopTimer = null;

    const stopCoast = () => {
      coasting = false;
      vel = 0;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };

    const coast = () => {
      vel *= 0.82; // friction — higher = longer glide
      if (Math.abs(vel) < 0.8) { stopCoast(); return; }
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const next = Math.max(0, Math.min(maxY, window.scrollY + vel));
      if (next === window.scrollY) { stopCoast(); return; }
      window.scrollTo(0, next);
      raf = requestAnimationFrame(coast);
    };

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - prevY;

      if (coasting) {
        // Navigation jump or direction reversal → give control back immediately
        if (Math.abs(dy) > 150 || (dy !== 0 && Math.sign(dy) !== Math.sign(vel))) {
          stopCoast();
        }
        prevY = window.scrollY;
        prevT = now;
        return;
      }

      const dt = now - prevT;
      if (dt > 0 && dt < 200) {
        const raw = (dy / dt) * (1000 / 60); // px per frame at 60 fps
        vel = vel * 0.35 + raw * 0.65;        // exponential moving average
      }
      prevY = window.scrollY;
      prevT = now;

      // Start coasting 80 ms after the last scroll event
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (Math.abs(vel) > 3) {
          coasting = true;
          raf = requestAnimationFrame(coast);
        } else {
          vel = 0;
        }
      }, 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      stopCoast();
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div>
      <ScrollProgress />
      <Nav page={page} go={go} lang={lang} setLang={setLang} t={t} openGarage={() => setGarageOpen(true)}
           heroDone={(page === "home" && heroDone) || (page === "contact" && contactHeroDone) || (page !== "home" && page !== "contact")} />
      <main>
        {page === "home"     && <Home key="home" t={t} lang={lang} go={go} openCar={openCar} onHeroProgress={onHeroProgress} />}
        {page === "showroom" && <Showroom key="sr" t={t} lang={lang} openCar={openCar} />}
        {page === "detail"   && <CarDetail key={car ? car.id : "d"} car={car} t={t} lang={lang} openCar={openCar} back={back} />}
        {page === "services" && <Services key="sv" t={t} lang={lang} />}
        {page === "contact"  && <Contact key="ct" t={t} lang={lang} />}
      </main>
      <Footer t={t} go={go} lang={lang} />
      <GarageDrawer open={garageOpen} onClose={() => setGarageOpen(false)} t={t} lang={lang} openCar={openCar} go={go} />
    </div>
  );
}

export default App;
