// ═══════════════════════════════════════════
//   YADAV FAMILY WEBSITE — MAIN JS
// ═══════════════════════════════════════════

const DEFAULT_DATA = {
  "familyName":"Yadav",
  "tagline":"One Family, One Identity",
  "established":"1955",
  "hometown":"Pathreri, Paota",
  "adminPassword":"yadav@2024",
  "heroPhotos":[],
  "filterGroups":[
    {"id":"all","label":"🌟 All","relations":[]},
    {"id":"grandparents","label":"👴 Grandparents","relations":["Dada","Dadi","Nana","Nani"]},
    {"id":"parents","label":"❤️ Parents","relations":["Papa","Mummy"]},
    {"id":"uncles","label":"🙏 Elders","relations":["Tau","Tai","Chacha","Chachi","Mama","Mami","Bua","Fufa"]},
    {"id":"cousins","label":"😊 Cousins","relations":["Cousin"]},
    {"id":"siblings","label":"👫 Siblings","relations":["Bhai","Bhabhi","Behen","Jija","Main"]}
  ],
  "members":[
    {"id":1,"name":"Ramesh Lal Yadav","relation":"Dada","relationHindi":"दादा जी","generation":1,"gender":"male","phone":"","dob":"1942-04-15","city":"Pathreri, Paota","currentRole":"Retired","occupation":"Former farmer, now resting at home","education":"Primary School","photo":"","note":"The pillar of our family"},
    {"id":2,"name":"Savitri Devi Yadav","relation":"Dadi","relationHindi":"दादी जी","generation":1,"gender":"female","phone":"","dob":"1945-08-20","city":"Pathreri, Paota","currentRole":"Homemaker","occupation":"Taking care of the home and grandchildren","education":"","photo":"","note":"The heart of our family"},
    {"id":3,"name":"Suresh Kumar Yadav","relation":"Papa","relationHindi":"पापा","generation":2,"gender":"male","phone":"9876543210","dob":"1968-01-10","city":"Jaipur, Rajasthan","currentRole":"Businessman","occupation":"Running a clothing shop for 20+ years","education":"B.Com","photo":"","note":"Our family's foundation"},
    {"id":4,"name":"Meena Devi Yadav","relation":"Mummy","relationHindi":"मम्मी","generation":2,"gender":"female","phone":"9876500001","dob":"1970-05-18","city":"Jaipur, Rajasthan","currentRole":"Homemaker","occupation":"Raising the family with love and care","education":"12th Pass","photo":"","note":"Our home's warmth"},
    {"id":5,"name":"Rajesh Kumar Yadav","relation":"Tau","relationHindi":"ताऊ जी","generation":2,"gender":"male","phone":"9800011111","dob":"1962-11-03","city":"Delhi","currentRole":"Govt. Employee","occupation":"Senior Clerk, Delhi Municipal Corporation — 30 years","education":"BA","photo":"","note":""},
    {"id":6,"name":"Kamla Devi Yadav","relation":"Tai","relationHindi":"ताई जी","generation":2,"gender":"female","phone":"","dob":"1965-03-25","city":"Delhi","currentRole":"Homemaker","occupation":"Managing home and raising children","education":"8th Pass","photo":"","note":""},
    {"id":7,"name":"Vijay Kumar Yadav","relation":"Chacha","relationHindi":"चाचा जी","generation":2,"gender":"male","phone":"9700022222","dob":"1972-07-14","city":"Agra, UP","currentRole":"Teacher","occupation":"Hindi Teacher at Govt. School — 15 years","education":"M.A. Hindi, B.Ed","photo":"","note":"The most educated in our family"},
    {"id":8,"name":"Sunita Devi Yadav","relation":"Chachi","relationHindi":"चाची जी","generation":2,"gender":"female","phone":"9700033333","dob":"1975-09-30","city":"Agra, UP","currentRole":"Anganwadi Worker","occupation":"Teaching children at Anganwadi for 10 years","education":"10th Pass","photo":"","note":""},
    {"id":9,"name":"Priya Yadav","relation":"Cousin","relationHindi":"चचेरी बहन","generation":3,"gender":"female","phone":"9900033333","dob":"1996-04-22","city":"Delhi","currentRole":"Software Engineer","occupation":"Software Engineer at TCS Delhi — 4 years","education":"B.Tech CSE, Delhi University","photo":"","note":"Our family's first engineer"},
    {"id":10,"name":"Rohit Yadav","relation":"Cousin","relationHindi":"चचेरा भाई","generation":3,"gender":"male","phone":"9900044444","dob":"1999-12-05","city":"Delhi","currentRole":"B.Com Final Year","occupation":"Pursuing B.Com from Delhi University","education":"B.Com (Final Year)","photo":"","note":""},
    {"id":11,"name":"Ankit Yadav","relation":"Cousin","relationHindi":"चचेरा भाई","generation":3,"gender":"male","phone":"","dob":"2002-06-18","city":"Agra, UP","currentRole":"12th Student","occupation":"12th Science at St. Peter's College Agra","education":"12th Science","photo":"","note":"Preparing for NEET"},
    {"id":12,"name":"Your Name","relation":"Main","relationHindi":"मैं","generation":3,"gender":"male","phone":"","dob":"2000-01-01","city":"Pathreri, Paota","currentRole":"Website Admin","occupation":"Write your occupation here","education":"Write your degree here","photo":"","note":"Owner of this website"}
  ],
  "events":[
    {"id":1,"title":"Dada Ji's Birthday","date":"2025-04-15","type":"birthday","description":"Dada Ji's 83rd birthday celebration"},
    {"id":2,"title":"Family Reunion","date":"2025-12-25","type":"reunion","description":"The biggest family gathering of the year"},
    {"id":3,"title":"Priya Di's Wedding","date":"2026-02-14","type":"wedding","description":"Priya Di's wedding — everyone is invited!"}
  ],
  "announcements":[
    "🙏 Welcome to the Yadav Family official website!",
    "🎓 Priya Di joined TCS — our family is proud!",
    "📢 Family Reunion in December at Pathreri — save the date!"
  ]
};

