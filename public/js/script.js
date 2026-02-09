document.addEventListener('DOMContentLoaded', function () {
    setupWarning();
    setupNavigation();

    // Page-specific rendering
    if (document.getElementById('videos-container')) {
        renderVideos();
    }
    if (document.getElementById('docs-container')) {
        renderDocuments();
        setupPdfViewer();
    }
    if (document.getElementById('gallery-container')) {
        renderImages();
        setupLightbox();
    }
    if (document.getElementById('notes-container')) {
        renderNotes();
    }

    // Scroll spy only on pages with sections
    if (document.querySelectorAll('.section').length) {
        setupScrollSpy();
    }
});

// --- Content warning popup ---
function setupWarning() {
    var overlay = document.getElementById('warning-overlay');
    var acceptBtn = document.getElementById('warning-accept');
    var leaveBtn = document.getElementById('warning-leave');

    if (!overlay) return;

    if (sessionStorage.getItem('warning-accepted')) {
        overlay.classList.add('dismissed');
        return;
    }

    document.body.style.overflow = 'hidden';

    acceptBtn.addEventListener('click', function () {
        sessionStorage.setItem('warning-accepted', '1');
        overlay.classList.add('dismissed');
        document.body.style.overflow = '';
    });

    leaveBtn.addEventListener('click', function () {
        window.location.href = 'about:blank';
    });
}

// --- Render videos ---
function renderVideos() {
    var container = document.getElementById('videos-container');
    if (!container || !SITE_DATA.videos) return;

    SITE_DATA.videos.forEach(function (video) {
        var card = document.createElement('div');
        card.className = 'video-card';

        var videoEl = document.createElement('video');
        videoEl.controls = true;
        videoEl.preload = 'metadata';
        videoEl.playsInline = true;
        videoEl.setAttribute('controlsList', 'nodownload');

        var source = document.createElement('source');
        source.src = 'videos/' + video.filename;
        source.type = 'video/mp4';
        videoEl.appendChild(source);

        var label = document.createElement('div');
        label.className = 'video-label';
        label.textContent = video.id;

        card.appendChild(videoEl);
        card.appendChild(label);

        // Add video note as a caption under the video
        if (SITE_DATA.videoNotes && SITE_DATA.videoNotes.length > 0) {
            SITE_DATA.videoNotes.forEach(function(note) {
                if (note.videoId === video.id) {
                    var caption = document.createElement('div');
                    caption.className = 'gallery-caption';
                    caption.textContent = note.content;
                    card.appendChild(caption);
                }
            });
        }

        container.appendChild(card);
    });
}

// --- PDF custom names (localStorage) ---
function getPdfCustomNames() {
    try {
        return JSON.parse(localStorage.getItem('pdf-custom-names') || '{}');
    } catch (e) {
        return {};
    }
}

function setPdfCustomName(filename, name) {
    var names = getPdfCustomNames();
    if (name && name.trim()) {
        names[filename] = name.trim();
    } else {
        delete names[filename];
    }
    localStorage.setItem('pdf-custom-names', JSON.stringify(names));
}

// --- Render documents ---
function renderDocuments() {
    var container = document.getElementById('docs-container');
    if (!container || !SITE_DATA.documents) return;

    var customNames = getPdfCustomNames();

    SITE_DATA.documents.forEach(function (doc) {
        var card = document.createElement('button');
        card.className = 'doc-card';
        card.type = 'button';

        var displayTitle = customNames[doc.filename] || doc.title;

        card.innerHTML =
            '<div class="doc-icon">PDF</div>' +
            '<div class="doc-info">' +
                '<div class="doc-title">' + escapeHtml(displayTitle) + '</div>' +
                '<div class="doc-filename">' + escapeHtml(doc.filename) + '</div>' +
            '</div>' +
            '<div class="doc-arrow">&#8250;</div>';

        card.addEventListener('click', function () {
            openPdfViewer(doc.url, displayTitle, doc.filename);
        });

        container.appendChild(card);
    });
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Render images ---
function renderImages() {
    var container = document.getElementById('gallery-container');
    if (!container || !SITE_DATA.images) return;

    SITE_DATA.images.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'gallery-item';

        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.loading = 'lazy';

        var caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = item.caption;

        div.appendChild(img);
        div.appendChild(caption);

        div.addEventListener('click', function () {
            openLightbox(item.src, item.caption);
        });

        container.appendChild(div);
    });
}

