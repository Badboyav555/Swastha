/* ============================================================
   SwasthyaSaathi — Supabase Client Configuration
   ============================================================
   Replace the two placeholders below with your project's
   values (Project Settings → API in the Supabase dashboard).
   This app deliberately does NOT use Supabase Auth — a custom
   users table + SHA-256 password hashing is used instead
   (see js/auth.js). Access control is enforced via Row Level
   Security (RLS) policies on every table (see /sql/schema.sql
   if provided, or the setup notes in README.md).
   ============================================================ */

const SUPABASE_URL = "YOUR_SUPABASE_URL";        // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const SUPABASE_CONFIGURED =
  SUPABASE_URL && !SUPABASE_URL.includes("YOUR_SUPABASE_URL") &&
  SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY");

let supabaseClient = null;

/**
 * Lazily loads the Supabase JS SDK from CDN and creates the client.
 * Falls back gracefully (returns null) if not configured, so the
 * UI can run in DEMO mode with local sample data for evaluation.
 */
async function getSupabaseClient(){
  if(supabaseClient) return supabaseClient;
  if(!SUPABASE_CONFIGURED) return null;

  if(!window.supabase){
    await new Promise((resolve, reject)=>{
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }).catch(()=>{ console.error("Could not load Supabase SDK"); });
  }

  if(window.supabase){
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession:false, autoRefreshToken:false } // custom auth, not Supabase Auth
    });
  }
  return supabaseClient;
}

/**
 * Generic safe query wrapper — never leaks raw Postgres/PostgREST
 * errors to the UI (see SKILL requirement #39 Error Handling).
 */
async function safeQuery(promise){
  try{
    const { data, error } = await promise;
    if(error){
      console.error("[Supabase error]", error.message);
      return { data:null, error: I18N.t('something_wrong') };
    }
    return { data, error:null };
  }catch(err){
    console.error("[Supabase exception]", err);
    return { data:null, error: I18N.t('something_wrong') };
  }
}
