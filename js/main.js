

// cat > /tmp/clean_main.js << 'EOF'
// // YADAV FAMILY WEBSITE - FIREBASE VERSION

var firebaseConfig = {
  apiKey: "AIzaSyDAC6aREQq0Zv0eIKikgHRjbJA2BaLmLvs",
  authDomain: "yadav-family-website.firebaseapp.com",
  projectId: "yadav-family-website",
  storageBucket: "yadav-family-website.firebasestorage.app",
  messagingSenderId: "659268829120",
  appId: "1:659268829120:web:0f5a46925be7af738d9225"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var DOC_REF = db.collection("family").doc("data");

var fd=null, isAdmin=false, editMemberId=null, editEventId=null;
var activeFilter='all', heroSlideIndex=0, heroTimer=null;
var cropInstance=null, cropTarget=null;
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var DEFAULT_DATA={
  familyName:"Yadav",tagline:"One Family, One Identity",
  established:"1955",hometown:"Pathreri, Paota",
  adminPassword:"yadav@2024",heroPhotos:[],
  filterGroups:[
    {id:"all",label:"All",relations:[]},
    {id:"dadke",label:"Grandparents",relations:["Dada","Dadi","Nana","Nani"]},
    {id:"parents",label:"Parents",relations:["Papa","Mummy"]},
    {id:"uncles",label:"Uncles-Aunts",relations:["Tau","Tai","Chacha","Chachi","Mama","Mami","Bua","Fufa"]},
    {id:"cousins",label:"Cousins",relations:["Cousin"]},
    {id:"siblings",label:"Siblings",relations:["Bhai","Bhabhi","Behen","Jija","Main"]}
  ],
  members:[
    {id:1,name:"Ramesh Lal Yadav",relation:"Dada",relationHindi:"Dada Ji",generation:1,gender:"male",phone:"",dob:"1942-04-15",city:"Pathreri, Paota",currentRole:"Retired",occupation:"Former Farmer",education:"Primary School",photo:"",note:"Pillar of our family"},
    {id:2,name:"Savitri Devi Yadav",relation:"Dadi",relationHindi:"Dadi Ji",generation:1,gender:"female",phone:"",dob:"1945-08-20",city:"Pathreri, Paota",currentRole:"Homemaker",occupation:"Taking care of home",education:"",photo:"",note:"Heart of our family"},
    {id:3,name:"Suresh Kumar Yadav",relation:"Papa",relationHindi:"Papa",generation:2,gender:"male",phone:"9876543210",dob:"1968-01-10",city:"Jaipur, Rajasthan",currentRole:"Businessman",occupation:"Running cloth shop since 20 years",education:"B.Com",photo:"",note:"Backbone of family"},
    {id:4,name:"Meena Devi Yadav",relation:"Mummy",relationHindi:"Mummy",generation:2,gender:"female",phone:"9876500001",dob:"1970-05-18",city:"Jaipur, Rajasthan",currentRole:"Homemaker",occupation:"Taking care of home and children",education:"12th Pass",photo:"",note:"Soul of our home"},
    {id:5,name:"Rajesh Kumar Yadav",relation:"Tau",relationHindi:"Tau Ji",generation:2,gender:"male",phone:"9800011111",dob:"1962-11-03",city:"Delhi",currentRole:"Govt. Employee",occupation:"Senior Clerk at Delhi Nagar Nigam",education:"BA",photo:"",note:""},
    {id:6,name:"Kamla Devi Yadav",relation:"Tai",relationHindi:"Tai Ji",generation:2,gender:"female",phone:"",dob:"1965-03-25",city:"Delhi",currentRole:"Homemaker",occupation:"Taking care of home",education:"8th Pass",photo:"",note:""},
    {id:7,name:"Vijay Kumar Yadav",relation:"Chacha",relationHindi:"Chacha Ji",generation:2,gender:"male",phone:"9700022222",dob:"1972-07-14",city:"Agra, UP",currentRole:"Teacher",occupation:"Hindi Teacher at Govt. School",education:"M.A. Hindi, B.Ed",photo:"",note:"Most educated in family"},
    {id:8,name:"Sunita Devi Yadav",relation:"Chachi",relationHindi:"Chachi Ji",generation:2,gender:"female",phone:"9700033333",dob:"1975-09-30",city:"Agra, UP",currentRole:"Anganwadi Worker",occupation:"Teaching children at Anganwadi",education:"10th Pass",photo:"",note:""},
    {id:9,name:"Priya Yadav",relation:"Cousin",relationHindi:"Cousin (Tau Ji ki beti)",generation:3,gender:"female",phone:"9900033333",dob:"1996-04-22",city:"Delhi",currentRole:"Software Engineer",occupation:"Software Engineer at TCS Delhi",education:"B.Tech CSE",photo:"",note:"First engineer in family"},
    {id:10,name:"Rohit Yadav",relation:"Cousin",relationHindi:"Cousin (Tau Ji ka beta)",generation:3,gender:"male",phone:"9900044444",dob:"1999-12-05",city:"Delhi",currentRole:"B.Com Final Year",occupation:"Studying B.Com at Delhi University",education:"B.Com Final Year",photo:"",note:""},
    {id:11,name:"Ankit Yadav",relation:"Cousin",relationHindi:"Cousin (Chacha Ji ka beta)",generation:3,gender:"male",phone:"",dob:"2002-06-18",city:"Agra, UP",currentRole:"12th Student",occupation:"12th Science at St. Peters College",education:"12th Science",photo:"",note:"Preparing for NEET"},
    {id:12,name:"Your Name Here",relation:"Main",relationHindi:"Me",generation:3,gender:"male",phone:"",dob:"2000-01-01",city:"Pathreri, Paota",currentRole:"Website Admin",occupation:"Enter your work here",education:"Enter degree here",photo:"",note:"Website owner"}
  ],
  events:[
    {id:1,title:"Dada ji Birthday",date:"2025-04-15",type:"birthday",description:"Everyone attend!"},
    {id:2,title:"Family Reunion",date:"2025-12-25",type:"reunion",description:"Annual gathering"},
    {id:3,title:"Priya Di Wedding",date:"2026-02-14",type:"wedding",description:"Everyone invited!"}
  ],
  announcements:[
    "Welcome to Yadav Family official website!",
    "Priya Di joined TCS - family is proud!",
    "Family Reunion in December - stay ready!"
  ]
};

// LOAD / SAVE
function loadData() {
  showLoading(true);
  DOC_REF.get().then(function(snap) {
    if (snap.exists) {
      fd = snap.data();
    } else {
      fd = JSON.parse(JSON.stringify(DEFAULT_DATA));
      DOC_REF.set(fd);
    }
    DOC_REF.onSnapshot(function(s) {
      if (s.exists) { fd = s.data(); renderAll(); }
    });
    showLoading(false);
    renderAll();
  }).catch(function(e) {
    console.error('Firebase error:', e);
    fd = JSON.parse(JSON.stringify(DEFAULT_DATA));
    showLoading(false);
    renderAll();
  });
}

function save() {
  return DOC_REF.set(fd).catch(function(e) {
    console.error('Save error:', e);
    alert('Save failed! Check internet connection.');
  });
}

function showLoading(show) {
  var el = document.getElementById('loading-bar');
  if (el) el.style.display = show ? 'block' : 'none';
}

// HELPERS
function calcAge(dob) {
  if (!dob) return null;
  var d = new Date(dob), n = new Date();
  var a = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--;
  return a;
}
function fmtDob(dob) {
  if (!dob) return '';
  var d = new Date(dob);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
function initials(n) {
  return n.trim().split(' ').map(function(w) { return w[0] || ''; }).join('').substring(0, 2).toUpperCase();
}
function setText(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
function getVal(id) { return (document.getElementById(id) || {}).value || ''; }
function setVal(id, v) { var e = document.getElementById(id); if (e) e.value = v || ''; }

function getRoleBadge(role) {
  if (!role) return '';
  var r = role.toLowerCase(), cls = 'rb-other', icon = '[W]';
  if (r.indexOf('student') > -1 || r.indexOf('12th') > -1 || r.indexOf('neet') > -1 || r.indexOf('b.tech') > -1 || r.indexOf('b.com') > -1) { cls = 'rb-student'; icon = '[S]'; }
  else if (r.indexOf('software') > -1 || r.indexOf('engineer') > -1 || r.indexOf('developer') > -1 || r.indexOf('tcs') > -1) { cls = 'rb-job'; icon = '[IT]'; }
  else if (r.indexOf('teacher') > -1 || r.indexOf('professor') > -1) { cls = 'rb-teacher'; icon = '[T]'; }
  else if (r.indexOf('govt') > -1 || r.indexOf('government') > -1 || r.indexOf('clerk') > -1) { cls = 'rb-govt'; icon = '[G]'; }
  else if (r.indexOf('business') > -1 || r.indexOf('shop') > -1) { cls = 'rb-business'; icon = '[B]'; }
  else if (r.indexOf('homemaker') > -1 || r.indexOf('home') > -1) { cls = 'rb-grihini'; icon = '[H]'; }
  else if (r.indexOf('retired') > -1) { cls = 'rb-retired'; icon = '[R]'; }
  else if (r.indexOf('anganwadi') > -1) { cls = 'rb-teacher'; icon = '[A]'; }
  return '<span class="role-badge ' + cls + '">' + role + '</span>';
}

// RENDER ALL
function renderAll() {
  if (!fd) return;
  renderNavTitle(); renderHero(); renderAnnounce(); renderFilterTabs();
  renderMembers(); renderHomePreview(); renderUpcomingBdays(); renderEvents(); renderAbout();
}

function renderNavTitle() {
  document.querySelectorAll('.family-name').forEach(function(el) { el.textContent = fd.familyName + ' Family'; });
  document.title = fd.familyName + ' Family - Official Website';
}

// HERO
function renderHero() {
  setText('hero-tagline', fd.tagline || '');
  setText('hero-place', fd.hometown || '');
  setText('stat-members', fd.members.length);
  var cities = {};
  fd.members.forEach(function(m) { if (m.city) cities[m.city.split(',')[0]] = 1; });
  setText('stat-cities', Object.keys(cities).length);
  setText('stat-est', fd.established || '-');
  startHeroSlideshow();
}

function startHeroSlideshow() {
  clearInterval(heroTimer);
  var photos = fd.heroPhotos || [];
  var wrap = document.getElementById('hero-slide-wrap');
  var dots = document.getElementById('hero-dots');
  if (!wrap) return;
  if (!photos.length) {
    wrap.innerHTML = '<div class="hero-no-photo"><div style="font-size:3rem;margin-bottom:.5rem">Home</div><div style="font-size:14px;opacity:.6">' + (isAdmin ? 'Add photos from Admin Panel' : fd.familyName + ' Family') + '</div></div>';
    if (dots) dots.innerHTML = '';
    return;
  }
  heroSlideIndex = Math.min(heroSlideIndex, photos.length - 1);
  renderHeroSlide();
  if (dots) {
    dots.innerHTML = photos.map(function(_, i) {
      return '<span class="hdot ' + (i === 0 ? 'active' : '') + '" onclick="goHeroSlide(' + i + ')"></span>';
    }).join('');
  }
  if (photos.length > 1) {
    heroTimer = setInterval(function() { heroSlideIndex = (heroSlideIndex + 1) % photos.length; renderHeroSlide(); }, 4000);
  }
}

function renderHeroSlide() {
  var photos = fd.heroPhotos || [];
  if (!photos.length) return;
  var wrap = document.getElementById('hero-slide-wrap');
  var dots = document.getElementById('hero-dots');
  if (!wrap) return;
  var p = photos[heroSlideIndex];
  wrap.innerHTML = '<div class="hero-slide"><img src="' + p.url + '" alt="' + (p.caption || '') + '">' + (p.caption ? '<div class="hero-caption">' + p.caption + '</div>' : '') + '</div>';
  if (dots) dots.querySelectorAll('.hdot').forEach(function(d, i) { d.classList.toggle('active', i === heroSlideIndex); });
}

function goHeroSlide(i) {
  heroSlideIndex = i; renderHeroSlide();
  clearInterval(heroTimer);
  if ((fd.heroPhotos || []).length > 1) heroTimer = setInterval(function() { heroSlideIndex = (heroSlideIndex + 1) % fd.heroPhotos.length; renderHeroSlide(); }, 4000);
}
function prevSlide() { var l = (fd.heroPhotos || []).length || 1; heroSlideIndex = (heroSlideIndex - 1 + l) % l; renderHeroSlide(); }
function nextSlide() { var l = (fd.heroPhotos || []).length || 1; heroSlideIndex = (heroSlideIndex + 1) % l; renderHeroSlide(); }

function renderAnnounce() {
  var el = document.getElementById('announce-list');
  if (!el) return;
  el.innerHTML = (fd.announcements || []).map(function(a) { return '<div class="announce-item"><span>*</span><span>' + a + '</span></div>'; }).join('') || '<div class="announce-item"><span>*</span><span>No announcements yet</span></div>';
}

function renderFilterTabs() {
  var wrap = document.getElementById('filter-tabs-wrap');
  if (!wrap || !fd) return;
  wrap.innerHTML = (fd.filterGroups || []).map(function(g) {
    return '<button class="ftab ' + (activeFilter === g.id ? 'active' : '') + '" onclick="setFilter(\'' + g.id + '\')">' + g.label + '</button>';
  }).join('');
}
function setFilter(f) { activeFilter = f; renderFilterTabs(); renderMembers(); }

function memberCardHTML(m) {
  var age = calcAge(m.dob), dob = fmtDob(m.dob);
  var photoBlock = m.photo ? '<img class="mcard-photo" src="' + m.photo + '" alt="' + m.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' : '';
  return '<div class="mcard" id="mcard-' + m.id + '">' +
    '<div class="mcard-top"></div>' +
    '<div class="mcard-photo-wrap">' + photoBlock +
    '<div class="mcard-photo-initials" style="display:' + (m.photo ? 'none' : 'flex') + '">' + initials(m.name) + '</div>' +
    '<div class="mcard-photo-overlay"><div class="mcard-name-over">' + m.name + '</div><div class="mcard-relation-over">' + (m.relationHindi || m.relation) + '</div></div></div>' +
    '<div class="mcard-body">' +
    '<div class="mcard-header-row">' + getRoleBadge(m.currentRole) + '</div>' +
    '<div class="mdetails">' +
    '<div class="mrow"><span class="mrow-icon">W</span><span class="mrow-label">Work:</span><span class="mrow-val highlight">' + (m.occupation || '-') + '</span></div>' +
    (m.education ? '<div class="mrow"><span class="mrow-icon">E</span><span class="mrow-label">Edu:</span><span class="mrow-val">' + m.education + '</span></div>' : '') +
    (m.city ? '<div class="mrow"><span class="mrow-icon">C</span><span class="mrow-label">City:</span><span class="mrow-val">' + m.city + '</span></div>' : '') +
    (dob ? '<div class="mrow"><span class="mrow-icon">B</span><span class="mrow-label">DOB:</span><span class="mrow-val">' + dob + (age ? ' - ' + age + ' yrs' : '') + '</span></div>' : '') +
    (m.phone ? '<div class="mrow"><span class="mrow-icon">P</span><span class="mrow-label">Phone:</span><span class="mrow-val"><a href="tel:' + m.phone + '" style="color:var(--brown-mid);text-decoration:none">' + m.phone + '</a></span></div>' : '') +
    '</div>' + (m.note ? '<div class="mcard-note">' + m.note + '</div>' : '') + '</div>' +
    '<div class="card-actions"><button class="btn-edit-card" onclick="openEditMember(' + m.id + ')">Edit</button><button class="btn-del-card" onclick="deleteMember(' + m.id + ')">Del</button></div></div>';
}

function renderMembers(filter) {
  filter = filter || activeFilter;
  var search = (document.getElementById('search-input') ? document.getElementById('search-input').value : '').toLowerCase().trim();
  var grid = document.getElementById('members-grid');
  if (!grid || !fd) return;
  var group = null;
  for (var gi = 0; gi < (fd.filterGroups || []).length; gi++) { if (fd.filterGroups[gi].id === filter) { group = fd.filterGroups[gi]; break; } }
  var filterRels = group && group.relations || [];
  var filtered = fd.members.filter(function(m) {
    var inGroup = !filterRels.length || filterRels.indexOf(m.relation) > -1;
    var inSearch = !search || m.name.toLowerCase().indexOf(search) > -1 || m.relation.toLowerCase().indexOf(search) > -1 || (m.city || '').toLowerCase().indexOf(search) > -1 || (m.currentRole || '').toLowerCase().indexOf(search) > -1;
    return inGroup && inSearch;
  });
  if (!filtered.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)">No member found</div>'; return; }
  var GEN = {1:'1st Generation - Grandparents', 2:'2nd Generation - Parents & Uncles', 3:'3rd Generation - Cousins & Us'};
  var byGen = {};
  filtered.forEach(function(m) { var g = m.generation || 3; if (!byGen[g]) byGen[g] = []; byGen[g].push(m); });
  var gens = Object.keys(byGen).sort();
  var html = '';
  gens.forEach(function(g) {
    if (gens.length > 1) html += '<div class="gen-section" style="grid-column:1/-1"><span class="gen-pill">' + (GEN[g] || 'Gen ' + g) + '</span><span class="gen-line"></span><span style="color:var(--text-light);font-size:13px">' + byGen[g].length + ' members</span></div>';
    byGen[g].forEach(function(m) { html += memberCardHTML(m); });
  });
  grid.innerHTML = html;
}

function renderHomePreview() {
  var g = document.getElementById('home-preview-grid');
  if (!g || !fd) return;
  g.innerHTML = fd.members.slice(0, 4).map(function(m) { return memberCardHTML(m); }).join('');
}

function renderUpcomingBdays() {
  var el = document.getElementById('bday-list');
  if (!el || !fd) return;
  var now = new Date();
  var list = fd.members.filter(function(m) { return m.dob; }).map(function(m) {
    var d = new Date(m.dob);
    var next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    if (next <= now) next.setFullYear(now.getFullYear() + 1);
    return {name:m.name, relation:m.relation, days:Math.ceil((next-now)/86400000), nextDate:next};
  }).sort(function(a, b) { return a.days - b.days; }).slice(0, 6);
  el.innerHTML = list.map(function(m) {
    var label = m.days === 0 ? 'Today!' : m.days === 1 ? 'Tomorrow' : m.days + ' days';
    var urgent = m.days <= 7;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-dark);gap:8px">' +
      '<div><div style="font-weight:500;color:var(--brown);font-size:14px">' + m.name + '</div><div style="font-size:12px;color:var(--text-light)">' + m.relation + ' - ' + m.nextDate.getDate() + ' ' + MONTHS[m.nextDate.getMonth()] + '</div></div>' +
      '<span style="font-size:12px;font-weight:600;color:' + (urgent ? '#B45309' : 'var(--text-light)') + ';background:' + (urgent ? '#FEF3C7' : 'var(--cream-dark)') + ';padding:3px 10px;border-radius:10px;white-space:nowrap">' + label + '</span></div>';
  }).join('') || '<div style="color:var(--text-light);font-size:14px">No upcoming birthdays</div>';
}

function renderEvents() {
  var grid = document.getElementById('events-grid');
  if (!grid || !fd) return;
  var evs = (fd.events || []).slice().sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
  var typeEmoji = {birthday:'Birthday',reunion:'Reunion',wedding:'Wedding',festival:'Festival',other:'Event'};
  if (!evs.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2.5rem;color:var(--text-light)">No events yet</div>'; return; }
  grid.innerHTML = evs.map(function(ev) {
    var d = new Date(ev.date);
    var adminBtns = isAdmin ? '<div style="display:flex;gap:6px;margin-top:8px"><button onclick="openEditEvent(' + ev.id + ')" style="font-size:12px;padding:4px 10px;border-radius:6px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;color:var(--brown-mid)">Edit</button><button onclick="deleteEvent(' + ev.id + ')" style="font-size:12px;padding:4px 10px;border-radius:6px;border:1px solid #FECACA;background:#FEF2F2;cursor:pointer;color:#B91C1C">Delete</button></div>' : '';
    return '<div class="ecard"><div class="edate"><div class="eday">' + d.getDate() + '</div><div class="emon">' + MONTHS[d.getMonth()] + '</div></div><div><div class="etitle">' + ev.title + '</div><div class="edesc">' + (ev.description || '') + '</div><span class="etype-badge">' + (typeEmoji[ev.type] || ev.type) + '</span>' + adminBtns + '</div></div>';
  }).join('');
}

function renderAbout() {
  if (!fd) return;
  var m = fd.members;
  var citiesObj = {};
  m.forEach(function(x) { if (x.city) citiesObj[x.city] = 1; });
  setText('ab-hometown', fd.hometown || '-');
  setText('ab-est', fd.established || '-');
  setText('ab-total', m.length);
  setText('ab-cities-list', Object.keys(citiesObj).join(', ') || '-');
  setText('ab-gen1', m.filter(function(x) { return x.generation === 1; }).length);
  setText('ab-gen2', m.filter(function(x) { return x.generation === 2; }).length);
  setText('ab-gen3', m.filter(function(x) { return x.generation === 3; }).length);
}

// NAV
function showPage(p) {
  document.querySelectorAll('.page').forEach(function(x) { x.classList.remove('active'); });
  document.querySelectorAll('.nav-links a[data-page]').forEach(function(x) { x.classList.remove('active'); });
  var pg = document.getElementById('page-' + p); if (pg) pg.classList.add('active');
  var a = document.querySelector('.nav-links a[data-page="' + p + '"]'); if (a) a.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  closeNav();
}
function toggleNav() { document.getElementById('nav-links').classList.toggle('open'); }
function closeNav() { document.getElementById('nav-links').classList.remove('open'); }

// ADMIN
function openAdminLogin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.getElementById('admin-pw').value = '';
  document.getElementById('admin-err').textContent = '';
  setTimeout(function() { document.getElementById('admin-pw').focus(); }, 120);
}
function closeAdminLogin() { document.getElementById('admin-overlay').classList.remove('open'); }
function doLogin() {
  if (document.getElementById('admin-pw').value === fd.adminPassword) {
    isAdmin = true;
    document.body.classList.add('admin-mode');
    closeAdminLogin();
    renderAll();
  } else {
    document.getElementById('admin-err').textContent = 'Wrong password!';
  }
}
function doLogout() { isAdmin = false; document.body.classList.remove('admin-mode'); renderAll(); }

function openAdminPanel() {
  setVal('ap-family-name', fd.familyName); setVal('ap-tagline', fd.tagline);
  setVal('ap-established', fd.established); setVal('ap-hometown', fd.hometown); setVal('ap-password', '');
  renderHeroPhotoList(); renderAnnouncementList(); renderFilterGroupList();
  document.getElementById('admin-panel-overlay').classList.add('open');
}
function closeAdminPanel() { document.getElementById('admin-panel-overlay').classList.remove('open'); }
function saveAdminPanel() {
  fd.familyName = getVal('ap-family-name').trim() || fd.familyName;
  fd.tagline = getVal('ap-tagline').trim();
  fd.established = getVal('ap-established').trim();
  fd.hometown = getVal('ap-hometown').trim();
  var np = getVal('ap-password').trim(); if (np) fd.adminPassword = np;
  save().then(function() { closeAdminPanel(); renderAll(); });
}

// IMAGE / CROP
function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var maxW = 1200, w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject; img.src = e.target.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function openCropModal(imageSrc, target, captionVal) {
  cropTarget = target;
  var modal = document.getElementById('crop-overlay');
  var cropImg = document.getElementById('crop-image');
  var capWrap = document.getElementById('crop-caption-wrap');
  if (capWrap) capWrap.style.display = (target === 'hero') ? 'block' : 'none';
  if (captionVal !== undefined) setVal('crop-caption', captionVal);
  modal.classList.add('open');
  cropImg.src = imageSrc;
  cropImg.onload = function() {
    if (cropInstance) { cropInstance.destroy(); cropInstance = null; }
    cropInstance = new Cropper(cropImg, {
      aspectRatio: target === 'hero' ? 16/9 : 1,
      viewMode: 1, autoCropArea: 0.9, responsive: true, guides: true, background: false
    });
  };
  if (cropImg.complete && cropImg.naturalWidth) cropImg.onload();
}
function closeCropModal() {
  document.getElementById('crop-overlay').classList.remove('open');
  if (cropInstance) { cropInstance.destroy(); cropInstance = null; }
}
function applyCrop() {
  if (!cropInstance) return;
  var canvas = cropInstance.getCroppedCanvas({maxWidth: cropTarget==='hero'?1400:600, maxHeight: cropTarget==='hero'?800:600});
  var b64 = canvas.toDataURL('image/jpeg', 0.88);
  var caption = getVal('crop-caption').trim();
  if (cropTarget === 'hero') {
    if (!fd.heroPhotos) fd.heroPhotos = [];
    fd.heroPhotos.push({url: b64, caption: caption || ''});
    save().then(function() { renderHeroPhotoList(); startHeroSlideshow(); closeCropModal(); });
  } else if (cropTarget === 'member') {
    setVal('mm-photo', b64);
    var prev = document.getElementById('mm-photo-preview');
    if (prev) { prev.src = b64; prev.style.display = 'block'; }
    closeCropModal();
  }
}

function handlePhotoFilePick(input) {
  var files = input.files; if (!files || !files.length) return;
  var cap = getVal('ap-photo-caption').trim();
  var reader = new FileReader();
  reader.onload = function(e) { openCropModal(e.target.result, 'hero', cap); };
  reader.readAsDataURL(files[0]);
  input.value = '';
}
function handlePastePhoto(event) {
  var items = event.clipboardData && event.clipboardData.items; if (!items) return;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') > -1) {
      var file = items[i].getAsFile();
      var reader = new FileReader();
      reader.onload = function(e) { openCropModal(e.target.result, 'hero', getVal('ap-photo-caption')); };
      reader.readAsDataURL(file); event.preventDefault(); return;
    }
  }
}
function addHeroPhoto() {
  var url = getVal('ap-photo-url').trim(); var cap = getVal('ap-photo-caption').trim();
  if (!url) { alert('Enter URL or upload a file!'); return; }
  openCropModal(url, 'hero', cap); setVal('ap-photo-url', '');
}
function handleMemberPhotoUpload(input) {
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) { openCropModal(e.target.result, 'member', ''); };
  reader.readAsDataURL(file); input.value = '';
}
function handleMemberPaste(event) {
  var items = event.clipboardData && event.clipboardData.items; if (!items) return;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') > -1) {
      var file = items[i].getAsFile();
      var reader = new FileReader();
      reader.onload = function(e) { openCropModal(e.target.result, 'member', ''); };
      reader.readAsDataURL(file); event.preventDefault(); return;
    }
  }
}

