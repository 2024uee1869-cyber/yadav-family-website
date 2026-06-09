// ═══════════════════════════════════════════
//   YADAV FAMILY — FIREBASE POWERED
// ═══════════════════════════════════════════

// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyDAC6aREQq0Zv0eIKikgHRjbJA2BaLmLvs",
  authDomain: "yadav-family-website.firebaseapp.com",
  projectId: "yadav-family-website",
  storageBucket: "yadav-family-website.firebasestorage.app",
  messagingSenderId: "659268829120",
  appId: "1:659268829120:web:0f5a46925be7af738d9225"
};

// ── FIREBASE INIT (CDN modules) ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const DOC_REF = doc(db, "family", "data");

// ── STATE ──
let fd = null;
let isAdmin = false;
let editMemberId = null;
let editEventId  = null;
let activeFilter = 'all';
let heroSlideIndex = 0;
let heroTimer = null;
let cropInstance = null;
let cropTarget = null; // 'hero' or 'member'
let _pastedHeroB64 = null;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DEFAULT_DATA = {
  familyName:"Yadav", tagline:"One Family, One Identity",
  established:"1955", hometown:"Pathreri, Paota",
  adminPassword:"yadav@2024",
  heroPhotos:[], filterGroups:[
    {id:"all",      label:"🌟 All",          relations:[]},
    {id:"dadke",    label:"👴 Grandparents",  relations:["Dada","Dadi","Nana","Nani"]},
    {id:"parents",  label:"❤️ Parents",       relations:["Papa","Mummy"]},
    {id:"uncles",   label:"🙏 Uncles-Aunts",  relations:["Tau","Tai","Chacha","Chachi","Mama","Mami","Bua","Fufa"]},
    {id:"cousins",  label:"😊 Cousins",       relations:["Cousin"]},
    {id:"siblings", label:"👫 Siblings",      relations:["Bhai","Bhabhi","Behen","Jija","Main"]}
  ],
  members:[
    {id:1,name:"Ramesh Lal Yadav",relation:"Dada",relationHindi:"दादा जी",generation:1,gender:"male",phone:"",dob:"1942-04-15",city:"Pathreri, Paota",currentRole:"Retired",occupation:"Former Farmer, now resting at home",education:"Primary School",photo:"",note:"The pillar of our family"},
    {id:2,name:"Savitri Devi Yadav",relation:"Dadi",relationHindi:"दादी जी",generation:1,gender:"female",phone:"",dob:"1945-08-20",city:"Pathreri, Paota",currentRole:"Homemaker",occupation:"Taking care of home and grandchildren",education:"",photo:"",note:"The heart of our family"},
    {id:3,name:"Suresh Kumar Yadav",relation:"Papa",relationHindi:"पापा",generation:2,gender:"male",phone:"9876543210",dob:"1968-01-10",city:"Jaipur, Rajasthan",currentRole:"Businessman",occupation:"Running cloth shop since 20 years",education:"B.Com",photo:"",note:"The backbone of our family"},
    {id:4,name:"Meena Devi Yadav",relation:"Mummy",relationHindi:"मम्मी",generation:2,gender:"female",phone:"9876500001",dob:"1970-05-18",city:"Jaipur, Rajasthan",currentRole:"Homemaker",occupation:"Taking care of home and children",education:"12th Pass",photo:"",note:"The soul of our home"},
    {id:5,name:"Rajesh Kumar Yadav",relation:"Tau",relationHindi:"ताऊ जी",generation:2,gender:"male",phone:"9800011111",dob:"1962-11-03",city:"Delhi",currentRole:"Govt. Employee",occupation:"Senior Clerk at Delhi Nagar Nigam since 30 years",education:"BA",photo:"",note:""},
    {id:6,name:"Kamla Devi Yadav",relation:"Tai",relationHindi:"ताई जी",generation:2,gender:"female",phone:"",dob:"1965-03-25",city:"Delhi",currentRole:"Homemaker",occupation:"Taking care of home and children",education:"8th Pass",photo:"",note:""},
    {id:7,name:"Vijay Kumar Yadav",relation:"Chacha",relationHindi:"चाचा जी",generation:2,gender:"male",phone:"9700022222",dob:"1972-07-14",city:"Agra, UP",currentRole:"Teacher",occupation:"Hindi Teacher at Govt. School since 15 years",education:"M.A. Hindi, B.Ed",photo:"",note:"Most educated in family"},
    {id:8,name:"Sunita Devi Yadav",relation:"Chachi",relationHindi:"चाची जी",generation:2,gender:"female",phone:"9700033333",dob:"1975-09-30",city:"Agra, UP",currentRole:"Anganwadi Worker",occupation:"Teaching children at Anganwadi since 10 years",education:"10th Pass",photo:"",note:""},
    {id:9,name:"Priya Yadav",relation:"Cousin",relationHindi:"चचेरी बहन",generation:3,gender:"female",phone:"9900033333",dob:"1996-04-22",city:"Delhi",currentRole:"Software Engineer",occupation:"Software Engineer at TCS Delhi since 4 years",education:"B.Tech CSE",photo:"",note:"First engineer in family"},
    {id:10,name:"Rohit Yadav",relation:"Cousin",relationHindi:"चचेरा भाई",generation:3,gender:"male",phone:"9900044444",dob:"1999-12-05",city:"Delhi",currentRole:"B.Com Final Year",occupation:"Studying B.Com at Delhi University",education:"B.Com (Final Year)",photo:"",note:""},
    {id:11,name:"Ankit Yadav",relation:"Cousin",relationHindi:"चचेरा भाई",generation:3,gender:"male",phone:"",dob:"2002-06-18",city:"Agra, UP",currentRole:"12th Student",occupation:"12th Science at St. Peters College Agra",education:"12th Science",photo:"",note:"Preparing for NEET"},
    {id:12,name:"Your Name Here",relation:"Main",relationHindi:"मैं",generation:3,gender:"male",phone:"",dob:"2000-01-01",city:"Pathreri, Paota",currentRole:"Website Admin",occupation:"Enter your work here",education:"Enter degree here",photo:"",note:"Website owner & admin"}
  ],
  events:[
    {id:1,title:"Dada ji Birthday",date:"2025-04-15",type:"birthday",description:"83rd birthday — everyone attend!"},
    {id:2,title:"Family Reunion",date:"2025-12-25",type:"reunion",description:"Annual family gathering"},
    {id:3,title:"Priya Di Wedding",date:"2026-02-14",type:"wedding",description:"Everyone is invited!"}
  ],
  announcements:[
    "🙏 Welcome to Yadav Family official website!",
    "🎓 Priya Di joined TCS — family is proud!",
    "📢 Family Reunion in December — stay ready!"
  ]
};

