import { useEffect, useRef, useState } from 'react';

/**
 * Element that fades up the first time it scrolls into view.
 * Starts visible (so server HTML and no-JS stay readable), then arms itself after hydration.
 */
export function Fade({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setArmed(true);
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, armed ? 'fade' : '', armed && seen ? 'in' : ''].filter(Boolean).join(' ');
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}
