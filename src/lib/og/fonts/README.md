# OG card fonts

Font binaries for the generated journal Open Graph cards
(`src/app/[locale]/journal/[slug]/opengraph-image.tsx`).

`next/og` renders through Satori, which needs each font handed to it as a raw
binary buffer. It cannot read a CSS `@font-face`, so it cannot use the
`next/font/google` fonts the live site loads in `src/app/layout.tsx`, and
`next/font`'s internal cache is not a stable interface to reach into. These
files are therefore committed and read from disk at render time.

**Satori accepts `ttf`, `otf` and `woff`. It does not accept `woff2`** — do not
replace these with woff2 files.

## What is here

| File                            | Family              | Weight | Size    |
| ------------------------------- | ------------------- | ------ | ------- |
| `CormorantGaramond-SemiBold.ttf` | Cormorant Garamond | 600    | 774 KB  |
| `NotoSerifTC-Medium.ttf`        | Noto Serif TC       | 500    | 10.0 MB |

Both are the site's own display families — Cormorant Garamond is
`--font-display`, and Noto Serif TC is the CJK member of that stack in
`src/app/globals.css`. Cards therefore look like the pages they point at.

The weights match the entry page's `h1`, which is `font-display font-semibold`
(600). 500 is the heaviest Noto Serif TC weight the site loads.

**Noto Serif TC is the complete face — 20,748 mapped codepoints, not a subset.**
That is deliberate. A subset would render tofu the first time an editor drops in
a post using a character outside it, which is exactly the silent failure this
whole route exists to prevent. 10 MB buys the file-drop guarantee. It costs
nothing at request time: these routes are prerendered at build, and Satori
parses the font's tables lazily — a cold Traditional Chinese card measures
around 200 ms, a warm one around 25 ms.

## Provenance and how to regenerate

Upstream is the `google/fonts` repository. Both families ship there only as
variable fonts, and **their variable defaults are wrong for this use** — the
`NotoSerifTC[wght].ttf` default instance is 200 (ExtraLight), which would render
the cards spindly. So each is instanced to a fixed weight with `fonttools`
before being committed. `fonttools` is an authoring-time tool; it is not, and
should not become, a dependency of this project.

```sh
# 1. Fetch the upstream variable fonts (into a scratch directory, not the repo)
curl -sL -o 'CormorantGaramond[wght].ttf' \
  'https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf'
curl -sL -o 'NotoSerifTC[wght].ttf' \
  'https://github.com/google/fonts/raw/main/ofl/notoseriftc/NotoSerifTC%5Bwght%5D.ttf'

# 2. Instance each to a single static weight
python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

for src, wght, out in [
    ('CormorantGaramond[wght].ttf', 600, 'CormorantGaramond-SemiBold.ttf'),
    ('NotoSerifTC[wght].ttf',       500, 'NotoSerifTC-Medium.ttf'),
]:
    f = TTFont(src)
    instantiateVariableFont(f, {'wght': wght}, inplace=True, updateFontNames=True)
    f.save(out)
PY
```

Then copy the two static files into this folder. If you change a weight here,
change the matching `weight` in `src/lib/og/journal-card.tsx` too — Satori
matches on the number you declare, not on anything inside the file.

## Licensing

Both families are under the SIL Open Font License 1.1, which permits embedding
and redistribution. The licences are committed beside the binaries as
`OFL-CormorantGaramond.txt` and `OFL-NotoSerifTC.txt`. Instancing a variable
font is a Modified Version under the OFL; the reserved font names are unchanged
and the licences travel with the files, which is what the OFL asks for.
