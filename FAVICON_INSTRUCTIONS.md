# Favicon Generation Instructions

## Quick Online Conversion (Recommended)
1. Go to https://favicon.io/favicon-converter/
2. Upload the `favicon-static.svg` file from the public folder
3. Download the generated favicon package
4. Replace the current placeholder files

## Manual Steps:
1. Open `public/favicon-static.svg` in a browser or image editor
2. Save/export as PNG at 32x32 pixels
3. Use an online ICO converter to create favicon.ico
4. Place favicon.ico in the public folder

## Alternative Tools:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- ImageMagick: `convert favicon-static.svg -resize 32x32 favicon.ico`

## Files to Generate:
- favicon.ico (32x32, 16x16 multi-size)
- apple-touch-icon.png (180x180)
- favicon-16x16.png
- favicon-32x32.png

The SVG favicon will work in modern browsers, but ICO is needed for older browsers and Windows.

## Design Concept:
- Circular badge with gradient from light blue (#00D9FF) to dark blue (#003366)
- Central white nucleus representing the neutrino particle
- Orbital particles in cyan/blue gradients
- Letter "N" in the center with white outline for visibility
- Clean, modern look suitable for both light and dark interfaces