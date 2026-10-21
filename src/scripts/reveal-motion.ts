type Gsap = typeof import('gsap').default;
type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger;

function show(el: HTMLElement, gsap?: Gsap) {
  el.classList.add('is-in');
  gsap?.set(el, { clearProps: 'opacity,transform,y' });
}

function revealInView(gsap?: Gsap) {
  const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)');
  if (!nodes.length) return;

  if (!('IntersectionObserver' in window)) {
    nodes.forEach((el) => show(el, gsap));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      window.setTimeout(() => {
        if (!el.classList.contains('is-in')) show(el, gsap);
      }, 400);
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  nodes.forEach((el) => io.observe(el));
}

export function revealWithScroll(gsap: Gsap, ScrollTrigger: ScrollTriggerType): void {
  const reveals = gsap.utils.toArray<HTMLElement>('.reveal:not(.is-in)');
  if (!reveals.length) return;

  ScrollTrigger.batch(reveals, {
    start: 'top 92%',
    once: true,
    interval: 0.1,
    batchMax: 4,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => batch.forEach((el) => show(el as HTMLElement, gsap)),
      });
    },
  });

  revealInView(gsap);
  refreshAfterLayout(ScrollTrigger);

  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)').forEach((el) => show(el, gsap));
  }, 4000);
}

export function refreshAfterLayout(ScrollTrigger: ScrollTriggerType): void {
  let timer = 0;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  void document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true });
  });
}