// ══════════════════════════
//  FIREBASE LOAD / SAVE
// ══════════════════════════
async function loadData() {
  showLoading(true);
  try {
    const snap = await getDoc(DOC_REF);
    if (snap.exists()) {
      fd = snap.data();
    } else {
      fd = JSON.parse(JSON.stringify(DEFAULT_DATA));
      await setDoc(DOC_REF, fd);
    }
    // Real-time listener — any device saves → all devices update
    onSnapshot(DOC_REF, (snap) => {
      if (snap.exists()) { fd = snap.data(); renderAll(); }
    });
  } catch(e) {
    console.error('Firebase error:', e);
    fd = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  showLoading(false);
  renderAll();
}

async function save() {
  try {
    await setDoc(DOC_REF, fd);
  } catch(e) {
    console.error('Save error:', e);
    alert('Save failed! Check internet connection.');
  }
}

function showLoading(show) {
  const el = document.getElementById('loading-bar');
  if (el) el.style.display = show ? 'block' : 'none';
}

// ══════════════════════════
//  HELPERS
// ══════════════════════════
function calcAge(dob){if(!dob)return null;const d=new Date(dob),n=new Date();let a=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))a--;return a;}
function fmtDob(dob){if(!dob)return'';const d=new Date(dob);return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear();}
function initials(n){return n.trim().split(' ').map(w=>w[0]||'').join('').substring(0,2).toUpperCase();}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}
function getVal(id){return(document.getElementById(id)||{}).value||'';}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v||'';}

function getRoleBadge(role){
  if(!role)return'';
  const r=role.toLowerCase();
  let cls='rb-other',icon='💼';
  if(r.includes('student')||r.includes('b.com')||r.includes('b.tech')||r.includes('12th')||r.includes('school')||r.includes('neet'))cls='rb-student',icon='📚';
  else if(r.includes('software')||r.includes('engineer')||r.includes('developer')||r.includes('tcs')||r.includes('infosys'))cls='rb-job',icon='💻';
  else if(r.includes('teacher')||r.includes('professor'))cls='rb-teacher',icon='🎓';
  else if(r.includes('govt')||r.includes('government')||r.includes('clerk')||r.includes('nagar'))cls='rb-govt',icon='🏛️';
  else if(r.includes('business')||r.includes('dukaan')||r.includes('shop'))cls='rb-business',icon='🏪';
  else if(r.includes('homemaker')||r.includes('grihini')||r.includes('home'))cls='rb-grihini',icon='🏡';
  else if(r.includes('retired')||r.includes('resting'))cls='rb-retired',icon='☕';
  else if(r.includes('doctor')||r.includes('medical')||r.includes('nurse'))cls='rb-job',icon='⚕️';
  else if(r.includes('anganwadi')||r.includes('worker'))cls='rb-teacher',icon='👩‍🏫';
  return '<span class="role-badge '+cls+'">'+icon+' '+role+'</span>';
}