let fd = null, isAdmin = false, editMemberId = null, editEventId = null;
let activeFilter = 'all', heroSlideIndex = 0, heroTimer = null;
let pastedHeroImageData = null, pastedMemberImageData = null;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── DATA ───────────────────────────────────
async function loadData() {
  const local = localStorage.getItem('yadavFamily_v4');
  if (local) { try { fd = JSON.parse(local); renderAll(); return; } catch(e) {} }
  try {
    const res = await fetch('data/family.json?t=' + Date.now());
    if (res.ok) { fd = await res.json(); renderAll(); return; }
  } catch(e) {}
  fd = JSON.parse(JSON.stringify(DEFAULT_DATA));
  renderAll();
}
function save() { localStorage.setItem('yadavFamily_v4', JSON.stringify(fd)); }

// ─── HELPERS ────────────────────────────────
function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob), n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--;
  return a;
}
function fmtDob(dob) {
  if (!dob) return '';
  const d = new Date(dob);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
function initials(name) {
  return name.trim().split(' ').map(w => w[0] || '').join('').substring(0, 2).toUpperCase();
}
function setText(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; }
function getVal(id) { return (document.getElementById(id) || {}).value || ''; }
function setVal(id, v) { const e = document.getElementById(id); if (e) e.value = v || ''; }

function getRoleBadge(role) {
  if (!role) return '';
  const r = role.toLowerCase();
  let cls = 'rb-other', icon = '💼';
  if (r.match(/student|b\.com|b\.tech|12th|school|neet|college|year/)) { cls = 'rb-student'; icon = '📚'; }
  else if (r.match(/software|engineer|developer|tcs|infosys|wipro|it /)) { cls = 'rb-job'; icon = '💻'; }
  else if (r.match(/teacher|professor|lecturer/)) { cls = 'rb-teacher'; icon = '🎓'; }
  else if (r.match(/govt|government|clerk|municipal|sarkari/)) { cls = 'rb-govt'; icon = '🏛️'; }
  else if (r.match(/business|shop|dukaan|merchant|trade/)) { cls = 'rb-business'; icon = '🏪'; }
  else if (r.match(/homemaker|grihini|housewife/)) { cls = 'rb-grihini'; icon = '🏡'; }
  else if (r.match(/retired|pension/)) { cls = 'rb-retired'; icon = '☕'; }
  else if (r.match(/doctor|medical|hospital/)) { cls = 'rb-job'; icon = '⚕️'; }
  else if (r.match(/anganwadi|worker/)) { cls = 'rb-teacher'; icon = '👩‍🏫'; }
  return `<span class="role-badge ${cls}">${icon} ${role}</span>`;
}

// ─── RENDER ALL ─────────────────────────────
function renderAll() {
  if (!fd) return;
  renderNavTitle();
  renderHero();
  renderAnnounce();
  renderFilterTabs();
  renderMembers();
  renderHomePreview();
  renderUpcomingBdays();
  renderEvents();
  renderAbout();
}

function renderNavTitle() {
  document.querySelectorAll('.family-name').forEach(el => el.textContent = fd.familyName + ' Family');
  document.title = fd.familyName + ' Family — Official Website';
}

// ─── HERO SLIDESHOW ──────────────────────────
function renderHero() {
  setText('hero-tagline', fd.tagline || '');
  setText('hero-place', '📍 ' + (fd.hometown || ''));
  setText('stat-members', fd.members.length);
  const cities = new Set(fd.members.map(m => m.city && m.city.split(',')[0]).filter(Boolean));
  setText('stat-cities', cities.size);
  setText('stat-est', fd.established || '—');
  startHeroSlideshow();
}

function startHeroSlideshow() {
  clearInterval(heroTimer);
  const photos = fd.heroPhotos || [];
  const wrap = document.getElementById('hero-slide-wrap');
  const dots = document.getElementById('hero-dots');
  if (!wrap) return;
  if (!photos.length) {
    wrap.innerHTML = `<div class="hero-no-photo"><div style="font-size:3rem;margin-bottom:.5rem">🏠</div><div>${isAdmin ? 'Add photos from Admin Panel' : fd.familyName + ' Family'}</div></div>`;
    if (dots) dots.innerHTML = '';
    return;
  }
  heroSlideIndex = 0;
  renderHeroSlide();
  if (dots) {
    dots.innerHTML = photos.map((_, i) =>
      `<button class="hdot ${i === 0 ? 'active' : ''}" onclick="goHeroSlide(${i})" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }
  if (photos.length > 1) {
    heroTimer = setInterval(() => {
      heroSlideIndex = (heroSlideIndex + 1) % photos.length;
      renderHeroSlide();
    }, 4500);
  }
}

function renderHeroSlide() {
  const photos = fd.heroPhotos || [];
  if (!photos.length) return;
  const wrap = document.getElementById('hero-slide-wrap');
  const dots = document.getElementById('hero-dots');
  if (!wrap) return;
  // Build all slides, show active
  wrap.innerHTML = photos.map((p, i) => `
    <div class="hero-slide ${i === heroSlideIndex ? 'active' : ''}">
      <img src="${p.url}" alt="${p.caption || ''}" onerror="this.parentElement.innerHTML='<div class=hero-no-photo style=\\'color:rgba(255,255,255,.3)\\'>Image could not be loaded</div>'">
      ${p.caption ? `<div class="hero-caption">${p.caption}</div>` : ''}
    </div>`
  ).join('');
  if (dots) {
    dots.querySelectorAll('.hdot').forEach((d, i) => d.classList.toggle('active', i === heroSlideIndex));
  }
}

function goHeroSlide(i) {
  heroSlideIndex = i;
  renderHeroSlide();
  clearInterval(heroTimer);
  if ((fd.heroPhotos || []).length > 1) {
    heroTimer = setInterval(() => {
      heroSlideIndex = (heroSlideIndex + 1) % fd.heroPhotos.length;
      renderHeroSlide();
    }, 4500);
  }
}
function prevSlide() { const l = (fd.heroPhotos || []).length || 1; heroSlideIndex = (heroSlideIndex - 1 + l) % l; renderHeroSlide(); }
function nextSlide() { const l = (fd.heroPhotos || []).length || 1; heroSlideIndex = (heroSlideIndex + 1) % l; renderHeroSlide(); }

// ─── ANNOUNCEMENTS ───────────────────────────
function renderAnnounce() {
  const el = document.getElementById('announce-list');
  if (!el) return;
  el.innerHTML = (fd.announcements || []).map(a =>
    `<div class="announce-item"><span>📢</span><span>${a}</span></div>`
  ).join('') || '<div class="announce-item"><span>📢</span><span>No announcements at the moment</span></div>';
}

// ─── FILTER TABS ─────────────────────────────
function renderFilterTabs() {
  const wrap = document.getElementById('filter-tabs-wrap');
  if (!wrap || !fd) return;
  wrap.innerHTML = (fd.filterGroups || []).map(g =>
    `<button class="ftab ${activeFilter === g.id ? 'active' : ''}" onclick="setFilter('${g.id}')">${g.label}</button>`
  ).join('');
}
function setFilter(f) { activeFilter = f; renderFilterTabs(); renderMembers(); }

// ─── MEMBER CARD ────────────────────────────
function memberCardHTML(m) {
  const age = calcAge(m.dob), dob = fmtDob(m.dob);
  const photoBlock = m.photo
    ? `<img class="mcard-photo" src="${m.photo}" alt="${m.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const initBlock = `<div class="mcard-photo-initials" style="display:${m.photo ? 'none' : 'flex'}">${initials(m.name)}</div>`;
  return `<div class="mcard" id="mcard-${m.id}">
    <div class="mcard-top"></div>
    <div class="mcard-photo-wrap">
      ${photoBlock}${initBlock}
      <div class="mcard-photo-overlay">
        <div class="mcard-name-over">${m.name}</div>
        <div class="mcard-relation-over">${m.relationHindi || m.relation}</div>
      </div>
    </div>
    <div class="mcard-body">
      <div class="mcard-header-row">${getRoleBadge(m.currentRole)}</div>
      <div class="mdetails">
        ${m.occupation ? `<div class="mrow"><span class="mrow-icon">💼</span><span class="mrow-label">Work:</span><span class="mrow-val highlight">${m.occupation}</span></div>` : ''}
        ${m.education ? `<div class="mrow"><span class="mrow-icon">🎓</span><span class="mrow-label">Education:</span><span class="mrow-val">${m.education}</span></div>` : ''}
        ${m.city ? `<div class="mrow"><span class="mrow-icon">📍</span><span class="mrow-label">City:</span><span class="mrow-val">${m.city}</span></div>` : ''}
        ${dob ? `<div class="mrow"><span class="mrow-icon">🎂</span><span class="mrow-label">Birthday:</span><span class="mrow-val">${dob}${age ? ' · ' + age + ' yrs' : ''}</span></div>` : ''}
        ${m.phone ? `<div class="mrow"><span class="mrow-icon">📱</span><span class="mrow-label">Phone:</span><span class="mrow-val"><a href="tel:${m.phone}" style="color:var(--brown-mid);text-decoration:none">${m.phone}</a></span></div>` : ''}
      </div>
      ${m.note ? `<div class="mcard-note">"${m.note}"</div>` : ''}
    </div>
    <div class="card-actions">
      <button class="btn-edit-card" onclick="openEditMember(${m.id})">✏️ Edit</button>
      <button class="btn-del-card" onclick="deleteMember(${m.id})">🗑️</button>
    </div>
  </div>`;
}

function renderMembers() {
  const filter = activeFilter;
  const search = ((document.getElementById('search-input') || {}).value || '').toLowerCase().trim();
  const grid = document.getElementById('members-grid');
  if (!grid || !fd) return;
  const group = (fd.filterGroups || []).find(g => g.id === filter);
  const filterRelations = group && group.relations || [];
  let filtered = fd.members.filter(m => {
    const inGroup = !filterRelations.length || filterRelations.includes(m.relation);
    const inSearch = !search || [m.name, m.relation, m.city, m.currentRole, m.occupation].some(s => (s || '').toLowerCase().includes(search));
    return inGroup && inSearch;
  });
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)"><div style="font-size:3rem;margin-bottom:.8rem">🔍</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--brown)">No members found</div><div style="font-size:13px;margin-top:.4rem">Try a different search or filter</div></div>`;
    return;
  }
  const GEN_LABELS = {
    1: '👴 1st Generation — Dada & Dadi',
    2: '🙏 2nd Generation — Parents & Elders',
    3: '😊 3rd Generation — Cousins & Us'
  };
  const byGen = {};
  filtered.forEach(m => { const g = m.generation || 3; (byGen[g] = byGen[g] || []).push(m); });
  const gens = Object.keys(byGen).sort();
  let html = '';
  gens.forEach(g => {
    if (gens.length > 1) {
      html += `<div class="gen-section" style="grid-column:1/-1">
        <span class="gen-pill">${GEN_LABELS[g] || 'Generation ' + g}</span>
        <span class="gen-line"></span>
        <span class="gen-count">${byGen[g].length} member${byGen[g].length !== 1 ? 's' : ''}</span>
      </div>`;
    }
    byGen[g].forEach(m => { html += memberCardHTML(m); });
  });
  grid.innerHTML = html;
}

function renderHomePreview() {
  const grid = document.getElementById('home-preview-grid');
  if (!grid || !fd) return;
  grid.innerHTML = fd.members.slice(0, 4).map(m => memberCardHTML(m)).join('');
}

function renderUpcomingBdays() {
  const el = document.getElementById('bday-list');
  if (!el || !fd) return;
  const now = new Date();
  const list = fd.members.filter(m => m.dob).map(m => {
    const d = new Date(m.dob);
    let next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    if (next <= now) next.setFullYear(now.getFullYear() + 1);
    return { ...m, days: Math.ceil((next - now) / 86400000), nextDate: next };
  }).sort((a, b) => a.days - b.days).slice(0, 6);

  el.innerHTML = list.map(m => {
    const label = m.days === 0 ? '🎉 Today!' : m.days === 1 ? 'Tomorrow' : `${m.days} days`;
    const urgent = m.days <= 7;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-dark);gap:8px">
      <div>
        <div style="font-weight:500;color:var(--brown);font-size:14px">${m.name}</div>
        <div style="font-size:12px;color:var(--text-light)">${m.relation} · ${m.nextDate.getDate()} ${MONTHS[m.nextDate.getMonth()]}</div>
      </div>
      <span style="font-size:12px;font-weight:600;color:${urgent ? '#B45309' : 'var(--text-light)'};background:${urgent ? '#FEF3C7' : 'var(--cream-dark)'};padding:3px 12px;border-radius:12px;white-space:nowrap">${label}</span>
    </div>`;
  }).join('') || '<div style="color:var(--text-light);font-size:14px">No birthdays on record</div>';
}

function renderEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid || !fd) return;
  const evs = [...(fd.events || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const typeEmoji = { birthday: '🎂', reunion: '🏡', wedding: '💍', festival: '🪔', other: '📅' };
  const typeLabel = { birthday: 'Birthday', reunion: 'Reunion', wedding: 'Wedding', festival: 'Festival', other: 'Event' };
  if (!evs.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2.5rem;color:var(--text-light)">No events yet — add one!</div>';
    return;
  }
  grid.innerHTML = evs.map(ev => {
    const d = new Date(ev.date);
    const adminBtns = isAdmin ? `<div class="event-admin-btns">
      <button onclick="openEditEvent(${ev.id})" style="border:1px solid var(--border-solid);background:var(--cream);color:var(--brown-mid);cursor:pointer;font-family:'Jost',sans-serif">✏️ Edit</button>
      <button onclick="deleteEvent(${ev.id})" style="border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-family:'Jost',sans-serif">🗑️ Delete</button>
    </div>` : '';
    return `<div class="ecard">
      <div class="edate"><div class="eday">${d.getDate()}</div><div class="emon">${MONTHS[d.getMonth()]}</div></div>
      <div style="flex:1">
        <div class="etitle">${typeEmoji[ev.type] || '📅'} ${ev.title}</div>
        ${ev.description ? `<div class="edesc">${ev.description}</div>` : ''}
        <span class="etype-badge">${typeLabel[ev.type] || ev.type}</span>
        ${adminBtns}
      </div>
    </div>`;
  }).join('');
}

function renderAbout() {
  if (!fd) return;
  const m = fd.members;
  const cities = [...new Set(m.map(x => x.city).filter(Boolean))];
  setText('ab-hometown', fd.hometown || '—');
  setText('ab-est', fd.established || '—');
  setText('ab-total', m.length);
  setText('ab-cities-list', cities.join(' · ') || '—');
  setText('ab-gen1', m.filter(x => x.generation === 1).length);
  setText('ab-gen2', m.filter(x => x.generation === 2).length);
  setText('ab-gen3', m.filter(x => x.generation === 3).length);
}

// ─── NAV ─────────────────────────────────────
function showPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.nav-links a[data-page]').forEach(x => x.classList.remove('active'));
  const pg = document.getElementById('page-' + p);
  if (pg) pg.classList.add('active');
  const a = document.querySelector(`.nav-links a[data-page="${p}"]`);
  if (a) a.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeNav();
}
function toggleNav() { document.getElementById('nav-links').classList.toggle('open'); }
function closeNav() { document.getElementById('nav-links').classList.remove('open'); }

