import { ImagePlus, Replace, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { CardImage } from '@/components/CardImage';
import { ACCEPTED_IMAGE_TYPES, prepareCardImage } from '@/media/imageUpload';
import { MAX_CUSTOM_IMAGES, type MediaSettings } from '@/media/useMediaSettings';

export function CustomImagesSection({ media }: { media: MediaSettings }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const atLimit = media.customCount >= MAX_CUSTOM_IMAGES;

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await prepareCardImage(file);
      const targetId = replaceTarget.current;
      if (targetId) {
        media.replaceCustom(targetId, dataUrl);
      } else if (!media.addCustom(dataUrl, file.name.slice(0, 40))) {
        setError(`Hanggang ${MAX_CUSTOM_IMAGES} lang ang maaaring i-upload.`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Hindi na-upload ang larawan.');
    } finally {
      setBusy(false);
      replaceTarget.current = null;
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function openPicker(targetId: string | null) {
    replaceTarget.current = targetId;
    fileInput.current?.click();
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-xl tracking-wide text-charcoal-100">Sariling Larawan</h3>
        <button
          type="button"
          onClick={() => openPicker(null)}
          disabled={atLimit || busy}
          className="flex items-center gap-1.5 rounded-md bg-ember-500 px-3 py-1.5 text-xs font-bold text-charcoal-950 transition-colors hover:bg-ember-400 disabled:cursor-not-allowed disabled:bg-charcoal-700 disabled:text-charcoal-400"
        >
          <ImagePlus className="h-4 w-4" />
          {busy ? 'Pinoproseso...' : 'I-upload'}
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error && <p className="rounded-md bg-red-950/60 px-3 py-2 text-xs text-red-200">{error}</p>}
      {media.storageFull && (
        <p className="rounded-md bg-amber-950/60 px-3 py-2 text-xs text-amber-200">
          Hindi ma-save sa browser ang mga pagbabago. Mag-alis ng ilang larawan.
        </p>
      )}

      {media.customCount === 0 ? (
        <p className="text-xs text-charcoal-400">JPG, PNG, o WebP. Awtomatikong ii-crop sa tamang sukat ng pamato.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {media.customImages.map((image) => (
            <li key={image.key} className="flex flex-col gap-2 rounded-lg border border-charcoal-700 bg-charcoal-950/50 p-2">
              <div className="mx-auto aspect-[5/7] w-20 overflow-hidden rounded border border-charcoal-600">
                <CardImage image={image} />
              </div>
              <p className="truncate text-center text-[11px] text-charcoal-300">{image.label}</p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => media.selectCha(image.key)}
                  className="rounded bg-charcoal-800 py-1 text-[11px] font-semibold text-ember-300 hover:bg-charcoal-700"
                >
                  CHA
                </button>
                <button
                  type="button"
                  onClick={() => media.assignChub(image.key)}
                  className="rounded bg-charcoal-800 py-1 text-[11px] font-semibold text-red-300 hover:bg-charcoal-700"
                >
                  CHUB
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => openPicker(image.key)}
                  disabled={busy}
                  className="flex items-center justify-center gap-1 rounded bg-charcoal-800 py-1 text-[11px] text-charcoal-200 hover:bg-charcoal-700"
                  title="Palitan"
                >
                  <Replace className="h-3 w-3" />
                  Palitan
                </button>
                <button
                  type="button"
                  onClick={() => media.removeCustom(image.key)}
                  className="flex items-center justify-center gap-1 rounded bg-charcoal-800 py-1 text-[11px] text-red-300 hover:bg-charcoal-700"
                  title="Alisin"
                >
                  <Trash2 className="h-3 w-3" />
                  Alisin
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