function renderHeroPhotoList() {
  var wrap = document.getElementById('ap-photo-list'); if (!wrap) return;
  var photos = fd.heroPhotos || [];
  if (!photos.length) { wrap.innerHTML = '<div style="color:var(--text-light);font-size:13px;padding:.5rem 0">No photos yet</div>'; return; }
  wrap.innerHTML = photos.map(function(p, i) {
    var isB64 = p.url.indexOf('data:') === 0;
    return '<div class="ap-photo-item"><img src="' + p.url + '" style="width:72px;height:54px;object-fit:cover;border-radius:6px;border:1px solid var(--border-solid)" onerror="this.style.opacity=\'.3\'">' +
      '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;color:var(--brown);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (p.caption || '(no caption)') + '</div>' +
      '<div style="font-size:11px;color:var(--text-light)">' + (isB64 ? 'Uploaded photo' : 'URL photo') + '</div></div>' +
      '<div style="display:flex;gap:4px;flex-shrink:0">' +
      (i > 0 ? '<button onclick="movePhoto(' + i + ',-1)" style="padding:4px 7px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer">Up</button>' : '') +
      (i < photos.length-1 ? '<button onclick="movePhoto(' + i + ',1)" style="padding:4px 7px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer">Dn</button>' : '') +
      '<button onclick="removePhoto(' + i + ')" style="padding:4px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer">Del</button></div></div>';
  }).join('');
}
function removePhoto(i) { fd.heroPhotos.splice(i, 1); save().then(function() { renderHeroPhotoList(); startHeroSlideshow(); }); }
function movePhoto(i, dir) {
  var arr = fd.heroPhotos, j = i + dir;
  if (j < 0 || j >= arr.length) return;
  var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  save().then(function() { renderHeroPhotoList(); startHeroSlideshow(); });
}

