const TIERS = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];

function hashHue(value) {
  let hash = 0;
  const text = String(value || 'music');
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 360;
  }
  return hash;
}

function normalizeSpotifyItem(rawItem, mode) {
  const imageUrl = rawItem?.images?.[0]?.url || null;
  if (mode === 'artists') {
    return {
      id: rawItem.id,
      name: rawItem.name,
      subtitle: Array.isArray(rawItem.genres) && rawItem.genres.length > 0 ? rawItem.genres.slice(0, 2).join(' • ') : 'Artist',
      imageUrl,
      hue: hashHue(rawItem.id || rawItem.name),
    };
  }

  const artistNames = Array.isArray(rawItem.artists) ? rawItem.artists.map((artist) => artist.name).filter(Boolean).join(', ') : 'Unknown artist';
  const year = rawItem.release_date ? String(rawItem.release_date).slice(0, 4) : '';
  return {
    id: rawItem.id,
    name: rawItem.name,
    subtitle: year ? `${artistNames} • ${year}` : artistNames,
    imageUrl,
    hue: hashHue(rawItem.id || rawItem.name),
  };
}

async function searchSpotify(query, mode) {
  const searchType = mode === 'artists' ? 'artist' : 'album';
  const response = await fetch(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error || 'Search failed';
    throw new Error(message);
  }

  const key = `${searchType}s`;
  let rawItems = Array.isArray(payload?.[key]?.items) ? payload[key].items : [];
  if (mode !== 'artists') {
    // Spotify Search returns EPs as album_type === "single" too.
    // Heuristic: hide true "singles" (usually 1–2 tracks), keep EPs (3+ tracks) and albums.
    rawItems = rawItems.filter((item) => {
      if (item?.album_type !== 'single') {
        return true;
      }
      const totalTracks = typeof item?.total_tracks === 'number' ? item.total_tracks : 0;
      return totalTracks > 2;
    });
  }

  return rawItems
    .map((item) => normalizeSpotifyItem(item, mode))
    .filter((item) => item.id && item.name);
}

function useRanker(mode, storageKey) {
  const sessionKey = `${storageKey}__session_v1`;
  const [items, setItems] = React.useState([]);
  const [searchIds, setSearchIds] = React.useState(() => new Set());
  const searchIdsRef = React.useRef(searchIds);
  React.useEffect(() => {
    searchIdsRef.current = searchIds;
  }, [searchIds]);
  const [placements, setPlacements] = React.useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(placements));
    } catch (error) {
      // Ignore storage errors.
    }
  }, [placements, storageKey]);

  React.useEffect(() => {
    try {
      const payload = {
        version: 1,
        mode,
        savedAt: Date.now(),
        items,
        placements,
        searchIds: Array.from(searchIds),
      };
      localStorage.setItem(sessionKey, JSON.stringify(payload));
    } catch (error) {
      // Ignore storage errors.
    }
  }, [items, mode, placements, searchIds, sessionKey]);

  const setSearchResults = React.useCallback((incomingItems) => {
    setSearchIds(new Set(incomingItems.map((item) => item.id).filter(Boolean)));
    setItems((currentItems) => {
      const pinned = currentItems.filter((item) => Boolean(placements[item.id]));
      const byId = new Map(pinned.map((item) => [item.id, item]));
      incomingItems.forEach((item) => byId.set(item.id, item));
      return Array.from(byId.values());
    });
  }, [placements]);

  const place = React.useCallback((id, bucket) => {
    setPlacements((currentPlacements) => {
      const nextPlacements = { ...currentPlacements };
      if (bucket == null) {
        delete nextPlacements[id];
      } else {
        nextPlacements[id] = bucket;
      }
      return nextPlacements;
    });

    if (bucket == null) {
      const allowReturnToPool = searchIdsRef.current.has(id);
      if (!allowReturnToPool) {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      }
    }
  }, []);

  const clearAll = React.useCallback(() => {
    setPlacements({});
  }, []);

  const startNewList = React.useCallback(() => {
    setItems([]);
    setPlacements({});
    setSearchIds(new Set());
  }, []);

  const loadLastSession = React.useCallback(() => {
    let raw;
    try {
      raw = localStorage.getItem(sessionKey);
    } catch (error) {
      return false;
    }
    if (!raw) {
      return false;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return false;
    }

    const nextItems = Array.isArray(parsed?.items) ? parsed.items : [];
    const nextPlacements = parsed?.placements && typeof parsed.placements === 'object' ? parsed.placements : {};
    const nextSearchIds = Array.isArray(parsed?.searchIds) ? new Set(parsed.searchIds) : new Set();

    setItems(nextItems);
    setPlacements(nextPlacements);
    setSearchIds(nextSearchIds);
    return true;
  }, [sessionKey]);

  const exportSession = React.useCallback(() => {
    const payload = {
      version: 1,
      mode,
      exportedAt: Date.now(),
      items,
      placements,
    };
    return JSON.stringify(payload, null, 2);
  }, [items, mode, placements]);

  const importSession = React.useCallback((rawText) => {
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (error) {
      throw new Error('Invalid JSON file.');
    }

    const nextItems = Array.isArray(parsed?.items) ? parsed.items : null;
    const nextPlacements = parsed?.placements && typeof parsed.placements === 'object' ? parsed.placements : null;
    if (!nextItems || !nextPlacements) {
      throw new Error('That JSON does not look like a MusicRanker export.');
    }

    setItems(nextItems);
    setPlacements(nextPlacements);
    setSearchIds(new Set(nextItems.map((item) => item?.id).filter(Boolean)));
  }, []);

  const byBucket = React.useMemo(() => {
    const result = { pool: [], staging: [] };
    TIERS.forEach((tier) => {
      result[tier] = [];
    });

    items.forEach((item) => {
      const bucket = placements[item.id];
      if (!bucket) {
        result.pool.push(item);
      } else if (bucket === 'staging') {
        result.staging.push(item);
      } else if (result[bucket]) {
        result[bucket].push(item);
      }
    });

    return result;
  }, [items, placements]);

  return {
    items,
    setSearchResults,
    place,
    clearAll,
    startNewList,
    loadLastSession,
    exportSession,
    importSession,
    byBucket,
    placements,
  };
}

function useDrag() {
  const onDragStart = (id) => (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const onDragEnd = () => {};
  return { onDragStart, onDragEnd };
}

function DropZone({ onDrop, children, style, activeStyle }) {
  const [isOver, setIsOver] = React.useState(false);

  return (
    <div
      style={{ ...style, ...(isOver ? activeStyle : null) }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        const id = event.dataTransfer.getData('text/plain');
        if (id) {
          onDrop(id);
        }
      }}
    >
      {children}
    </div>
  );
}

function CoverArt({ imageUrl, hue, size = 40, style }) {
  const gradient = `linear-gradient(160deg, oklch(0.75 0.14 ${hue}), oklch(0.55 0.16 ${(hue + 40) % 360}))`;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="cover"
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          flexShrink: 0,
          objectFit: 'cover',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.25)',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        flexShrink: 0,
        background: gradient,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25), 0 1px 2px rgba(0,0,0,.25)',
        ...style,
      }}
    />
  );
}

async function exportTierListAsImage(targetEl, filename = 'musicranker-tierlist.png') {
  if (!window.htmlToImage) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const dataUrl = await window.htmlToImage.toPng(targetEl, { pixelRatio: 2, cacheBust: true });
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

Object.assign(window, { TIERS, useRanker, useDrag, DropZone, CoverArt, exportTierListAsImage, searchSpotify });
