## Contributing to the Epstein Files archive

Thank you for contributing. This guide explains how to add documents, videos, images, and bulletin board entries. There are two paths below -- one for beginners and one for experienced contributors.

### Quick rules (always)
- Use clear, descriptive commit messages.
- Keep file/folder names simple and lowercase where possible (numbers and hyphens OK).
- Put PDF files under `public/docs/<category>/` (see categories below).
- If you add or update `data/metadata.json`, make sure it stays valid JSON.
- Do not edit `public/data/site_data.json` - it is generated automatically.

---

### For beginners (no coding experience needed)

You can add content directly on GitHub.com without installing anything.

#### Adding a PDF

1. Go to the repository on GitHub
2. Navigate to the folder where the PDF belongs:
   - `public/docs/court-documents/` - court filings, legal docs
   - `public/docs/emails/` - e-mails
   - `public/docs/other/` - anything else
3. Click **"Add file"** > **"Upload files"**
4. Drag your PDF file into the upload area
5. Write a short commit message like "Add document EFTA01234567"
6. Click **"Commit changes"**

The PDF will appear on the site automatically within a few minutes. It will use the filename as its title.

#### Giving a PDF a readable title (optional)

If you want a nicer title or want to tag which persons appear in the document:

1. Go to `public/data/metadata.json` on GitHub
2. Click the pencil icon to edit
3. Find the `"documentOverrides"` section (near the top of the file)
4. Add a comma after the last entry's closing `}`, then add your entry:

```json
    "EFTA01249597.pdf": {
      "displayName": "Report about Prince Andrew",
      "persons": ["Jeffrey Epstein", "Prince Andrew"]
    },
    "YOUR_NEW_FILE.pdf": {
      "displayName": "Your title here",
      "persons": ["Person One", "Person Two"]
    }
```

5. Click **"Commit changes"**

You can skip `"persons"` if you do not know who is in the document:

```json
"EFTA09999999.pdf": {
  "displayName": "Email about money transfers"
}
```

**Common mistakes to avoid:**
- Forgetting the comma between entries
- Misspelling the filename (must match exactly, including `.pdf`)
- Putting two person names in one string (wrong: `"Person One, Person Two"` / right: `"Person One", "Person Two"`)

#### Adding a video

1. Navigate to `public/videos/` on GitHub
2. Click **"Add file"** > **"Upload files"**
3. Upload your `.mp4` file
4. Commit - it shows up automatically

#### Adding an image

1. Navigate to `public/images/` on GitHub
2. Upload your `.jpg`, `.png`, or `.webp` file
3. Commit - it shows up in the gallery automatically

---

### For experienced contributors

#### Setup

```bash
git clone https://github.com/GGV7373/webside-epstin.git
cd webside-epstin
npm install
```

#### Workflow

```bash
# 1. Create a branch
git checkout -b add/EFTA12345678

# 2. Add your files
#    Drop PDFs into public/docs/emails/ (or court-documents/ or other/)
#    Drop videos into public/videos/
#    Drop images into public/images/

# 3. (Optional) Edit metadata
#    Open public/data/metadata.json and add display names, person tags, etc.

# 4. Build and test locally
npm run dev
#    This generates site_data.json and starts a server at http://localhost:3000

# 5. Commit and push
git add .
git commit -m "Add documents about XYZ"
git push -u origin add/EFTA12345678

# 6. Open a pull request on GitHub
```

#### Bulk uploads

- Use descriptive branch names like `feature/docs/batch-2026-02`.
- Split very large uploads into multiple PRs if each one adds >50 files to keep review manageable.
- Provide a short manifest listing your files and metadata to make review easier.

When adding many person tags, maintain consistency:
- Use the same full name string each time (e.g., "Jeffrey Epstein").
- If a person should be split or merged, open an issue before large refactors.

---

### Adding a person to the bulletin board

The bulletin board (`buletingbord.html`) uses `public/data/bulletin.json`. This file is **not** auto-generated -- you edit it by hand.

1. Open `public/data/bulletin.json`
2. Add an entry to the `"persons"` array:

```json
{
  "id": "lastname",
  "name": "Full Name",
  "role": "Their role (e.g. Peripheral Contact)",
  "tier": 3,
  "age": "50",
  "status": "Named in Documents",
  "photo": "images/persons/lastname.jpg",
  "reason": "Why they are on the list.",
  "details": "More background info."
}
```

3. Put their photo in `public/images/persons/` (use `.jpg` or `.webp`)
4. Add connections to other persons in the `"extraConnections"` array:

```json
{ "from": "epstein", "to": "lastname", "weight": 2 }
```

**Tier levels:**

| Tier | Meaning | Ring on board |
|------|---------|---------------|
| 0 | Central figure | Center |
| 1 | Inner circle / co-conspirators | First ring |
| 2 | Persons of interest | Second ring |
| 3 | Peripheral contacts | Outer ring |

**Connection weights:**

| Weight | Meaning | Line style |
|--------|---------|------------|
| 1 | Weak / mentioned | Thin, faded |
| 2 | Moderate / multiple contacts | Medium |
| 3 | Strong / close ties | Thick, bright |

---

### Adding a document category

If you need a new category (like "financial-records"):

1. Create the folder: `public/docs/financial-records/`
2. Open `scripts/generate-site-data.js`
3. Add the category to the `ALL_CATEGORIES` array:

```javascript
{ id: 'financial-records', label: 'Financial Records' }
```

The folder name must match the `id` exactly. Include a note in your PR about the new category.

---

### File naming

- PDFs: use the original EFTA ID when possible (e.g. `EFTA01234567.pdf`)
- Images: descriptive lowercase names (e.g. `flight_log_page3.jpg`)
- Videos: use the original EFTA ID (e.g. `EFTA01234567.mp4`)
- Person photos: `firstname_lastname.jpg` in lowercase (e.g. `bill_clinton.jpg`)

---

### PR checklist (suggested)
- [ ] Files are in the correct `docs/` folder.
- [ ] `data/metadata.json` is valid JSON and includes only intended edits.
- [ ] Ran `node scripts/generate-site-data.js` locally and checked `data/site_data.json` looks correct.
- [ ] Commit message explains what was added/changed.

---

### Contact / Questions

If you're not sure where to place a file or how to tag persons, open an issue with the filename and a short description. Maintainers will advise before you open a large PR.

Thank you for contributing!
