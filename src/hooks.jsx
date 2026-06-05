/* ============================================================
   HOOKS — count-up, in-view reveal, tilt
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountUp(target, { duration = 1600, start = false } = {}) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setVal(target * ease(p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, target, duration]);
  return val;
}

export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

export function Reveal({ children, delay = 0, className = "", as = "div", style = {} }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`}
         style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

export function useTilt(max = 10) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
  }, [max]);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateZ(0)";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

/* ============================================================
   FAVORITES / GARAGE store — module singleton + localStorage
   ============================================================ */
const FAV_KEY = "chrono_garage";
export const favStore = {
  ids: (() => { try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch { return new Set(); } })(),
  subs: new Set(),
  save() { try { localStorage.setItem(FAV_KEY, JSON.stringify([...this.ids])); } catch {} },
  toggle(id) { this.ids.has(id) ? this.ids.delete(id) : this.ids.add(id); this.save(); this.emit(); },
  remove(id) { this.ids.delete(id); this.save(); this.emit(); },
  has(id) { return this.ids.has(id); },
  emit() { this.subs.forEach((f) => f(new Set(this.ids))); },
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); },
};

export function useFavorites() {
  const [ids, setIds] = useState(new Set(favStore.ids));
  useEffect(() => favStore.subscribe(setIds), []);
  return {
    ids,
    count: ids.size,
    has: (id) => ids.has(id),
    toggle: (id) => favStore.toggle(id),
    remove: (id) => favStore.remove(id),
  };
}

export function HeartButton({ id, dark = false, size = 18 }) {
  const { has, toggle } = useFavorites();
  const on = has(id);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle(id); }}
      aria-label="favorite"
      className={`relative grid place-items-center rounded-full transition-all active:scale-90 ${
        dark ? "bg-black/40 backdrop-blur hover:bg-black/60" : "bg-white/90 hover:bg-white"
      }`}
      style={{ width: size + 18, height: size + 18, boxShadow: on ? "0 0 0 1px var(--gold)" : "none" }}>
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill={on ? "var(--gold)" : "none"} stroke={on ? "var(--gold)" : (dark ? "#fff" : "#15161a")}
        strokeWidth="1.8" style={{ transition: "transform .25s", transform: on ? "scale(1.1)" : "scale(1)" }}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none">
      <div className="h-full origin-left"
           style={{ width: `${p}%`, background: "linear-gradient(90deg, var(--gold-deep), var(--gold-hi))",
                    boxShadow: "0 0 10px var(--gold-glow)", transition: "width 0.1s linear" }} />
    </div>
  );
}
