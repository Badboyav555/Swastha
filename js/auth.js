/* ============================================================
   SwasthyaSaathi — Custom Authentication
   ------------------------------------------------------------
   IMPORTANT (per product requirement): this app intentionally
   does NOT use Supabase Auth. Passwords are hashed client-side
   with SHA-256 (no salt, as specified) via the Web Crypto API
   and compared against users.password_hash.

   PROTOTYPE NOTICE: unsalted SHA-256 client-side password
   checking is a prototype/custom-auth pattern only. For a real
   production healthcare deployment, replace this with a
   server-side authentication service (e.g. a Postgres function
   behind RLS, or a dedicated auth microservice) rather than
   verifying passwords in the browser.
   ============================================================ */

const AUTH = {
  SESSION_KEY: 'ss_session',

  async hashPassword(plain){
    const enc = new TextEncoder().encode(plain);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  },

  validateMobile(mobile){
    return /^[6-9]\d{9}$/.test(String(mobile).trim());
  },

  validatePassword(pw){
    return typeof pw === 'string' && pw.length >= 8;
  },

  getSession(){
    try{
      const raw = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  },

  setSession(user, remember){
    // Store only the minimum required, non-sensitive fields.
    const safe = {
      id:user.id, name:user.name, mobile:user.mobile, role:user.role,
      district:user.district, block:user.block, village:user.village || user.assigned_area || ''
    };
    const store = remember ? localStorage : sessionStorage;
    store.setItem(this.SESSION_KEY, JSON.stringify(safe));
  },

  clearSession(){
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  },

  logout(){
    this.clearSession();
    window.location.href = 'login.html';
  },

  roleHome(role){
    return role === 'admin' ? 'admin.html' : 'dashboard.html';
  },

  /** Redirects unauthenticated users away from protected pages. */
  requireAuth(){
    const session = this.getSession();
    if(!session){
      window.location.href = 'login.html';
      return null;
    }
    return session;
  },

  /** Redirects non-admins away from admin.html. */
  requireRole(roles){
    const session = this.requireAuth();
    if(!session) return null;
    if(!roles.includes(session.role)){
      window.location.href = this.roleHome(session.role);
      return null;
    }
    return session;
  },

  async login(mobile, password){
    if(!this.validateMobile(mobile)) return { ok:false, error: I18N.t('something_wrong') };

    const hash = await this.hashPassword(password);
    const client = await getSupabaseClient();

    if(client){
      const { data, error } = await safeQuery(
        client.from('users').select('*').eq('mobile', mobile).eq('is_active', true).maybeSingle()
      );
      if(error) return { ok:false, error };
      if(!data || data.password_hash !== hash){
        return { ok:false, error: I18N.current === 'hi' ? 'गलत मोबाइल नंबर या पासवर्ड' : 'Incorrect mobile number or password' };
      }
      if(data.status === 'pending'){
        return { ok:false, error: I18N.current === 'hi' ? 'आपका खाता समीक्षा हेतु लंबित है' : 'Your account is pending admin approval' };
      }
      await safeQuery(client.from('users').update({ last_login: new Date().toISOString() }).eq('id', data.id));
      return { ok:true, user:data };
    }

    // DEMO fallback (no Supabase configured) — uses DEMO_DATA.users
    const demoUser = (window.DEMO_DATA?.users || []).find(u => u.mobile === mobile);
    if(!demoUser || demoUser.password_hash !== hash){
      return { ok:false, error: I18N.current === 'hi' ? 'गलत मोबाइल नंबर या पासवर्ड (डेमो)' : 'Incorrect mobile number or password (demo)' };
    }
    if(demoUser.status === 'pending'){
      return { ok:false, error: I18N.current === 'hi' ? 'आपका खाता समीक्षा हेतु लंबित है' : 'Your account is pending admin approval' };
    }
    return { ok:true, user:demoUser };
  },

  async signup(fields){
    const { name, mobile, password, confirmPassword, district, block, village } = fields;
    if(!name || name.trim().length < 2) return { ok:false, error:'name' };
    if(!this.validateMobile(mobile)) return { ok:false, error:'mobile' };
    if(!this.validatePassword(password)) return { ok:false, error:'password' };
    if(password !== confirmPassword) return { ok:false, error:'confirm' };
    if(!district || !block || !village) return { ok:false, error:'location' };

    const password_hash = await this.hashPassword(password);
    const client = await getSupabaseClient();

    const record = {
      name: name.trim(), mobile: mobile.trim(), password_hash,
      role: 'asha',            // Public signup is ASHA-only, hardcoded server/DB-side too via RLS default
      district, block, village,
      is_active: false,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if(client){
      const { data: existing } = await safeQuery(client.from('users').select('id').eq('mobile', mobile).maybeSingle());
      if(existing) return { ok:false, error:'duplicate' };
      const { error } = await safeQuery(client.from('users').insert(record));
      if(error) return { ok:false, error:'server' };
      return { ok:true };
    }

    // DEMO fallback
    window.DEMO_DATA = window.DEMO_DATA || {};
    window.DEMO_DATA.users = window.DEMO_DATA.users || [];
    if(window.DEMO_DATA.users.some(u=>u.mobile === mobile)) return { ok:false, error:'duplicate' };
    window.DEMO_DATA.users.push({ id:'demo-'+Date.now(), ...record });
    return { ok:true };
  }
};
