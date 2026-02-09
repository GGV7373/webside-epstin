document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('bulletin-board');
  if (!container) return;

  fetch('data/bulletin.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { renderBoard(container, data); })
    .catch(function () { container.innerText = 'Could not load bulletin data.'; });
});

/* ---- Helpers ---- */
function el(tag, className) {
  var e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/* ============================================
   Auto-Layout Algorithm
   ============================================ */

function computeLayout(persons, evidence) {
  var ITEM_W = 160;
  var MIN_SPACING = 50;
  var BASE_RADIUS = 280;
  var RING_GAP = 220;

  /* Group persons by tier */
  var tiers = {};
  persons.forEach(function (p) {
    var t = p.tier != null ? p.tier : 1;
    if (!tiers[t]) tiers[t] = [];
    tiers[t].push(p);
  });

  var tierKeys = Object.keys(tiers).map(Number).sort(function (a, b) { return a - b; });
  var maxRadius = 0;

  tierKeys.forEach(function (tier, tierIndex) {
    var items = tiers[tier];
    if (tier === 0) {
      /* Center item(s) */
      items.forEach(function (p) { p._x = 0; p._y = 0; });
      return;
    }

    /* Calculate radius so items don't overlap */
    var circumNeeded = items.length * (ITEM_W + MIN_SPACING);
    var minRadius = circumNeeded / (2 * Math.PI);
    var radius = Math.max(BASE_RADIUS + (tierIndex - 1) * RING_GAP, minRadius);

    /* Stagger ring angle so items don't align radially */
    var ringOffset = tierIndex * 0.45;

    items.forEach(function (p, i) {
      var angle = (i / items.length) * Math.PI * 2 - Math.PI / 2 + ringOffset;
      p._x = Math.cos(angle) * radius;
      p._y = Math.sin(angle) * radius;
    });

    maxRadius = Math.max(maxRadius, radius);
  });

  /* Evidence ring - placed beyond the outermost person ring */
  var evRadius = maxRadius + RING_GAP * 0.85;
  var evOffset = 0.3;
  evidence.forEach(function (item, i) {
    var angle = (i / evidence.length) * Math.PI * 2 - Math.PI / 2 + evOffset;
    item._x = Math.cos(angle) * evRadius;
    item._y = Math.sin(angle) * evRadius;
    maxRadius = Math.max(maxRadius, evRadius);
  });

  /* Board dimensions */
  var padding = 350;
  var boardW = (maxRadius + padding) * 2;
  var boardH = (maxRadius + padding) * 2;
  var cx = boardW / 2;
  var cy = boardH / 2;

  /* Offset all positions so center is at board center */
  persons.forEach(function (p) {
    p._x = (p._x || 0) + cx;
    p._y = (p._y || 0) + cy;
  });
  evidence.forEach(function (item) {
    item._x = (item._x || 0) + cx;
    item._y = (item._y || 0) + cy;
  });

  /* Deterministic rotation for natural look */
  persons.forEach(function (p, i) {
    p._rot = ((i * 7 + 3) % 11) - 5; /* -5 to 5 degrees */
  });
  evidence.forEach(function (item, i) {
    item._rot = ((i * 5 + 2) % 9) - 4;
  });

  /* Ring labels */
  var ringLabels = [];
  var labelMap = { 1: 'INNER CIRCLE', 2: 'PERSONS OF INTEREST', 3: 'PERIPHERAL' };
  tierKeys.forEach(function (tier, tierIndex) {
    if (tier === 0) return;
    var items = tiers[tier];
    var circumNeeded = items.length * (ITEM_W + MIN_SPACING);
    var minRadius = circumNeeded / (2 * Math.PI);
    var radius = Math.max(BASE_RADIUS + (tierIndex - 1) * RING_GAP, minRadius);
    var label = labelMap[tier] || ('TIER ' + tier);
    ringLabels.push({ label: label, x: cx, y: cy - radius - 30 });
  });

  return { width: boardW, height: boardH, ringLabels: ringLabels };
}

/* ============================================
   Generate Connections
   ============================================ */

function buildConnections(persons, extra) {
  var connections = [];
  var centerId = null;

  /* Find center person */
  persons.forEach(function (p) {
    if (p.tier === 0) centerId = p.id;
  });

  /* Auto-connect every non-center person to center */
  if (centerId) {
    persons.forEach(function (p) {
      if (p.id === centerId) return;
      var tier = p.tier || 1;
      var weight = tier === 1 ? 3 : tier === 2 ? 2 : 1;
      connections.push({ from: centerId, to: p.id, weight: weight });
    });
  }

  /* Add extra connections */
  (extra || []).forEach(function (c) {
    connections.push({ from: c.from, to: c.to, weight: c.weight || 1 });
  });

  return connections;
}

/* Build lookup: person id -> list of connected person names */
function buildConnectionMap(connections, personMap) {
  var map = {};
  connections.forEach(function (c) {
    var fromP = personMap.get(c.from);
    var toP = personMap.get(c.to);
    if (!fromP || !toP) return;
    if (!map[c.from]) map[c.from] = [];
    if (!map[c.to]) map[c.to] = [];
    map[c.from].push(toP.name || toP.id);
    map[c.to].push(fromP.name || fromP.id);
  });
  return map;
}

/* ============================================
   Main Render
   ============================================ */

function renderBoard(container, data) {
  container.innerHTML = '';

  var persons = data.persons || [];
  var evidence = data.evidence || [];
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* Person lookup map */
  var personMap = new Map();
  persons.forEach(function (p) { personMap.set(p.id, p); });

  /* ---- Layout ---- */
  var board = computeLayout(persons, evidence);

  /* ---- Connections ---- */
  var connections = buildConnections(persons, data.extraConnections);
  var connMap = buildConnectionMap(connections, personMap);

  /* ---- DOM Structure ---- */
  var viewport = el('div', 'board-viewport');
  var surface = el('div', 'board-surface');
  surface.style.width = board.width + 'px';
  surface.style.height = board.height + 'px';

  /* ---- SVG Yarn Layer ---- */
  var svg = document.createElementNS(SVGNS, 'svg');
  svg.classList.add('yarn-layer');
  svg.setAttribute('width', board.width);
  svg.setAttribute('height', board.height);
  svg.setAttribute('viewBox', '0 0 ' + board.width + ' ' + board.height);

  var defs = document.createElementNS(SVGNS, 'defs');
  defs.innerHTML =
    '<filter id="yarn-tex">' +
    '<feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>';
  svg.appendChild(defs);
  surface.appendChild(svg);

  /* ---- Item widths ---- */
  var WIDTHS = { polaroid: 140, note: 160, document: 170, tag: 130 };

  /* ---- Create Person Items ---- */
  var itemMap = new Map();

  persons.forEach(function (p) {
    var isCenter = p.tier === 0;
    var w = isCenter ? 180 : 140;
    var item = { id: p.id, type: 'polaroid', name: p.name, label: p.role, center: isCenter, photo: p.photo };
    var itemEl = createItem(item);
    itemEl.style.width = w + 'px';
    itemEl.style.left = (p._x - w / 2) + 'px';
    itemEl.style.top = p._y + 'px';
    if (p._rot) itemEl.style.transform = 'rotate(' + p._rot + 'deg)';
    surface.appendChild(itemEl);
    itemMap.set(p.id, { data: p, el: itemEl, x: p._x, y: p._y });
  });

  /* ---- Create Evidence Items ---- */
  evidence.forEach(function (item) {
    var w = WIDTHS[item.type] || 140;
    var itemEl = createItem(item);
    itemEl.style.width = w + 'px';
    itemEl.style.left = (item._x - w / 2) + 'px';
    itemEl.style.top = item._y + 'px';
    if (item._rot) itemEl.style.transform = 'rotate(' + item._rot + 'deg)';
    surface.appendChild(itemEl);
    itemMap.set(item.id, { data: item, el: itemEl, x: item._x, y: item._y });
  });

  /* ---- Draw Yarn ---- */
  var yarnStyles = {
    3: { w: 3.5, c: '#c91a1a', o: 0.9 },
    2: { w: 2.5, c: '#b52020', o: 0.75 },
    1: { w: 1.5, c: '#993333', o: 0.6 }
  };

  connections.forEach(function (conn) {
    var from = itemMap.get(conn.from);
    var to = itemMap.get(conn.to);
    if (!from || !to) return;

    var x1 = from.x, y1 = from.y;
    var x2 = to.x, y2 = to.y;
    var dist = Math.hypot(x2 - x1, y2 - y1);
    var sag = Math.min(dist * 0.08, 50);
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2 + sag;

    var path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2);
    path.classList.add('yarn-thread');

    var weight = Math.min(conn.weight || 1, 3);
    var s = yarnStyles[weight];
    path.setAttribute('stroke', s.c);
    path.setAttribute('stroke-width', s.w);
    path.setAttribute('opacity', s.o);
    path.setAttribute('filter', 'url(#yarn-tex)');

    svg.appendChild(path);
  });

  /* ---- Ring Labels ---- */
  board.ringLabels.forEach(function (rl) {
    var lbl = el('div', 'ring-label');
    lbl.textContent = rl.label;
    lbl.style.left = rl.x + 'px';
    lbl.style.top = rl.y + 'px';
    surface.appendChild(lbl);
  });

  /* ---- Vignette ---- */
  surface.appendChild(el('div', 'board-vignette'));

  /* ---- Assemble DOM ---- */
  viewport.appendChild(surface);
  container.appendChild(viewport);

  /* ---- Zoom Controls ---- */
  var controls = el('div', 'board-controls');
  var btnIn = el('button', ''); btnIn.textContent = '+'; btnIn.title = 'Zoom in';
  var btnOut = el('button', ''); btnOut.textContent = '\u2212'; btnOut.title = 'Zoom out';
  var btnReset = el('button', ''); btnReset.textContent = '\u2302'; btnReset.title = 'Reset view';
  controls.append(btnIn, btnOut, btnReset);
  container.appendChild(controls);

  /* ---- Pan / Zoom ---- */
  var vw = container.clientWidth;
  var vh = container.clientHeight;
  var scaleX = vw / board.width;
  var scaleY = vh / board.height;
  var initScale = Math.min(scaleX, scaleY) * 0.9;
  var scale = initScale;
  var offsetX = (vw - board.width * scale) / 2;
  var offsetY = (vh - board.height * scale) / 2;
  var initOX = offsetX, initOY = offsetY;

  function updateTransform() {
    surface.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + scale + ')';
  }
  updateTransform();

  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = viewport.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var old = scale;
    scale = Math.min(2.5, Math.max(0.1, scale - e.deltaY * 0.001 * scale));
    offsetX = mx - (mx - offsetX) * (scale / old);
    offsetY = my - (my - offsetY) * (scale / old);
    updateTransform();
  }, { passive: false });

  var active = [];
  var isPanning = false;
  var startPan = null;
  var pinchDist = 0, pinchScale = 1, pinchOX = 0, pinchOY = 0;

  viewport.addEventListener('pointerdown', function (e) {
    active.push({ id: e.pointerId, x: e.clientX, y: e.clientY });
    if (active.length === 1 && !e.target.closest('.board-item')) {
      isPanning = true;
      startPan = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
      viewport.setPointerCapture(e.pointerId);
    } else if (active.length === 2) {
      isPanning = false;
      pinchDist = pDist(active); pinchScale = scale;
      pinchOX = offsetX; pinchOY = offsetY;
      viewport.setPointerCapture(e.pointerId);
    }
  });

  viewport.addEventListener('pointermove', function (e) {
    var idx = active.findIndex(function (p) { return p.id === e.pointerId; });
    if (idx < 0) return;
    active[idx] = { id: e.pointerId, x: e.clientX, y: e.clientY };
    if (active.length === 2 && pinchDist > 0) {
      var nd = pDist(active);
      var rect = viewport.getBoundingClientRect();
      var cx = ((active[0].x + active[1].x) / 2) - rect.left;
      var cy = ((active[0].y + active[1].y) / 2) - rect.top;
      scale = Math.min(2.5, Math.max(0.1, pinchScale * (nd / pinchDist)));
      offsetX = cx - (cx - pinchOX) * (scale / pinchScale);
      offsetY = cy - (cy - pinchOY) * (scale / pinchScale);
      updateTransform();
    } else if (active.length === 1 && isPanning && startPan) {
      offsetX = startPan.ox + (e.clientX - startPan.x);
      offsetY = startPan.oy + (e.clientY - startPan.y);
      updateTransform();
    }
  });

  viewport.addEventListener('pointerup', function (e) {
    active = active.filter(function (p) { return p.id !== e.pointerId; });
    try { viewport.releasePointerCapture(e.pointerId); } catch (ex) {}
    if (active.length === 0) { isPanning = false; startPan = null; pinchDist = 0; }
  });

  function pDist(pts) {
    return pts.length < 2 ? 0 : Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  }

  function zoomStep(factor) {
    var rect = viewport.getBoundingClientRect();
    var cx = rect.width / 2, cy = rect.height / 2;
    var old = scale;
    scale = Math.min(2.5, Math.max(0.1, scale * factor));
    offsetX = cx - (cx - offsetX) * (scale / old);
    offsetY = cy - (cy - offsetY) * (scale / old);
    updateTransform();
  }

  btnIn.addEventListener('click', function () { zoomStep(1.3); });
  btnOut.addEventListener('click', function () { zoomStep(0.75); });
  btnReset.addEventListener('click', function () {
    scale = initScale; offsetX = initOX; offsetY = initOY; updateTransform();
  });

  /* ---- Modal ---- */
  var modal = buildModal();
  container.appendChild(modal);

  /* Person click -> detail modal */
  persons.forEach(function (p) {
    var entry = itemMap.get(p.id);
    if (!entry) return;
    entry.el.addEventListener('click', function () {
      openPersonModal(modal, p, connMap[p.id] || [], data);
    });
  });

  /* Evidence click -> simple modal */
  evidence.forEach(function (item) {
    var entry = itemMap.get(item.id);
    if (!entry) return;
    entry.el.addEventListener('click', function () {
      openEvidenceModal(modal, item);
    });
  });
}