// Scroll nav shadow
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ─── ADMIN ───────────────────────────────────
function openAdminLogin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.getElementById('admin-pw').value = '';
  document.getElementById('admin-err').textContent = '';
  setTimeout(() => document.getElementById('admin-pw').focus(), 120);
}
function closeAdminLogin() { document.getElementById('admin-overlay').classList.remove('open'); }
function doLogin() {
  if (document.getElementById('admin-pw').value === fd.adminPassword) {
    isAdmin = true;
    document.body.classList.add('admin-mode');
    closeAdminLogin();
    renderAll();
  } else {
    document.getElementById('admin-err').textContent = '❌ Wrong password. Please try again.';
  }
}
function doLogout() { isAdmin = false; document.body.classList.remove('admin-mode'); renderAll(); }

// ─── ADMIN PANEL ─────────────────────────────
function openAdminPanel() {
  setVal('ap-family-name', fd.familyName);
  setVal('ap-tagline', fd.tagline);
  setVal('ap-established', fd.established);
  setVal('ap-hometown', fd.hometown);
  setVal('ap-password', '');
  pastedHeroImageData = null;
  document.getElementById('paste-preview').style.display = 'none';
  document.getElementById('paste-drop-zone').querySelector('.paste-zone-inner').style.display = 'flex';
  document.getElementById('ap-paste-add-btn').style.display = 'none';
  renderHeroPhotoList();
  renderAnnouncementList();
  renderFilterGroupList();
  document.getElementById('admin-panel-overlay').classList.add('open');
}
function closeAdminPanel() { document.getElementById('admin-panel-overlay').classList.remove('open'); }
function saveAdminPanel() {
  fd.familyName = getVal('ap-family-name').trim() || fd.familyName;
  fd.tagline = getVal('ap-tagline').trim();
  fd.established = getVal('ap-established').trim();
  fd.hometown = getVal('ap-hometown').trim();
  const np = getVal('ap-password').trim();
  if (np) fd.adminPassword = np;
  save();
  closeAdminPanel();
  renderAll();
}

