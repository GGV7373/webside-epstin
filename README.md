# The Epstein Files Web Archive

This project is a static web archive for organizing and viewing documents, videos, images, and personal notes related to the Epstein case. It is designed for informational and educational purposes only.

**Live site:** https://epstin.netlify.app/

---

## How to add a PDF

### Step 1 - Put the PDF in the right folder

Pick the folder that matches the type of document:

| Folder                        | Use for                    |
|-------------------------------|----------------------------|
| `public/docs/court-documents/`| Court filings, legal docs  |
| `public/docs/emails/`         | E-mails                    |
| `public/docs/other/`          | Anything else              |

Just drag or copy the PDF file into the folder. That is all you need to do for it to show up on the site.

### Step 2 (optional) - Give it a name and tag persons

If you skip this step the PDF will show up with its filename as the title (for example "EFTA01234567"). If you want a readable name or want to tag which persons are mentioned in the document, open the file:

```
public/data/metadata.json
```

Find the `"documentOverrides"` section and add a new line for your PDF. Copy this template and change the values:

```json
"YOUR_FILENAME.pdf": {
  "displayName": "A short title for the document",
  "persons": ["Person One", "Person Two"]
}
```

**Example** - you added a PDF called `EFTA09999999.pdf` to the emails folder:

```json
"EFTA09999999.pdf": {
  "displayName": "Email about money transfers",
  "persons": ["Jeffrey Epstein", "Bill Gates"]
}
```

Make sure to:
- Put a comma after the previous entry before adding yours
- Use the exact filename (including `.pdf`)
- Put each person name as a separate item in the list

You can also skip `"persons"` if you do not know who is in the document:

```json
"EFTA09999999.pdf": {
  "displayName": "Email about money transfers"
}
```

### Step 3 - Push to git

```
git add .
git commit -m "Add new document"
git push
```

Netlify will automatically rebuild the site. Your PDF will appear within a few minutes.

---

## How to add a video

1. Put the video file (`.mp4`) in `public/videos/`
2. Push to git
3. Done - it shows up automatically

To add a note/caption under a video, open `public/data/metadata.json` and add an entry to the `"videoNotes"` list:

```json
{ "videoId": "EFTA01234567", "content": "Description of the video." }
```

The `videoId` is the filename without `.mp4`.

---

## How to add an image

1. Put the image file (`.jpg`, `.png`, `.webp`) in `public/images/`
2. Push to git
3. Done - it shows up in the gallery automatically

To add a caption, open `public/data/metadata.json` and add an entry to `"imageOverrides"`:

```json
"myimage.jpg": {
  "alt": "Short description",
  "caption": "Caption shown under the image"
}
```

---

## How to add a note

Open `public/data/metadata.json` and add an entry to the `"notes"` list:

```json
{
  "title": "My note title",
  "content": "The text of the note."
}
```

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