// ══════════════════════════
//  RENDER
// ══════════════════════════
function renderAll(){
  if(!fd)return;
  renderNavTitle(); renderHero(); renderAnnounce(); renderFilterTabs();
  renderMembers(); renderHomePreview(); renderUpcomingBdays(); renderEvents(); renderAbout();
}

function renderNavTitle(){
  document.querySelectorAll('.family-name').forEach(el=>el.textContent=fd.familyName+' Family');
  document.title=fd.familyName+' Family — Official Website';
}

// ── HERO SLIDESHOW ──
function renderHero(){
  setText('hero-tagline', fd.tagline||'');
  setText('hero-place', '📍 '+(fd.hometown||''));
  setText('stat-members', fd.members.length);
  const cities=new Set(fd.members.map(m=>m.city&&m.city.split(',')[0]).filter(Boolean));
  setText('stat-cities', cities.size);
  setText('stat-est', fd.established||'—');
  startHeroSlideshow();
}

function startHeroSlideshow(){
  clearInterval(heroTimer);
  const photos=fd.heroPhotos||[];
  const wrap=document.getElementById('hero-slide-wrap');
  const dots=document.getElementById('hero-dots');
  if(!wrap)return;
  if(!photos.length){
    wrap.innerHTML='<div class="hero-no-photo"><div style="font-size:3.5rem;margin-bottom:.5rem">🏠</div><div style="font-size:14px;opacity:.6">'+(isAdmin?'Click "Manage Photos" above to add photos':fd.familyName+' Family')+'</div></div>';
    if(dots)dots.innerHTML='';
    return;
  }
  heroSlideIndex=Math.min(heroSlideIndex,photos.length-1);
  renderHeroSlide();
  if(dots)dots.innerHTML=photos.map((_,i)=>'<span class="hdot '+(i===0?'active':'')+'" onclick="goHeroSlide('+i+')"></span>').join('');
  if(photos.length>1)heroTimer=setInterval(()=>{heroSlideIndex=(heroSlideIndex+1)%photos.length;renderHeroSlide();},4000);
}

function renderHeroSlide(){
  const photos=fd.heroPhotos||[];if(!photos.length)return;
  const wrap=document.getElementById('hero-slide-wrap');
  const dots=document.getElementById('hero-dots');
  if(!wrap)return;
  const p=photos[heroSlideIndex];
  wrap.innerHTML='<div class="hero-slide"><img src="'+p.url+'" alt="'+(p.caption||'')+'">'+(p.caption?'<div class="hero-caption">'+p.caption+'</div>':'')+'</div>';
  if(dots)dots.querySelectorAll('.hdot').forEach((d,i)=>d.classList.toggle('active',i===heroSlideIndex));
}

function goHeroSlide(i){heroSlideIndex=i;renderHeroSlide();clearInterval(heroTimer);if((fd.heroPhotos||[]).length>1)heroTimer=setInterval(()=>{heroSlideIndex=(heroSlideIndex+1)%fd.heroPhotos.length;renderHeroSlide();},4000);}
function prevSlide(){const l=(fd.heroPhotos||[]).length||1;heroSlideIndex=(heroSlideIndex-1+l)%l;renderHeroSlide();}
function nextSlide(){const l=(fd.heroPhotos||[]).length||1;heroSlideIndex=(heroSlideIndex+1)%l;renderHeroSlide();}

// ── ANNOUNCE ──
function renderAnnounce(){
  const el=document.getElementById('announce-list');if(!el)return;
  el.innerHTML=(fd.announcements||[]).map(a=>'<div class="announce-item"><span>📢</span><span>'+a+'</span></div>').join('')||'<div class="announce-item"><span>📢</span><span>No announcements yet</span></div>';
}

// ── FILTER TABS ──
function renderFilterTabs(){
  const wrap=document.getElementById('filter-tabs-wrap');if(!wrap||!fd)return;
  wrap.innerHTML=(fd.filterGroups||[]).map(g=>'<button class="ftab '+(activeFilter===g.id?'active':'')+'" data-f="'+g.id+'" onclick="setFilter(\''+g.id+'\')">'+g.label+'</button>').join('');
}
function setFilter(f){activeFilter=f;renderFilterTabs();renderMembers();}

