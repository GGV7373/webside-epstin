document.addEventListener('DOMContentLoaded', () => {
    renderMeta();
    renderTimeline();
    renderKeyFigures();
    renderDocuments();
    renderGallery();
    renderResources();

    setupNavigation();
    setupScrollSpy();
    setupLightbox();
});

// --- Render site metadata ---
function renderMeta() {
    const { siteTitle, siteSubtitle, heroTagline, footerText } = SITE_DATA.meta;

    document.getElementById('nav-brand').textContent = siteTitle;
    document.getElementById('hero-title').textContent = siteTitle;
    document.getElementById('hero-subtitle').textContent = siteSubtitle;
    document.getElementById('hero-tagline').textContent = heroTagline;
    document.getElementById('footer-text').textContent = footerText;
    document.title = siteTitle;
}

// --- Render timeline ---
function renderTimeline() {
    var container = document.getElementById('timeline-container');
    if (!container || !SITE_DATA.timeline) return;

    SITE_DATA.timeline.forEach(function (entry, index) {
        var side = index % 2 === 0 ? 'left' : 'right';

        var div = document.createElement('div');
        div.className = 'timeline-entry ' + side + ' fade-in';
        div.style.animationDelay = (index * 0.1) + 's';

        var sourceHTML = '';
        if (entry.source && entry.sourceLabel) {
            sourceHTML = '<a href="' + entry.source + '" class="timeline-source" target="_blank" rel="noopener">' + entry.sourceLabel + '</a>';
        }

        div.innerHTML =
            '<div class="timeline-card">' +
                '<div class="timeline-date">' + entry.date + '</div>' +
                '<h3 class="timeline-title">' + entry.title + '</h3>' +
                '<p class="timeline-desc">' + entry.description + '</p>' +
                sourceHTML +
            '</div>';

        container.appendChild(div);
    });
}

// --- Render key figures ---
function renderKeyFigures() {
    var container = document.getElementById('figures-container');
    if (!container || !SITE_DATA.keyFigures) return;

    SITE_DATA.keyFigures.forEach(function (figure, index) {
        var card = document.createElement('div');
        card.className = 'figure-card fade-in';
        card.style.animationDelay = (index * 0.15) + 's';

        var sourcesHTML = '';
        if (figure.sources) {
            sourcesHTML = figure.sources.map(function (s) {
                return '<a href="' + s.url + '" class="figure-source-link" target="_blank" rel="noopener">' + s.label + '</a>';
            }).join('');
        }

        card.innerHTML =
            '<img src="' + figure.image + '" alt="' + figure.name + '" class="figure-img" loading="lazy">' +
            '<div class="figure-info">' +
                '<h3 class="figure-name">' + figure.name + '</h3>' +
                '<div class="figure-role">' + figure.role + '</div>' +
                '<p class="figure-desc">' + figure.description + '</p>' +
                '<div class="figure-sources">' + sourcesHTML + '</div>' +
            '</div>';

        container.appendChild(card);
    });
}

// --- Render documents with category filter ---
function renderDocuments() {
    var filterContainer = document.getElementById('docs-filter');
    var listContainer = document.getElementById('docs-container');
    if (!filterContainer || !listContainer || !SITE_DATA.documents) return;

    var categories = [];
    SITE_DATA.documents.forEach(function (d) {
        if (categories.indexOf(d.category) === -1) {
            categories.push(d.category);
        }
    });

    filterContainer.appendChild(createFilterTab('All', 'all', true));
    categories.forEach(function (cat) {
        var label = cat.replace(/-/g, ' ');
        filterContainer.appendChild(createFilterTab(label, cat, false));
    });

    SITE_DATA.documents.forEach(function (doc, index) {
        var card = document.createElement('div');
        card.className = 'doc-card fade-in';
        card.dataset.category = doc.category;
        card.style.animationDelay = (index * 0.1) + 's';

        card.innerHTML =
            '<div class="doc-info">' +
                '<h3 class="doc-title">' + doc.title + '</h3>' +
                '<div class="doc-meta">' +
                    '<span class="doc-category">' + doc.category.replace(/-/g, ' ') + '</span>' +
                    '<span>' + doc.date + '</span>' +
                    '<span>' + doc.pages + ' page' + (doc.pages !== 1 ? 's' : '') + '</span>' +
                '</div>' +
                '<p class="doc-desc">' + doc.description + '</p>' +
            '</div>' +
            '<a href="' + doc.url + '" class="doc-link" target="_blank" rel="noopener">View PDF</a>';

        listContainer.appendChild(card);
    });

    setupFilterTabs(filterContainer, listContainer);
}

// --- Render gallery with category filter ---
function renderGallery() {
    var filterContainer = document.getElementById('gallery-filter');
    var gridContainer = document.getElementById('gallery-container');
    if (!filterContainer || !gridContainer || !SITE_DATA.gallery) return;

    var categories = [];
    SITE_DATA.gallery.forEach(function (g) {
        if (categories.indexOf(g.category) === -1) {
            categories.push(g.category);
        }
    });

    filterContainer.appendChild(createFilterTab('All', 'all', true));
    categories.forEach(function (cat) {
        filterContainer.appendChild(createFilterTab(cat, cat, false));
    });

    SITE_DATA.gallery.forEach(function (item, index) {
        var div = document.createElement('div');
        div.className = 'gallery-item fade-in';
        div.dataset.category = item.category;
        div.style.animationDelay = (index * 0.1) + 's';

        div.innerHTML =
            '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy">' +
            '<div class="gallery-caption">' + item.caption + '</div>';

        div.addEventListener('click', (function (src, caption) {
            return function () {
                openLightbox(src, caption);
            };
        })(item.src, item.caption));

        gridContainer.appendChild(div);
    });

    setupFilterTabs(filterContainer, gridContainer);
}

// --- Render resources ---
function renderResources() {
    var container = document.getElementById('resources-container');
    if (!container || !SITE_DATA.resources) return;

    SITE_DATA.resources.forEach(function (res, index) {
        var item = document.createElement('div');
        item.className = 'resource-item fade-in';
        item.style.animationDelay = (index * 0.1) + 's';

        item.innerHTML =
            '<span class="resource-type-badge">' + res.type + '</span>' +
            '<div class="resource-info">' +
                '<h3 class="resource-title">' +
                    '<a href="' + res.url + '" target="_blank" rel="noopener">' + res.title + '</a>' +
                '</h3>' +
                '<p class="resource-desc">' + res.description + '</p>' +
            '</div>';

        container.appendChild(item);
    });
}

// --- Helpers: filter tabs ---
function createFilterTab(label, value, isActive) {
    var btn = document.createElement('button');
    btn.className = 'filter-tab' + (isActive ? ' active' : '');
    btn.dataset.filter = value;
    btn.textContent = label;
    return btn;
}

function setupFilterTabs(tabsContainer, itemsContainer) {
    tabsContainer.addEventListener('click', function (e) {
        if (!e.target.classList.contains('filter-tab')) return;

        var tabs = tabsContainer.querySelectorAll('.filter-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }
        e.target.classList.add('active');

        var filter = e.target.dataset.filter;
        var items = itemsContainer.children;

        for (var j = 0; j < items.length; j++) {
            if (filter === 'all' || items[j].dataset.category === filter) {
                items[j].classList.remove('hidden');
            } else {
                items[j].classList.add('hidden');
            }
        }
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