// ANNOUNCEMENTS
function renderAnnouncementList() {
  var wrap = document.getElementById('ap-announce-list'); if (!wrap) return;
  var list = fd.announcements || [];
  if (!list.length) { wrap.innerHTML = '<div style="color:var(--text-light);font-size:13px">No announcements</div>'; return; }
  wrap.innerHTML = list.map(function(a, i) {
    return '<div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--cream-dark)"><span style="flex:1;font-size:13px;color:var(--text-mid)">' + a + '</span>' +
      '<button onclick="editAnnouncement(' + i + ')" style="padding:3px 8px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px">Edit</button>' +
      '<button onclick="removeAnnouncement(' + i + ')" style="padding:3px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px">Del</button></div>';
  }).join('');
}
function addAnnouncement() { var txt = getVal('ap-announce-text').trim(); if (!txt) return; if (!fd.announcements) fd.announcements = []; fd.announcements.push(txt); setVal('ap-announce-text', ''); save().then(function() { renderAnnouncementList(); renderAnnounce(); }); }
function editAnnouncement(i) { var cur = fd.announcements[i]; var newTxt = prompt('Edit announcement:', cur); if (newTxt !== null) { fd.announcements[i] = newTxt.trim() || cur; save().then(function() { renderAnnouncementList(); renderAnnounce(); }); } }
function removeAnnouncement(i) { fd.announcements.splice(i, 1); save().then(function() { renderAnnouncementList(); renderAnnounce(); }); }

