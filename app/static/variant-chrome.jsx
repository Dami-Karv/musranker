const chromePlatinumStyles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    color: '#1a1a20',
    background: `
      radial-gradient(ellipse at 20% 10%, rgba(180,200,230,.35), transparent 50%),
      radial-gradient(ellipse at 80% 90%, rgba(220,180,230,.25), transparent 55%),
      linear-gradient(180deg, #e8ebef 0%, #d0d5dd 50%, #b8bec8 100%)
    `,
    overflow: 'hidden',
    position: 'relative',
  },
  chromeBar: {
    background: 'linear-gradient(180deg, #f5f7fa 0%, #d7dce5 45%, #b6bdc9 55%, #e1e6ed 100%)',
    borderBottom: '1px solid rgba(0,0,0,.35)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(0,0,0,.15), 0 2px 6px rgba(0,0,0,.18)',
  },
  panel: {
    background: 'linear-gradient(180deg, rgba(255,255,255,.75) 0%, rgba(230,235,242,.7) 100%)',
    border: '1px solid rgba(255,255,255,.8)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.2)',
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  bevelBtn: {
    background: 'linear-gradient(180deg, #fbfcfe 0%, #dde3ec 50%, #c4ccd8 100%)',
    border: '1px solid rgba(0,0,0,.3)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 1px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.15)',
    borderRadius: 6,
    cursor: 'pointer',
    color: '#1a1a20',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 600,
  },
  holoText: {
    background: 'linear-gradient(90deg, #a78bfa 0%, #60a5fa 25%, #34d399 50%, #fbbf24 75%, #f472b6 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  },
};

const TIER_GRADIENTS_CHROME = {
  S: 'linear-gradient(90deg, #fbbf24, #f472b6)',
  A: 'linear-gradient(90deg, #f472b6, #a78bfa)',
  B: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
  C: 'linear-gradient(90deg, #60a5fa, #34d399)',
  D: 'linear-gradient(90deg, #34d399, #94a3b8)',
  E: 'linear-gradient(90deg, #94a3b8, #64748b)',
  F: 'linear-gradient(90deg, #64748b, #475569)',
};

function ChromeTile({ label, sub, icon, onClick, mode }) {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 300,
        height: 380,
        background: 'linear-gradient(155deg, rgba(255,255,255,.9), rgba(220,228,240,.5))',
        border: '1px solid rgba(255,255,255,.9)',
        boxShadow: hover
          ? 'inset 0 2px 0 rgba(255,255,255,1), 0 20px 60px rgba(80,100,150,.4), 0 0 0 1px rgba(0,0,0,.25), 0 0 40px rgba(160,180,230,.5)'
          : 'inset 0 2px 0 rgba(255,255,255,1), 0 12px 30px rgba(60,80,120,.28), 0 0 0 1px rgba(0,0,0,.22)',
        borderRadius: 18,
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform .2s, box-shadow .2s',
        transform: hover ? 'translateY(-4px) scale(1.01)' : 'none',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `conic-gradient(from ${hover ? '200deg' : '140deg'}, transparent 0%, rgba(255,200,230,.35) 15%, rgba(180,230,255,.35) 30%, transparent 45%, transparent 100%)`,
          transition: 'background 1.2s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 50,
          background: 'linear-gradient(180deg, rgba(255,255,255,.7), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'conic-gradient(from 45deg, #e8ebef, #f8f9fb, #c4ccd8, #e8ebef, #a8b0bc, #f0f3f7, #d0d5dd)',
          boxShadow:
            'inset 0 0 0 6px rgba(255,255,255,.7), inset 0 -8px 20px rgba(0,0,0,.25), 0 6px 20px rgba(0,0,0,.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #2a2a30, #0a0a10)',
            boxShadow: 'inset 0 -4px 8px rgba(255,255,255,.1), 0 0 0 8px rgba(255,255,255,.9), 0 0 0 9px rgba(0,0,0,.3)',
          }}
        />
        <div style={{ position: 'absolute', fontSize: 54, fontWeight: 900, color: '#1a1a20', zIndex: 2, fontFamily: 'Helvetica, Arial' }}>
          {icon}
        </div>
      </div>

      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#0a0a12' }}>{label}</div>
        <div
          style={{
            fontSize: 11,
            fontFamily: 'ui-monospace, "IBM Plex Mono", monospace',
            color: '#4a4a55',
            marginTop: 6,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          {sub}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 9,
          color: '#4a4a55',
          display: 'flex',
          justifyContent: 'space-between',
          letterSpacing: '1px',
          zIndex: 2,
        }}
      >
        <span>MODE_{(mode || '').toUpperCase()}</span>
        <span style={{ color: '#10b981' }}>● READY</span>
      </div>
    </button>
  );
}

