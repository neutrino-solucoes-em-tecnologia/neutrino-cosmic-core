# Open Graph Image Instructions

## Current Setup
- **og-image-static.svg**: Minimal design with white text on dark background
- **Dimensions**: 1200x630px (ideal for Open Graph)
- **Design**: Clean logo reproduction from homepage

## For Better Social Media Support
Convert SVG to PNG for better compatibility:

### Quick Online Conversion:
1. Go to https://svgtopng.com/ or https://convertio.co/
2. Upload `public/og-image-static.svg`
3. Set size to 1200x630px
4. Download as `og-image.png`
5. Update HTML meta tags to use `.png` instead of `.svg`

### Alternative Tools:
- https://cloudconvert.com/svg-to-png
- Figma: Import SVG, export as PNG
- Adobe Illustrator: File → Export → PNG

### Recommended Files:
- `og-image.png` (1200x630) - Primary Open Graph image
- `og-image-small.png` (600x315) - Fallback for smaller displays

## Design Notes:
- Dark background (#0A0A0A) for professional look
- White text matching homepage logo exactly
- Pipe symbol (|) consistent with brand identity
- Minimal, clean design focused on brand recognition
- Optimal contrast for readability across platforms