// ─── IMAGE HELPERS ───────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── PASTE / DRAG ZONE SETUP ─────────────────
function setupPasteZone(zoneId, previewId, onImageReady) {
  const zone = document.getElementById(zoneId);
  const preview = document.getElementById(previewId);
  if (!zone) return;

  zone.addEventListener('click', () => zone.focus());

  zone.addEventListener('paste', async e => {
    e.preventDefault();
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        try {
          const b64 = await blobToBase64(blob);
          showPastePreview(zone, preview, b64, onImageReady);
        } catch(err) { alert('Could not load image. Please try again.'); }
        return;
      }
    }
    alert('No image found in clipboard. Try copying an image first (right-click → Copy Image).');
  });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', async e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      try {
        const b64 = await fileToBase64(files[0]);
        showPastePreview(zone, preview, b64, onImageReady);
      } catch(err) { alert('Could not load image.'); }
    }
  });
}

function showPastePreview(zone, preview, b64, onImageReady) {
  const inner = zone.querySelector('.paste-zone-inner');
  if (inner) inner.style.display = 'none';
  preview.src = b64;
  preview.style.display = 'block';
  onImageReady(b64);
}

// Setup hero paste zone
function initHeroPasteZone() {
  setupPasteZone('paste-drop-zone', 'paste-preview', (b64) => {
    pastedHeroImageData = b64;
    document.getElementById('ap-paste-add-btn').style.display = 'block';
  });
}

