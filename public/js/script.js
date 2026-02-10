// Load site data from JSON then initialize app
function startApp() {
    function ready() {
        setupWarning();
        setupNavigation();

        // Page-specific rendering
        if (document.getElementById('videos-container')) {
            renderVideos();
        }
        if (document.getElementById('docs-container')) {
            setupDocFilters();
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }
}

fetch('data/site_data.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
        window.SITE_DATA = data;
        startApp();
    })
    .catch(function () {
        // If load fails, fall back to any existing SITE_DATA and start anyway
        window.SITE_DATA = window.SITE_DATA || {};
        startApp();
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

// --- Document filters state ---
var activePersonFilter = 'all';
var activeCategoryFilter = 'all';

// --- Build filter bar ---
function setupDocFilters() {
    var filtersEl = document.getElementById('docs-filters');
    if (!filtersEl || !SITE_DATA.documents) return;

    // Collect unique persons from all documents
    var personsSet = {};
    SITE_DATA.documents.forEach(function (doc) {
        (doc.persons || []).forEach(function (p) {
            personsSet[p] = true;
        });
    });
    var personsList = Object.keys(personsSet).sort();

    // Collect categories that actually have documents
    var usedCategories = {};
    SITE_DATA.documents.forEach(function (doc) {
        if (doc.category) usedCategories[doc.category] = true;
    });

    var categories = (SITE_DATA.docCategories || []).filter(function (c) {
        return usedCategories[c.id];
    });

    // Build filter HTML
    var html = '';

    // Category filter
    if (categories.length > 0) {
        html += '<div class="filter-group">';
        html += '<span class="filter-label">Category:</span>';
        html += '<div class="filter-chips" id="filter-category">';
        html += '<button class="filter-chip active" data-value="all">All</button>';
        categories.forEach(function (cat) {
            html += '<button class="filter-chip" data-value="' + escapeHtml(cat.id) + '">' + escapeHtml(cat.label) + '</button>';
        });
        html += '</div></div>';
    }

    // Person filter
    if (personsList.length > 0) {
        html += '<div class="filter-group">';
        html += '<span class="filter-label">Person:</span>';
        html += '<div class="filter-chips" id="filter-person">';
        html += '<button class="filter-chip active" data-value="all">All</button>';
        personsList.forEach(function (name) {
            html += '<button class="filter-chip" data-value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</button>';
        });
        html += '</div></div>';
    }

    filtersEl.innerHTML = html;

    // Category chip click handlers
    var catChips = filtersEl.querySelectorAll('#filter-category .filter-chip');
    for (var i = 0; i < catChips.length; i++) {
        catChips[i].addEventListener('click', function () {
            activeCategoryFilter = this.getAttribute('data-value');
            setActiveChip(filtersEl.querySelectorAll('#filter-category .filter-chip'), this);
            renderDocuments();
        });
    }

    // Person chip click handlers
    var personChips = filtersEl.querySelectorAll('#filter-person .filter-chip');
    for (var j = 0; j < personChips.length; j++) {
        personChips[j].addEventListener('click', function () {
            activePersonFilter = this.getAttribute('data-value');
            setActiveChip(filtersEl.querySelectorAll('#filter-person .filter-chip'), this);
            renderDocuments();
        });
    }
}

function setActiveChip(chips, active) {
    for (var i = 0; i < chips.length; i++) {
        chips[i].classList.remove('active');
    }
    active.classList.add('active');
}

// --- Render documents (grouped by category, filtered) ---
function renderDocuments() {
    var container = document.getElementById('docs-container');
    if (!container || !SITE_DATA.documents) return;

    container.innerHTML = '';

    // Filter documents
    var filtered = SITE_DATA.documents.filter(function (doc) {
        var catMatch = activeCategoryFilter === 'all' || doc.category === activeCategoryFilter;
        var personMatch = activePersonFilter === 'all' ||
            (doc.persons && doc.persons.indexOf(activePersonFilter) >= 0);
        return catMatch && personMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p class="notes-empty">No documents match the selected filters.</p>';
        return;
    }

    // Build category lookup
    var catMap = {};
    (SITE_DATA.docCategories || []).forEach(function (c) {
        catMap[c.id] = c.label;
    });

    // Group by category
    var groups = {};
    var groupOrder = [];
    filtered.forEach(function (doc) {
        var cat = doc.category || 'other';
        if (!groups[cat]) {
            groups[cat] = [];
            groupOrder.push(cat);
        }
        groups[cat].push(doc);
    });

    // Render each group
    groupOrder.forEach(function (catId) {
        var docs = groups[catId];
        var catLabel = catMap[catId] || catId;

        // Category header
        var header = document.createElement('div');
        header.className = 'docs-category-header';
        header.textContent = catLabel;
        container.appendChild(header);

        // Document cards in this category
        docs.forEach(function (doc) {
            var card = document.createElement('button');
            card.className = 'doc-card';
            card.type = 'button';

            var displayTitle = doc.displayName || doc.filename;

            // Person tags
            var personTags = '';
            if (doc.persons && doc.persons.length > 0) {
                personTags = '<div class="doc-persons">';
                doc.persons.forEach(function (p) {
                    personTags += '<span class="doc-person-tag">' + escapeHtml(p) + '</span>';
                });
                personTags += '</div>';
            }

            card.innerHTML =
                '<div class="doc-icon">PDF</div>' +
                '<div class="doc-info">' +
                    '<div class="doc-title">' + escapeHtml(displayTitle) + '</div>' +
                    '<div class="doc-filename">' + escapeHtml(doc.filename) + '</div>' +
                    personTags +
                '</div>' +
                '<div class="doc-arrow">&#8250;</div>';

            card.addEventListener('click', function () {
                openPdfViewer(doc.url, displayTitle, doc.filename);
            });

            container.appendChild(card);
        });
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

    // Auto-set active nav link based on current file path
    try {
        var path = window.location.pathname.split('/').pop();
        if (!path) path = 'index.html';
        var allNavLinks = document.querySelectorAll('.nav-link');
        for (var j = 0; j < allNavLinks.length; j++) {
            var href = allNavLinks[j].getAttribute('href');
            // Normalize href (ignore query/hash)
            var hrefFile = href.split('?')[0].split('#')[0];
            if (hrefFile === path || (hrefFile === 'index.html' && path === 'index.html')) {
                allNavLinks[j].classList.add('active');
            } else {
                allNavLinks[j].classList.remove('active');
            }
        }
    } catch (e) {
        // Silent fail — navigation still works without JS support for active state
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
            // Find the document in SITE_DATA
            var doc = null;
            for (var i = 0; i < SITE_DATA.documents.length; i++) {
                if (SITE_DATA.documents[i].filename === currentPdfFilename) {
                    doc = SITE_DATA.documents[i];
                    break;
                }
            }
            if (!doc) return;

            var currentName = doc.displayName || doc.filename;
            var newName = prompt('Enter a display name for this document:\n(The source filename "' + doc.filename + '" stays the same)', currentName);
            if (newName !== null && newName.trim()) {
                doc.displayName = newName.trim();
                titleEl.textContent = doc.displayName;
                renderDocuments();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && viewer.classList.contains('open')) {
            closePdfViewer();
        }
    });
}
