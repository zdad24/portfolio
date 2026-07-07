import React from 'react'

/* ============================================================
   Window — the cornerstone OS chrome wrapper
   ============================================================ */
function Win({
  title = 'untitled.txt',
  meta = '',
  id,
  children,
  status,
  lights = true,
  className = '',
  innerClass = '',
  bodyStyle = {},
  noStatus = false,
}) {
  return (
    <section className={`window reveal ${className}`} id={id}>
      <header className="window-bar">
        {lights && (
          <div className="lights">
            <span></span><span></span><span></span>
          </div>
        )}
        <div className="title mono">{title}</div>
        <div className="meta mono">{meta}</div>
      </header>
      <div className={`window-body ${innerClass}`} style={bodyStyle}>
        {children}
      </div>
      {!noStatus && (
        <footer className="window-statusbar mono">
          <span>{status?.left || `// ${title}`}</span>
          <span>{status?.right || 'READY'}</span>
        </footer>
      )}
    </section>
  );
}

/* Section anchor heading inside a window (used for top-of-window
   tag w/ pixel label and rule) */
function WinHeading({ tag, title, sub }) {
  return (
    <header className="col gap-2" style={{ marginBottom: 24 }}>
      <div className="label" style={{ color: 'var(--accent-ink)' }}>{tag}</div>
      <h2 className="pixel-md" style={{ margin: 0 }}>{title}</h2>
      {sub && <p className="muted" style={{ margin: 0, maxWidth: 640 }}>{sub}</p>}
    </header>
  );
}

export { Win, WinHeading }