// ── MEMBER CARD ──
function memberCardHTML(m){
  const age=calcAge(m.dob),dob=fmtDob(m.dob);
  const photoBlock=m.photo?'<img class="mcard-photo" src="'+m.photo+'" alt="'+m.name+'" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">':'';
  return '<div class="mcard" id="mcard-'+m.id+'"><div class="mcard-top"></div><div class="mcard-photo-wrap">'+photoBlock+'<div class="mcard-photo-initials" style="display:'+(m.photo?'none':'flex')+'">'+initials(m.name)+'</div><div class="mcard-photo-overlay"><div class="mcard-name-over">'+m.name+'</div><div class="mcard-relation-over">'+(m.relationHindi||m.relation)+'</div></div></div><div class="mcard-body"><div class="mcard-header-row">'+getRoleBadge(m.currentRole)+'</div><div class="mdetails"><div class="mrow"><span class="mrow-icon">💼</span><span class="mrow-label">Work:</span><span class="mrow-val highlight">'+(m.occupation||'—')+'</span></div>'+(m.education?'<div class="mrow"><span class="mrow-icon">🎓</span><span class="mrow-label">Edu:</span><span class="mrow-val">'+m.education+'</span></div>':'')+(m.city?'<div class="mrow"><span class="mrow-icon">📍</span><span class="mrow-label">City:</span><span class="mrow-val">'+m.city+'</span></div>':'')+(dob?'<div class="mrow"><span class="mrow-icon">🎂</span><span class="mrow-label">DOB:</span><span class="mrow-val">'+dob+(age?' · '+age+' yrs':'')+'</span></div>':'')+(m.phone?'<div class="mrow"><span class="mrow-icon">📱</span><span class="mrow-label">Phone:</span><span class="mrow-val"><a href="tel:'+m.phone+'" style="color:var(--brown-mid);text-decoration:none">'+m.phone+'</a></span></div>':'')+'</div>'+(m.note?'<div class="mcard-note">"'+m.note+'"</div>':'')+'</div><div class="card-actions"><button class="btn-edit-card" onclick="openEditMember('+m.id+')">✏️ Edit</button><button class="btn-del-card" onclick="deleteMember('+m.id+')">🗑️</button></div></div>';
}

function renderMembers(filter){
  filter=filter||activeFilter;
  const search=(document.getElementById('search-input')&&document.getElementById('search-input').value||'').toLowerCase().trim();
  const grid=document.getElementById('members-grid');if(!grid||!fd)return;
  const group=(fd.filterGroups||[]).find(g=>g.id===filter);
  const filterRels=group&&group.relations||[];
  let filtered=fd.members.filter(m=>{
    const inGroup=!filterRels.length||filterRels.includes(m.relation);
    const inSearch=!search||m.name.toLowerCase().includes(search)||m.relation.toLowerCase().includes(search)||(m.city||'').toLowerCase().includes(search)||(m.currentRole||'').toLowerCase().includes(search)||(m.occupation||'').toLowerCase().includes(search);
    return inGroup&&inSearch;
  });
  if(!filtered.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)"><div style="font-size:3rem;margin-bottom:.8rem">🔍</div><div style="font-size:1.2rem">No member found</div></div>';return;}
  const GEN={1:'👴 1st Generation — Grandparents',2:'🙏 2nd Generation — Parents & Uncles',3:'😊 3rd Generation — Cousins & Us'};
  const byGen={};filtered.forEach(m=>{const g=m.generation||3;(byGen[g]=byGen[g]||[]).push(m);});
  const gens=Object.keys(byGen).sort();
  let html='';
  gens.forEach(g=>{
    if(gens.length>1)html+='<div class="gen-section" style="grid-column:1/-1"><span class="gen-pill">'+(GEN[g]||'Gen '+g)+'</span><span class="gen-line"></span><span style="color:var(--text-light);font-size:13px">'+byGen[g].length+' members</span></div>';
    byGen[g].forEach(m=>{html+=memberCardHTML(m);});
  });
  grid.innerHTML=html;
}

function renderHomePreview(){const g=document.getElementById('home-preview-grid');if(!g||!fd)return;g.innerHTML=fd.members.slice(0,4).map(m=>memberCardHTML(m)).join('');}

function renderUpcomingBdays(){
  const el=document.getElementById('bday-list');if(!el||!fd)return;
  const now=new Date();
  const list=fd.members.filter(m=>m.dob).map(m=>{const d=new Date(m.dob);let next=new Date(now.getFullYear(),d.getMonth(),d.getDate());if(next<=now)next.setFullYear(now.getFullYear()+1);return Object.assign({},m,{days:Math.ceil((next-now)/86400000),nextDate:next});}).sort((a,b)=>a.days-b.days).slice(0,6);
  el.innerHTML=list.map(m=>{const label=m.days===0?'🎉 Today!':m.days===1?'Tomorrow':m.days+' days';const urgent=m.days<=7;return'<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cream-dark);gap:8px"><div><div style="font-weight:500;color:var(--brown);font-size:14px">'+m.name+'</div><div style="font-size:12px;color:var(--text-light)">'+m.relation+' · '+m.nextDate.getDate()+' '+MONTHS[m.nextDate.getMonth()]+'</div></div><span style="font-size:12px;font-weight:600;color:'+(urgent?'#B45309':'var(--text-light)')+';background:'+(urgent?'#FEF3C7':'var(--cream-dark)')+';padding:3px 10px;border-radius:10px;white-space:nowrap">'+label+'</span></div>';}).join('')||'<div style="color:var(--text-light);font-size:14px">No upcoming birthdays</div>';
}

