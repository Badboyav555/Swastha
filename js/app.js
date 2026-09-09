/* ============================================================
   SwasthyaSaathi — Shared App Shell & Utilities
   ------------------------------------------------------------
   Renders the sidebar / mobile header / bottom nav into pages,
   wires the online/offline status pill, provides toast/util
   helpers, and holds fallback DEMO_DATA used only when
   SUPABASE_CONFIGURED is false (see js/supabase.js) so the UI
   can be evaluated without a live backend.
   ============================================================ */

const ICONS = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  cases:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"/></svg>',
  pregnancy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.2"/><path d="M12 10.5c-4 0-6 3-6 6.5v1h12v-1c0-3.5-2-6.5-6-6.5Z"/><path d="M12 22v-4"/></svg>',
  referrals:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 4 12l5 6"/><path d="M4 12h16"/></svg>',
  followups:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  child:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="2.6"/><path d="M8 21v-6.5a4 4 0 0 1 8 0V21"/><path d="M9 15l-2 3M15 15l2 3"/></svg>',
  reports:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7z"/><path d="M10 12v4M13 10v6M16 14v2"/></svg>',
  profile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6"/></svg>',
  admin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8l8-4 8 4v8l-8 4-8-4Z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6l8-3 8 3v15"/><path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  chevronRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  syringe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4M9.5 8.5l6 6M4 20l3.5-1L18 8.5l-2.5-2.5L5 16.5 4 20Z"/></svg>',
};

const NAV_CONFIG = [
  { key:'dashboard', href:'dashboard.html', icon:'dashboard', label:'nav_dashboard', roles:['asha','anm','medical_officer','block_officer','district_officer'] },
  { key:'cases', href:'cases.html', icon:'cases', label:'nav_cases', roles:['asha','anm','medical_officer','block_officer','district_officer'] },
  { key:'pregnancy', href:'pregnancy.html', icon:'pregnancy', label:'nav_new_pregnancy', roles:['asha','anm'] },
  { key:'referrals', href:'referrals.html', icon:'referrals', label:'nav_referrals', roles:['asha','anm','medical_officer','block_officer','district_officer'] },
  { key:'referrals-followups', href:'referrals.html#followups', icon:'followups', label:'nav_followups', roles:['asha','anm','medical_officer','block_officer','district_officer'] },
  { key:'referrals-child', href:'referrals.html#child', icon:'child', label:'nav_child_health', roles:['asha','anm','medical_officer'] },
  { key:'reports', href:'dashboard.html#reports', icon:'reports', label:'nav_reports', roles:['block_officer','district_officer','medical_officer'] },
  { key:'admin', href:'admin.html', icon:'admin', label:'nav_admin', roles:['admin'] },
];

const BOTTOM_NAV = [
  { key:'dashboard', href:'dashboard.html', icon:'dashboard', label:'nav_home' },
  { key:'cases', href:'cases.html', icon:'cases', label:'nav_cases' },
  { key:'referrals', href:'referrals.html', icon:'referrals', label:'nav_referrals' },
  { key:'referrals-followups', href:'referrals.html#followups', icon:'followups', label:'nav_followups' },
  { key:'profile', href:'dashboard.html#profile', icon:'profile', label:'nav_profile' },
];

