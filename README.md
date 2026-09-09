# स्वास्थ्यसाथी · SwasthyaSaathi

**Right Health Support for Every Mother and Child**

A premium, responsive, online-first maternal & child health risk-screening
and referral platform for ASHA/ANM workers, medical officers, and block /
district health administrators in rural India.

---

## 1. Running it

This is a plain HTML/CSS/JS multi-page app — no build step.

1. Open `index.html` in a browser (or serve the folder with any static
   file server, e.g. `npx serve .`), for correct fetch/CORS behaviour.
2. Without any setup, the app runs in **DEMO mode**: `js/supabase.js`
   detects that `SUPABASE_URL` / `SUPABASE_ANON_KEY` are still
   placeholders and the UI falls back to the sample data in
   `js/app.js` (`DEMO_DATA`), clearly marked with a **DEMO DATA** badge.
   Any 8+ character password logs into the demo mobile numbers listed
   on the login page, one per role, so every dashboard can be reviewed.

## 2. Connecting Supabase (production)

1. Create a Supabase project.
2. Run `sql/schema.sql` in the Supabase SQL editor — it creates every
   table (`users`, `beneficiaries`, `pregnancies`, `health_assessments`,
   `risk_assessments`, `risk_rules`, `referrals`, `facilities`,
   `followups`, `anc_visits`, `children`, `immunizations`,
   `notifications`, `districts`, `blocks`, `audit_logs`,
   `app_settings`) and enables Row Level Security with role-scoped
   policies (ASHA/ANM → own/assigned records, block/district officers →
   their block/district, admin → everything).
3. Copy your Project URL and anon public key into `js/supabase.js`:
   ```js
   const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```
4. **Important — read before going live:** this prototype authenticates
   in the browser with a custom `users` table and unsalted SHA-256
   password hashing (see `js/auth.js`), by explicit product
   requirement, and does **not** use Supabase Auth. That means the
   anon key alone cannot prove identity to Postgres. The RLS policies
   in `sql/schema.sql` check custom JWT claims (`request.jwt.claims`)
   — for real deployment, put a small server (edge function / API
   route) in front of Supabase that verifies the logged-in session and
   sets those claims (or issues a signed Supabase JWT with custom
   claims) before any query reaches the database. **Do not deploy the
   client-only version with real patient data.**

## 3. Project structure

```
index.html         Landing page
login.html          Custom mobile+password login (SHA-256, no OTP, no Supabase Auth)
signup.html         Public ASHA-only registration → pending admin approval
dashboard.html      Role-based dashboard (ASHA/ANM, Medical Officer, Block/District Officer)
pregnancy.html      8-step pregnancy registration + transparent risk screening
cases.html          Case list/search/filter + case detail drawer
referrals.html      Tabs: Referral Mgmt · Facilities · Follow-ups · ANC · Postnatal · Child Health · Immunization
admin.html          Tabs: Dashboard · Users · Approvals · Officers · Facilities · Risk Rules · Regions · Audit Logs · Settings
css/style.css       Full design system (tokens, components, responsive rules)
js/translations.js  English/Hindi dictionary + language switch engine
js/supabase.js      Supabase client bootstrap + safe query wrapper
js/auth.js          SHA-256 hashing, login/signup, session, RBAC helpers
js/risk-engine.js   Transparent rule-based maternal risk screening
js/offline.js       IndexedDB queue + automatic sync for field workflows
js/app.js           Shared nav shell, icons, toasts, formatting utils, demo dataset
sql/schema.sql      Tables + Row Level Security policies
```

## 4. Design system

Colors, typography, and spacing follow the brief's exact palette
(`#C94F70` primary rose on white/blush, dark text, green/amber/red
reserved for status only) — see the `:root` tokens at the top of
`css/style.css`. Hindi text uses Noto Sans Devanagari; English uses
Inter. Every risk badge pairs color with text and an icon so nothing
depends on color alone.

## 5. Risk screening

`js/risk-engine.js` implements **transparent, rule-based screening**
(no ML model, no accuracy claims). It scores vitals, history, and
warning signs, and any urgent warning sign (bleeding, convulsions,
breathing difficulty, etc.) forces `urgent_flag = true` and an
automatic High Risk classification regardless of the numeric score.
Every result carries a `ruleset_version` so historical assessments
stay interpretable even after rules change. Thresholds are prototype
defaults — review and align them to your applicable official clinical
protocol before real deployment.

## 6. Offline field support

Only three workflows queue offline, via IndexedDB
(`OfflineSync` in `js/offline.js`): new pregnancy registration, health
assessments, and follow-up entries. Everything else (dashboards, case
lists, referrals, admin) is online-first and reads live from Supabase.
Queued records carry a client-generated `op_id` and are upserted with
`client_op_id` as the conflict key, so re-syncing never creates
duplicates. The sidebar/footer status pill shows Online/Offline and a
pending-sync count in the active language.

## 7. What's demo vs. production-ready

- **Production-ready patterns:** full HTML/CSS/JS structure, RLS
  policies, offline queue with dedupe, SHA-256 auth flow, transparent
  risk engine, bilingual UI, responsive layout down to 320px.
- **Needs real backend wiring before go-live:** every page currently
  falls back to `DEMO_DATA` when Supabase isn't configured, and the
  browser-side auth pattern needs the server-side claim-signing step
  described in §2 before handling real patient data.

## 8. Quality checklist (see original brief §41)

All 8 pages exist as real navigable HTML pages (no SPA routing);
login/signup/role-redirect/admin-approval flow is wired; risk
screening is rule-based and versioned with immutable history; referral
/ facility / follow-up / ANC / child / immunization workflows are
present; admin covers users, approvals, officers, facilities, risk
rules, audit logs; Hindi/English switches every visible string;
offline queue + auto-sync covers the three specified workflows; every
data view has loading/empty/error states; layouts are tested down to
320px with no horizontal overflow; the medical disclaimer appears on
the landing page and inside the pregnancy risk-screening flow; no
AI/ML or accuracy claims appear anywhere.