function addPastedPhoto() {
  if (!pastedHeroImageData) { alert('Please paste an image first!'); return; }
  const cap = getVal('ap-paste-caption').trim();
  if (!fd.heroPhotos) fd.heroPhotos = [];
  fd.heroPhotos.push({ url: pastedHeroImageData, caption: cap || 'Photo ' + fd.heroPhotos.length });
  setVal('ap-paste-caption', '');
  pastedHeroImageData = null;
  document.getElementById('paste-preview').style.display = 'none';
  const inner = document.getElementById('paste-drop-zone').querySelector('.paste-zone-inner');
  if (inner) inner.style.display = 'flex';
  document.getElementById('ap-paste-add-btn').style.display = 'none';
  save();
  renderHeroPhotoList();
  startHeroSlideshow();
}

// ─── HERO PHOTOS ─────────────────────────────
async function handlePhotoFilePick(input) {
  const files = input.files;
  if (!files || !files.length) return;
  const cap = getVal('ap-photo-caption').trim();
  const btn = document.getElementById('ap-upload-btn');
  if (btn) { btn.textContent = 'Uploading...'; btn.disabled = true; }
  if (!fd.heroPhotos) fd.heroPhotos = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const b64 = await fileToBase64(files[i]);
      fd.heroPhotos.push({ url: b64, caption: cap || files[i].name.replace(/\.[^.]+$/, '') });
    } catch(e) { alert('Could not load photo: ' + files[i].name); }
  }
  setVal('ap-photo-caption', '');
  input.value = '';
  if (btn) { btn.textContent = '📁 Choose Photo(s) from Device'; btn.disabled = false; }
  save();
  renderHeroPhotoList();
  startHeroSlideshow();
}

function addHeroPhotoURL() {
  const url = getVal('ap-photo-url').trim();
  const cap = getVal('ap-url-caption').trim();
  if (!url) { alert('Please enter a URL!'); return; }
  if (!fd.heroPhotos) fd.heroPhotos = [];
  fd.heroPhotos.push({ url, caption: cap });
  setVal('ap-photo-url', '');
  setVal('ap-url-caption', '');
  save();
  renderHeroPhotoList();
  startHeroSlideshow();
}

// Legacy addHeroPhoto support
function addHeroPhoto() { addHeroPhotoURL(); }