function ChromeLanding() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      padding: 40,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: 4, color: '#5a5a66', marginBottom: 12 }}>
          v2.4.1 · PLATINUM EDITION
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '-5px',
            lineHeight: 0.9,
            ...chromePlatinumStyles.holoText,
            filter: 'drop-shadow(0 2px 0 rgba(255,255,255,.9)) drop-shadow(0 4px 12px rgba(100,120,180,.4))',
          }}
        >
          MUS<span style={{ fontStyle: 'italic' }}>RANKER</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <ChromeTile label="Rank Artists" sub="Build your canon" icon="◉" onClick={() => { window.location.href = '/rank_artists'; }} mode="artists" />
        <ChromeTile label="Rank Albums" sub="S through E" icon="▣" onClick={() => { window.location.href = '/rank_albums'; }} mode="albums" />
      </div>
      <div style={{ display: 'flex', gap: 20, fontSize: 11, fontFamily: 'ui-monospace, monospace', color: '#4a4a55', letterSpacing: 1.5 }}>
        <span>◈ DRAG & DROP</span>
        <span>◈ SPOTIFY SYNC</span>
        <span>◈ EXPORT PNG</span>
      </div>
    </div>
  );
}

function ChromeCard({ item, draggable, onDragStart, onDragEnd, inTier, onRemove }) {
  const tileSize = inTier ? 96 : 108;
  const innerSize = tileSize - 12;
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        width: tileSize,
        height: tileSize,
        display: 'flex',
        flexDirection: 'column',
        padding: 6,
        background: 'linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(225,232,242,.86) 100%)',
        border: '1px solid rgba(0,0,0,.18)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 1px 2px rgba(0,0,0,.1)',
        borderRadius: 6,
        cursor: draggable ? 'grab' : 'default',
        fontSize: 12,
        userSelect: 'none',
        minWidth: 0,
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: innerSize }}>
        <CoverArt
          imageUrl={item.imageUrl}
          hue={item.hue}
          size={innerSize}
          style={{
            width: '100%',
            height: innerSize,
            borderRadius: 5,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.18)',
          }}
        />
        <div
          title={item.name}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '6px 6px 5px',
            borderRadius: '0 0 5px 5px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.72))',
            color: 'rgba(255,255,255,.96)',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '.2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(0,0,0,.45)',
            pointerEvents: 'none',
          }}
        >
          {item.name}
        </div>
      </div>
      {inTier && (
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,.3)',
            background: 'linear-gradient(180deg, #fff, #d0d5dd)',
            fontSize: 9,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            boxShadow: '0 1px 2px rgba(0,0,0,.18)',
          }}
        >
          x
        </button>
      )}
    </div>
  );
}