/* ============================================
   Item Element Builders
   ============================================ */

function createItem(item) {
  var type = item.type || 'polaroid';
  var wrap = el('div', 'board-item item-' + type + (item.center ? ' center-item' : ''));
  wrap.dataset.id = item.id;

  var tack = el('div', 'thumbtack');
  var tackColors = { polaroid: 'red', note: 'yellow', document: 'blue', tag: 'green' };
  tack.classList.add(tackColors[type] || 'white');
  wrap.appendChild(tack);

  switch (type) {
    case 'polaroid': buildPolaroid(wrap, item); break;
    case 'note':     buildNote(wrap, item); break;
    case 'document': buildDoc(wrap, item); break;
    case 'tag':      buildTag(wrap, item); break;
  }

  return wrap;
}

function buildPolaroid(wrap, item) {
  var frame = el('div', 'polaroid-frame');
  var img = el('div', 'polaroid-image');
  if (item.photo) {
    img.classList.add('has-photo');
    var imgEl = document.createElement('img');
    imgEl.src = item.photo;
    imgEl.alt = item.name || '';
    img.appendChild(imgEl);
  }
  var caption = el('div', 'polaroid-caption');
  caption.textContent = item.name || item.label;
  frame.append(img, caption);
  if (item.center) frame.appendChild(el('div', 'center-marker'));
  wrap.appendChild(frame);
  if (item.label) {
    var lbl = el('div', 'polaroid-label');
    lbl.textContent = item.label;
    wrap.appendChild(lbl);
  }
}