function renderHeroPhotoList() {
  const wrap = document.getElementById('ap-photo-list');
  if (!wrap) return;
  const photos = fd.heroPhotos || [];
  if (!photos.length) {
    wrap.innerHTML = '<div style="color:var(--text-light);font-size:13px;padding:.5rem 0;margin-bottom:.5rem">No photos added yet — use one of the methods below.</div>';
    return;
  }
  wrap.innerHTML = photos.map((p, i) => {
    const isBase64 = p.url.startsWith('data:');
    const urlLabel = isBase64 ? '[Uploaded / Pasted photo]' : p.url;
    return `<div class="ap-photo-item">
      <img class="ap-photo-thumb" src="${p.url}" onerror="this.style.opacity='.3'" alt="">
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:500;color:var(--brown);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.caption || '(no caption)'}</div>
        <div style="font-size:11px;color:var(--text-light);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${urlLabel}</div>
      </div>
      <div style="display:flex;gap:4px;flex-shrink:0">
        ${i > 0 ? `<button onclick="movePhoto(${i},-1)" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:13px">↑</button>` : ''}
        ${i < photos.length - 1 ? `<button onclick="movePhoto(${i},1)" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:13px">↓</button>` : ''}
        <button onclick="removePhoto(${i})" style="padding:4px 9px;border-radius:6px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:13px">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function removePhoto(i) { fd.heroPhotos.splice(i, 1); save(); renderHeroPhotoList(); startHeroSlideshow(); }
function movePhoto(i, dir) {
  const arr = fd.heroPhotos, j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  save(); renderHeroPhotoList(); startHeroSlideshow();
}

// ─── ANNOUNCEMENTS ───────────────────────────
function renderAnnouncementList() {
  const wrap = document.getElementById('ap-announce-list');
  if (!wrap) return;
  const list = fd.announcements || [];
  if (!list.length) { wrap.innerHTML = '<div style="color:var(--text-light);font-size:13px;margin-bottom:.5rem">No announcements yet.</div>'; return; }
  wrap.innerHTML = list.map((a, i) =>
    `<div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--cream-dark)">
      <span style="flex:1;font-size:13px;color:var(--text-mid);line-height:1.5">${a}</span>
      <button onclick="editAnnouncement(${i})" style="padding:3px 9px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px;flex-shrink:0;font-family:'Jost',sans-serif">✏️</button>
      <button onclick="removeAnnouncement(${i})" style="padding:3px 9px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px;flex-shrink:0;font-family:'Jost',sans-serif">🗑️</button>
    </div>`
  ).join('');
}
function addAnnouncement() {
  const txt = getVal('ap-announce-text').trim();
  if (!txt) return;
  if (!fd.announcements) fd.announcements = [];
  fd.announcements.push(txt);
  setVal('ap-announce-text', '');
  save(); renderAnnouncementList(); renderAnnounce();
}
function editAnnouncement(i) {
  const cur = fd.announcements[i];
  const newTxt = prompt('Edit announcement:', cur);
  if (newTxt !== null) { fd.announcements[i] = newTxt.trim() || cur; save(); renderAnnouncementList(); renderAnnounce(); }
}
function removeAnnouncement(i) { fd.announcements.splice(i, 1); save(); renderAnnouncementList(); renderAnnounce(); }

// ─── FILTER GROUPS ───────────────────────────
function renderFilterGroupList() {
  const wrap = document.getElementById('ap-filter-list');
  if (!wrap || !fd) return;
  wrap.innerHTML = (fd.filterGroups || []).map((g, i) =>
    `<div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--cream-dark)">
      <span style="flex:1;font-size:13px;color:var(--brown);font-weight:500">${g.label}</span>
      <span style="font-size:11px;color:var(--text-light)">[${g.relations.join(', ') || 'All'}]</span>
      <button onclick="editFilterGroup(${i})" style="padding:3px 9px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px;font-family:'Jost',sans-serif">✏️</button>
      ${i > 0 ? `<button onclick="removeFilterGroup(${i})" style="padding:3px 9px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px;font-family:'Jost',sans-serif">🗑️</button>` : '<span style="width:30px"></span>'}
    </div>`
  ).join('');
}
function addFilterGroup() {
  const label = getVal('ap-filter-label').trim();
  const rels = getVal('ap-filter-relations').split(',').map(r => r.trim()).filter(Boolean);
  if (!label) { alert('Tab label is required!'); return; }
  if (!fd.filterGroups) fd.filterGroups = [];
  fd.filterGroups.push({ id: 'grp_' + Date.now(), label, relations: rels });
  setVal('ap-filter-label', ''); setVal('ap-filter-relations', '');
  save(); renderFilterGroupList(); renderFilterTabs();
}
function editFilterGroup(i) {
  const g = fd.filterGroups[i];
  const newLabel = prompt('Filter name:', g.label);
  if (newLabel === null) return;
  const newRels = prompt('Relations (comma separated):', g.relations.join(', '));
  if (newRels === null) return;
  fd.filterGroups[i].label = newLabel.trim() || g.label;
  fd.filterGroups[i].relations = newRels.split(',').map(r => r.trim()).filter(Boolean);
  save(); renderFilterGroupList(); renderFilterTabs();
}
function removeFilterGroup(i) {
  if (!confirm('Remove this filter tab?')) return;
  fd.filterGroups.splice(i, 1);
  save(); renderFilterGroupList(); renderFilterTabs();
}

// ─── MEMBER CRUD ─────────────────────────────
function openAddMember() {
  editMemberId = null;
  document.getElementById('mm-title').textContent = 'Add New Member';
  ['mm-name','mm-relation','mm-relation-hi','mm-current-role','mm-occupation','mm-education','mm-phone','mm-dob','mm-city','mm-photo','mm-note'].forEach(id => setVal(id, ''));
  setVal('mm-gen', '3'); setVal('mm-gender', 'male');
  const prev = document.getElementById('mm-photo-preview');
  if (prev) prev.style.display = 'none';
  pastedMemberImageData = null;
  resetMemberPasteZone();
  switchMemberPhotoTab('upload', document.querySelector('.mphoto-tab'));
  document.getElementById('member-overlay').classList.add('open');
}
function openEditMember(id) {
  editMemberId = id;
  const m = fd.members.find(x => x.id === id);
  if (!m) return;
  document.getElementById('mm-title').textContent = '✏️ Edit Member';
  setVal('mm-name', m.name); setVal('mm-relation', m.relation);
  setVal('mm-relation-hi', m.relationHindi); setVal('mm-gen', m.generation || 3);
  setVal('mm-gender', m.gender || 'male'); setVal('mm-current-role', m.currentRole);
  setVal('mm-occupation', m.occupation); setVal('mm-education', m.education);
  setVal('mm-phone', m.phone); setVal('mm-dob', m.dob);
  setVal('mm-city', m.city); setVal('mm-photo', m.photo || '');
  setVal('mm-note', m.note);
  const prev = document.getElementById('mm-photo-preview');
  if (prev) { if (m.photo) { prev.src = m.photo; prev.style.display = 'block'; } else prev.style.display = 'none'; }
  pastedMemberImageData = null;
  resetMemberPasteZone();
  switchMemberPhotoTab('url', document.querySelectorAll('.mphoto-tab')[2]);
  document.getElementById('member-overlay').classList.add('open');
}
function closeMemberModal() { document.getElementById('member-overlay').classList.remove('open'); }
function saveMember() {
  const name = getVal('mm-name').trim(), relation = getVal('mm-relation');
  if (!name || !relation) { alert('Name and Relation are required!'); return; }
  // Use pasted photo if available
  let photo = getVal('mm-photo').trim();
  if (pastedMemberImageData) photo = pastedMemberImageData;
  const data = {
    name, relation,
    relationHindi: getVal('mm-relation-hi').trim() || relation,
    generation: parseInt(getVal('mm-gen')) || 3,
    gender: getVal('mm-gender'),
    currentRole: getVal('mm-current-role').trim(),
    occupation: getVal('mm-occupation').trim(),
    education: getVal('mm-education').trim(),
    phone: getVal('mm-phone').trim(),
    dob: getVal('mm-dob'),
    city: getVal('mm-city').trim(),
    photo,
    note: getVal('mm-note').trim(),
    alive: true
  };
  if (editMemberId) {
    const idx = fd.members.findIndex(m => m.id === editMemberId);
    fd.members[idx] = { ...fd.members[idx], ...data };
  } else {
    data.id = Date.now();
    fd.members.push(data);
  }
  save(); closeMemberModal(); renderAll();
}
function deleteMember(id) {
  const m = fd.members.find(x => x.id === id);
  if (!m || !confirm(`Remove "${m.name}" from the family website?`)) return;
  fd.members = fd.members.filter(x => x.id !== id);
  save(); renderAll();
}

// Member photo tabs
function switchMemberPhotoTab(tab, btn) {
  document.querySelectorAll('.mphoto-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.mphoto-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('mphoto-' + tab);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

async function handleMemberPhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const btn = document.getElementById('mm-photo-upload-btn');
  if (btn) { btn.textContent = 'Uploading...'; btn.disabled = true; }
  try {
    const b64 = await fileToBase64(file);
    pastedMemberImageData = b64;
    setVal('mm-photo', b64);
    const prev = document.getElementById('mm-photo-preview');
    if (prev) { prev.src = b64; prev.style.display = 'block'; }
  } catch(e) { alert('Could not load photo.'); }
  if (btn) { btn.textContent = '📁 Choose Photo from Device'; btn.disabled = false; }
  input.value = '';
}

function resetMemberPasteZone() {
  const preview = document.getElementById('member-paste-preview');
  if (preview) preview.style.display = 'none';
  const inner = document.querySelector('#member-paste-zone .paste-zone-inner');
  if (inner) inner.style.display = 'flex';
}

function initMemberPasteZone() {
  setupPasteZone('member-paste-zone', 'member-paste-preview', (b64) => {
    pastedMemberImageData = b64;
    const prev = document.getElementById('mm-photo-preview');
    if (prev) { prev.src = b64; prev.style.display = 'block'; }
  });
}

// ─── EVENT CRUD ──────────────────────────────
function openAddEvent() {
  editEventId = null;
  document.getElementById('em-title-h').textContent = 'Add New Event';
  ['em-title','em-date','em-desc'].forEach(id => setVal(id, ''));
  setVal('em-type', 'birthday');
  document.getElementById('event-overlay').classList.add('open');
}
function openEditEvent(id) {
  editEventId = id;
  const ev = fd.events && fd.events.find(x => x.id === id);
  if (!ev) return;
  document.getElementById('em-title-h').textContent = '✏️ Edit Event';
  setVal('em-title', ev.title); setVal('em-date', ev.date);
  setVal('em-type', ev.type || 'other'); setVal('em-desc', ev.description);
  document.getElementById('event-overlay').classList.add('open');
}
function closeEventModal() { document.getElementById('event-overlay').classList.remove('open'); }
function saveEvent() {
  const title = getVal('em-title').trim(), date = getVal('em-date');
  if (!title || !date) { alert('Event name and date are required!'); return; }
  const data = { title, date, type: getVal('em-type'), description: getVal('em-desc').trim() };
  if (!fd.events) fd.events = [];
  if (editEventId) {
    const idx = fd.events.findIndex(e => e.id === editEventId);
    fd.events[idx] = { ...fd.events[idx], ...data };
  } else { data.id = Date.now(); fd.events.push(data); }
  save(); closeEventModal(); renderEvents();
}
function deleteEvent(id) {
  if (!confirm('Remove this event?')) return;
  fd.events = fd.events.filter(e => e.id !== id);
  save(); renderEvents();
}

// ─── EXPORT ──────────────────────────────────
function exportJSON() {
  const blob = new Blob([JSON.stringify(fd, null, 2)], { type: 'application/json' });
  Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'family.json' }).click();
}

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Admin login enter key
  document.getElementById('admin-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
    document.getElementById('admin-err').textContent = '';
  });

  // Close overlays on backdrop click
  ['admin-overlay','member-overlay','event-overlay','admin-panel-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
  });

  // Init paste zones after slight delay (DOM needs to be ready)
  setTimeout(() => {
    initHeroPasteZone();
    initMemberPasteZone();
  }, 300);

  // URL input photo preview for member
  const urlInput = document.getElementById('mm-photo');
  if (urlInput) {
    urlInput.addEventListener('input', () => {
      const prev = document.getElementById('mm-photo-preview');
      if (!prev) return;
      if (urlInput.value.trim()) {
        prev.src = urlInput.value.trim();
        prev.style.display = 'block';
        prev.onerror = () => { prev.style.display = 'none'; };
      } else {
        prev.style.display = 'none';
      }
    });
  }
});
