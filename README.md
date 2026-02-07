# The Epstein Files Web Archive

This project is a static web archive for organizing and viewing documents, videos, images, and personal notes related to the Epstein case. It is designed for informational and educational purposes only.

## Features
- **Live Demo**: Access the archive at https://epstin.netlify.app/
- **Archive Browsing**: Easy navigation through organized content categories.
- **Videos**: Browse and play video evidence, each with optional notes/captions.
- **Documents**: View and open court documents (PDFs) in a built-in viewer.
- **Images**: Browse a gallery of images with captions and lightbox support.
- **Notes**: Add and display personal notes for documents or general observations.
- **Video Notes**: Add notes for each video, displayed as captions under the video.
- **Content Warning**: Popup warning for sensitive material.
- **Responsive Design**: Works on desktop and mobile devices.

## Project Structure
```
public/
  index.html         # Main HTML file
  css/styles.css     # Main stylesheet
  js/
    data.js          # All site content (videos, docs, images, notes)
    script.js        # Main site logic
  images/            # Image files
  videos/            # Video files
  docs/court-documents/ # PDF documents
netlify.toml         # Netlify deployment config 
package.json         # For dependency management (if needed)
```

## How to Add Content
- **Videos**: Add video files to `public/videos/` and list them in `videos` in `data.js`.
- **Documents**: Add PDFs to `public/docs/court-documents/` and list them in `documents` in `data.js`.
- **Images**: Add images to `public/images/` and list them in `images` in `data.js`.
- **Notes**: Add general notes in the `notes` array in `data.js`.
- **Video Notes**: Add notes for specific videos in the `videoNotes` array in `data.js` (matched by `videoId`).

## Usage
1. Clone or download this repository.
2. Open `public/index.html` in your browser.
3. Edit `public/js/data.js` to add or update content.

## Customization
- Update styles in `public/css/styles.css`.
- Modify layout or sections in `public/index.html`.
- Extend functionality in `public/js/script.js`.

## Disclaimer
This site is for informational and educational purposes only. Some content may be sensitive or disturbing.

---

**Maintained by:** GGV7373
