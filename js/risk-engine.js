/* ============================================================
   SwasthyaSaathi — Risk Screening Engine
   ------------------------------------------------------------
   IMPORTANT: This is TRANSPARENT, RULE-BASED SCREENING.
   It is NOT a trained machine-learning model and makes NO
   accuracy claims. It is decision support only — never a
   diagnosis. Any urgent warning sign forces an urgent flag
   regardless of the numerical score.

   Thresholds below are illustrative defaults for a working
   prototype and MUST be reviewed and aligned to applicable
   official clinical protocols (e.g. national ANC / high-risk
   pregnancy guidelines) before any real-world deployment.
   Admins can adjust rules via admin.html → Risk Rules; changed
   rules bump RULESET_VERSION and are captured in the audit log.
   ============================================================ */

const RULESET_VERSION = "v1.0.0";

const RiskEngine = {

  /**
   * @param {object} input - collected form data from pregnancy.html
   * input.vitals: { systolicBP, diastolicBP, pulse, temperature, weight, haemoglobin, bloodGlucose }
   * input.history: { hypertension, diabetes, anaemia, prevCsection, prevComplications,
   *                   stillbirth, miscarriage, pph, multiplePregnancy }
   * input.warningSigns: { bleeding, headache, vision, abdominal, fever, breathing, convulsions, reducedMovement }
   * input.pregnancy: { gestationalWeeks, gravida, para }
   * @returns {{risk_level:'low'|'moderate'|'high', score:number, contributing_indicators:string[],
   *            urgent_flag:boolean, ruleset_version:string}}
   */
  evaluate(input){
    const vitals = input.vitals || {};
    const history = input.history || {};
    const warning = input.warningSigns || {};
    const pregnancy = input.pregnancy || {};

    let score = 0;
    const indicators = [];

    // --- Urgent warning signs (override everything) ---
    const urgentSigns = [];
    if(warning.bleeding){ urgentSigns.push(I18N.t('w_bleeding')); score += 5; }
    if(warning.convulsions){ urgentSigns.push(I18N.t('w_convulsions')); score += 5; }
    if(warning.breathing){ urgentSigns.push(I18N.t('w_breathing')); score += 5; }
    if(warning.abdominal){ urgentSigns.push(I18N.t('w_abdominal')); score += 4; }
    if(warning.vision){ urgentSigns.push(I18N.t('w_vision')); score += 4; }
    if(warning.headache){ urgentSigns.push(I18N.t('w_headache')); score += 3; }
    if(warning.reducedMovement){ urgentSigns.push(I18N.t('w_reduced_movement')); score += 3; }
    if(warning.fever){ urgentSigns.push(I18N.t('w_fever')); score += 2; }
    if(warning.other){ urgentSigns.push(I18N.t('w_other')); score += 1; }
    indicators.push(...urgentSigns);

    const urgent_flag = urgentSigns.length > 0;

    // --- Blood pressure ---
    const sbp = Number(vitals.systolicBP), dbp = Number(vitals.diastolicBP);
    if(sbp >= 160 || dbp >= 110){
      score += 5; indicators.push('Severely elevated blood pressure');
    }else if(sbp >= 140 || dbp >= 90){
      score += 3; indicators.push('Elevated blood pressure');
    }

    // --- Haemoglobin (anaemia severity) ---
    const hb = Number(vitals.haemoglobin);
    if(hb && hb < 7){ score += 4; indicators.push('Severe anaemia (low haemoglobin)'); }
    else if(hb && hb < 11){ score += 2; indicators.push('Anaemia (low haemoglobin)'); }

    // --- Pulse ---
    const pulse = Number(vitals.pulse);
    if(pulse && (pulse > 120 || pulse < 50)){ score += 2; indicators.push('Abnormal pulse rate'); }

    // --- Blood glucose ---
    const glucose = Number(vitals.bloodGlucose);
    if(glucose && glucose > 200){ score += 2; indicators.push('Elevated blood glucose'); }

    // --- History factors ---
    if(history.hypertension){ score += 2; indicators.push('History of hypertension'); }
    if(history.diabetes){ score += 2; indicators.push('History of diabetes'); }
    if(history.anaemia){ score += 1; indicators.push('History of anaemia'); }
    if(history.prevCsection){ score += 1; indicators.push('Previous C-section'); }
    if(history.prevComplications){ score += 2; indicators.push('Previous pregnancy complications'); }
    if(history.stillbirth){ score += 3; indicators.push('History of stillbirth'); }
    if(history.miscarriage){ score += 1; indicators.push('History of miscarriage'); }
    if(history.pph){ score += 3; indicators.push('History of postpartum haemorrhage'); }
    if(history.multiplePregnancy){ score += 2; indicators.push('Multiple pregnancy'); }

    // --- Age / gravida factors ---
    const age = Number(input.age);
    if(age && (age < 19 || age > 35)){ score += 1; indicators.push('Age outside typical low-risk range'); }
    if(Number(pregnancy.gravida) >= 5){ score += 1; indicators.push('High gravida (grand multipara)'); }

    // --- Determine level ---
    let risk_level;
    if(urgent_flag || score >= 8) risk_level = 'high';
    else if(score >= 4) risk_level = 'moderate';
    else risk_level = 'low';

    return {
      risk_level,
      score,
      contributing_indicators: [...new Set(indicators)],
      urgent_flag,
      ruleset_version: RULESET_VERSION,
      evaluated_at: new Date().toISOString()
    };
  },

  levelLabel(level){
    return { low:I18N.t('risk_low'), moderate:I18N.t('risk_moderate'), high:I18N.t('risk_high') }[level] || level;
  },
  levelShort(level){
    return { low:I18N.t('risk_low_short'), moderate:I18N.t('risk_moderate_short'), high:I18N.t('risk_high_short') }[level] || level;
  }
};
