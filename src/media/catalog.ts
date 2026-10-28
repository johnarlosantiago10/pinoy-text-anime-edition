import { ANIME_TITLES } from './animeTitles';

export interface CatalogImage {
  id: string;
  label: string;
  src: string | null;
  position: string;
}

const COMMONS_ARTWORK: Partial<Record<(typeof ANIME_TITLES)[number], string>> = {
  Doraemon: 'https://commons.wikimedia.org/wiki/Special:FilePath/Doraemon_Anime_Outline.png',
  Naruto: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naruto-Naruto-Diag-allV3.png',
};

function toId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const CATALOG: CatalogImage[] = ANIME_TITLES.map((title) => ({
  id: toId(title),
  label: title,
  src: COMMONS_ARTWORK[title] ?? null,
  position: '50% 50%',
}));
