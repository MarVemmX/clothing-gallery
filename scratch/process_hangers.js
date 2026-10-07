const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CANVAS_WIDTH = 896;
const CANVAS_HEIGHT = 1200;
const TARGET_HOOK_Y = 69;
const TARGET_CENTER_X = 448;

/**
 * Normalizes a raw cutout image to the exact 896x1200 showroom rail canvas:
 * - Transparent background
 * - Top of hanger hook at Y=69
 * - Center of hanger hook at X=448
 * - Proper width and height scaling matching the existing rail garments
 */
async function processHangerModel(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();
  
  const rawData = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = rawData;
  
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * (info.channels);
      const alpha = info.channels === 4 ? data[idx + 3] : 255;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const isWhiteBg = r > 245 && g > 245 && b > 245;
      
      if (alpha > 20 && !isWhiteBg) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const contentW = Math.max(1, maxX - minX);
  const contentH = Math.max(1, maxY - minY);
  
  const targetH = 1050;
  const scale = targetH / contentH;
  const scaledW = Math.round(contentW * scale);
  const scaledH = targetH;

  const cropped = await sharp(inputPath)
    .extract({ left: minX, top: minY, width: contentW, height: contentH })
    .resize(scaledW, scaledH, { fit: 'contain' })
    .toBuffer();

  const left = Math.round(TARGET_CENTER_X - (scaledW / 2));
  const top = TARGET_HOOK_Y;

  await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: cropped,
    top: Math.max(0, top),
    left: Math.max(0, left)
  }])
  .png()
  .toFile(outputPath);

  console.log(`Processed and saved to: ${outputPath}`);
}

module.exports = { processHangerModel };