function buildNote(wrap, item) {
  var paper = el('div', 'note-paper');
  if (item.label) {
    var lbl = el('div', 'note-label'); lbl.textContent = item.label; paper.appendChild(lbl);
  }
  if (item.text) {
    var txt = el('div', 'note-text'); txt.textContent = item.text; paper.appendChild(txt);
  }
  wrap.appendChild(paper);
}

function buildDoc(wrap, item) {
  var paper = el('div', 'doc-paper');
  if (item.label) {
    var lbl = el('div', 'doc-label'); lbl.textContent = item.label; paper.appendChild(lbl);
  }
  if (item.name) {
    var title = el('div', 'doc-title'); title.textContent = item.name; paper.appendChild(title);
  }
  if (item.notes) {
    var notes = el('div', 'doc-notes'); notes.textContent = item.notes; paper.appendChild(notes);
  }
  var stamp = el('div', 'doc-stamp'); stamp.textContent = 'Evidence';
  paper.appendChild(stamp);
  wrap.appendChild(paper);
}

function buildTag(wrap, item) {
  var card = el('div', 'tag-card');
  if (item.label) {
    var lbl = el('div', 'tag-label'); lbl.textContent = item.label; card.appendChild(lbl);
  }
  if (item.name) {
    var name = el('div', 'tag-name'); name.textContent = item.name; card.appendChild(name);
  }
  wrap.appendChild(card);
}

