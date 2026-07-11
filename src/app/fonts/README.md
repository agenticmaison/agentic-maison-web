# Brand Fonts — Drop Zone

This folder receives licensed brand font files for the rebrand v2 creative stack.

## How to Add Brand Fonts

1. Drop `.woff2` font files here (preferred format — smallest, most widely supported).
   Optionally include `.woff` as fallback for older browsers.

2. Register each font family in the v2 layout at
   `src/app/(v2)/layout.tsx` using `next/font/local`:

   ```tsx
   import localFont from 'next/font/local'

   // Replace PLACEHOLDER with actual font files once licensed
   const brandDisplay = localFont({
     src: [
       { path: '../../app/fonts/YourDisplay-Regular.woff2', weight: '400', style: 'normal' },
       { path: '../../app/fonts/YourDisplay-Italic.woff2', weight: '400', style: 'italic' },
       { path: '../../app/fonts/YourDisplay-Bold.woff2',   weight: '700', style: 'normal' },
     ],
     variable: '--font-brand-display',
     display: 'swap',
   })

   const brandBody = localFont({
     src: [
       { path: '../../app/fonts/YourBody-Regular.woff2', weight: '400', style: 'normal' },
       { path: '../../app/fonts/YourBody-Medium.woff2',  weight: '500', style: 'normal' },
     ],
     variable: '--font-brand-body',
     display: 'swap',
   })
   ```

3. Apply the CSS variables in `src/styles/brand.css` by replacing the PLACEHOLDER
   comments with the actual `--font-brand-display` and `--font-brand-body` values:

   ```css
   @theme inline {
     /* Replace var(--font-brand-display) once font registered above */
     --font-brand-display: var(--font-brand-display), fallback-serif;
     --font-brand-body:    var(--font-brand-body), fallback-sans;
   }
   ```

4. The root layout (`src/app/layout.tsx`) is NOT modified — the live site fonts remain
   untouched. The brand fonts are loaded only inside the `(v2)` route group.

## Current Status

PLACEHOLDER — no licensed fonts yet. The `(v2)` demo route uses system fallbacks
via the `--font-brand-display` and `--font-brand-body` CSS variables defined in
`src/styles/brand.css`. Real font values will be set in a follow-on PRD once
typography direction is finalized.

## Font Licensing Notes

- License fonts that permit web embedding (EULA must include web/SaaS use).
- `next/font/local` self-hosts the font — no CDN requests, good for privacy and performance.
- Subset fonts if possible: `pyftsubset YourFont.woff2 --unicodes="U+0000-00FF"` for Latin.
- Use `display: 'swap'` to prevent invisible text during load (FOIT → FOUT).