// FILTER GROUPS
function renderFilterGroupList() {
  var wrap = document.getElementById('ap-filter-list'); if (!wrap || !fd) return;
  wrap.innerHTML = (fd.filterGroups || []).map(function(g, i) {
    return '<div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--cream-dark)"><span style="flex:1;font-size:13px;color:var(--brown);font-weight:500">' + g.label + '</span>' +
      '<span style="font-size:11px;color:var(--text-light)">[' + (g.relations.join(', ') || 'All') + ']</span>' +
      '<button onclick="editFilterGroup(' + i + ')" style="padding:3px 8px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px">Edit</button>' +
      (i > 0 ? '<button onclick="removeFilterGroup(' + i + ')" style="padding:3px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px">Del</button>' : '<span style="width:30px"></span>') + '</div>';
  }).join('');
}
function addFilterGroup() { var label = getVal('ap-filter-label').trim(); var rels = getVal('ap-filter-relations').split(',').map(function(r) { return r.trim(); }).filter(Boolean); if (!label) { alert('Tab label required!'); return; } if (!fd.filterGroups) fd.filterGroups = []; fd.filterGroups.push({id:'grp_'+Date.now(), label:label, relations:rels}); setVal('ap-filter-label',''); setVal('ap-filter-relations',''); save().then(function() { renderFilterGroupList(); renderFilterTabs(); }); }
function editFilterGroup(i) { var g = fd.filterGroups[i]; var newLabel = prompt('Filter tab label:', g.label); if (newLabel === null) return; var newRels = prompt('Relations (comma separated):', g.relations.join(', ')); if (newRels === null) return; fd.filterGroups[i].label = newLabel.trim() || g.label; fd.filterGroups[i].relations = newRels.split(',').map(function(r) { return r.trim(); }).filter(Boolean); save().then(function() { renderFilterGroupList(); renderFilterTabs(); }); }
function removeFilterGroup(i) { if (!confirm('Remove this filter tab?')) return; fd.filterGroups.splice(i, 1); save().then(function() { renderFilterGroupList(); renderFilterTabs(); }); }