function renderEvents(){
  const grid=document.getElementById('events-grid');if(!grid||!fd)return;
  const evs=[...(fd.events||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const typeEmoji={birthday:'🎂',reunion:'🏡',wedding:'💍',festival:'🪔',other:'📅'};
  const typeLabel={birthday:'Birthday',reunion:'Reunion',wedding:'Wedding',festival:'Festival',other:'Event'};
  if(!evs.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:2.5rem;color:var(--text-light)">No events yet</div>';return;}
  grid.innerHTML=evs.map(ev=>{const d=new Date(ev.date);const adminBtns=isAdmin?'<div style="display:flex;gap:6px;margin-top:8px"><button onclick="openEditEvent('+ev.id+')" style="font-size:12px;padding:4px 10px;border-radius:6px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;color:var(--brown-mid)">✏️ Edit</button><button onclick="deleteEvent('+ev.id+')" style="font-size:12px;padding:4px 10px;border-radius:6px;border:1px solid #FECACA;background:#FEF2F2;cursor:pointer;color:#B91C1C">🗑️</button></div>':'';return'<div class="ecard"><div class="edate"><div class="eday">'+d.getDate()+'</div><div class="emon">'+MONTHS[d.getMonth()]+'</div></div><div><div class="etitle">'+(typeEmoji[ev.type]||'📅')+' '+ev.title+'</div><div class="edesc">'+(ev.description||'')+'</div><span class="etype-badge">'+(typeLabel[ev.type]||ev.type)+'</span>'+adminBtns+'</div></div>';}).join('');
}

function renderAbout(){
  if(!fd)return;
  const m=fd.members;const cities=[...new Set(m.map(x=>x.city).filter(Boolean))];
  setText('ab-hometown',fd.hometown||'—');setText('ab-est',fd.established||'—');setText('ab-total',m.length);
  setText('ab-cities-list',cities.join(' · ')||'—');setText('ab-gen1',m.filter(x=>x.generation===1).length);
  setText('ab-gen2',m.filter(x=>x.generation===2).length);setText('ab-gen3',m.filter(x=>x.generation===3).length);
}

// ══════════════════════════
//  NAV
// ══════════════════════════
function showPage(p){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.nav-links a[data-page]').forEach(x=>x.classList.remove('active'));document.getElementById('page-'+p)&&document.getElementById('page-'+p).classList.add('active');const a=document.querySelector('.nav-links a[data-page="'+p+'"]');if(a)a.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});closeNav();}
function toggleNav(){document.getElementById('nav-links').classList.toggle('open');}
function closeNav(){document.getElementById('nav-links').classList.remove('open');}

// ══════════════════════════
//  ADMIN
// ══════════════════════════
function openAdminLogin(){document.getElementById('admin-overlay').classList.add('open');document.getElementById('admin-pw').value='';document.getElementById('admin-err').textContent='';setTimeout(()=>document.getElementById('admin-pw').focus(),120);}
function closeAdminLogin(){document.getElementById('admin-overlay').classList.remove('open');}
function doLogin(){if(document.getElementById('admin-pw').value===fd.adminPassword){isAdmin=true;document.body.classList.add('admin-mode');closeAdminLogin();renderAll();}else{document.getElementById('admin-err').textContent='❌ Wrong password!';}}
function doLogout(){isAdmin=false;document.body.classList.remove('admin-mode');renderAll();}

function openAdminPanel(){
  setVal('ap-family-name',fd.familyName);setVal('ap-tagline',fd.tagline);
  setVal('ap-established',fd.established);setVal('ap-hometown',fd.hometown);setVal('ap-password','');
  renderHeroPhotoList();renderAnnouncementList();renderFilterGroupList();
  document.getElementById('admin-panel-overlay').classList.add('open');
}
function closeAdminPanel(){document.getElementById('admin-panel-overlay').classList.remove('open');}
async function saveAdminPanel(){
  fd.familyName=getVal('ap-family-name').trim()||fd.familyName;
  fd.tagline=getVal('ap-tagline').trim();fd.established=getVal('ap-established').trim();
  fd.hometown=getVal('ap-hometown').trim();const np=getVal('ap-password').trim();
  if(np)fd.adminPassword=np;
  await save();closeAdminPanel();renderAll();
}

// ══════════════════════════
//  IMAGE UTILS
// ══════════════════════════
function fileToBase64(file){
  return new Promise(function(resolve,reject){
    var reader=new FileReader();
    reader.onload=function(e){
      var img=new Image();
      img.onload=function(){
        var canvas=document.createElement('canvas');
        var maxW=1200;var w=img.width,h=img.height;
        if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
        canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',0.82));
      };
      img.onerror=reject;img.src=e.target.result;
    };
    reader.onerror=reject;reader.readAsDataURL(file);
  });
}

// ══════════════════════════
//  CROP MODAL
// ══════════════════════════
function openCropModal(imageSrc, target, captionVal) {
  cropTarget = target;
  const modal = document.getElementById('crop-overlay');
  const cropImg = document.getElementById('crop-image');
  document.getElementById('crop-caption-wrap').style.display = (target === 'hero') ? 'block' : 'none';
  if (captionVal !== undefined) setVal('crop-caption', captionVal);
  cropImg.src = imageSrc;
  modal.classList.add('open');
  // Init cropper after image loads
  cropImg.onload = function() {
    if (cropInstance) { cropInstance.destroy(); cropInstance = null; }
    const aspectRatio = target === 'hero' ? 16/9 : 1;
    cropInstance = new Cropper(cropImg, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      autoCropArea: 0.9,
      responsive: true,
      guides: true,
      background: false,
    });
  };
  if (cropImg.complete) cropImg.onload();
}

function closeCropModal() {
  document.getElementById('crop-overlay').classList.remove('open');
  if (cropInstance) { cropInstance.destroy(); cropInstance = null; }
}

function applyCrop() {
  if (!cropInstance) return;
  const canvas = cropInstance.getCroppedCanvas({
    maxWidth: cropTarget === 'hero' ? 1400 : 600,
    maxHeight: cropTarget === 'hero' ? 800 : 600,
    imageSmoothingQuality: 'high'
  });
  const b64 = canvas.toDataURL('image/jpeg', 0.88);
  const caption = getVal('crop-caption').trim();

  if (cropTarget === 'hero') {
    if (!fd.heroPhotos) fd.heroPhotos = [];
    fd.heroPhotos.push({ url: b64, caption: caption || '' });
    save().then(() => { renderHeroPhotoList(); startHeroSlideshow(); closeCropModal(); });
  } else if (cropTarget === 'member') {
    setVal('mm-photo', b64);
    const prev = document.getElementById('mm-photo-preview');
    if (prev) { prev.src = b64; prev.style.display = 'block'; }
    closeCropModal();
  }
}

// ── HERO PHOTO HANDLERS ──
async function handlePhotoFilePick(input) {
  const files = input.files; if (!files || !files.length) return;
  const cap = getVal('ap-photo-caption').trim();
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => openCropModal(e.target.result, 'hero', cap);
    reader.readAsDataURL(files[i]);
    break; // one at a time for crop
  }
  input.value = '';
}

function handlePastePhoto(event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (e) => openCropModal(e.target.result, 'hero', getVal('ap-photo-caption'));
      reader.readAsDataURL(file);
      event.preventDefault();
      return;
    }
  }
}

