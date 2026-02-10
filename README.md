# The Epstein Files Web Archive

This project is a static web archive for organizing and viewing documents, videos, images, and personal notes related to the Epstein case. It is designed for informational and educational purposes only.

**Live site:** https://epstin.netlify.app/

---

## Contributing

The site is rebuilt automatically on every push. Data is generated from the files in the repository plus optional overrides in `public/data/metadata.json`.

**Adding content is simple:**
- **PDFs** -- drop into the right `public/docs/` subfolder and push
- **Videos** -- drop `.mp4` into `public/videos/` and push
- **Images** -- drop into `public/images/` and push
- **Titles and person tags** -- edit `public/data/metadata.json` (optional)

For full step-by-step instructions (including how to do it on GitHub.com without installing anything), see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## How it works

When you push to git, Netlify runs a build script (`scripts/generate-site-data.js`) that:
1. Scans all PDF files in `public/docs/` and its subfolders
2. Scans all videos in `public/videos/`
3. Scans all images in `public/images/`
4. Reads your overrides from `public/data/metadata.json`
5. Generates `public/data/site_data.json` which the website reads

You never need to edit `site_data.json` by hand. It is generated automatically.

---

## Project structure

```
public/
  index.html                  Main page (documents, images, notes)
  videos.html                 Videos page
  buletingbord.html            Bulletin board (persons and connections)
  css/
    styles.css                Main stylesheet
    bulletin.css              Bulletin board styles
  js/
    script.js                 Main site logic
    bulletin.js               Bulletin board logic
  data/
    metadata.json             YOUR FILE - edit this to add names and tags
    site_data.json            Generated automatically (do not edit)
    bulletin.json             Bulletin board data (persons, connections)
  docs/
    court-documents/          Court document PDFs
    emails/                   Email PDFs
    other/                    Other PDFs
  videos/                     Video files
  images/                     Gallery images
    persons/                  Person photos (used by bulletin board)
scripts/
  generate-site-data.js       Build script (runs on Netlify)
netlify.toml                  Netlify config
```

---

## Local development

```
npm run build     # Generate site_data.json from folders
npm start         # Start local server on port 3000
npm run dev       # Both at once (build + start)
```

---

## Disclaimer

This site is for informational and educational purposes only. Some content may be sensitive or disturbing.

---

**Maintained by:** GGV7373
