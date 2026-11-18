import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const placeTypes = [
  {
    number: '01',
    title: 'Rentals',
    description: 'A place to put down roots.',
    className: 'fit-card--rentals',
  },
  {
    number: '03',
    title: 'Sublets',
    description: 'Make a quick move.',
    className: 'fit-card--sublets',
  },
  {
    number: '02',
    title: 'Short stays',
    description: 'Stay for a while.',
    className: 'fit-card--stays',
  },
];

export function HomePage() {
  const fitGridRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [fitGridVisible, setFitGridVisible] = useState(false);
  const [calloutVisible, setCalloutVisible] = useState(false);

  const animatePreview = () => {
    const preview = previewRef.current;

    if (!preview || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    preview.getAnimations().forEach((animation) => animation.cancel());
    preview.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-10px) scale(1.06)', offset: 0.45 },
        { transform: 'translateY(3px) scale(0.99)', offset: 0.72 },
        { transform: 'translateY(0) scale(1)' },
      ],
      {
        duration: 560,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    );
  };

  useEffect(() => {
    const fitGrid = fitGridRef.current;

    if (!fitGrid) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFitGridVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(fitGrid);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const callout = calloutRef.current;

    if (!callout || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCalloutVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(callout);

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="hero-orb hero-orb--pink" aria-hidden="true" />
        <div className="hero-orb hero-orb--violet" aria-hidden="true" />
        <div className="hero-orb hero-orb--rose" aria-hidden="true" />

        <div className="home-hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">Your place. Your pace.</p>
            <h1 id="hero-heading">Move into<br />what's next.</h1>
            <p className="hero-description">
              Discover rentals, sublets, and stays made for where life is taking you.
            </p>
            <Link className="hero-button" to="/postings">Browse postings <span aria-hidden="true">&gt;</span></Link>
          </div>

          <div
            className="hero-preview"
            role="button"
            tabIndex={0}
            aria-label="Animate the house preview"
            ref={previewRef}
            onClick={animatePreview}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                event.preventDefault();
                animatePreview();
              }
            }}
          >
            <svg
              className="hero-preview-roof"
              viewBox="0 0 450 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M8 96Q2 96 7 93L198 16C214 7 236 7 252 16L443 93Q448 96 442 96Z" />
            </svg>
            <div className="hero-preview-structure">
              <div className="hero-preview-art">
                <div className="hero-preview-window">
                  <span className="hero-preview-door" aria-hidden="true" />
                  <span className="hero-preview-window-pane hero-preview-window-pane--left" aria-hidden="true" />
                  <span className="hero-preview-window-pane hero-preview-window-pane--right" aria-hidden="true" />
                </div>
              </div>
              <div className="hero-preview-caption">
                <p className="eyebrow">Find a place that fits</p>
                <h2>Your next move starts here</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fit-section" aria-labelledby="fit-heading">
        <div className="section-inner">
          <p className="eyebrow section-eyebrow">Pick your next chapter</p>
          <h2 id="fit-heading">Find the right fit.</h2>

          <div
            className={`fit-grid${fitGridVisible ? ' fit-grid--visible' : ''}`}
            ref={fitGridRef}
          >
            {placeTypes.map((placeType) => (
              <Link
                className={`fit-card ${placeType.className}`}
                key={placeType.title}
                to="/postings"
              >
                <span className="fit-card-number">{placeType.number}</span>
                <span className="fit-card-title">{placeType.title}</span>
                <span className="fit-card-description">{placeType.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`home-callout${calloutVisible ? ' home-callout--visible' : ''}`}
        aria-labelledby="callout-heading"
        ref={calloutRef}
      >
        <div className="home-callout-copy">
          <p className="eyebrow">The search can feel different</p>
          <h2 id="callout-heading">Your next place starts here.</h2>
          <p>A simpler way to find the space that fits your life.</p>
        </div>
        <Link className="callout-button" to="/postings">Start exploring <span aria-hidden="true">&gt;</span></Link>
      </section>
    </main>
  );
}
