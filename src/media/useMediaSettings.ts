import { useEffect, useState } from 'react';
import { CATALOG, type CatalogImage } from './catalog';

export interface CustomImage {
  id: string;
  name: string;
  dataUrl: string;
}

export interface ResolvedImage {
  key: string;
  src: string | null;
  fallbackSrc?: string | null;
  position: string;
  label: string;
}

export const MAX_CUSTOM_IMAGES = 6;
const STORAGE_KEY = 'pinoy-teks:media';
const TILE_COUNT = 4;

interface StoredMedia {
  custom: CustomImage[];
  chaId: string;
  chubId: string | null;
  collageSeed: number;
}

const DEFAULT_MEDIA: StoredMedia = {
  custom: [],
  chaId: CATALOG[0].id,
  chubId: null,
  collageSeed: 0,
};

function loadMedia(): StoredMedia {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MEDIA;
    const parsed = JSON.parse(raw) as Partial<StoredMedia>;
    return {
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      chaId: typeof parsed.chaId === 'string' ? parsed.chaId : DEFAULT_MEDIA.chaId,
      chubId: typeof parsed.chubId === 'string' ? parsed.chubId : null,
      collageSeed: typeof parsed.collageSeed === 'number' ? parsed.collageSeed : 0,
    };
  } catch {
    return DEFAULT_MEDIA;
  }
}

function saveMedia(media: StoredMedia): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(media));
    return true;
  } catch {
    return false;
  }
}

function toResolved(image: CatalogImage): ResolvedImage {
  return { key: image.id, src: image.src, fallbackSrc: image.fallbackSrc, position: image.position, label: image.label };
}

function makeId(): string {
  return `up-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useMediaSettings() {
  const [initial] = useState(loadMedia);
  const [custom, setCustom] = useState<CustomImage[]>(initial.custom);
  const [chaId, setChaId] = useState(initial.chaId);
  const [chubId, setChubId] = useState<string | null>(initial.chubId);
  const [collageSeed, setCollageSeed] = useState(initial.collageSeed);
  const [brokenSources, setBrokenSources] = useState<string[]>([]);
  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    const saved = saveMedia({ custom, chaId, chubId, collageSeed });
    setStorageFull(!saved);
  }, [custom, chaId, chubId, collageSeed]);

  const available = CATALOG.filter((image) =>
    (image.src === null || !brokenSources.includes(image.src)) &&
    (image.fallbackSrc === null || !brokenSources.includes(image.fallbackSrc)),
  );
  const customImages: ResolvedImage[] = custom.map((image) => ({
    key: image.id,
    src: image.dataUrl,
    position: '50% 50%',
    label: image.name,
  }));

  const selectedCustom = custom.find((image) => image.id === chaId);
  const selectedCatalog = available.find((image) => image.id === chaId);
  const chaImage: ResolvedImage | null = selectedCustom
    ? { key: selectedCustom.id, src: selectedCustom.dataUrl, position: '50% 50%', label: selectedCustom.name }
    : selectedCatalog
      ? toResolved(selectedCatalog)
      : available[0]
        ? toResolved(available[0])
        : null;

  const chubCustom = custom.find((image) => image.id === chubId);
  const chubTiles: ResolvedImage[] = chubCustom
    ? [{ key: chubCustom.id, src: chubCustom.dataUrl, position: '50% 50%', label: chubCustom.name }]
    : available.length === 0
      ? []
      : Array.from({ length: Math.min(TILE_COUNT, available.length) }, (_, index) =>
          toResolved(available[(index + collageSeed) % available.length]),
        );

  function markBroken(src: string) {
    setBrokenSources((current) => (current.includes(src) ? current : [...current, src]));
  }

  function addCustom(dataUrl: string, name: string) {
    if (custom.length >= MAX_CUSTOM_IMAGES) return null;
    const id = makeId();
    setCustom((current) => [...current, { id, name, dataUrl }]);
    return id;
  }

  function replaceCustom(id: string, dataUrl: string) {
    setCustom((current) => current.map((image) => (image.id === id ? { ...image, dataUrl } : image)));
  }

  function removeCustom(id: string) {
    setCustom((current) => current.filter((image) => image.id !== id));
    setChaId((current) => (current === id ? CATALOG[0].id : current));
    setChubId((current) => (current === id ? null : current));
  }

  return {
    customImages,
    catalogImages: available.map(toResolved),
    chaImage,
    chubTiles,
    chubIsCustom: Boolean(chubCustom),
    chaId,
    chubId,
    storageFull,
    customCount: custom.length,
    selectCha: setChaId,
    assignChub: setChubId,
    shuffleCollage: () => setCollageSeed((seed) => seed + 1),
    addCustom,
    replaceCustom,
    removeCustom,
    markBroken,
  };
}

export type MediaSettings = ReturnType<typeof useMediaSettings>;

