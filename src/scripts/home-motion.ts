export async function startHomeMotion(): Promise<void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { default: gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero .line-inner', {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
    });

    gsap.fromTo('.hero-img', { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power2.out' });

    gsap.fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, delay: 0.45, ease: 'power3.out' });

    const reveals = gsap.utils.toArray<HTMLElement>('.reveal');
    if (reveals.length) {
      gsap.set(reveals, { opacity: 0, y: 28 });
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
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
            onComplete: () => gsap.set(batch, { clearProps: 'opacity,transform' }),
          });
        },
      });
    }

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const proxy = { n: 0 };
      gsap.to(proxy, {
        n: target,
        duration: 1.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = decimals ? proxy.n.toFixed(decimals) : String(Math.round(proxy.n));
        },
      });
    });

    const wipe = document.querySelector('[data-wipe]');
    if (wipe) {
      gsap.fromTo(wipe, { scaleX: 1 }, {
        scaleX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.wash',
          start: 'top 78%',
          end: 'center 48%',
          scrub: 0.4,
        },
      });
    }

    const progress = document.querySelector('[data-progress]');
    if (progress) {
      gsap.to(progress, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process',
          start: 'top 70%',
          end: 'bottom 65%',
          scrub: 0.4,
        },
      });
    }
  });

  mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.to('.hero-parallax', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    const owner = document.querySelector('.owner');
    if (!owner) return;

    gsap.to('.owner-parallax', {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: {
        trigger: owner,
        start: 'top top',
        end: '+=70%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
      },
    });
  });
}
