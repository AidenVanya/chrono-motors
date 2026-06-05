/* ============================================================
   ICONS + LOGO + CAR SILHOUETTES  (pure SVG)
   ============================================================ */

export function ChronoMark({ size = 40, stroke = "var(--gold)", spin = true }) {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0;
    const a = (i / 60) * Math.PI * 2;
    const r1 = major ? 38 : 41;
    const r2 = 45;
    ticks.push(
      <line key={i}
        x1={50 + Math.cos(a) * r1} y1={50 + Math.sin(a) * r1}
        x2={50 + Math.cos(a) * r2} y2={50 + Math.sin(a) * r2}
        stroke={stroke} strokeWidth={major ? 1.6 : 0.7}
        opacity={major ? 0.95 : 0.5} />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="gpu" style={{ overflow: "visible" }}>
      <circle cx="50" cy="50" r="47" fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.85" />
      <g style={ spin ? { transformOrigin: "50px 50px", animation: "chrono-rotate 40s linear infinite" } : {} }>
        {ticks}
      </g>
      <circle cx="50" cy="50" r="30" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
      <g style={{ transformOrigin: "50px 50px", transform: "rotate(-38deg)" }}>
        <line x1="50" y1="50" x2="50" y2="16" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="64" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
      </g>
      <circle cx="50" cy="50" r="4.5" fill={stroke} />
      <circle cx="50" cy="50" r="1.8" fill="#0b0c10" />
    </svg>
  );
}

export function Logo({ light = false, size = 38 }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <ChronoMark size={size} />
      <div className="leading-none">
        <div className="font-display tracking-[0.12em] text-[19px]"
             style={{ color: light ? "#fff" : "var(--ink)", fontWeight: 600 }}>
          CHRONO
        </div>
        <div className="font-mono tracking-[0.42em] text-[10px] mt-0.5"
             style={{ color: "var(--gold)" }}>
          MOTORS
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CAR SILHOUETTES — side profile, stylized
   ============================================================ */

function Wheel({ cx, cy, r = 40, className = "" }) {
  const spokes = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    spokes.push(
      <line key={i} x1={cx} y1={cy}
        x2={cx + Math.cos(a) * (r - 13)} y2={cy + Math.sin(a) * (r - 13)}
        stroke="#5b5b5b" strokeWidth="3.4" strokeLinecap="round" />
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0c0c0e" />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#2a2a2c" strokeWidth="2" />
      <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={r - 12} fill="#171719" stroke="#3a3a3d" strokeWidth="1.5" />
        {spokes}
        <circle cx={cx} cy={cy} r="6" fill="#6e6e72" />
      </g>
      <circle cx={cx} cy={cy} r="3" fill="var(--gold-hi)" />
    </g>
  );
}

const BODIES = {
  coupe: {
    fw: 168, rw: 472, wr: 44, arch: 50,
    body: "M28 178 C28 162 44 156 70 154 L116 150 C128 126 158 116 192 110 L250 100 C262 98 268 92 280 78 L330 50 C352 42 396 40 432 50 L486 76 C520 88 560 94 592 104 C612 110 620 126 620 150 L619 178",
    glass: "M268 92 L322 62 C342 54 384 53 414 62 L456 82 C430 92 300 94 268 92 Z",
    accentLine: "M120 150 C200 138 430 138 600 150",
  },
  suv: {
    fw: 168, rw: 472, wr: 46, arch: 52,
    body: "M26 176 C26 158 40 150 64 148 L112 146 C120 116 150 100 188 96 L300 92 C360 90 430 92 470 100 C520 110 568 116 600 128 C616 134 622 146 622 158 L621 176",
    glass: "M150 100 C160 80 180 70 200 68 L300 66 C360 65 430 68 460 80 L470 100 C400 94 240 94 150 100 Z",
    accentLine: "M120 146 C220 134 470 134 604 146",
  },
  sedan: {
    fw: 168, rw: 472, wr: 43, arch: 49,
    body: "M28 180 C28 164 42 158 66 156 L120 152 C132 130 162 118 200 112 L268 102 C282 92 300 78 332 70 L408 60 C452 56 506 64 542 80 L592 102 C612 110 620 124 620 148 L619 180",
    glass: "M270 100 C292 86 312 74 340 70 L408 64 C448 61 498 68 528 82 L560 100 C470 92 350 92 270 100 Z",
    accentLine: "M124 152 C220 140 500 140 600 152",
  },
};

export function CarSilhouette({ type = "coupe", c1 = "#d61f26", c2 = "#7a0d12", className = "", uid = "x", showGlass = true }) {
  const b = BODIES[type] || BODIES.coupe;
  const gid = `cg-${uid}`;
  const ggid = `cgl-${uid}`;
  return (
    <svg viewBox="0 0 650 230" className={className} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="55%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={ggid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0c10" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3a4452" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <path d={`${b.body} L${b.rw + b.arch} 192 A${b.arch} ${b.arch} 0 0 0 ${b.rw - b.arch} 192 L${b.fw + b.arch} 192 A${b.arch} ${b.arch} 0 0 0 ${b.fw - b.arch} 192 L40 192 Z`}
        fill={`url(#${gid})`} />

      <path d={b.accentLine} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.28" strokeLinecap="round" />

      {showGlass && <path d={b.glass} fill={`url(#${ggid})`} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />}

      <path d={`M${b.fw + 70} 150 L${b.fw + 70} 188`} stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" />
      <path d={`M${b.rw - 70} 145 L${b.rw - 70} 188`} stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" />

      <ellipse cx="44" cy="168" rx="8" ry="5" fill="var(--gold-hi)" opacity="0.9" />
      <rect x="606" y="150" width="12" height="6" rx="3" fill="#ff3b3b" opacity="0.85" />

      <Wheel cx={b.fw} cy={186} r={b.wr} className="wheel" />
      <Wheel cx={b.rw} cy={186} r={b.wr} className="wheel" />
    </svg>
  );
}

/* ---- Generic line icons ---- */
const Icon = ({ d, size = 22, stroke = "currentColor", sw = 1.6, fill = "none", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconPower   = (p) => <Icon {...p} d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />;
export const IconGauge   = (p) => <Icon {...p}><path d="M12 14l4-4" /><circle cx="12" cy="13" r="9" /></Icon>;
export const IconTop     = (p) => <Icon {...p} d="M3 17l6-6 4 4 8-8M21 7v6h-6" />;
export const IconCal     = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Icon>;
export const IconArrow   = (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />;
export const IconArrowL  = (p) => <Icon {...p} d="M19 12H5M11 18l-6-6 6-6" />;
export const IconClose   = (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />;
export const IconPhone   = (p) => <Icon {...p} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />;
export const IconMail    = (p) => <Icon {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></Icon>;
export const IconPin     = (p) => <Icon {...p}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>;
export const IconClock   = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
export const IconCheck   = (p) => <Icon {...p} d="M20 6 9 17l-5-5" />;
export const IconGlobe   = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></Icon>;
export const IconShield  = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
export const IconSwap    = (p) => <Icon {...p} d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" />;
export const IconStar    = (p) => <Icon {...p} d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z" />;
export const IconWallet  = (p) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h3M3 9h18" /></Icon>;
export const IconMenu    = (p) => <Icon {...p} d="M4 7h16M4 12h16M4 17h16" />;
export const IconHeart   = (p) => <Icon {...p} d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />;
export const IconTrash   = (p) => <Icon {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></Icon>;