const APP = {

  initials(name){
    return (name||'').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  },

  buildSidebar(active, session){
    const items = NAV_CONFIG.filter(i => i.roles.includes(session.role));
    return `
      <aside class="sidebar">
        <a href="dashboard.html" class="sidebar-brand">
          <div class="brand-mark">SS</div>
          <div>
            <div class="brand-name-hi">${I18N.t('brand_hi')}</div>
            <div class="brand-name-en">${I18N.t('brand_en')}</div>
          </div>
        </a>
        <nav class="sidebar-nav">
          ${items.map(i => `
            <a href="${i.href}" class="nav-item ${i.key===active?'active':''}">
              ${ICONS[i.icon]}<span data-i18n="${i.label}">${I18N.t(i.label)}</span>
            </a>`).join('')}
        </nav>
        <div class="sidebar-footer">
          <div id="sidebarStatusPill"></div>
          <div class="flex items-center justify-between">
            <div class="user-mini">
              <div class="user-avatar">${this.initials(session.name)}</div>
              <div>
                <div class="user-name">${session.name}</div>
                <div class="user-role" data-i18n="role_${session.role}">${I18N.t('role_'+session.role)}</div>
              </div>
            </div>
          </div>
          <a href="#" id="logoutBtn" class="logout-link" data-i18n="logout">${I18N.t('logout')}</a>
        </div>
      </aside>`;
  },

  buildMobileHeader(session){
    return `
      <header class="mobile-header">
        <a href="dashboard.html" class="flex items-center gap-2">
          <div class="brand-mark">SS</div>
          <span style="font-weight:700;font-size:14.5px;" data-i18n="brand_hi">${I18N.t('brand_hi')}</span>
        </a>
        <div class="flex items-center gap-2">
          <div class="lang-switch">
            <button data-lang="en">EN</button><button data-lang="hi">हिन्दी</button>
          </div>
          <button class="icon-btn" aria-label="Notifications">${ICONS.bell}</button>
          <a href="#" id="logoutBtnMobile" class="icon-btn" aria-label="Logout">${ICONS.close}</a>
        </div>
      </header>`;
  },

  buildBottomNav(active){
    return `
      <nav class="bottom-nav">
        ${BOTTOM_NAV.map(i => `
          <a href="${i.href}" class="bottom-nav-item ${i.key===active?'active':''}">
            ${ICONS[i.icon]}<span data-i18n="${i.label}">${I18N.t(i.label)}</span>
          </a>`).join('')}
      </nav>`;
  },

  statusPillHTML(state){
    const online = state !== 'offline' && navigator.onLine;
    return `<span class="status-pill ${online?'online':'offline'}">
      <span class="status-dot"></span>
      <span data-i18n="${online?'online':'offline'}">${I18N.t(online?'online':'offline')}</span>
    </span>`;
  },

  /** Injects sidebar + mobile header + bottom nav into #appShellRoot, wraps existing #pageContent. */
  mountShell(activeKey, requiredRoles){
    const session = requiredRoles ? AUTH.requireRole(requiredRoles) : AUTH.requireAuth();
    if(!session) return null;

    const root = document.getElementById('appShellRoot');
    const content = document.getElementById('pageContent');
    if(!root || !content) return session;

    root.insertAdjacentHTML('afterbegin', this.buildSidebar(activeKey, session));
    root.insertAdjacentHTML('beforeend', this.buildMobileHeader(session));
    root.insertAdjacentHTML('beforeend', this.buildBottomNav(activeKey));
    root.insertAdjacentHTML('beforeend', '<div class="toast-stack" id="toastStack"></div>');

    document.getElementById('logoutBtn')?.addEventListener('click', e=>{ e.preventDefault(); AUTH.logout(); });
    document.getElementById('logoutBtnMobile')?.addEventListener('click', e=>{ e.preventDefault(); AUTH.logout(); });

    this.wireStatus();
    I18N.apply();
    document.addEventListener('langchange', ()=> I18N.apply());
    return session;
  },

  wireStatus(){
    const renderPill = (pending)=>{
      const wrap = document.getElementById('sidebarStatusPill');
      if(!wrap) return;
      let html = this.statusPillHTML();
      if(pending > 0){
        html += `<div class="sync-pill" style="margin-top:6px;">${ICONS.followups.replace('width="24" height="24"','width="13" height="13"')} ${I18N.t('pending_sync_count',{n:pending})}</div>`;
      }
      wrap.innerHTML = html;
      I18N.apply(wrap);
    };
    OfflineSync.pendingCount().then(renderPill);
    OfflineSync.onChange(({pending})=> renderPill(pending));
  },

  toast(message, type='default'){
    const stack = document.getElementById('toastStack');
    if(!stack){ console.log('[toast]', message); return; }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity 200ms'; setTimeout(()=>el.remove(),200); }, 3200);
  },

  formatDate(iso, locale){
    if(!iso) return '—';
    try{
      const d = new Date(iso);
      return d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', { day:'2-digit', month:'short', year:'numeric' });
    }catch(e){ return iso; }
  },

  gestationalAgeWeeks(lmpIso){
    if(!lmpIso) return null;
    const lmp = new Date(lmpIso);
    const days = Math.floor((Date.now() - lmp.getTime()) / (1000*60*60*24));
    if(days < 0) return null;
    return { weeks: Math.floor(days/7), days: days % 7 };
  },

  edd(lmpIso){
    if(!lmpIso) return null;
    const lmp = new Date(lmpIso);
    lmp.setDate(lmp.getDate() + 280);
    return lmp.toISOString().slice(0,10);
  },

  trimester(weeks){
    if(weeks === null || weeks === undefined) return '—';
    if(weeks < 13) return 1;
    if(weeks < 27) return 2;
    return 3;
  },

  riskBadge(level){
    const cls = { low:'badge-low', moderate:'badge-moderate', high:'badge-high' }[level] || 'badge-neutral';
    return `<span class="badge ${cls}">${ICONS.check.replace('width="24" height="24"','width="12" height="12"')}${RiskEngine.levelLabel(level)}</span>`;
  },
};

/* ============================================================
   DEMO DATA — used only when Supabase is not configured, so
   reviewers/judges can evaluate the full UI without setup.
   Clearly labelled in the UI wherever shown.
   ============================================================ */