function addHeroPhoto() {
  const url = getVal('ap-photo-url').trim();
  const cap = getVal('ap-photo-caption').trim();
  if (!url) { alert('Enter URL or upload a file!'); return; }
  openCropModal(url, 'hero', cap);
  setVal('ap-photo-url', '');
}

// ── MEMBER PHOTO HANDLERS ──
async function handleMemberPhotoUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => openCropModal(e.target.result, 'member', '');
  reader.readAsDataURL(file);
  input.value = '';
}

function handleMemberPaste(event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (e) => openCropModal(e.target.result, 'member', '');
      reader.readAsDataURL(file);
      event.preventDefault();
      return;
    }
  }
}

// ── HERO PHOTO LIST ──
function renderHeroPhotoList() {
  const wrap = document.getElementById('ap-photo-list'); if (!wrap) return;
  const photos = fd.heroPhotos || [];
  if (!photos.length) { wrap.innerHTML = '<div style="color:var(--text-light);font-size:13px;padding:.5rem 0">No photos yet — upload below</div>'; return; }
  wrap.innerHTML = photos.map((p, i) => {
    const isB64 = p.url.startsWith('data:');
    return '<div class="ap-photo-item"><img src="'+p.url+'" style="width:72px;height:54px;object-fit:cover;border-radius:6px;border:1px solid var(--border-solid)" onerror="this.style.opacity=\'.3\'"><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;color:var(--brown);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(p.caption||'(no caption)')+'</div><div style="font-size:11px;color:var(--text-light)">'+(isB64?'✅ Uploaded photo':'🔗 URL photo')+'</div></div><div style="display:flex;gap:4px;flex-shrink:0">'+(i>0?'<button onclick="movePhoto('+i+',-1)" style="padding:4px 7px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:13px">↑</button>':'')+(i<photos.length-1?'<button onclick="movePhoto('+i+',1)" style="padding:4px 7px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:13px">↓</button>':'')+'<button onclick="removePhoto('+i+')" style="padding:4px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:13px">🗑️</button></div></div>';
  }).join('');
}

