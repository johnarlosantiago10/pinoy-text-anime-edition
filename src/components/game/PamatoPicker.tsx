import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { CardImage } from '@/components/CardImage';
import { ACCEPTED_IMAGE_TYPES, prepareCardImage } from '@/media/imageUpload';
import { MAX_CUSTOM_IMAGES, type MediaSettings } from '@/media/useMediaSettings';

interface PamatoPickerProps {
  media: MediaSettings;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onSelectConfirm?: () => void;
}

export function PamatoPicker({ media, selectedId, onSelect, onSelectConfirm }: PamatoPickerProps) {
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const suppressClick = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [flightRect, setFlightRect] = useState<{ left: number; top: number; width: number; height: number; x: number; y: number } | null>(null);
  const animationTimer = useRef<number | null>(null);
  const options = [...media.catalogImages, ...media.customImages];

  useEffect(() => () => {
    if (animationTimer.current !== null) window.clearTimeout(animationTimer.current);
  }, []);

  function animateSelection(id: string, source?: HTMLElement) {
    if (animatingId !== null || suppressClick.current) return;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    if (source) {
      const rect = source.getBoundingClientRect();
      setFlightRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        x: viewportCenterX - (rect.left + rect.width / 2),
        y: viewportCenterY - (rect.top + rect.height / 2),
      });
    } else {
      setFlightRect(null);
    }
    setAnimatingId(id);
    animationTimer.current = window.setTimeout(() => {
      onSelect?.(id);
      onSelectConfirm?.();
      animationTimer.current = null;
      setAnimatingId(null);
      setFlightRect(null);
    }, 1350);
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!listRef.current) return;
    dragStart.current = { x: event.clientX, scrollLeft: listRef.current.scrollLeft };
    suppressClick.current = false;
  }

  function drag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStart.current || !listRef.current) return;
    const distance = event.clientX - dragStart.current.x;
    if (Math.abs(distance) > 5) suppressClick.current = true;
    listRef.current.scrollLeft = dragStart.current.scrollLeft - distance;
  }

  function endDrag() {
    dragStart.current = null;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  }

  async function upload(file?: File) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await prepareCardImage(file);
      const id = media.addCustom(dataUrl, file.name.slice(0, 40));
      if (id) {
        animateSelection(id);
      } else setError(`Hanggang ${MAX_CUSTOM_IMAGES} custom na larawan lang ang maitatabi.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Hindi ma-upload ang larawan.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <section className={`desktop-pamato-picker [grid-area:pamato] flex h-full flex-col rounded-lg border border-charcoal-700 bg-charcoal-900 p-2 ${animatingId ? 'pamato-picker-is-selecting' : ''}`} aria-label="Pagpipilian ng pamato">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold uppercase tracking-wide text-charcoal-300">Choose Pamato</span>
        <button type="button" disabled={busy || media.customCount >= MAX_CUSTOM_IMAGES} onClick={() => input.current?.click()} className="flex items-center gap-1 rounded-md border border-charcoal-600 px-2 py-1 text-xs font-semibold text-ember-300 disabled:opacity-40">
          <ImagePlus className="h-3.5 w-3.5" /> {busy ? 'Pinoproseso...' : 'Upload'}
        </button>
        <input ref={input} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="hidden" onChange={(event) => void upload(event.target.files?.[0])} />
      </div>
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
      {media.storageFull && <p className="mt-1 text-xs text-amber-300">Hindi ma-save sa browser ang custom na larawan.</p>}
      <div className="pamato-carousel mt-2 flex min-h-0 flex-1 items-stretch gap-1">
        <div
          ref={listRef}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          className="pamato-thumbnail-list flex min-w-0 flex-1 touch-pan-x cursor-grab gap-2 overflow-x-auto overscroll-x-contain select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {options.map((image) => {
            const selected = image.key === (selectedId ?? media.chaId);
            return (
              <button key={image.key} type="button" aria-pressed={selected} disabled={animatingId !== null} onClick={(event: ReactMouseEvent<HTMLButtonElement>) => animateSelection(image.key, event.currentTarget)} className={`pamato-card shrink-0 border-0 bg-transparent p-0 text-center pointer-events-auto ${animatingId === image.key ? 'pamato-card-selecting' : ''}`}>
                <span className="pamato-card-image block h-[124px] w-[92px] overflow-hidden"><CardImage image={image} hideLabel /></span>
                <span className="sr-only">{image.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {animatingId && (() => {
        const selected = options.find((image) => image.key === animatingId);
        return selected ? (
          <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
            <div
              className="pamato-selection-flight absolute overflow-hidden rounded-lg border-2 border-ember-400 bg-charcoal-950 shadow-2xl"
              style={flightRect ? {
                left: flightRect.left,
                top: flightRect.top,
                width: flightRect.width,
                height: flightRect.height,
                '--flight-x': `${flightRect.x}px`,
                '--flight-y': `${flightRect.y}px`,
                '--flight-mid-x': `${flightRect.x * 0.4}px`,
                '--flight-mid-y': `${flightRect.y * 0.4}px`,
              } as CSSProperties : {
                left: `calc(50% - ${56}px)`,
                top: `calc(50% - ${96}px)`,
                '--flight-x': '0px',
                '--flight-y': '0px',
                '--flight-mid-x': '0px',
                '--flight-mid-y': '0px',
              } as CSSProperties}
            >
              <CardImage image={selected} hideLabel />
            </div>
          </div>
        ) : null;
      })()}
    </section>
  );
}