window.DEMO_DATA = {
  users: [
    { id:'u-admin', name:'Rekha Sharma', mobile:'9811100001', role:'admin', district:'Jaipur', block:'—', village:'—', is_active:true, status:'approved', password_hash:'' },
    { id:'u-asha', name:'Sunita Devi', mobile:'9811100002', role:'asha', district:'Jaipur', block:'Sanganer', village:'Bagru', is_active:true, status:'approved', password_hash:'' },
    { id:'u-anm', name:'Kavita Yadav', mobile:'9811100003', role:'anm', district:'Jaipur', block:'Sanganer', village:'—', is_active:true, status:'approved', password_hash:'' },
    { id:'u-mo', name:'Dr. Aman Verma', mobile:'9811100004', role:'medical_officer', district:'Jaipur', block:'Sanganer', village:'—', is_active:true, status:'approved', password_hash:'' },
    { id:'u-bo', name:'Ramesh Chandra', mobile:'9811100005', role:'block_officer', district:'Jaipur', block:'Sanganer', village:'—', is_active:true, status:'approved', password_hash:'' },
    { id:'u-do', name:'Anjali Mehta', mobile:'9811100006', role:'district_officer', district:'Jaipur', block:'—', village:'—', is_active:true, status:'approved', password_hash:'' },
    { id:'u-pending', name:'Meena Kumari', mobile:'9811100007', role:'asha', district:'Jaipur', block:'Chaksu', village:'Dudu', is_active:false, status:'pending', password_hash:'' },
  ],
  cases: [
    { id:'CASE-1042', name:'Geeta Kumari', age:24, week:28, risk:'high', referral:'referred', followup:'2026-09-10', district:'Jaipur', block:'Sanganer', mobile:'9822200011' },
    { id:'CASE-1041', name:'Pooja Sharma', age:29, week:14, risk:'low', referral:'—', followup:'2026-09-15', district:'Jaipur', block:'Sanganer', mobile:'9822200012' },
    { id:'CASE-1040', name:'Radha Bai', age:32, week:36, risk:'moderate', referral:'pending', followup:'2026-09-09', district:'Jaipur', block:'Chaksu', mobile:'9822200013' },
    { id:'CASE-1039', name:'Sushila Devi', age:20, week:8, risk:'low', referral:'—', followup:'2026-09-20', district:'Jaipur', block:'Sanganer', mobile:'9822200014' },
    { id:'CASE-1038', name:'Kiran Meena', age:35, week:31, risk:'high', referral:'completed', followup:'2026-09-05', district:'Jaipur', block:'Chaksu', mobile:'9822200015' },
    { id:'CASE-1037', name:'Anita Rathore', age:26, week:22, risk:'moderate', referral:'—', followup:'2026-09-11', district:'Jaipur', block:'Sanganer', mobile:'9822200016' },
  ],
  facilities: [
    { id:'F-1', name:'Sanganer PHC', type:'PHC', district:'Jaipur', block:'Sanganer', obstetric:true, emergency:false, contact:'0141-2345001' },
    { id:'F-2', name:'Chaksu CHC', type:'CHC', district:'Jaipur', block:'Chaksu', obstetric:true, emergency:true, contact:'0141-2345002' },
    { id:'F-3', name:'Jaipur District Hospital', type:'District Hospital', district:'Jaipur', block:'—', obstetric:true, emergency:true, contact:'0141-2345003' },
  ],
  riskRules: [
    { id:'R-1', name:'Severe hypertension', indicator:'Systolic/Diastolic BP', condition:'≥160 / ≥110', severity:'high', enabled:true, version:'v1.0.0' },
    { id:'R-2', name:'Severe anaemia', indicator:'Haemoglobin', condition:'< 7 g/dL', severity:'high', enabled:true, version:'v1.0.0' },
    { id:'R-3', name:'Elevated BP', indicator:'Systolic/Diastolic BP', condition:'≥140 / ≥90', severity:'moderate', enabled:true, version:'v1.0.0' },
    { id:'R-4', name:'Reduced fetal movement', indicator:'Warning sign', condition:'Reported by beneficiary', severity:'urgent', enabled:true, version:'v1.0.0' },
  ],
  auditLogs: [
    { user:'Rekha Sharma', action:'Approved user', entity:'users', entityId:'u-pending', date:'2026-09-08', time:'10:12' },
    { user:'Sunita Devi', action:'Created pregnancy', entity:'pregnancies', entityId:'CASE-1042', date:'2026-09-08', time:'09:40' },
    { user:'Dr. Aman Verma', action:'Updated risk rule', entity:'risk_rules', entityId:'R-1', date:'2026-09-07', time:'16:02' },
  ]
};
