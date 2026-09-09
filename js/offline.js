/* ============================================================
   SwasthyaSaathi — Offline Field Support
   ------------------------------------------------------------
   This app is ONLINE-FIRST. All reads/dashboards pull live data
   from Supabase. Only three field-entry workflows can queue
   locally when connectivity is lost:
     - new pregnancy registration
     - health assessment
     - follow-up entry
   Records are stored in IndexedDB with a client-generated
   operation ID (for duplicate prevention), then flushed to
   Supabase automatically once the browser regains connectivity.
   ============================================================ */

const OfflineSync = {
  DB_NAME: 'swasthyasaathi_offline',
  STORE: 'queue',
  db: null,
  listeners: [],

  async open(){
    if(this.db) return this.db;
    this.db = await new Promise((resolve, reject)=>{
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = (e)=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains(OfflineSync.STORE)){
          const store = db.createObjectStore(OfflineSync.STORE, { keyPath:'op_id' });
          store.createIndex('status', 'status');
        }
      };
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
    return this.db;
  },

  genOpId(){
    return 'op_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  },

  /**
   * Queues a record for one of the supported field workflows.
   * @param {'pregnancy'|'health_assessment'|'followup'} type
   */
  async enqueue(type, payload){
    const db = await this.open();
    const record = {
      op_id: this.genOpId(),
      type, payload,
      status: 'pending',
      created_at: new Date().toISOString(),
      attempts: 0
    };
    await new Promise((resolve, reject)=>{
      const tx = db.transaction(OfflineSync.STORE, 'readwrite');
      tx.objectStore(OfflineSync.STORE).add(record);
      tx.oncomplete = resolve;
      tx.onerror = ()=> reject(tx.error);
    });
    this.notify();
    if(navigator.onLine) this.syncAll();
    return record.op_id;
  },

  async getAll(){
    const db = await this.open();
    return new Promise((resolve, reject)=>{
      const tx = db.transaction(OfflineSync.STORE, 'readonly');
      const req = tx.objectStore(OfflineSync.STORE).getAll();
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  },

  async pendingCount(){
    const all = await this.getAll();
    return all.filter(r => r.status === 'pending' || r.status === 'error').length;
  },

  async updateStatus(op_id, status){
    const db = await this.open();
    return new Promise((resolve, reject)=>{
      const tx = db.transaction(OfflineSync.STORE, 'readwrite');
      const store = tx.objectStore(OfflineSync.STORE);
      const req = store.get(op_id);
      req.onsuccess = ()=>{
        const rec = req.result;
        if(rec){ rec.status = status; rec.attempts = (rec.attempts||0)+1; store.put(rec); }
      };
      tx.oncomplete = resolve;
      tx.onerror = ()=> reject(tx.error);
    });
  },

  async remove(op_id){
    const db = await this.open();
    return new Promise((resolve, reject)=>{
      const tx = db.transaction(OfflineSync.STORE, 'readwrite');
      tx.objectStore(OfflineSync.STORE).delete(op_id);
      tx.oncomplete = resolve;
      tx.onerror = ()=> reject(tx.error);
    });
  },

  TABLE_MAP: {
    pregnancy: 'pregnancies',
    health_assessment: 'health_assessments',
    followup: 'followups'
  },

  async syncOne(record){
    const client = await getSupabaseClient();
    if(!client) return false; // no backend configured — stays queued for DEMO purposes
    const table = this.TABLE_MAP[record.type];
    if(!table) return false;

    // Duplicate prevention: client_op_id must be unique per row.
    const { error } = await safeQuery(
      client.from(table).upsert({ ...record.payload, client_op_id: record.op_id }, { onConflict:'client_op_id' })
    );
    return !error;
  },

  syncing:false,

  async syncAll(){
    if(this.syncing || !navigator.onLine) return;
    this.syncing = true;
    this.notify('syncing');
    const all = await this.getAll();
    const pending = all.filter(r => r.status !== 'synced');
    for(const rec of pending){
      try{
        const ok = await this.syncOne(rec);
        if(ok){ await this.updateStatus(rec.op_id, 'synced'); await this.remove(rec.op_id); }
        else{ await this.updateStatus(rec.op_id, 'error'); }
      }catch(e){
        await this.updateStatus(rec.op_id, 'error');
      }
    }
    this.syncing = false;
    this.notify('synced');
  },

  onChange(cb){ this.listeners.push(cb); },
  async notify(state){
    const count = await this.pendingCount();
    this.listeners.forEach(cb => cb({ state: state || (navigator.onLine ? 'online' : 'offline'), pending: count }));
  },

  init(){
    window.addEventListener('online', ()=>{ this.notify('online'); this.syncAll(); });
    window.addEventListener('offline', ()=> this.notify('offline'));
    // Attempt a sync shortly after load, in case items were queued last session.
    setTimeout(()=>{ if(navigator.onLine) this.syncAll(); }, 1500);
  }
};

OfflineSync.init();