/* ============================================
   Modal - Case File Detail
   ============================================ */

function buildModal() {
  var wrap = el('div', 'bb-modal');
  var inner = el('div', 'modal-inner');
  inner.style.position = 'relative';

  var closeBtn = el('button', 'modal-close');
  closeBtn.textContent = '\u2715';
  closeBtn.addEventListener('click', function () { wrap.classList.remove('open'); });
  inner.appendChild(closeBtn);

  var body = el('div', 'modal-body');
  inner.appendChild(body);
  wrap.appendChild(inner);

  wrap.addEventListener('click', function (e) {
    if (e.target === wrap) wrap.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') wrap.classList.remove('open');
  });

  return wrap;
}

function statusClass(status) {
  if (!status) return 'status-named';
  var s = status.toLowerCase();
  if (s.indexOf('convicted') >= 0) return 'status-convicted';
  if (s.indexOf('deceased') >= 0) return 'status-deceased';
  if (s.indexOf('investigation') >= 0) return 'status-investigation';
  return 'status-named';
}

function openPersonModal(modal, person, connectedNames, data) {
  var body = modal.querySelector('.modal-body');
  body.innerHTML = '';
  body.classList.remove('evidence-detail');

  /* Header: photo + name + role + status */
  var header = el('div', 'detail-header');
  var photo = el('div', 'detail-photo');
  if (person.photo) {
    var photoImg = document.createElement('img');
    photoImg.src = person.photo;
    photoImg.alt = person.name || '';
    photo.appendChild(photoImg);
  } else {
    photo.textContent = '?';
  }
  var info = el('div', 'detail-info');
  var nameEl = el('div', 'detail-name'); nameEl.textContent = person.name || person.id;
  var roleEl = el('div', 'detail-role'); roleEl.textContent = person.role || '';
  var statusEl = el('div', 'detail-status ' + statusClass(person.status));
  statusEl.textContent = person.status || 'Unknown';
  info.append(nameEl, roleEl, statusEl);
  header.append(photo, info);
  body.appendChild(header);

  /* Fields grid */
  var fields = el('div', 'detail-fields');

  var fieldAge = el('div', 'detail-field');
  fieldAge.innerHTML = '<span class="field-label">Age</span><span class="field-value">' + esc(person.age || 'Unknown') + '</span>';
  fields.appendChild(fieldAge);

  var fieldTier = el('div', 'detail-field');
  var tierLabel = person.tier === 0 ? 'Center' : person.tier === 1 ? 'Inner Circle' : person.tier === 2 ? 'Person of Interest' : 'Peripheral';
  fieldTier.innerHTML = '<span class="field-label">Connection Tier</span><span class="field-value">' + esc(tierLabel) + '</span>';
  fields.appendChild(fieldTier);

  var fieldStatus = el('div', 'detail-field');
  fieldStatus.innerHTML = '<span class="field-label">Status</span><span class="field-value">' + esc(person.status || 'Unknown') + '</span>';
  fields.appendChild(fieldStatus);

  var fieldRole = el('div', 'detail-field');
  fieldRole.innerHTML = '<span class="field-label">Role</span><span class="field-value">' + esc(person.role || 'Unknown') + '</span>';
  fields.appendChild(fieldRole);

  body.appendChild(fields);

  /* Why on the list */
  if (person.reason) {
    var sec1 = el('div', 'detail-section');
    var t1 = el('div', 'detail-section-title'); t1.textContent = 'Why on the List';
    var txt1 = el('div', 'detail-section-text'); txt1.textContent = person.reason;
    sec1.append(t1, txt1);
    body.appendChild(sec1);
  }

  /* Additional details */
  if (person.details) {
    var sec2 = el('div', 'detail-section');
    var t2 = el('div', 'detail-section-title'); t2.textContent = 'Details';
    var txt2 = el('div', 'detail-section-text'); txt2.textContent = person.details;
    sec2.append(t2, txt2);
    body.appendChild(sec2);
  }

  /* Linked Documents */
  if (person.documents && person.documents.length > 0) {
    var secDocs = el('div', 'detail-section');
    var tDocs = el('div', 'detail-section-title'); tDocs.textContent = 'Linked Documents';
    secDocs.appendChild(tDocs);

    var docList = el('div', 'detail-doc-list');
    person.documents.forEach(function (filename) {
      var docLink = el('a', 'detail-doc-link');
      docLink.textContent = filename;
      docLink.href = 'docs/court-documents/' + filename;
      docLink.target = '_blank';
      docLink.rel = 'noopener';
      docList.appendChild(docLink);
    });
    secDocs.appendChild(docList);
    body.appendChild(secDocs);
  }

  /* Connected to */
  if (connectedNames && connectedNames.length > 0) {
    var secConn = el('div', 'detail-connections');
    var tConn = el('div', 'detail-section-title'); tConn.textContent = 'Connected To';
    var tags = el('div', 'conn-tags');
    /* Deduplicate */
    var unique = [];
    connectedNames.forEach(function (n) { if (unique.indexOf(n) < 0) unique.push(n); });
    unique.forEach(function (name) {
      var tag = el('span', 'conn-tag'); tag.textContent = name; tags.appendChild(tag);
    });
    secConn.append(tConn, tags);
    body.appendChild(secConn);
  }

  modal.classList.add('open');
}

