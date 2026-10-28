export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const CARD_WIDTH = 480;
const CARD_HEIGHT = 672;

export async function prepareCardImage(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Tanggapin lang ang JPG, JPEG, PNG, o WebP.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Masyadong malaki ang larawan. Maximum ay 15 MB.');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.max(CARD_WIDTH / bitmap.width, CARD_HEIGHT / bitmap.height);
  const sourceWidth = CARD_WIDTH / scale;
  const sourceHeight = CARD_HEIGHT / scale;
  const sourceX = (bitmap.width - sourceWidth) / 2;
  const sourceY = (bitmap.height - sourceHeight) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('Hindi ma-proseso ang larawan sa browser na ito.');
  }
  context.fillStyle = '#141414';
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  context.drawImage(bitmap, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.86);
}
