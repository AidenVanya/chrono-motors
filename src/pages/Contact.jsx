/* ============================================================
   CONTACT & VIP APPOINTMENT
   ============================================================ */
import { useState } from 'react';
import { Reveal } from '../hooks';
import { IconPin, IconClock, IconPhone, IconArrow, IconCheck, IconMail, IconGlobe } from '../icons';

/* ── small reusable field ─────────────────────────────────── */
function Field({ label, type = "text", textarea = false, value, onChange, delay = 0 }) {
  return (
    <div className="field" style={{ animation: `reveal-up 0.5s var(--ease) ${delay}ms both` }}>
      <label>{label}</label>
      {textarea
        ? <textarea value={value} onChange={onChange} rows={4} />
        : <input type={type} value={value} onChange={onChange} />}
      <span className="underline" />
    </div>
  );
}

/* ── topic chip row ───────────────────────────────────────── */
function TopicChips({ topics, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {topics.map((topic) => (
        <button key={topic} type="button" onClick={() => onChange(topic)}
          className={`chip font-mono text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-full border transition-all ${
            value === topic
              ? "bg-ink text-white border-ink"
              : "text-inksoft border-line hover:border-gold hover:text-ink"
          }`}>
          {topic}
        </button>
      ))}
    </div>
  );
}