function removePhoto(i) { fd.heroPhotos.splice(i,1); save().then(()=>{renderHeroPhotoList();startHeroSlideshow();}); }
function movePhoto(i,dir) { const arr=fd.heroPhotos,j=i+dir; if(j<0||j>=arr.length)return; [arr[i],arr[j]]=[arr[j],arr[i]]; save().then(()=>{renderHeroPhotoList();startHeroSlideshow();}); }

// ── ANNOUNCEMENTS ──
function renderAnnouncementList(){
  const wrap=document.getElementById('ap-announce-list');if(!wrap)return;
  const list=fd.announcements||[];
  if(!list.length){wrap.innerHTML='<div style="color:var(--text-light);font-size:13px">No announcements</div>';return;}
  wrap.innerHTML=list.map((a,i)=>'<div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--cream-dark)"><span style="flex:1;font-size:13px;color:var(--text-mid)">'+a+'</span><button onclick="editAnnouncement('+i+')" style="padding:3px 8px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px;flex-shrink:0">✏️</button><button onclick="removeAnnouncement('+i+')" style="padding:3px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px;flex-shrink:0">🗑️</button></div>').join('');
}
async function addAnnouncement(){const txt=getVal('ap-announce-text').trim();if(!txt)return;if(!fd.announcements)fd.announcements=[];fd.announcements.push(txt);setVal('ap-announce-text','');await save();renderAnnouncementList();renderAnnounce();}
async function editAnnouncement(i){const cur=fd.announcements[i];const newTxt=prompt('Edit announcement:',cur);if(newTxt!==null){fd.announcements[i]=newTxt.trim()||cur;await save();renderAnnouncementList();renderAnnounce();}}
async function removeAnnouncement(i){fd.announcements.splice(i,1);await save();renderAnnouncementList();renderAnnounce();}

// ── FILTER GROUPS ──
function renderFilterGroupList(){
  const wrap=document.getElementById('ap-filter-list');if(!wrap||!fd)return;
  wrap.innerHTML=(fd.filterGroups||[]).map((g,i)=>'<div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--cream-dark)"><span style="flex:1;font-size:13px;color:var(--brown);font-weight:500">'+g.label+'</span><span style="font-size:11px;color:var(--text-light)">['+( g.relations.join(', ')||'All')+']</span><button onclick="editFilterGroup('+i+')" style="padding:3px 8px;border-radius:5px;border:1px solid var(--border-solid);background:var(--cream);cursor:pointer;font-size:12px">✏️</button>'+(i>0?'<button onclick="removeFilterGroup('+i+')" style="padding:3px 8px;border-radius:5px;border:1px solid #FECACA;background:#FEF2F2;color:#B91C1C;cursor:pointer;font-size:12px">🗑️</button>':'<span style="width:30px"></span>')+'</div>').join('');
}
async function addFilterGroup(){const label=getVal('ap-filter-label').trim();const rels=getVal('ap-filter-relations').split(',').map(r=>r.trim()).filter(Boolean);if(!label){alert('Tab label is required!');return;}if(!fd.filterGroups)fd.filterGroups=[];fd.filterGroups.push({id:'grp_'+Date.now(),label:label,relations:rels});setVal('ap-filter-label','');setVal('ap-filter-relations','');await save();renderFilterGroupList();renderFilterTabs();}
async function editFilterGroup(i){const g=fd.filterGroups[i];const newLabel=prompt('Filter tab label:',g.label);if(newLabel===null)return;const newRels=prompt('Relations (comma separated, blank = All):',g.relations.join(', '));if(newRels===null)return;fd.filterGroups[i].label=newLabel.trim()||g.label;fd.filterGroups[i].relations=newRels.split(',').map(r=>r.trim()).filter(Boolean);await save();renderFilterGroupList();renderFilterTabs();}
async function removeFilterGroup(i){if(!confirm('Remove this filter tab?'))return;fd.filterGroups.splice(i,1);await save();renderFilterGroupList();renderFilterTabs();}

