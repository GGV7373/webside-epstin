#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// --- Paths ---
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DOCS_DIR = path.join(PUBLIC_DIR, 'docs');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const METADATA_PATH = path.join(PUBLIC_DIR, 'data', 'metadata.json');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'data', 'site_data.json');

// --- Category definitions ---
// Category ID = folder name. Add new categories by creating a folder and adding an entry here.
const ALL_CATEGORIES = [
  { id: 'court-documents', label: 'Court Documents' },
  { id: 'emails', label: 'E-mails' },
  { id: 'reports', label: 'Reports' },
  { id: 'financial-records', label: 'Financial Records' },
  { id: 'other', label: 'Other' }
];

const KNOWN_FOLDERS = new Set(ALL_CATEGORIES.map(function (c) { return c.id; }));

// --- Helpers ---
function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, '');
}

// --- Scan Documents ---
function scanDocuments(metadata) {
  var overrides = (metadata && metadata.documentOverrides) || {};
  var documents = [];
  var foundFiles = new Set();

  if (!fs.existsSync(DOCS_DIR)) {
    console.warn('Warning: docs directory not found at ' + DOCS_DIR);
    return documents;
  }

  var folders = fs.readdirSync(DOCS_DIR).filter(function (f) {
    return fs.statSync(path.join(DOCS_DIR, f)).isDirectory();
  });

  folders.forEach(function (folder) {
    var categoryId = KNOWN_FOLDERS.has(folder) ? folder : 'other';
    if (!KNOWN_FOLDERS.has(folder)) {
      console.warn('Warning: Unknown docs folder "' + folder + '", mapping to "other"');
    }

    var folderPath = path.join(DOCS_DIR, folder);
    var files = fs.readdirSync(folderPath).filter(function (f) {
      return /\.pdf$/i.test(f);
    });

    files.forEach(function (file) {
      foundFiles.add(file);
      var override = overrides[file] || {};
      var entry = {
        displayName: override.displayName || stripExtension(file),
        filename: file,
        url: 'docs/' + folder + '/' + file,
        category: categoryId
      };
      if (override.persons && override.persons.length > 0) {
        entry.persons = override.persons;
      }
      documents.push(entry);
    });
  });

  // Warn about overrides with no matching file on disk
  Object.keys(overrides).forEach(function (key) {
    if (!foundFiles.has(key)) {
      console.warn('Warning: metadata override for "' + key + '" but no matching file found on disk');
    }
  });

  // Sort alphabetically by filename for deterministic output
  documents.sort(function (a, b) { return a.filename.localeCompare(b.filename); });

  return documents;
}

// --- Scan Videos ---
function scanVideos() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.warn('Warning: videos directory not found at ' + VIDEOS_DIR);
    return [];
  }

  return fs.readdirSync(VIDEOS_DIR)
    .filter(function (f) { return /\.(mp4|mov|webm)$/i.test(f); })
    .map(function (f) { return { filename: f, id: stripExtension(f) }; })
    .sort(function (a, b) { return a.filename.localeCompare(b.filename); });
}

// --- Scan Images (top-level only, excludes subdirectories like persons/) ---
function scanImages(metadata) {
  var overrides = (metadata && metadata.imageOverrides) || {};

  if (!fs.existsSync(IMAGES_DIR)) {
    console.warn('Warning: images directory not found at ' + IMAGES_DIR);
    return [];
  }

  return fs.readdirSync(IMAGES_DIR)
    .filter(function (f) {
      if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(f)) return false;
      return fs.statSync(path.join(IMAGES_DIR, f)).isFile();
    })
    .map(function (f) {
      var override = overrides[f] || {};
      var baseName = stripExtension(f);
      return {
        src: 'images/' + f,
        alt: override.alt || baseName,
        caption: override.caption || baseName
      };
    })
    .sort(function (a, b) { return a.src.localeCompare(b.src); });
}

// --- Main ---
function main() {
  console.log('Generating site_data.json...');

  var metadata = readJsonSafe(METADATA_PATH) || {};

  var videos = scanVideos();
  var documents = scanDocuments(metadata);
  var images = scanImages(metadata);

  var siteData = {
    videos: videos,
    docCategories: ALL_CATEGORIES,
    documents: documents,
    images: images,
    notes: metadata.notes || [],
    videoNotes: metadata.videoNotes || []
  };

  // Ensure data directory exists
  var dataDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(siteData, null, 2) + '\n');

  console.log('Done: ' + documents.length + ' documents, ' + videos.length + ' videos, ' + images.length + ' images');
}

main();
