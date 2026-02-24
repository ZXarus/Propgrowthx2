export default function Hero() {
  return (
    <>
      {/* Global reset + hero styles */}
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }

        .hero-section-root {
         position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          /* Pull the section up by 200px to cancel any parent padding-top,
             then add matching padding-top so content stays visually centered */
          margin-top: -200px !important;
          padding-top: 200px !important;
         height: calc(100vh + 200px) !important;
          min-height: 600px;
          width: 100vw !important;
          max-width: 100vw !important;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .hero-section-root {
            height: 100svh;
            min-height: 550px;
          }
          .hero-content { padding: 0 20px !important; }
          .hero-heading {
            font-size: clamp(24px, 6vw, 42px) !important;
            line-height: 1.15 !important;
            margin-bottom: 18px !important;
            letter-spacing: -0.02em !important;
            font-weight: 700 !important;
          }
          .hero-subheading {
            font-size: clamp(13px, 3.5vw, 16px) !important;
            margin-bottom: 28px !important;
            line-height: 1.55 !important;
            opacity: 0.95 !important;
          }
          .hero-button {
            font-size: 12px !important;
            padding: 14px 28px !important;
            display: inline-block !important;
            letter-spacing: 0.5px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section-root { min-height: 500px; }
          .hero-content { padding: 0 18px !important; }
          .hero-heading {
            font-size: clamp(22px, 5.5vw, 36px) !important;
            line-height: 1.2 !important;
            margin-bottom: 16px !important;
          }
          .hero-subheading {
            font-size: clamp(12px, 3vw, 14px) !important;
            margin-bottom: 24px !important;
          }
          .hero-button { font-size: 11px !important; padding: 12px 24px !important; letter-spacing: 0.3px !important; }
        }

        @media (max-width: 380px) {
          .hero-section-root { min-height: 480px; }
          .hero-content { padding: 0 16px !important; }
          .hero-heading { font-size: clamp(20px, 5vw, 32px) !important; margin-bottom: 14px !important; }
          .hero-subheading { margin-bottom: 20px !important; }
          .hero-button { padding: 11px 20px !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content { padding: 0 32px !important; }
          .hero-heading { font-size: 56px !important; }
        }
      `}</style>

      <section className="hero-section-root">
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/hero-bg.jpg"
            alt="Modern Property Interior"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.15))' }} />
        </div>

        {/* Content */}
        <div
          className="hero-content"
          style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px', width: '100%', zIndex: 1, position: 'relative' }}
        >
          <div style={{ maxWidth: '850px' }}>
            <h1
              className="hero-heading"
              style={{ fontSize: '72px', fontWeight: '700', color: '#FFFFFF', lineHeight: '0.95', marginBottom: '20px', letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              Manage Your Properties<br />
              Like You're Standing<br />
              Right There.
            </h1>

            <p
              className="hero-subheading"
              style={{ fontSize: '17px', color: '#FFFFFF', lineHeight: '1.5', marginBottom: '36px', opacity: 0.92, fontWeight: '400', fontFamily: 'DM Sans, sans-serif', maxWidth: '580px' }}
            >
              Control every property from anywhere. Real-time visibility,
              automated workflows, zero spreadsheets.
            </p>

            <button
              className="hero-button"
              style={{ background: '#FFFFFF', color: '#EF4444', fontSize: '14px', fontWeight: '700', padding: '16px 40px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.8px', textTransform: 'uppercase' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' }}
            >
              REGISTER YOUR PROPERTY
            </button>
          </div>
        </div>
      </section>
    </>
  )
}