/* ── map card ─────────────────────────────────────────────── */
function MapCard({ t }) {
  return (
    <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-white/10 h-full min-h-[300px]"
         style={{ background: "linear-gradient(160deg,#12161c,#0b0c10)" }}>
      {/* grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }} preserveAspectRatio="none">
        <defs>
          <pattern id="cgrid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="var(--gold-hi)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cgrid)" />
      </svg>
      {/* diagonal road */}
      <div className="absolute inset-0"
           style={{ background:"linear-gradient(115deg,transparent 44%,rgba(230,201,140,.12) 45%,rgba(230,201,140,.12) 49%,transparent 50%)" }} />
      {/* glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background:"radial-gradient(50% 50% at 50% 45%,rgba(230,201,140,.08),transparent)" }} />

      {/* pin + radar */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="radar-wave    absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-goldhi/50" />
          <span className="radar-wave d2 absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-goldhi/50" />
          <div className="map-pin relative text-goldhi" style={{ filter:"drop-shadow(0 8px 14px rgba(0,0,0,.5))" }}>
            <IconPin size={46} stroke="var(--gold-hi)" sw={1.4} />
          </div>
        </div>
      </div>

      {/* address pill */}
      <div className="absolute bottom-4 left-4 right-4 bg-night/85 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">{t.contact.addr}</div>
          <div className="text-white text-sm mt-0.5">{t.contact.addrVal}</div>
        </div>
        <span className="text-goldhi"><IconPin size={20} /></span>
      </div>
    </div>
  );
}

/* ── hero band ────────────────────────────────────────────── */
function ContactHero({ t }) {
  return (
    <div className="relative bg-night text-white overflow-hidden">
      {/* grid — clipped to viewport so it never causes horizontal scroll */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
           style={{ opacity: 0.08 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hgrid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="var(--gold-hi)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>

      {/* ambient glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(circle,rgba(230,201,140,.14),transparent 65%)" }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
           style={{ background:"radial-gradient(circle,rgba(230,201,140,.07),transparent 70%)" }} />

      {/* content — pt-28 clears the fixed 72px navbar + comfortable breathing room */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-6
                      pt-28 pb-14 sm:pt-32 sm:pb-18 md:pt-36 md:pb-24 text-center">

        <Reveal>
          <div className="font-mono text-gold text-[10px] sm:text-xs tracking-[0.45em] uppercase mb-4">
            {t.nav.contact}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-display leading-[0.95]"
              style={{ fontSize:"clamp(30px,9vw,78px)", fontWeight:600 }}>
            <span className="block text-white">{t.contact.heroTitle1}</span>
            <span className="block italic gold-text">{t.contact.heroTitle2}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-white/55 mt-4 sm:mt-5 mx-auto leading-relaxed
                        text-[13px] sm:text-[15px] md:text-base
                        max-w-[260px] sm:max-w-sm md:max-w-lg"
             style={{ textWrap:"pretty" }}>
            {t.contact.heroSub}
          </p>
        </Reveal>

        {/* divider */}
        <Reveal delay={220}>
          <div className="hairline opacity-20 max-w-[200px] sm:max-w-xs mx-auto mt-8 sm:mt-10" />
        </Reveal>

        {/* quick stats — flex so they stay centered on all screen sizes */}
        <Reveal delay={280}>
          <div className="flex items-center justify-center mt-7 sm:mt-8">
            {t.contact.quickStats.map((s, i) => (
              <div key={i} className="flex items-center">
                {/* stat */}
                <div className="flex flex-col items-center gap-1 px-4 sm:px-7 md:px-10">
                  <span className="font-display text-goldhi font-semibold"
                        style={{ fontSize:"clamp(18px,5vw,30px)" }}>
                    {s.v}
                  </span>
                  <span className="font-mono text-white/40 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
                    {s.l}
                  </span>
                </div>
                {/* divider between items */}
                {i < t.contact.quickStats.length - 1 && (
                  <div className="w-px h-8 bg-white/15 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* scroll cue */}
        <div className="flex flex-col items-center mt-10 sm:mt-12 opacity-35">
          <span className="w-px h-8 bg-gradient-to-b from-goldhi/70 to-transparent" />
        </div>
      </div>

      {/* bottom fade into page background */}
      <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
           style={{ background:"linear-gradient(to bottom,transparent,var(--bg))" }} />
    </div>
  );
}

/* ── how it works section ─────────────────────────────────── */
function StepsSection({ t }) {
  return (
    <section className="bg-night py-20 md:py-28 relative overflow-hidden">
      {/* background texture */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background:"radial-gradient(ellipse 80% 60% at 50% 100%,rgba(230,201,140,.06),transparent)" }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <Reveal className="text-center mb-14">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.contact.stepsTitle.toUpperCase()}</div>
          <h2 className="font-display text-white" style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:600 }}>
            {t.contact.stepsTitle}
          </h2>
          <p className="text-white/50 mt-3">{t.contact.stepsSub}</p>
        </Reveal>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px"
               style={{ background:"linear-gradient(90deg,transparent,var(--gold-deep) 20%,var(--gold-hi) 50%,var(--gold-deep) 80%,transparent)", opacity:0.3 }} />

          {t.contact.steps.map((step, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                {/* number circle */}
                <div className="relative mb-6 shrink-0">
                  <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center"
                       style={{ background:"rgba(184,145,90,.07)" }}>
                    <span className="font-mono text-gold text-lg font-bold">{step.n}</span>
                  </div>
                  {/* pulse ring */}
                  <span className="absolute inset-0 rounded-full border border-gold/15"
                        style={{ animation:"pulse-ring 3s ease-out infinite", animationDelay:`${i * 0.8}s` }} />
                </div>
                <h3 className="font-display text-white text-xl mb-3">{step.t}</h3>
                <p className="text-white/50 text-sm leading-relaxed" style={{ textWrap:"pretty" }}>{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── contact channels ─────────────────────────────────────── */
function ChannelCard({ icon, label, value, href, delay }) {
  return (
    <Reveal delay={delay}>
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
         className="group flex flex-col items-center text-center gap-4 bg-surface border border-line rounded-[var(--radius-lg)] p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_50px_-20px_var(--gold-glow)]">
        <div className="w-14 h-14 rounded-xl bg-surface2 flex items-center justify-center text-gold group-hover:bg-night group-hover:text-goldhi transition-all duration-300">
          {icon}
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-inkmute mb-1">{label}</div>
          <div className="font-mono text-ink text-sm font-medium group-hover:text-gold transition-colors">{value}</div>
        </div>
      </a>
    </Reveal>
  );
}

function ChannelsSection({ t }) {
  const channels = [
    { icon: <IconPhone size={24} />, label: t.cta.call,       value: "+90 212 000 00 00", href: "tel:+902120000000",       delay: 0   },
    { icon: <WhatsAppIcon />,         label: "WhatsApp",       value: "+90 212 000 00 00", href: "https://wa.me/902120000000", delay: 80  },
    { icon: <IconMail size={24} />,  label: t.nav.contact,    value: "hello@chronomotors.co", href: "mailto:hello@chronomotors.co", delay: 160 },
    { icon: <IconGlobe size={24} />, label: "Instagram",      value: "@chronomotors",     href: "https://instagram.com",   delay: 240 },
  ];
  return (
    <section className="bg-surface2 py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <Reveal className="text-center mb-10">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-2">{t.contact.channels}</div>
          <h2 className="font-display text-ink" style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:600 }}>
            {t.contact.channels}
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((ch, i) => (
            <ChannelCard key={i} {...ch} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* simple WhatsApp bubble icon inline */
function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

/* ── main page ────────────────────────────────────────────── */
export function Contact({ t, lang }) {
  const [form,  setForm]  = useState({ name:"", email:"", phone:"", msg:"" });
  const [topic, setTopic] = useState("");
  const [sent,  setSent]  = useState(false);

  const set    = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="page-enter bg-bg">

      {/* ── 1. cinematic hero ── */}
      <ContactHero t={t} />

      {/* ── 2. form + map ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* form card */}
          <Reveal>
            <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-7 md:p-9 h-full"
                 style={{ boxShadow:"0 16px 50px -28px rgba(0,0,0,.35)" }}>
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12"
                     style={{ animation:"reveal-up 0.5s var(--ease) both" }}>
                  <div className="w-20 h-20 rounded-full bg-night flex items-center justify-center text-goldhi mb-6"
                       style={{ boxShadow:"0 0 40px var(--gold-glow)" }}>
                    <IconCheck size={34} />
                  </div>
                  <p className="font-display text-2xl text-ink max-w-sm" style={{ textWrap:"balance" }}>{t.contact.sent}</p>
                  <p className="text-inksoft text-sm mt-3 max-w-xs">{t.contact.heroSub}</p>
                  <button onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", msg:"" }); setTopic(""); }}
                    className="mt-7 font-mono text-xs tracking-[0.16em] uppercase text-gold hover:text-golddeep transition-colors">
                    ↺ {lang === "tr" ? "Yeni Talep" : "New Request"}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  {/* form header */}
                  <div className="mb-2">
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                      {lang === "tr" ? "VIP Randevu" : "VIP Appointment"}
                    </div>
                    <div className="font-display text-ink text-xl">
                      {lang === "tr" ? "Randevu Talebi" : "Request Appointment"}
                    </div>
                  </div>

                  {/* topic chips */}
                  <TopicChips topics={t.contact.topics} value={topic} onChange={setTopic} />

                  <Field label={t.contact.name}  value={form.name}  onChange={set("name")}  delay={0}   />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Field label={t.contact.email} type="email" value={form.email} onChange={set("email")} delay={60}  />
                    <Field label={t.contact.phone} type="tel"   value={form.phone} onChange={set("phone")} delay={120} />
                  </div>
                  <Field label={t.contact.msg} textarea value={form.msg} onChange={set("msg")} delay={180} />

                  <button type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-ink text-white font-medium px-7 py-4 rounded-full hover:bg-night transition-colors"
                    style={{ boxShadow:"0 14px 34px -16px rgba(0,0,0,.5)", animation:"reveal-up 0.5s var(--ease) 240ms both" }}>
                    {t.contact.send} <IconArrow size={18} />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* map + info cards */}
          <div className="flex flex-col gap-5">
            <Reveal delay={80} className="flex-1">
              <MapCard t={t} />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Reveal delay={160}>
                <div className="bg-surface border border-line rounded-2xl p-5 flex items-start gap-3 hover:border-gold transition-colors">
                  <span className="text-gold mt-0.5"><IconClock size={22} /></span>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-inkmute">{t.contact.hours}</div>
                    <div className="text-ink text-sm mt-1 leading-relaxed">{t.contact.hoursVal}</div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="bg-surface border border-line rounded-2xl p-5 flex items-start gap-3 hover:border-gold transition-colors">
                  <span className="text-gold mt-0.5"><IconPhone size={22} /></span>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-inkmute">{t.cta.call}</div>
                    <div className="text-ink text-sm mt-1 font-mono">+90 212 000 00 00</div>
                    <div className="text-inksoft text-xs mt-0.5 font-mono">hello@chronomotors.co</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. how it works ── */}
      <StepsSection t={t} />

      {/* ── 4. contact channels ── */}
      <ChannelsSection t={t} />
    </div>
  );
}