function openEvidenceModal(modal, item) {
  var body = modal.querySelector('.modal-body');
  body.innerHTML = '';
  body.classList.add('evidence-detail');

  var header = el('div', 'detail-header');
  var info = el('div', 'detail-info');
  var nameEl = el('div', 'detail-name'); nameEl.textContent = item.name || item.label || 'Evidence';
  var roleEl = el('div', 'detail-role'); roleEl.textContent = item.label || '';
  info.append(nameEl, roleEl);
  header.appendChild(info);
  body.appendChild(header);

  if (item.notes || item.text) {
    var sec = el('div', 'detail-section');
    var t = el('div', 'detail-section-title'); t.textContent = 'Notes';
    var txt = el('div', 'detail-section-text'); txt.textContent = item.notes || item.text;
    sec.append(t, txt);
    body.appendChild(sec);
  }

  /* Media */
  var m = item.media && item.media[0];
  if (m) {
    var mediaWrap = el('div', 'bb-media');
    if (m.type === 'image') {
      var img = document.createElement('img'); img.src = m.url; img.alt = m.title || '';
      mediaWrap.appendChild(img);
    } else if (m.type === 'video') {
      var vid = document.createElement('video'); vid.controls = true; vid.src = m.url;
      mediaWrap.appendChild(vid);
    } else if (m.type === 'pdf' || m.type === 'document') {
      var iframe = document.createElement('iframe'); iframe.src = m.url;
      iframe.style.cssText = 'border:none;width:100%;height:400px';
      mediaWrap.appendChild(iframe);
    }
    body.appendChild(mediaWrap);
  }

  modal.classList.add('open');
}

/* ---- Escape HTML ---- */
function esc(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