function ChromeRanker({ mode }) {
  const { setSearchResults, place, clearAll, startNewList, loadLastSession, exportSession, importSession, byBucket, placements } = useRanker(mode, `mr_chrome_${mode}`);
  const { onDragStart, onDragEnd } = useDrag();
  const [query, setQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sessionMsg, setSessionMsg] = React.useState('');
  const tierRef = React.useRef(null);
  const importInputRef = React.useRef(null);

  const triggerImport = () => {
    setSessionMsg('');
    if (importInputRef.current) {
      importInputRef.current.value = '';
      importInputRef.current.click();
    }
  };

  const runSearch = async () => {
    const value = query.trim();
    if (!value) {
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const items = await searchSpotify(value, mode);
      setSearchResults(items);
      if (items.length === 0) {
        setError('No results found for that query.');
      }
    } catch (searchError) {
      setError(searchError.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={chromePlatinumStyles.root}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 220px 1fr', gap: 12, padding: 12, minHeight: 0 }}>
        <div style={{ ...chromePlatinumStyles.panel, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 10, borderBottom: '1px solid rgba(0,0,0,.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: 2, color: '#4a4a55' }}>
                SEARCH SPOTIFY · {mode === 'artists' ? 'ARTISTS' : 'ALBUMS / EPS'}
              </div>
              <button
                onClick={() => { window.location.href = '/'; }}
                style={{ ...chromePlatinumStyles.bevelBtn, padding: '2px 8px', fontSize: 10 }}
              >
                Home
              </button>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'linear-gradient(180deg, #d4d9e3, #eef1f6)', border: '1px solid rgba(0,0,0,.3)', borderRadius: 6, padding: 3 }}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    runSearch();
                  }
                }}
                placeholder={`Search ${mode}...`}
                style={{ flex: 1, padding: '4px 8px', border: 'none', outline: 'none', background: 'transparent', fontSize: 12, fontFamily: 'Helvetica, Arial, sans-serif' }}
              />
              <button onClick={runSearch} style={{ ...chromePlatinumStyles.bevelBtn, padding: '2px 10px', fontSize: 11 }}>
                {isLoading ? '...' : 'Go'}
              </button>
            </div>
            {error && <div style={{ marginTop: 8, fontSize: 11, color: '#b91c1c' }}>{error}</div>}
          </div>

          <DropZone
            onDrop={(id) => place(id, null)}
            style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}
            activeStyle={{ background: 'rgba(180,200,240,.3)' }}
          >
            {byBucket.pool.length === 0 && (
              <div style={{ textAlign: 'center', color: '#5a5a66', fontSize: 11, padding: 20, fontFamily: 'ui-monospace, monospace' }}>
                Search to load artists or albums.
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start' }}>
              {byBucket.pool.map((item) => (
                <ChromeCard key={item.id} item={item} draggable onDragStart={onDragStart(item.id)} onDragEnd={onDragEnd} />
              ))}
            </div>
          </DropZone>
        </div>

        <div style={{ ...chromePlatinumStyles.panel, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 10, borderBottom: '1px solid rgba(0,0,0,.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: 2, color: '#4a4a55' }}>STAGING</div>
            <div style={{ fontSize: 10, color: '#5a5a66', fontFamily: 'ui-monospace, monospace' }}>{byBucket.staging.length}</div>
          </div>
          <DropZone
            onDrop={(id) => place(id, 'staging')}
            style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}
            activeStyle={{ background: 'rgba(180,200,240,.3)' }}
          >
            {byBucket.staging.length === 0 && (
              <div style={{ textAlign: 'center', color: '#5a5a66', fontSize: 11, padding: '30px 10px', fontFamily: 'ui-monospace, monospace', border: '1.5px dashed rgba(0,0,0,.2)', borderRadius: 6 }}>
                Drag items here
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start' }}>
              {byBucket.staging.map((item) => (
                <ChromeCard key={item.id} item={item} draggable onDragStart={onDragStart(item.id)} onDragEnd={onDragEnd} />
              ))}
            </div>
          </DropZone>
        </div>

        <div ref={tierRef} style={{ ...chromePlatinumStyles.panel, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: 10, borderBottom: '1px solid rgba(0,0,0,.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', letterSpacing: 2, color: '#4a4a55' }}>TIER LIST</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  const ok = loadLastSession();
                  setSessionMsg(ok ? 'Loaded last session.' : 'No saved session found yet.');
                }}
                style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10 }}
              >
                Load
              </button>
              <button onClick={triggerImport} style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10 }}>
                Import JSON
              </button>
              <button
                onClick={() => {
                  startNewList();
                  setSessionMsg('Started a new list.');
                }}
                style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10 }}
              >
                New
              </button>
              <button onClick={clearAll} style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10 }}>Clear</button>
              <button
                onClick={() => {
                  const blob = new Blob([exportSession()], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = `musicranker-${mode}-session.json`;
                  anchor.click();
                  URL.revokeObjectURL(url);
                  setSessionMsg('Exported JSON session.');
                }}
                style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10 }}
              >
                Export JSON
              </button>
              <button onClick={() => exportTierListAsImage(tierRef.current, `musicranker-${mode}.png`)} style={{ ...chromePlatinumStyles.bevelBtn, padding: '3px 10px', fontSize: 10, background: 'linear-gradient(180deg, #fef3c7, #fbbf24)', color: '#1a1a20' }}>
                Export PNG
              </button>
            </div>
          </div>
          {sessionMsg && (
            <div style={{ padding: '6px 10px', borderBottom: '1px solid rgba(0,0,0,.08)', fontSize: 10, color: '#0a0a12', fontFamily: 'ui-monospace, monospace' }}>
              {sessionMsg}
            </div>
          )}

          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              file.text()
                .then((text) => {
                  importSession(text);
                  setSessionMsg('Imported session.');
                })
                .catch((importError) => {
                  setSessionMsg(importError?.message || 'Import failed.');
                });
            }}
          />

          <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
            {TIERS.map((tier) => (
              <DropZone
                key={tier}
                onDrop={(id) => place(id, tier)}
                activeStyle={{ background: 'rgba(180,200,240,.3)' }}
                style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 8, border: '1px solid rgba(0,0,0,.18)', borderRadius: 6, background: 'rgba(255,255,255,.4)', minHeight: 64, overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: TIER_GRADIENTS_CHROME[tier], fontSize: 36, fontWeight: 900, color: '#0a0a12' }}>
                  {tier}
                </div>
                <div style={{ padding: 6, display: 'flex', flexWrap: 'wrap', gap: 4, alignContent: 'flex-start' }}>
                  {byBucket[tier].length === 0 && <div style={{ color: '#5a5a66', fontSize: 10, fontFamily: 'ui-monospace, monospace', padding: '18px 4px' }}>Drop here</div>}
                  {byBucket[tier].map((item) => (
                    <div key={item.id}>
                      <ChromeCard
                        item={item}
                        draggable
                        inTier
                        onRemove={() => place(item.id, null)}
                        onDragStart={onDragStart(item.id)}
                        onDragEnd={onDragEnd}
                      />
                    </div>
                  ))}
                </div>
              </DropZone>
            ))}
          </div>

          <div style={{ padding: '6px 10px', borderTop: '1px solid rgba(0,0,0,.1)', fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#5a5a66', display: 'flex', justifyContent: 'space-between' }}>
            <span>{Object.keys(placements).length} placed</span>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChromePlatinum() {
  const config = window.MUSRANKER_CONFIG || {};
  const initialScreen = config.initialScreen === 'ranker' ? 'ranker' : 'landing';
  const initialMode = config.initialMode === 'albums' ? 'albums' : 'artists';

  if (initialScreen === 'landing') {
    return (
      <div style={chromePlatinumStyles.root}>
        <ChromeLanding />
      </div>
    );
  }

  return <ChromeRanker mode={initialMode} />;
}

window.ChromePlatinum = ChromePlatinum;
