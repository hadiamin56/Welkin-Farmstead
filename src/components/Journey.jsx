import { useCallback, useEffect, useRef, useState } from 'react';
import { AIcon } from './Svg.jsx';
import { Img } from './Img.jsx';
import { Sh } from './Blocks.jsx';
import { JOURNEY } from '../data/content.js';

const DWELL = 6000; // ms each stage stays on screen
const N = JOURNEY.length;
const SEG = 100 / (N - 1);

/**
 * Six-stage journey: step buttons, a progress line and swipeable stage cards that advance on their own.
 * - Only a real mouse hover pauses it (touch "hover" never ends, which used to freeze it on phones).
 * - Touching/swiping pauses briefly, then the timer restarts.
 * - With "reduce motion" on, it still advances, but without smooth scrolling.
 */
export function Journey() {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false); // mouse hover or finger down
  const [nonce, setNonce] = useState(0); // bump to restart the dwell timer after any manual change

  const rootRef = useRef(null);
  const slidesRef = useRef(null);
  const tickRef = useRef(null);
  const lockRef = useRef(false);
  const reduceRef = useRef(false);
  const curRef = useRef(0);
  curRef.current = cur;

  const stride = () => {
    const s = slidesRef.current;
    const kids = s ? s.children : [];
    return kids[1] ? kids[1].offsetLeft - kids[0].offsetLeft : (s ? s.clientWidth : 0);
  };

  const go = useCallback((i) => {
    const next = (i + N) % N;
    setCur(next);
    setNonce((n) => n + 1);
    const s = slidesRef.current;
    if (!s) return;
    lockRef.current = true;
    s.scrollTo({ left: next * stride(), behavior: reduceRef.current ? 'auto' : 'smooth' });
    window.setTimeout(() => { lockRef.current = false; }, 650);
  }, []);

  // Visible on screen? (autoplay only runs while the journey is in view)
  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const io = new IntersectionObserver((es) => setVisible(es.some((e) => e.isIntersecting)), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dwell timer + the line that fills toward the next stop.
  useEffect(() => {
    const tick = tickRef.current;
    if (tick) {
      tick.classList.remove('run');
      tick.style.left = `${cur * SEG}%`;
      tick.style.setProperty('--seg', `${SEG}%`);
      tick.style.setProperty('--dwell', `${DWELL}ms`);
      tick.style.animationPlayState = held ? 'paused' : '';
      if (playing && cur < N - 1) { void tick.offsetWidth; tick.classList.add('run'); }
    }
    if (!playing || !visible || held || document.hidden) return undefined;
    const t = window.setTimeout(() => go(curRef.current === N - 1 ? 0 : curRef.current + 1), DWELL);
    return () => window.clearTimeout(t);
  }, [cur, playing, visible, held, nonce, go]);

  // Pause while the tab is in the background.
  useEffect(() => {
    const onVis = () => setNonce((n) => n + 1);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Swiping moves the active stage to whichever card settles in view.
  const scrollTimer = useRef(null);
  const onScroll = () => {
    if (lockRef.current) return;
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      const st = stride();
      if (!st) return;
      const i = Math.round(slidesRef.current.scrollLeft / st);
      if (i >= 0 && i < N && i !== curRef.current) setCur(i);
      setNonce((n) => n + 1);
    }, 140);
  };
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);
  useEffect(() => {
    const onResize = () => { if (slidesRef.current) slidesRef.current.scrollLeft = curRef.current * stride(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const mouseOnly = (fn) => (e) => { if (e.pointerType === 'mouse') fn(); };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  };

  return (
    <section className="sec journey" id="journey">
      <div className="wrap">
        <Sh eyebrow="How Welkin grows" title="Six stages, one farm" sub="Follow the journey automatically, or tap any stage." />
        <div className="jt" id="jt" ref={rootRef} onPointerEnter={mouseOnly(() => setHeld(true))} onPointerLeave={mouseOnly(() => setHeld(false))}>
          <div className="jsteps">
            <span className="jline" aria-hidden="true"><i className="jfill" style={{ width: `${cur * SEG}%` }} /><i className="jtick" ref={tickRef} /></span>
            <ol>
              {JOURNEY.map((s, i) => (
                <li key={s.label}>
                  <button className={`jn${i === cur ? ' on' : ''}${i < cur ? ' done' : ''}`} type="button" data-i={i} aria-label={`Stage ${i + 1}: ${s.title}`} aria-current={i === cur ? 'step' : 'false'} onClick={() => go(i)}>
                    <AIcon name={s.icon} /><span className="jl">{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div
            className="jslides" id="jslides" tabIndex={0} aria-label="Farm stages" ref={slidesRef}
            onScroll={onScroll} onKeyDown={onKey}
            onTouchStart={() => setHeld(true)} onTouchEnd={() => { setHeld(false); setNonce((n) => n + 1); }} onTouchCancel={() => { setHeld(false); setNonce((n) => n + 1); }}
          >
            {JOURNEY.map((s, i) => (
              <article key={s.title} className={`jslide${i === cur ? ' act' : ''}`} id={`stage${i + 1}`} aria-label={`Stage ${i + 1} of ${N}`}>
                <div className="jimg"><Img file={s.file} alt={s.title} sizes="(min-width:980px) 600px, 86vw" /></div>
                <div className="jtxt"><span className="stage">{`Stage ${i + 1} of ${N}`}</span><h3>{s.title}</h3><p>{s.text}</p></div>
              </article>
            ))}
          </div>
          <div className="jctl">
            <button className="jbtn" id="jprev" type="button" aria-label="Previous stage" onClick={() => go(cur - 1)}>‹</button>
            <button className="jplay" id="jplay" type="button" aria-label={playing ? 'Pause journey' : 'Play journey'} data-state={playing ? 'play' : 'pause'} onClick={() => { setPlaying((p) => !p); setNonce((n) => n + 1); }}>
              <span className="ic-pause" /><span className="ic-play" />
            </button>
            <span className="jcount" id="jcount">{`${cur + 1} / ${N}`}</span>
            <button className="jbtn" id="jnext" type="button" aria-label="Next stage" onClick={() => go(cur + 1)}>›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
