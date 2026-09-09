/* ============================================================
   SwasthyaSaathi — Translation Engine (English <-> Hindi)
   Usage: add data-i18n="key" to any element's text, or
          data-i18n-ph="key" for placeholder attributes.
   ============================================================ */

const TRANSLATIONS = {
  en: {
    // Brand
    brand_hi:"स्वास्थ्यसाथी", brand_en:"SwasthyaSaathi",
    tagline:"Right Health Support for Every Mother and Child",

    // Nav
    nav_dashboard:"Dashboard", nav_cases:"Cases", nav_new_pregnancy:"New Pregnancy",
    nav_referrals:"Referrals", nav_followups:"Follow-ups", nav_child_health:"Child Health",
    nav_reports:"Reports", nav_profile:"Profile", nav_admin:"Admin", nav_home:"Home",

    // Status
    online:"Online", offline:"Offline", pending_sync_count:"{n} records waiting to sync",
    syncing:"Syncing...", synced:"All data synchronized", logout:"Logout",

    // Landing
    hero_desc:"A digital decision-support platform designed to help rural health workers record maternal and child health information, identify cases requiring attention, and coordinate referrals and follow-up.",
    btn_login:"Login", btn_asha_signup:"ASHA Registration",
    feat1_title:"Early Risk Screening", feat1_desc:"Transparent, rule-based screening flags maternal risk early using recorded vitals and history.",
    feat2_title:"Faster Referral", feat2_desc:"Structured referral workflow connects ASHA workers directly to the right facility.",
    feat3_title:"Follow-up Tracking", feat3_desc:"Never miss a due visit — due, overdue and completed follow-ups tracked automatically.",
    feat4_title:"Offline Field Support", feat4_desc:"Continue key field workflows without signal; data syncs automatically once online.",
    feat5_title:"District Monitoring", feat5_desc:"Block and district officers get a live view of risk distribution and referral performance.",
    workflow_title:"How it works",
    wf_register:"Register", wf_assess:"Assess", wf_risk:"Risk Screen", wf_refer:"Refer",
    wf_followup:"Follow Up", wf_monitor:"Monitor",
    disclaimer_full:"This platform provides health screening and decision support. It does not replace qualified medical diagnosis or professional clinical judgment.",
    footer_about:"About", footer_features:"Features", footer_privacy:"Privacy",
    footer_disclaimer:"Disclaimer", footer_contact:"Contact",

    // Auth
    login_title:"Welcome back", login_sub:"Login to continue your fieldwork",
    mobile_number:"Mobile Number", password:"Password",
    forgot_password:"Need help accessing your account? Contact your block coordinator for account assistance.",
    no_account:"New ASHA worker?", signup_link:"Register here",
    signup_title:"ASHA Registration", signup_sub:"Public registration is for ASHA workers only",
    full_name:"Full Name", confirm_password:"Confirm Password",
    district:"District", block:"Block", village:"Village / Area",
    signup_pending_note:"Your registration will be reviewed by an authorized administrator.",
    have_account:"Already have an account?", back_to_login:"Back to login",
    create_account:"Create Account",

    // Dashboard
    good_morning:"Good Morning", kpi_registered:"Registered Pregnancies", kpi_high_risk:"High Risk",
    kpi_pending_referrals:"Pending Referrals", kpi_followups_due:"Follow-ups Due",
    quick_actions:"Quick Actions", action_new_pregnancy:"New Pregnancy", action_today_visits:"Today's Visits",
    action_high_risk:"High-Risk Cases", action_referrals:"Referrals", action_followups:"Follow-ups",
    recent_cases:"Recent Cases", todays_followups:"Today's Follow-ups", priority_alerts:"Priority Alerts",
    view_all:"View all",
    kpi_pending_reviews:"Pending Reviews", kpi_moderate_risk:"Moderate Risk", kpi_low_risk:"Low Risk",
    kpi_overdue_followups:"Overdue Follow-ups", kpi_total_pregnancies:"Total Pregnancies",
    kpi_total_users:"Total Users", risk_distribution:"Risk Distribution",
    block_referral_overview:"Block-wise Referral Overview", block_comparison:"Block Comparison",
    referral_status_chart:"Referral Status", followup_performance:"Follow-up Performance",

    // Risk
    risk_low:"Low Risk", risk_moderate:"Moderate Risk", risk_high:"High Risk",
    risk_low_short:"Low", risk_moderate_short:"Moderate", risk_high_short:"High",

    // Pregnancy form
    pregnancy_title:"New Pregnancy Registration",
    step_mother:"Mother", step_pregnancy:"Pregnancy", step_vitals:"Vitals",
    step_history:"History", step_warning:"Warning Signs", step_risk:"Risk", step_save:"Save",
    name:"Name", age:"Age", area:"Area", beneficiary_id:"Beneficiary ID",
    lmp:"Last Menstrual Period (LMP)", gestational_age:"Gestational Age", edd:"Expected Delivery Date (EDD)",
    gravida:"Gravida", para:"Para", prev_csection:"Previous C-section", prev_complications:"Previous complications",
    trimester:"Trimester", calculated:"Calculated automatically",
    systolic_bp:"Systolic BP", diastolic_bp:"Diastolic BP", pulse:"Pulse",
    temperature:"Temperature", weight:"Weight", haemoglobin:"Haemoglobin", blood_glucose:"Blood Glucose",
    fetal_movement:"Fetal movement", fundal_height:"Fundal height", fetal_heart_rate:"Fetal heart rate",
    medical_history:"Medical History", warning_signs:"Warning Signs",
    h_hypertension:"Hypertension", h_diabetes:"Diabetes", h_anaemia:"Anaemia",
    h_prev_csection:"Previous C-section", h_prev_complications:"Previous complications",
    h_stillbirth:"Stillbirth", h_miscarriage:"Miscarriage", h_pph:"Postpartum haemorrhage",
    h_multiple:"Multiple pregnancy", h_other:"Other", h_none:"None",
    w_bleeding:"Vaginal bleeding", w_headache:"Severe headache", w_vision:"Vision problems",
    w_abdominal:"Severe abdominal pain", w_fever:"Fever", w_breathing:"Difficulty breathing",
    w_convulsions:"Convulsions", w_reduced_movement:"Reduced fetal movement", w_other:"Other",
    contributing_indicators:"Contributing indicators", assessment_date:"Assessment Date",
    ruleset_version:"Ruleset Version", recommended_action:"Recommended next action",
    recommended_action_text:"Medical review / referral according to configured protocol.",
    urgent_flag_note:"Urgent warning sign detected — this case requires immediate review regardless of the numerical score.",
    risk_engine_note:"Current prototype uses transparent, rule-based screening. This is decision support only, not a diagnosis.",
    back:"Back", next:"Continue", save_assessment:"Save Assessment", save_draft:"Save as Draft",
    saving:"Saving...", saved_successfully:"Saved successfully", something_wrong:"Something went wrong. Please try again.",
    no_records_found:"No records found",

    // Cases
    cases_title:"Cases", search_placeholder:"Search by name, ID or mobile",
    filter_risk:"Risk", filter_district:"District", filter_block:"Block", filter_date:"Date",
    col_case_id:"Case ID", col_beneficiary:"Beneficiary", col_week:"Pregnancy Week",
    col_risk:"Risk", col_latest_assessment:"Latest Assessment", col_referral:"Referral",
    col_followup:"Follow-up", col_action:"Action", view_details:"View details",
    case_details:"Case Details", assessment_history:"Assessment History", risk_history:"Risk History",
    anc_visits:"ANC Visits", medical_review:"Medical Review",

    // Referrals page tabs
    tab_referral_mgmt:"Referral Management", tab_facilities:"Facilities", tab_followups:"Follow-ups",
    tab_anc:"ANC", tab_postnatal:"Postnatal", tab_child_health:"Child Health", tab_immunization:"Immunization",
    referral_reason:"Reason", referral_priority:"Priority", referral_destination:"Destination Facility",
    referral_status:"Status", new_referral:"New Referral",
    status_pending:"Pending", status_referred:"Referred", status_received:"Received",
    status_under_review:"Under Review", status_followup_required:"Follow-up Required",
    status_completed:"Completed", status_cancelled:"Cancelled",
    rt_assessment:"Assessment", rt_generated:"Referral Generated", rt_referred:"Referred",
    rt_facility_received:"Facility Received", rt_medical_review:"Medical Review",
    rt_followup:"Follow-up", rt_completed:"Completed",
    facility_name:"Facility Name", facility_type:"Type", services:"Services",
    obstetric_capability:"Obstetric Capability", emergency_capability:"Emergency Capability", contact:"Contact",
    followup_today:"Today", followup_upcoming:"Upcoming", followup_overdue:"Overdue", followup_completed:"Completed",
    followup_reason:"Reason", assigned_worker:"Assigned Worker", followup_notes:"Notes",
    fs_due:"Due", fs_completed:"Completed", fs_missed:"Missed", fs_rescheduled:"Rescheduled",
    add_anc_visit:"Add ANC Visit", visit_date:"Visit Date",
    delivery_status:"Delivery status", postnatal_visits:"Postnatal visits",
    child_id:"Child ID", dob:"Date of Birth", birth_weight:"Birth Weight", sex:"Sex", delivery_facility:"Delivery Facility",
    newborn_followup:"Newborn follow-up", growth:"Growth", nutrition:"Nutrition", development:"Development",
    immunization_schedule:"Immunization Schedule", imm_completed:"Completed", imm_upcoming:"Upcoming",
    imm_due:"Due", imm_missed:"Missed",

    // Admin
    admin_title:"Admin", admin_dashboard:"Dashboard", admin_users:"Users",
    admin_pending_approvals:"Pending Approvals", admin_officers:"Officers", admin_facilities:"Facilities",
    admin_risk_rules:"Risk Rules", admin_districts_blocks:"Districts & Blocks",
    admin_audit_logs:"Audit Logs", admin_settings:"Settings",
    col_mobile:"Mobile", col_role:"Role", col_district:"District", col_block:"Block",
    col_status:"Status", col_created:"Created", act_view:"View", act_edit:"Edit",
    act_activate:"Activate", act_deactivate:"Deactivate", act_change_role:"Change Role",
    act_approve:"Approve", act_reject:"Reject",
    add_officer:"Add Officer", assigned_area:"Assigned Area",
    rule_name:"Rule Name", description:"Description", indicator:"Indicator", condition:"Condition",
    severity:"Severity", enabled:"Enabled", add_rule:"Add Rule",
    col_user:"User", col_action_log:"Action", col_entity:"Entity", col_entity_id:"Entity ID",
    col_date:"Date", col_time:"Time",

    // General
    role_asha:"ASHA", role_anm:"ANM", role_medical_officer:"Medical Officer",
    role_block_officer:"Block Officer", role_district_officer:"District Officer", role_admin:"Admin",
    demo_data:"DEMO DATA", demo_data_note:"Data shown for demonstration only",
    cancel:"Cancel", close:"Close", loading:"Loading...", none:"None", yes:"Yes", no:"No",
    week_short:"wk", years_short:"yrs",
  },

  hi: {
    brand_hi:"स्वास्थ्यसाथी", brand_en:"SwasthyaSaathi",
    tagline:"हर माँ और बच्चे तक सही स्वास्थ्य सहायता",

    nav_dashboard:"डैशबोर्ड", nav_cases:"केस", nav_new_pregnancy:"नई गर्भावस्था",
    nav_referrals:"रेफरल", nav_followups:"फॉलो-अप", nav_child_health:"बाल स्वास्थ्य",
    nav_reports:"रिपोर्ट", nav_profile:"प्रोफ़ाइल", nav_admin:"एडमिन", nav_home:"होम",

    online:"ऑनलाइन", offline:"ऑफलाइन", pending_sync_count:"{n} रिकॉर्ड सिंक होने बाकी हैं",
    syncing:"सिंक हो रहा है...", synced:"सभी डेटा सिंक हो गया है", logout:"लॉगआउट",

    hero_desc:"एक डिजिटल निर्णय-सहायता प्लेटफ़ॉर्म जो ग्रामीण स्वास्थ्यकर्मियों को मातृ एवं बाल स्वास्थ्य जानकारी दर्ज करने, ध्यान देने योग्य मामलों की पहचान करने और रेफरल व फॉलो-अप के समन्वय में मदद करता है।",
    btn_login:"लॉगिन", btn_asha_signup:"आशा पंजीकरण",
    feat1_title:"शीघ्र जोखिम स्क्रीनिंग", feat1_desc:"दर्ज किए गए वाइटल्स और इतिहास के आधार पर पारदर्शी, नियम-आधारित स्क्रीनिंग मातृ जोखिम को जल्दी चिह्नित करती है।",
    feat2_title:"तेज़ रेफरल", feat2_desc:"संरचित रेफरल वर्कफ़्लो आशा कार्यकर्ताओं को सीधे सही सुविधा से जोड़ता है।",
    feat3_title:"फॉलो-अप ट्रैकिंग", feat3_desc:"कोई भी नियत विज़िट न चूकें — बाकी, विलंबित और पूर्ण फॉलो-अप अपने आप ट्रैक होते हैं।",
    feat4_title:"ऑफलाइन फील्ड सहायता", feat4_desc:"बिना नेटवर्क के भी मुख्य फील्ड कार्य जारी रखें; ऑनलाइन होते ही डेटा अपने आप सिंक हो जाता है।",
    feat5_title:"जिला निगरानी", feat5_desc:"ब्लॉक और जिला अधिकारियों को जोखिम वितरण और रेफरल प्रदर्शन का लाइव दृश्य मिलता है।",
    workflow_title:"यह कैसे काम करता है",
    wf_register:"पंजीकरण", wf_assess:"मूल्यांकन", wf_risk:"जोखिम जांच", wf_refer:"रेफर",
    wf_followup:"फॉलो अप", wf_monitor:"निगरानी",
    disclaimer_full:"यह प्लेटफ़ॉर्म स्वास्थ्यकर्मियों के लिए स्क्रीनिंग और निर्णय सहायता प्रदान करता है। यह चिकित्सीय निदान नहीं है और योग्य स्वास्थ्य विशेषज्ञ के पेशेवर निर्णय का विकल्प नहीं है।",
    footer_about:"परिचय", footer_features:"विशेषताएं", footer_privacy:"गोपनीयता",
    footer_disclaimer:"अस्वीकरण", footer_contact:"संपर्क करें",

    login_title:"वापसी पर स्वागत है", login_sub:"अपना फील्ड कार्य जारी रखने के लिए लॉगिन करें",
    mobile_number:"मोबाइल नंबर", password:"पासवर्ड",
    forgot_password:"अपने खाते तक पहुँचने में सहायता चाहिए? कृपया अपने ब्लॉक समन्वयक से संपर्क करें।",
    no_account:"नई आशा कार्यकर्ता?", signup_link:"यहां पंजीकरण करें",
    signup_title:"आशा पंजीकरण", signup_sub:"सार्वजनिक पंजीकरण केवल आशा कार्यकर्ताओं के लिए है",
    full_name:"पूरा नाम", confirm_password:"पासवर्ड की पुष्टि करें",
    district:"जिला", block:"ब्लॉक", village:"गांव / क्षेत्र",
    signup_pending_note:"आपके पंजीकरण की समीक्षा एक अधिकृत प्रशासक द्वारा की जाएगी।",
    have_account:"पहले से खाता है?", back_to_login:"लॉगिन पर वापस जाएं",
    create_account:"खाता बनाएं",

    good_morning:"सुप्रभात", kpi_registered:"पंजीकृत गर्भावस्थाएं", kpi_high_risk:"उच्च जोखिम",
    kpi_pending_referrals:"लंबित रेफरल", kpi_followups_due:"फॉलो-अप बाकी",
    quick_actions:"त्वरित कार्य", action_new_pregnancy:"नई गर्भावस्था", action_today_visits:"आज की विज़िट",
    action_high_risk:"उच्च-जोखिम केस", action_referrals:"रेफरल", action_followups:"फॉलो-अप",
    recent_cases:"हाल के केस", todays_followups:"आज के फॉलो-अप", priority_alerts:"प्राथमिकता अलर्ट",
    view_all:"सभी देखें",
    kpi_pending_reviews:"लंबित समीक्षाएं", kpi_moderate_risk:"मध्यम जोखिम", kpi_low_risk:"कम जोखिम",
    kpi_overdue_followups:"विलंबित फॉलो-अप", kpi_total_pregnancies:"कुल गर्भावस्थाएं",
    kpi_total_users:"कुल उपयोगकर्ता", risk_distribution:"जोखिम वितरण",
    block_referral_overview:"ब्लॉक-वार रेफरल अवलोकन", block_comparison:"ब्लॉक तुलना",
    referral_status_chart:"रेफरल स्थिति", followup_performance:"फॉलो-अप प्रदर्शन",

    risk_low:"कम जोखिम", risk_moderate:"मध्यम जोखिम", risk_high:"उच्च जोखिम",
    risk_low_short:"कम", risk_moderate_short:"मध्यम", risk_high_short:"उच्च",

    pregnancy_title:"नई गर्भावस्था पंजीकरण",
    step_mother:"माता", step_pregnancy:"गर्भावस्था", step_vitals:"वाइटल्स",
    step_history:"इतिहास", step_warning:"चेतावनी संकेत", step_risk:"जोखिम", step_save:"सुरक्षित करें",
    name:"नाम", age:"आयु", area:"क्षेत्र", beneficiary_id:"लाभार्थी आईडी",
    lmp:"अंतिम मासिक धर्म तिथि (LMP)", gestational_age:"गर्भावधि आयु", edd:"प्रसव की संभावित तिथि (EDD)",
    gravida:"ग्रेविडा", para:"पैरा", prev_csection:"पूर्व सिजेरियन", prev_complications:"पूर्व जटिलताएं",
    trimester:"त्रैमास", calculated:"स्वतः गणना की गई",
    systolic_bp:"सिस्टोलिक बीपी", diastolic_bp:"डायस्टोलिक बीपी", pulse:"नाड़ी दर",
    temperature:"तापमान", weight:"वजन", haemoglobin:"हीमोग्लोबिन", blood_glucose:"ब्लड ग्लूकोज़",
    fetal_movement:"भ्रूण गति", fundal_height:"फंडल ऊंचाई", fetal_heart_rate:"भ्रूण हृदय दर",
    medical_history:"चिकित्सा इतिहास", warning_signs:"चेतावनी संकेत",
    h_hypertension:"उच्च रक्तचाप", h_diabetes:"मधुमेह", h_anaemia:"रक्ताल्पता",
    h_prev_csection:"पूर्व सिजेरियन", h_prev_complications:"पूर्व जटिलताएं",
    h_stillbirth:"मृत जन्म", h_miscarriage:"गर्भपात", h_pph:"प्रसवोत्तर रक्तस्राव",
    h_multiple:"बहुगर्भावस्था", h_other:"अन्य", h_none:"कोई नहीं",
    w_bleeding:"योनि से रक्तस्राव", w_headache:"गंभीर सिरदर्द", w_vision:"दृष्टि समस्या",
    w_abdominal:"तेज़ पेट दर्द", w_fever:"बुखार", w_breathing:"सांस लेने में कठिनाई",
    w_convulsions:"ऐंठन/दौरे", w_reduced_movement:"भ्रूण गति में कमी", w_other:"अन्य",
    contributing_indicators:"योगदान करने वाले संकेतक", assessment_date:"मूल्यांकन तिथि",
    ruleset_version:"नियम संस्करण", recommended_action:"अनुशंसित अगला कदम",
    recommended_action_text:"निर्धारित प्रोटोकॉल के अनुसार चिकित्सा समीक्षा / रेफरल।",
    urgent_flag_note:"तत्काल चेतावनी संकेत पाया गया — स्कोर चाहे जो भी हो, इस केस की तुरंत समीक्षा आवश्यक है।",
    risk_engine_note:"वर्तमान प्रोटोटाइप पारदर्शी, नियम-आधारित स्क्रीनिंग का उपयोग करता है। यह केवल निर्णय सहायता है, निदान नहीं।",
    back:"पीछे", next:"जारी रखें", save_assessment:"मूल्यांकन सुरक्षित करें", save_draft:"ड्राफ्ट सुरक्षित करें",
    saving:"सहेजा जा रहा है...", saved_successfully:"सफलतापूर्वक सुरक्षित किया गया",
    something_wrong:"कुछ समस्या हुई। कृपया पुनः प्रयास करें।", no_records_found:"कोई रिकॉर्ड नहीं मिला",

    cases_title:"केस", search_placeholder:"नाम, आईडी या मोबाइल से खोजें",
    filter_risk:"जोखिम", filter_district:"जिला", filter_block:"ब्लॉक", filter_date:"तिथि",
    col_case_id:"केस आईडी", col_beneficiary:"लाभार्थी", col_week:"गर्भावस्था सप्ताह",
    col_risk:"जोखिम", col_latest_assessment:"नवीनतम मूल्यांकन", col_referral:"रेफरल",
    col_followup:"फॉलो-अप", col_action:"कार्रवाई", view_details:"विवरण देखें",
    case_details:"केस विवरण", assessment_history:"मूल्यांकन इतिहास", risk_history:"जोखिम इतिहास",
    anc_visits:"एएनसी विज़िट", medical_review:"चिकित्सा समीक्षा",

    tab_referral_mgmt:"रेफरल प्रबंधन", tab_facilities:"सुविधाएं", tab_followups:"फॉलो-अप",
    tab_anc:"एएनसी", tab_postnatal:"प्रसवोत्तर", tab_child_health:"बाल स्वास्थ्य", tab_immunization:"टीकाकरण",
    referral_reason:"कारण", referral_priority:"प्राथमिकता", referral_destination:"गंतव्य सुविधा",
    referral_status:"स्थिति", new_referral:"नया रेफरल",
    status_pending:"लंबित", status_referred:"रेफर किया गया", status_received:"प्राप्त",
    status_under_review:"समीक्षाधीन", status_followup_required:"फॉलो-अप आवश्यक",
    status_completed:"पूर्ण", status_cancelled:"रद्द",
    rt_assessment:"मूल्यांकन", rt_generated:"रेफरल तैयार", rt_referred:"रेफर किया गया",
    rt_facility_received:"सुविधा प्राप्त", rt_medical_review:"चिकित्सा समीक्षा",
    rt_followup:"फॉलो-अप", rt_completed:"पूर्ण",
    facility_name:"सुविधा का नाम", facility_type:"प्रकार", services:"सेवाएं",
    obstetric_capability:"प्रसूति क्षमता", emergency_capability:"आपातकालीन क्षमता", contact:"संपर्क",
    followup_today:"आज", followup_upcoming:"आगामी", followup_overdue:"विलंबित", followup_completed:"पूर्ण",
    followup_reason:"कारण", assigned_worker:"नियुक्त कार्यकर्ता", followup_notes:"टिप्पणी",
    fs_due:"बाकी", fs_completed:"पूर्ण", fs_missed:"छूटा", fs_rescheduled:"पुनर्निर्धारित",
    add_anc_visit:"एएनसी विज़िट जोड़ें", visit_date:"विज़िट तिथि",
    delivery_status:"प्रसव स्थिति", postnatal_visits:"प्रसवोत्तर विज़िट",
    child_id:"बच्चे की आईडी", dob:"जन्म तिथि", birth_weight:"जन्म वजन", sex:"लिंग", delivery_facility:"प्रसव सुविधा",
    newborn_followup:"नवजात फॉलो-अप", growth:"विकास", nutrition:"पोषण", development:"विकासात्मक प्रगति",
    immunization_schedule:"टीकाकरण अनुसूची", imm_completed:"पूर्ण", imm_upcoming:"आगामी",
    imm_due:"बाकी", imm_missed:"छूटा",

    admin_title:"एडमिन", admin_dashboard:"डैशबोर्ड", admin_users:"उपयोगकर्ता",
    admin_pending_approvals:"लंबित स्वीकृतियां", admin_officers:"अधिकारी", admin_facilities:"सुविधाएं",
    admin_risk_rules:"जोखिम नियम", admin_districts_blocks:"जिले और ब्लॉक",
    admin_audit_logs:"ऑडिट लॉग", admin_settings:"सेटिंग्स",
    col_mobile:"मोबाइल", col_role:"भूमिका", col_district:"जिला", col_block:"ब्लॉक",
    col_status:"स्थिति", col_created:"बनाया गया", act_view:"देखें", act_edit:"संपादित करें",
    act_activate:"सक्रिय करें", act_deactivate:"निष्क्रिय करें", act_change_role:"भूमिका बदलें",
    act_approve:"स्वीकृत करें", act_reject:"अस्वीकार करें",
    add_officer:"अधिकारी जोड़ें", assigned_area:"नियुक्त क्षेत्र",
    rule_name:"नियम का नाम", description:"विवरण", indicator:"संकेतक", condition:"शर्त",
    severity:"गंभीरता", enabled:"सक्रिय", add_rule:"नियम जोड़ें",
    col_user:"उपयोगकर्ता", col_action_log:"कार्रवाई", col_entity:"इकाई", col_entity_id:"इकाई आईडी",
    col_date:"तिथि", col_time:"समय",

    role_asha:"आशा", role_anm:"एएनएम", role_medical_officer:"चिकित्सा अधिकारी",
    role_block_officer:"ब्लॉक अधिकारी", role_district_officer:"जिला अधिकारी", role_admin:"एडमिन",
    demo_data:"डेमो डेटा", demo_data_note:"डेटा केवल प्रदर्शन हेतु है",
    cancel:"रद्द करें", close:"बंद करें", loading:"लोड हो रहा है...", none:"कोई नहीं", yes:"हां", no:"नहीं",
    week_short:"सप्ताह", years_short:"वर्ष",
  }
};

const I18N = {
  current: localStorage.getItem('ss_lang') || 'en',

  t(key, vars){
    let str = (TRANSLATIONS[this.current] && TRANSLATIONS[this.current][key]) || TRANSLATIONS.en[key] || key;
    if(vars){
      Object.keys(vars).forEach(k=>{ str = str.replace(`{${k}}`, vars[k]); });
    }
    return str;
  },

  setLang(lang){
    this.current = lang;
    localStorage.setItem('ss_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('lang-hi', lang === 'hi');
    this.apply();
    document.dispatchEvent(new CustomEvent('langchange', {detail:{lang}}));
  },

  apply(root){
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    scope.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      el.setAttribute('placeholder', this.t(el.getAttribute('data-i18n-ph')));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el=>{
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('.lang-switch button').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.lang === this.current);
    });
  },

  init(){
    document.documentElement.setAttribute('lang', this.current);
    document.body.classList.toggle('lang-hi', this.current === 'hi');
    document.addEventListener('DOMContentLoaded', ()=>{
      this.apply();
      document.querySelectorAll('.lang-switch button').forEach(btn=>{
        btn.addEventListener('click', ()=> this.setLang(btn.dataset.lang));
      });
    });
  }
};

I18N.init();
