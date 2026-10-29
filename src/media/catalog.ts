export interface CatalogImage {
  id: string;
  label: string;
  src: string | null;
  fallbackSrc: string | null;
  position: string;
}

const CHA_FILE_NAMES = ['btx', 'digimon', 'goku', 'gokuss', 'gon kilua', 'Kenshin', 'luffy', 'miyagi', 'naruto', 'slumdunk', 'vegeta', 'vincent', 'Zenki'];

export const CHA_IMAGES: CatalogImage[] = CHA_FILE_NAMES.map((fileName) => ({
    id: `cha-${fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label: fileName,
    src: `${import.meta.env.BASE_URL}anime/cha/${fileName}.jpg`,
    fallbackSrc: null,
    position: '50% 50%',
  }));

export const CHUB_IMAGE: CatalogImage = {
  id: 'chub-chub',
  label: 'Chub',
  src: `${import.meta.env.BASE_URL}anime/chub/chub.png`,
  fallbackSrc: null,
  position: '50% 50%',
};

const folderImages: CatalogImage[] = [
  ...CHA_IMAGES,
  CHUB_IMAGE,
];

export const CATALOG: CatalogImage[] = folderImages;