// ── MEMBER CRUD ──
function openAddMember(){
  editMemberId=null;
  document.getElementById('mm-title').textContent='Add New Member';
  ['mm-name','mm-relation','mm-relation-hi','mm-current-role','mm-occupation','mm-education','mm-phone','mm-dob','mm-city','mm-photo','mm-note'].forEach(id=>setVal(id,''));
  setVal('mm-gen','3');setVal('mm-gender','male');
  const prev=document.getElementById('mm-photo-preview');if(prev)prev.style.display='none';
  document.getElementById('member-overlay').classList.add('open');
}
function openEditMember(id){
  editMemberId=id;const m=fd.members.find(x=>x.id===id);if(!m)return;
  document.getElementById('mm-title').textContent='✏️ Edit Member';
  setVal('mm-name',m.name);setVal('mm-relation',m.relation);setVal('mm-relation-hi',m.relationHindi);
  setVal('mm-gen',m.generation||3);setVal('mm-gender',m.gender||'male');
  setVal('mm-current-role',m.currentRole);setVal('mm-occupation',m.occupation);
  setVal('mm-education',m.education);setVal('mm-phone',m.phone);
  setVal('mm-dob',m.dob);setVal('mm-city',m.city);setVal('mm-photo',m.photo);setVal('mm-note',m.note);
  const prev=document.getElementById('mm-photo-preview');
  if(prev){if(m.photo){prev.src=m.photo;prev.style.display='block';}else prev.style.display='none';}
  document.getElementById('member-overlay').classList.add('open');
}
function closeMemberModal(){document.getElementById('member-overlay').classList.remove('open');}
async function saveMember(){
  const name=getVal('mm-name').trim(),relation=getVal('mm-relation');
  if(!name||!relation){alert('Name and Relation are required!');return;}
  const data={name,relation,relationHindi:getVal('mm-relation-hi').trim()||relation,generation:parseInt(getVal('mm-gen'))||3,gender:getVal('mm-gender'),currentRole:getVal('mm-current-role').trim(),occupation:getVal('mm-occupation').trim(),education:getVal('mm-education').trim(),phone:getVal('mm-phone').trim(),dob:getVal('mm-dob'),city:getVal('mm-city').trim(),photo:getVal('mm-photo').trim(),note:getVal('mm-note').trim(),alive:true};
  if(editMemberId){const i=fd.members.findIndex(m=>m.id===editMemberId);fd.members[i]=Object.assign({},fd.members[i],data);}
  else{data.id=Date.now();fd.members.push(data);}
  await save();closeMemberModal();renderAll();
}
async function deleteMember(id){
  const m=fd.members.find(x=>x.id===id);
  if(!m||!confirm('"'+m.name+'" — Remove this member?'))return;
  fd.members=fd.members.filter(x=>x.id!==id);await save();renderAll();
}

// ── EVENT CRUD ──
function openAddEvent(){editEventId=null;document.getElementById('em-title-h').textContent='Add New Event';['em-title','em-date','em-desc'].forEach(id=>setVal(id,''));setVal('em-type','birthday');document.getElementById('event-overlay').classList.add('open');}
function openEditEvent(id){editEventId=id;const ev=fd.events&&fd.events.find(x=>x.id===id);if(!ev)return;document.getElementById('em-title-h').textContent='✏️ Edit Event';setVal('em-title',ev.title);setVal('em-date',ev.date);setVal('em-type',ev.type||'other');setVal('em-desc',ev.description);document.getElementById('event-overlay').classList.add('open');}
function closeEventModal(){document.getElementById('event-overlay').classList.remove('open');}
async function saveEvent(){
  const title=getVal('em-title').trim(),date=getVal('em-date');
  if(!title||!date){alert('Title and Date are required!');return;}
  const data={title,date,type:getVal('em-type'),description:getVal('em-desc').trim()};
  if(!fd.events)fd.events=[];
  if(editEventId){const i=fd.events.findIndex(e=>e.id===editEventId);fd.events[i]=Object.assign({},fd.events[i],data);}
  else{data.id=Date.now();fd.events.push(data);}
  await save();closeEventModal();renderEvents();
}
async function deleteEvent(id){if(!confirm('Remove this event?'))return;fd.events=fd.events.filter(e=>e.id!==id);await save();renderEvents();}

function exportJSON(){const blob=new Blob([JSON.stringify(fd,null,2)],{type:'application/json'});Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:'family.json'}).click();}

// ── INIT ──
document.addEventListener('DOMContentLoaded',function(){
  loadData();
  document.getElementById('admin-pw').addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();document.getElementById('admin-err').textContent='';});
  ['admin-overlay','member-overlay','event-overlay','admin-panel-overlay','crop-overlay'].forEach(function(id){const el=document.getElementById(id);if(el)el.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});});
});
