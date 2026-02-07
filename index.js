const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// API: List all documents in public/docs, organized by subfolder
app.get('/api/documents', (req, res) => {
    const docsDir = path.join(__dirname, 'public', 'docs');
    const result = {};

    try {
        const entries = fs.readdirSync(docsDir, { withFileTypes: true });
        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const categoryPath = path.join(docsDir, entry.name);
                const files = fs.readdirSync(categoryPath).filter(f =>
                    /\.(pdf|doc|docx)$/i.test(f)
                );
                result[entry.name] = files.map(f => ({
                    name: f,
                    url: `/docs/${entry.name}/${f}`
                }));
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read documents directory' });
    }

    res.json(result);
});

// API: List all images in public/images
app.get('/api/images', (req, res) => {
    const imgDir = path.join(__dirname, 'public', 'images');
    const result = [];

    try {
        const files = fs.readdirSync(imgDir).filter(f =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
        );
        files.forEach(f => {
            result.push({ name: f, url: `/images/${f}` });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read images directory' });
    }

    res.json(result);
});

// API: List all videos in public/videos
app.get('/api/videos', (req, res) => {
    const vidDir = path.join(__dirname, 'public', 'videos');
    const result = [];

    try {
        const files = fs.readdirSync(vidDir).filter(f =>
            /\.(mp4|mov|webm)$/i.test(f)
        );
        files.forEach(f => {
            result.push({ name: f, url: `/videos/${f}` });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read videos directory' });
    }

    res.json(result);
});

// 404 catch-all — serve index.html for client-side routing
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