// --- Render notes ---
function renderNotes() {
    var container = document.getElementById('notes-container');
    if (!container || !SITE_DATA.notes) return;

    if (SITE_DATA.notes.length === 0) {
        container.innerHTML = '<p class="notes-empty">No notes yet. Add notes in data.js.</p>';
        return;
    }

    SITE_DATA.notes.forEach(function (note) {
        var card = document.createElement('div');
        card.className = 'note-card';

        card.innerHTML =
            '<h3 class="note-title">' + note.title + '</h3>' +
            '<div class="note-content">' + note.content + '</div>';

        container.appendChild(card);
    });
}

// --- Navigation: hamburger toggle ---
function setupNavigation() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('open');
            links.classList.toggle('open');
        });

        var navLinks = links.querySelectorAll('.nav-link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                toggle.classList.remove('open');
                links.classList.remove('open');
            });
        }
    }
}

// --- Scroll spy: highlight active nav link ---
function setupScrollSpy() {
    var sections = document.querySelectorAll('.section');
    var navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                for (var i = 0; i < navLinks.length; i++) {
                    if (navLinks[i].getAttribute('href') === '#' + id) {
                        navLinks[i].classList.add('active');
                    } else {
                        navLinks[i].classList.remove('active');
                    }
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    for (var i = 0; i < sections.length; i++) {
        observer.observe(sections[i]);
    }
}

// --- Lightbox ---
function openLightbox(src, caption) {
    var lightbox = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    var cap = document.getElementById('lightbox-caption');

    img.src = src;
    cap.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function setupLightbox() {
    var lightbox = document.getElementById('lightbox');
    var closeBtn = document.getElementById('lightbox-close');

    if (!lightbox || !closeBtn) return;

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
}

// --- PDF Viewer ---
var currentPdfFilename = '';

function openPdfViewer(url, title, filename) {
    var viewer = document.getElementById('pdf-viewer');
    var frame = document.getElementById('pdf-frame');
    var titleEl = document.getElementById('pdf-title');

    currentPdfFilename = filename || '';
    titleEl.textContent = title;
    frame.src = url;
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function setupPdfViewer() {
    var viewer = document.getElementById('pdf-viewer');
    var closeBtn = document.getElementById('pdf-close');
    var openBtn = document.getElementById('pdf-open-tab');
    var renameBtn = document.getElementById('pdf-rename');

    if (!viewer || !closeBtn) return;

    function closePdfViewer() {
        viewer.classList.remove('open');
        document.getElementById('pdf-frame').src = '';
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closePdfViewer);

    if (openBtn) {
        openBtn.addEventListener('click', function () {
            var frame = document.getElementById('pdf-frame');
            window.open(frame.src, '_blank');
        });
    }

    if (renameBtn) {
        renameBtn.addEventListener('click', function () {
            var titleEl = document.getElementById('pdf-title');
            var customNames = getPdfCustomNames();
            var currentName = customNames[currentPdfFilename] || titleEl.textContent;
            var newName = prompt('Enter a custom name for this document:', currentName);
            if (newName !== null) {
                setPdfCustomName(currentPdfFilename, newName);
                titleEl.textContent = newName || currentPdfFilename;
                // Refresh the document list
                var container = document.getElementById('docs-container');
                if (container) {
                    container.innerHTML = '';
                    renderDocuments();
                }
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && viewer.classList.contains('open')) {
            closePdfViewer();
        }
    });
}