// MEMBER CRUD
function openAddMember() { editMemberId = null; document.getElementById('mm-title').textContent = 'Add New Member'; ['mm-name','mm-relation','mm-relation-hi','mm-current-role','mm-occupation','mm-education','mm-phone','mm-dob','mm-city','mm-photo','mm-note'].forEach(function(id) { setVal(id, ''); }); setVal('mm-gen','3'); setVal('mm-gender','male'); var prev = document.getElementById('mm-photo-preview'); if (prev) prev.style.display = 'none'; document.getElementById('member-overlay').classList.add('open'); }
function openEditMember(id) { editMemberId = id; var m = fd.members.filter(function(x) { return x.id === id; })[0]; if (!m) return; document.getElementById('mm-title').textContent = 'Edit Member'; setVal('mm-name',m.name); setVal('mm-relation',m.relation); setVal('mm-relation-hi',m.relationHindi); setVal('mm-gen',m.generation||3); setVal('mm-gender',m.gender||'male'); setVal('mm-current-role',m.currentRole); setVal('mm-occupation',m.occupation); setVal('mm-education',m.education); setVal('mm-phone',m.phone); setVal('mm-dob',m.dob); setVal('mm-city',m.city); setVal('mm-photo',m.photo); setVal('mm-note',m.note); var prev = document.getElementById('mm-photo-preview'); if (prev) { if (m.photo) { prev.src = m.photo; prev.style.display = 'block'; } else prev.style.display = 'none'; } document.getElementById('member-overlay').classList.add('open'); }
function closeMemberModal() { document.getElementById('member-overlay').classList.remove('open'); }
function saveMember() { var name = getVal('mm-name').trim(), relation = getVal('mm-relation'); if (!name || !relation) { alert('Name and Relation are required!'); return; } var data = {name:name, relation:relation, relationHindi:getVal('mm-relation-hi').trim()||relation, generation:parseInt(getVal('mm-gen'))||3, gender:getVal('mm-gender'), currentRole:getVal('mm-current-role').trim(), occupation:getVal('mm-occupation').trim(), education:getVal('mm-education').trim(), phone:getVal('mm-phone').trim(), dob:getVal('mm-dob'), city:getVal('mm-city').trim(), photo:getVal('mm-photo').trim(), note:getVal('mm-note').trim(), alive:true}; if (editMemberId) { for (var i = 0; i < fd.members.length; i++) { if (fd.members[i].id === editMemberId) { fd.members[i] = Object.assign({}, fd.members[i], data); break; } } } else { data.id = Date.now(); fd.members.push(data); } save().then(function() { closeMemberModal(); renderAll(); }); }
function deleteMember(id) { var m = fd.members.filter(function(x) { return x.id === id; })[0]; if (!m || !confirm(m.name + ' - Remove this member?')) return; fd.members = fd.members.filter(function(x) { return x.id !== id; }); save().then(function() { renderAll(); }); }

