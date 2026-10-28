import { RefreshCw, Shuffle } from 'lucide-react';
import { CardImage } from '@/components/CardImage';
import { CustomImagesSection } from './CustomImagesSection';
import type { MediaSettings, ResolvedImage } from '@/media/useMediaSettings';

interface MediaPanelProps {
  media: MediaSettings;
}

function ChaSection({ media }: { media: MediaSettings }) {
  const options: ResolvedImage[] = [...media.catalogImages, ...media.customImages];
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl tracking-wide text-ember-300">CHA</h3>
        <span className="text-xs text-charcoal-400">Piliin ang larawan</span>
      </div>
      {media.chaImage && (
        <div className="mx-auto aspect-[5/7] w-32 overflow-hidden rounded-md border-2 border-ember-500 shadow-lg">
          <CardImage image={media.chaImage} onError={media.markBroken} />
        </div>
      )}
      <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1">
        {options.map((image) => {
          const selected = media.chaId === image.key;
          return (
            <div key={image.key} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => media.selectCha(image.key)}
                aria-pressed={selected}
                title={image.label}
                className={`aspect-[5/7] overflow-hidden rounded-md border-2 transition-all duration-200 hover:scale-[1.04] ${
                  selected ? 'border-ember-400 ring-2 ring-ember-500/60' : 'border-charcoal-700 hover:border-ember-500/60'
                }`}
              >
                <CardImage image={image} onError={media.markBroken} />
              </button>
              <button
                type="button"
                onClick={() => media.assignChub(image.key)}
                className="rounded bg-charcoal-800 py-0.5 text-[10px] font-semibold text-charcoal-300 hover:text-red-300"
                title="Ilagay sa CHUB"
              >
                CHUB
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChubSection({ media }: { media: MediaSettings }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl tracking-wide text-red-400">CHUB</h3>
        <div className="flex gap-2">
          {media.chubIsCustom && (
            <button
              type="button"
              onClick={() => media.assignChub(null)}
              className="flex items-center gap-1 rounded-md border border-charcoal-600 px-2 py-1 text-xs text-charcoal-200 hover:border-red-500/70"
            >
              <RefreshCw className="h-3 w-3" />
              Collage
            </button>
          )}
          {!media.chubIsCustom && (
            <button
              type="button"
              onClick={media.shuffleCollage}
              className="flex items-center gap-1 rounded-md border border-charcoal-600 px-2 py-1 text-xs text-charcoal-200 hover:border-red-500/70"
            >
              <Shuffle className="h-3 w-3" />
              Iba pang ayos
            </button>
          )}
        </div>
      </div>
      <div className="relative mx-auto aspect-[5/7] w-32 overflow-hidden rounded-md border-2 border-red-600 bg-charcoal-900 shadow-lg">
        <div className={`grid h-full w-full ${media.chubTiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-px`}>
          {media.chubTiles.map((tile, index) => (
            <div key={`${tile.key}-${index}`} className="relative overflow-hidden">
              <CardImage image={tile} onError={media.markBroken} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-red-600 mix-blend-multiply opacity-70" />
      </div>
    </section>
  );
}

export function MediaPanel({ media }: MediaPanelProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-charcoal-700 bg-charcoal-900 p-4">
      <ChaSection media={media} />
      <div className="h-px bg-charcoal-700" />
      <ChubSection media={media} />
      <div className="h-px bg-charcoal-700" />
      <CustomImagesSection media={media} />
      <p className="text-[11px] leading-relaxed text-charcoal-500">
        Doraemon dan Naruto: Wikimedia Commons, lisensya CC BY-SA. Pumili ng anime mula sa 90 pamagat. Mga larawang ina-upload mo ay nananatili lang sa browser mo.
      </p>
    </div>
  );
}
