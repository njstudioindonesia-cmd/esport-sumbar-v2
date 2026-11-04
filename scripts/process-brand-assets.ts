import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("🎨 Processing ESPORT SUMBAR brand assets with Sharp...");

  const brandDir = path.resolve('public/brand');
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  // 1. Clean transparent logo-mark-pink.png
  console.log("1. Creating transparent logo-mark-pink.png...");
  const rawPink = await sharp('public/brand/logo-mark-pink.png').raw().toBuffer({ resolveWithObject: true });
  const { data: pinkData, info: pinkInfo } = rawPink;
  const cleanedPinkBuf = Buffer.alloc(pinkInfo.width * pinkInfo.height * 4);
  const cleanedWhiteBuf = Buffer.alloc(pinkInfo.width * pinkInfo.height * 4);

  for (let i = 0; i < pinkInfo.width * pinkInfo.height; i++) {
    const srcIdx = i * pinkInfo.channels;
    const destIdx = i * 4;

    const r = pinkData[srcIdx];
    const g = pinkData[srcIdx + 1];
    const b = pinkData[srcIdx + 2];
    const a = pinkInfo.channels === 4 ? pinkData[srcIdx + 3] : 255;

    // Check if pixel is part of the pink mark
    // Pink has high R, low G
    if (r > 180 && g < 100 && a > 30) {
      // Calculate smooth alpha based on distance to white
      const isFull = g < 50;
      const alpha = isFull ? 255 : Math.max(0, Math.min(255, Math.round(255 * (1 - (g - 30) / 70))));

      // Pink Mark
      cleanedPinkBuf[destIdx] = 255;      // R: 255
      cleanedPinkBuf[destIdx + 1] = 23;   // G: 23 (#FF1752)
      cleanedPinkBuf[destIdx + 2] = 82;   // B: 82
      cleanedPinkBuf[destIdx + 3] = alpha;

      // White Mark
      cleanedWhiteBuf[destIdx] = 255;     // R: 255
      cleanedWhiteBuf[destIdx + 1] = 255; // G: 255 (#FFFFFF)
      cleanedWhiteBuf[destIdx + 2] = 255; // B: 255
      cleanedWhiteBuf[destIdx + 3] = alpha;
    } else {
      // Transparent background
      cleanedPinkBuf[destIdx + 3] = 0;
      cleanedWhiteBuf[destIdx + 3] = 0;
    }
  }

  await sharp(cleanedPinkBuf, {
    raw: { width: pinkInfo.width, height: pinkInfo.height, channels: 4 }
  }).png().toFile('public/brand/logo-mark-pink.png');

  await sharp(cleanedWhiteBuf, {
    raw: { width: pinkInfo.width, height: pinkInfo.height, channels: 4 }
  }).png().toFile('public/brand/logo-mark-white.png');

  console.log("   ✓ logo-mark-pink.png & logo-mark-white.png created with clean alpha transparency.");

  // 2. Crop logo-lockup-navy.png to content
  console.log("2. Cropping logo-lockup-navy.png to eliminate excess padding...");
  await sharp('public/brand/logo-lockup-navy.png')
    .trim()
    .png()
    .toFile('public/brand/logo-lockup-navy-cropped.png');
  console.log("   ✓ logo-lockup-navy-cropped.png created.");

  // 3. Generate Favicon & App Icons
  console.log("3. Generating Favicon & PWA App Icons...");
  const navyBg = { r: 3, g: 3, b: 26, alpha: 1 }; // #03031A (bg-base)

  // Icon 512x512
  const markResized512 = await sharp('public/brand/logo-mark-pink.png')
    .resize(400, null, { fit: 'inside' })
    .toBuffer();

  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: navyBg
    }
  })
  .composite([{ input: markResized512, gravity: 'center' }])
  .png()
  .toFile('public/brand/android-chrome-512x512.png');

  // Maskable 512x512 (80% safe zone: 320px wide mark)
  const markMaskable = await sharp('public/brand/logo-mark-pink.png')
    .resize(320, null, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: navyBg
    }
  })
  .composite([{ input: markMaskable, gravity: 'center' }])
  .png()
  .toFile('public/brand/android-chrome-maskable-512x512.png');

  // Icon 192x192
  const markResized192 = await sharp('public/brand/logo-mark-pink.png')
    .resize(150, null, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: navyBg
    }
  })
  .composite([{ input: markResized192, gravity: 'center' }])
  .png()
  .toFile('public/brand/android-chrome-192x192.png');

  // Apple Touch Icon 180x180
  const markResized180 = await sharp('public/brand/logo-mark-pink.png')
    .resize(140, null, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: navyBg
    }
  })
  .composite([{ input: markResized180, gravity: 'center' }])
  .png()
  .toFile('public/brand/apple-touch-icon.png');

  // Favicon 32x32 & 16x16
  const mark32 = await sharp('public/brand/logo-mark-pink.png')
    .resize(26, null, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: { width: 32, height: 32, channels: 4, background: navyBg }
  })
  .composite([{ input: mark32, gravity: 'center' }])
  .png()
  .toFile('public/brand/favicon-32x32.png');

  const mark16 = await sharp('public/brand/logo-mark-pink.png')
    .resize(14, null, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: { width: 16, height: 16, channels: 4, background: navyBg }
  })
  .composite([{ input: mark16, gravity: 'center' }])
  .png()
  .toFile('public/brand/favicon-16x16.png');

  // Copy 32x32 as public/favicon.ico
  await sharp({
    create: { width: 48, height: 48, channels: 4, background: navyBg }
  })
  .composite([{
    input: await sharp('public/brand/logo-mark-pink.png').resize(38, null, { fit: 'inside' }).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('public/favicon.ico');

  console.log("   ✓ All PWA & Favicon icons generated successfully.");

  // 4. Generate Open Graph / Twitter Banner (1200x630)
  console.log("4. Generating Open Graph 1200x630 banner...");
  const ogLockup = await sharp('public/brand/logo-lockup-navy-cropped.png')
    .resize(520, null, { fit: 'inside' })
    .toBuffer();

  const ogWatermark = await sharp('public/brand/logo-mark-pink.png')
    .resize(900, null, { fit: 'inside' })
    .modulate({ brightness: 1 })
    .composite([{
      input: Buffer.from([255, 255, 255, 25]), // opacity
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in'
    }])
    .toBuffer();

  const svgText = `
    <svg width="1200" height="630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#03031A"/>
          <stop offset="50%" stop-color="#000251"/>
          <stop offset="100%" stop-color="#03031A"/>
        </linearGradient>
        <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FF1752"/>
          <stop offset="100%" stop-color="#FF4D77"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <!-- Brand Line Accent Top -->
      <rect x="0" y="0" width="1200" height="4" fill="url(#pinkGrad)"/>
      <!-- Tagline & Description -->
      <text x="620" y="270" font-family="sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" letter-spacing="1">
        PUSAT DATA ESPORT
      </text>
      <text x="620" y="325" font-family="sans-serif" font-weight="900" font-size="44" fill="#FF1752" letter-spacing="1">
        SUMATERA BARAT
      </text>
      <text x="620" y="380" font-family="sans-serif" font-weight="400" font-size="20" fill="#9AA3B2">
        Identitas Digital • Kartu TCG Atlet • Ekosistem Resmi
      </text>
      <text x="620" y="440" font-family="sans-serif" font-weight="700" font-size="14" fill="#FFFFFF" letter-spacing="3" opacity="0.6">
        WWW.ESPORTSUMBAR.COM
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svgText))
    .composite([
      { input: ogLockup, top: 220, left: 60 }
    ])
    .png()
    .toFile('public/brand/og-image.png');

  console.log("   ✓ og-image.png generated at 1200x630.");
  console.log("🎉 Brand assets generation complete!");
}

main().catch(console.error);