// EVENT CRUD
function openAddEvent() { editEventId = null; document.getElementById('em-title-h').textContent = 'Add New Event'; ['em-title','em-date','em-desc'].forEach(function(id) { setVal(id,''); }); setVal('em-type','birthday'); document.getElementById('event-overlay').classList.add('open'); }
function openEditEvent(id) { editEventId = id; var ev = (fd.events||[]).filter(function(x) { return x.id === id; })[0]; if (!ev) return; document.getElementById('em-title-h').textContent = 'Edit Event'; setVal('em-title',ev.title); setVal('em-date',ev.date); setVal('em-type',ev.type||'other'); setVal('em-desc',ev.description); document.getElementById('event-overlay').classList.add('open'); }
function closeEventModal() { document.getElementById('event-overlay').classList.remove('open'); }
function saveEvent() { var title = getVal('em-title').trim(), date = getVal('em-date'); if (!title || !date) { alert('Title and Date required!'); return; } var data = {title:title, date:date, type:getVal('em-type'), description:getVal('em-desc').trim()}; if (!fd.events) fd.events = []; if (editEventId) { for (var i = 0; i < fd.events.length; i++) { if (fd.events[i].id === editEventId) { fd.events[i] = Object.assign({}, fd.events[i], data); break; } } } else { data.id = Date.now(); fd.events.push(data); } save().then(function() { closeEventModal(); renderEvents(); }); }
function deleteEvent(id) { if (!confirm('Remove this event?')) return; fd.events = fd.events.filter(function(e) { return e.id !== id; }); save().then(function() { renderEvents(); }); }

function exportJSON() { var blob = new Blob([JSON.stringify(fd, null, 2)], {type:'application/json'}); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'family.json'; a.click(); }

// INIT
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  var pw = document.getElementById('admin-pw');
  if (pw) pw.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); document.getElementById('admin-err').textContent = ''; });
  ['admin-overlay','member-overlay','event-overlay','admin-panel-overlay','crop-overlay'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
  });
});
// EOF
// echo "Lines: $(wc -l < /tmp/clean_main.js)"
