/* ============================================================
   CONTACT & VIP APPOINTMENT — neon focus fields + radar map pin
   ============================================================ */

function Field({ label, type = "text", textarea = false, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      {textarea
        ? <textarea value={value} onChange={onChange} rows={4} />
        : <input type={type} value={value} onChange={onChange} />}
      <span className="underline" />
    </div>
  );
}

function MapCard({ t }) {
  return (
    <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-line h-full min-h-[340px]"
         style={{ background: "linear-gradient(160deg, #12161c, #0b0c10)" }}>
      {/* abstract street grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }} preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="var(--gold-hi)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* diagonal road */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 44%, rgba(230,201,140,0.14) 45%, rgba(230,201,140,0.14) 49%, transparent 50%)" }} />

      {/* pin + radar */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="radar-wave absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-goldhi/50" />
          <span className="radar-wave d2 absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-goldhi/50" />
          <div className="map-pin relative text-goldhi" style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.5))" }}>
            <IconPin size={46} stroke="var(--gold-hi)" sw={1.4} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-night/80 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">{t.contact.addr}</div>
          <div className="text-white text-sm mt-0.5">{t.contact.addrVal}</div>
        </div>
        <span className="text-goldhi"><IconPin size={20} /></span>
      </div>
    </div>
  );
}

function Contact({ t, lang }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="page-enter min-h-screen bg-bg pt-28 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="font-mono text-gold text-xs tracking-[0.4em] mb-3">{t.nav.contact.toUpperCase()}</div>
          <h1 className="font-display text-ink" style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 600 }}>{t.contact.title}</h1>
          <p className="text-inksoft mt-3">{t.contact.sub}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* form */}
          <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-7 md:p-9"
               style={{ boxShadow: "0 16px 50px -28px rgba(0,0,0,0.35)" }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12"
                   style={{ animation: "reveal-up 0.5s var(--ease) both" }}>
                <div className="w-16 h-16 rounded-full bg-night flex items-center justify-center text-goldhi mb-5"
                     style={{ boxShadow: "0 0 30px var(--gold-glow)" }}>
                  <IconCheck size={30} />
                </div>
                <p className="font-display text-2xl text-ink max-w-sm" style={{ textWrap: "balance" }}>{t.contact.sent}</p>
                <button onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", msg:"" }); }}
                  className="mt-6 font-mono text-xs tracking-[0.16em] uppercase text-gold hover:text-golddeep">↺</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <Field label={t.contact.name} value={form.name} onChange={set("name")} />
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label={t.contact.email} type="email" value={form.email} onChange={set("email")} />
                  <Field label={t.contact.phone} type="tel" value={form.phone} onChange={set("phone")} />
                </div>
                <Field label={t.contact.msg} textarea value={form.msg} onChange={set("msg")} />
                <button type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-ink text-white font-medium px-7 py-4 rounded-full hover:bg-night transition-colors"
                  style={{ boxShadow: "0 14px 34px -16px rgba(0,0,0,0.5)" }}>
                  {t.contact.send} <IconArrow size={18} />
                </button>
              </form>
            )}
          </div>

          {/* map + info */}
          <div className="flex flex-col gap-5">
            <MapCard t={t} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-surface border border-line rounded-2xl p-5 flex items-start gap-3">
                <span className="text-gold mt-0.5"><IconClock size={22} /></span>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-inkmute">{t.contact.hours}</div>
                  <div className="text-ink text-sm mt-1 leading-relaxed">{t.contact.hoursVal}</div>
                </div>
              </div>
              <div className="bg-surface border border-line rounded-2xl p-5 flex items-start gap-3">
                <span className="text-gold mt-0.5"><IconPhone size={22} /></span>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-inkmute">{t.cta.call}</div>
                  <div className="text-ink text-sm mt-1 font-mono">+90 212 000 00 00</div>
                  <div className="text-inksoft text-xs mt-0.5 font-mono">hello@chronomotors.co</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Contact });
