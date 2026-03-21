'use strict';

/**
 * DiluteIt | HostCell suite UI (iOS-like)
 * Solver logic: C1 * V1 = C2 * V2
 * - Unit kinds: molar / massvol / percent (C1 and C2 must match)
 * - Volumes normalized to liters internally
 * - Bilingual ES/EN
 * - PWA install prompt + service worker registration
 */

const APP = {
  lang: "es",
  currentTarget: "v1",
  deferredInstallPrompt: null,
  lastResultOk: false,
  lastSolved: null
};

const DOM = {
  // language
  langEs: document.getElementById("lang-es"),
  langEn: document.getElementById("lang-en"),

  // top actions
  btnClear: document.getElementById("btn-clear"),
  btnInstall: document.getElementById("install-btn"),
  btnInfo: document.getElementById("btn-info"),

  // sheet
  sheetBackdrop: document.getElementById("sheet-backdrop"),
  btnCloseSheet: document.getElementById("btn-close-sheet"),

  // target selector
  targetButtons: Array.from(document.querySelectorAll("#target-seg [data-var]")),

  // solver card
  solverCard: document.getElementById("solver-card"),

  // inputs
  inputs: {
    c1: document.getElementById("val-c1"),
    v1: document.getElementById("val-v1"),
    c2: document.getElementById("val-c2"),
    v2: document.getElementById("val-v2")
  },
  units: {
    c1: document.getElementById("unit-c1"),
    v1: document.getElementById("unit-v1"),
    c2: document.getElementById("unit-c2"),
    v2: document.getElementById("unit-v2")
  },
  labels: {
    c1: document.getElementById("lbl-c1"),
    v1: document.getElementById("lbl-v1"),
    c2: document.getElementById("lbl-c2"),
    v2: document.getElementById("lbl-v2")
  },

  btnCalculate: document.getElementById("btn-calculate"),

  // result
  resultBox: document.getElementById("result-box"),
  resultLabel: document.getElementById("result-label"),
  outSolved: document.getElementById("out-solved"),
  resultValue: document.getElementById("result-value"),
  resultMeta: document.getElementById("result-meta"),
  statusLine: document.getElementById("status-line"),
  statusPill: document.getElementById("status-pill")
};

/* ---------- i18n ---------- */
function t(key){
  const pack = I18N[APP.lang] || I18N.es;
  return pack[key] ?? key;
}

function applyTranslations(lang){
  const pack = I18N[lang] || I18N.es;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (pack[key]) el.innerHTML = pack[key];
  });

  DOM.langEs.setAttribute('aria-selected', String(lang === 'es'));
  DOM.langEn.setAttribute('aria-selected', String(lang === 'en'));
}

function setLanguage(lang){
  if (!I18N[lang]) return;
  APP.lang = lang;
  applyTranslations(lang);
  setInputPlaceholders();
  // refresh result labels if visible
  if (DOM.resultBox.classList.contains('visible')) updateResultLabelsOnly();
  try{ localStorage.setItem('diluteit_lang', lang); }catch(_){}
}

function loadSavedLanguage(){
  try{
    const saved = localStorage.getItem('diluteit_lang');
    if (saved && I18N[saved]) APP.lang = saved;
  }catch(_){}
}

/* ---------- UI helpers ---------- */
function setCardValidity(isValid=true){
  DOM.solverCard.classList.toggle('invalid', !isValid);
}

function showResult(mode='normal'){
  DOM.resultBox.classList.add('visible');
  DOM.resultBox.classList.toggle('error', mode === 'error');
}
function hideResult(){
  DOM.resultBox.classList.remove('visible', 'error');
  DOM.statusPill.hidden = true;
  DOM.statusPill.textContent = '';
  DOM.statusPill.classList.remove('ok', 'warn');
}

function setStatusPill(text, kind='ok'){
  DOM.statusPill.hidden = false;
  DOM.statusPill.textContent = text;
  DOM.statusPill.classList.remove('ok', 'warn');
  DOM.statusPill.classList.add(kind);
}

function parsePositiveNumber(el){
  const v = Number.parseFloat(el.value);
  return Number.isFinite(v) && v > 0 ? v : NaN;
}

function parseVolumeUnit(selectEl){
  const factor = Number.parseFloat(selectEl.value); // to liters
  return { factor, label: selectEl.options[selectEl.selectedIndex].text };
}

function parseConcentrationUnit(selectEl){
  const raw = selectEl.value; // kind:factor
  const [kind, factorStr] = raw.split(':');
  const factor = Number.parseFloat(factorStr);
  return { kind, factor, label: selectEl.options[selectEl.selectedIndex].text };
}

function normalizeValuesToBase(){
  const v1Value = parsePositiveNumber(DOM.inputs.v1);
  const v2Value = parsePositiveNumber(DOM.inputs.v2);
  const v1Unit = parseVolumeUnit(DOM.units.v1);
  const v2Unit = parseVolumeUnit(DOM.units.v2);

  const c1Value = parsePositiveNumber(DOM.inputs.c1);
  const c2Value = parsePositiveNumber(DOM.inputs.c2);
  const c1Unit = parseConcentrationUnit(DOM.units.c1);
  const c2Unit = parseConcentrationUnit(DOM.units.c2);

  return {
    inputs: { c1Value, v1Value, c2Value, v2Value },
    units: { c1Unit, v1Unit, c2Unit, v2Unit },
    base: {
      c1: Number.isFinite(c1Value) ? c1Value * c1Unit.factor : NaN,
      v1: Number.isFinite(v1Value) ? v1Value * v1Unit.factor : NaN,
      c2: Number.isFinite(c2Value) ? c2Value * c2Unit.factor : NaN,
      v2: Number.isFinite(v2Value) ? v2Value * v2Unit.factor : NaN
    }
  };
}

function formatNumber(value, decimals=6){
  if (!Number.isFinite(value)) return t('errGeneric');
  const abs = Math.abs(value);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return value.toExponential(4);
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}

function setInputPlaceholders(){
  const target = APP.currentTarget;
  for (const key of ['c1','v1','c2','v2']){
    DOM.inputs[key].placeholder = (key === target) ? t('targetPlaceholder') : t('normalPlaceholder');
  }
}

function getVariableDisplayName(key){
  return t(`resultLabel_${key}`);
}

function setTarget(variableKey){
  APP.currentTarget = variableKey;

  // segmented state
  DOM.targetButtons.forEach((btn) => {
    const on = btn.dataset.var === variableKey;
    btn.setAttribute('aria-selected', String(on));
  });

  // highlight target label+field; lock target input
  for (const key of ['c1','v1','c2','v2']){
    DOM.inputs[key].classList.remove('target-field');
    DOM.labels[key].classList.remove('label-target');
    DOM.inputs[key].readOnly = false;
  }
  DOM.inputs[variableKey].classList.add('target-field');
  DOM.labels[variableKey].classList.add('label-target');
  DOM.inputs[variableKey].readOnly = true;

  // clear target
  DOM.inputs[variableKey].value = '';
  setInputPlaceholders();

  // reset result
  hideResult();
  setCardValidity(true);
}

/* ---------- Calculation engine ---------- */
function calculateDilution(){
  const { units, base } = normalizeValuesToBase();
  const target = APP.currentTarget;

  // Validate concentration kind (C1 & C2)
  if (units.c1Unit.kind !== units.c2Unit.kind){
    return renderError(t('errKindMismatch'));
  }

  const required = ['c1','v1','c2','v2'].filter(k => k !== target);
  const missing = required.some(k => !Number.isFinite(base[k]) || base[k] <= 0);
  if (missing){
    return renderError(t('errMissing'));
  }

  let resultBase = NaN;
  if (target === 'v1'){
    if (base.c1 === 0) return renderError(t('errZeroDivision'));
    resultBase = (base.c2 * base.v2) / base.c1;
  } else if (target === 'c1'){
    if (base.v1 === 0) return renderError(t('errZeroDivision'));
    resultBase = (base.c2 * base.v2) / base.v1;
  } else if (target === 'c2'){
    if (base.v2 === 0) return renderError(t('errZeroDivision'));
    resultBase = (base.c1 * base.v1) / base.v2;
  } else if (target === 'v2'){
    if (base.c2 === 0) return renderError(t('errZeroDivision'));
    resultBase = (base.c1 * base.v1) / base.c2;
  }

  if (!Number.isFinite(resultBase) || resultBase <= 0){
    return renderError(t('errGeneric'));
  }

  // Convert to selected unit of target
  let resultDisplay = NaN;
  let unitLabel = '';
  if (target === 'v1' || target === 'v2'){
    const u = parseVolumeUnit(DOM.units[target]);
    resultDisplay = resultBase / u.factor;
    unitLabel = u.label;
  } else {
    const u = parseConcentrationUnit(DOM.units[target]);
    resultDisplay = resultBase / u.factor;
    unitLabel = u.label;
  }

  // write back
  DOM.inputs[target].value = formatNumber(resultDisplay, 6);

  APP.lastResultOk = true;
  APP.lastSolved = target;

  DOM.resultLabel.textContent = getVariableDisplayName(target);
  DOM.outSolved.textContent = target.toUpperCase();
  DOM.resultValue.textContent = `${formatNumber(resultDisplay, 6)} ${unitLabel}`;
  DOM.resultMeta.innerHTML = `
    <div class="tags">
      <span class="tag">${t('resultMetaPrefix')}: <span class="mono">${getVariableDisplayName(target)}</span></span>
      <span class="tag">Base: ${units.c1Unit.kind}</span>
      <span class="tag">Volumes → L</span>
    </div>
  `;
  DOM.statusLine.textContent = t('statusOk');
  setStatusPill(t('statusOk'), 'ok');
  showResult('normal');
}

function renderError(message){
  APP.lastResultOk = false;
  APP.lastSolved = null;

  DOM.resultLabel.textContent = t('resultLabelDefault');
  DOM.outSolved.textContent = '---';
  DOM.resultValue.textContent = t('errGeneric');
  DOM.resultMeta.textContent = message;
  DOM.statusLine.textContent = t('statusError');
  setStatusPill(t('statusError'), 'warn');
  showResult('error');
}

function updateResultLabelsOnly(){
  // Keep the header consistent after language change
  if (APP.lastResultOk && APP.lastSolved) DOM.resultLabel.textContent = getVariableDisplayName(APP.lastSolved);
  else DOM.resultLabel.textContent = t('resultLabelDefault');

  // Keep status line and pill language-consistent
  if (DOM.resultBox.classList.contains('error')){
    DOM.statusLine.textContent = t('statusError');
    if (!DOM.statusPill.hidden) setStatusPill(t('statusError'), 'warn');
  } else if (DOM.resultBox.classList.contains('visible')){
    DOM.statusLine.textContent = t('statusOk');
    if (!DOM.statusPill.hidden) setStatusPill(t('statusOk'), 'ok');
  }
}

/* ---------- Clear ---------- */
function clearAll(){
  for (const key of ['c1','v1','c2','v2']){
    DOM.inputs[key].value = '';
  }
  // keep selection + units
  DOM.inputs[APP.currentTarget].value = '';

  APP.lastResultOk = false;
  APP.lastSolved = null;
  DOM.resultLabel.textContent = t('resultLabelDefault');

  hideResult();
  setCardValidity(true);
  setInputPlaceholders();
}

/* ---------- Info sheet ---------- */
function openSheet(){
  DOM.sheetBackdrop.classList.add('open');
  DOM.sheetBackdrop.setAttribute('aria-hidden', 'false');
}
function closeSheet(){
  DOM.sheetBackdrop.classList.remove('open');
  DOM.sheetBackdrop.setAttribute('aria-hidden', 'true');
}

/* ---------- PWA install + SW ---------- */
function setupInstallPrompt(){
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    APP.deferredInstallPrompt = event;
    DOM.btnInstall.hidden = false;
  });

  DOM.btnInstall.addEventListener('click', async () => {
    if (!APP.deferredInstallPrompt) return;
    APP.deferredInstallPrompt.prompt();
    APP.deferredInstallPrompt = null;
    DOM.btnInstall.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    DOM.btnInstall.hidden = true;
  });
}

function registerServiceWorker(){
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

function setupiOSInstallBanner(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const dismissed = (() => { try { return localStorage.getItem('di_ios_banner'); } catch(_){} return null; })();
  if (!isIOS || isStandalone || dismissed) return;
  const banner = document.getElementById('ios-install-banner');
  if (banner) banner.classList.add('visible');
  document.getElementById('btn-ios-dismiss')?.addEventListener('click', () => {
    banner?.classList.remove('visible');
    try { localStorage.setItem('di_ios_banner', '1'); } catch(_) {}
  });
}

/* ---------- events ---------- */
function bindEvents(){
  // language
  DOM.langEs.addEventListener('click', () => setLanguage('es'));
  DOM.langEn.addEventListener('click', () => setLanguage('en'));

  // target selector
  DOM.targetButtons.forEach((btn) => btn.addEventListener('click', () => setTarget(btn.dataset.var)));

  // solve
  DOM.btnCalculate.addEventListener('click', calculateDilution);

  // clear
  DOM.btnClear.addEventListener('click', clearAll);

  // info
  DOM.btnInfo.addEventListener('click', openSheet);
  DOM.btnCloseSheet.addEventListener('click', closeSheet);
  DOM.sheetBackdrop.addEventListener('click', (e) => {
    if (e.target === DOM.sheetBackdrop) closeSheet();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.sheetBackdrop.classList.contains('open')) closeSheet();
  });

  // Enter key on inputs triggers solve
  Object.values(DOM.inputs).forEach((el) => {
    el.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      calculateDilution();
    });

    el.addEventListener('input', () => {
      setCardValidity(true);
      if (DOM.resultBox.classList.contains('error')) DOM.resultBox.classList.remove('error');
    });
  });

  // Unit changes clear error highlight (but keep result until recalculated)
  Object.values(DOM.units).forEach((el) => {
    el.addEventListener('change', () => {
      setCardValidity(true);
      if (DOM.resultBox.classList.contains('error')) DOM.resultBox.classList.remove('error');
    });
  });
}

function init(){
  loadSavedLanguage();
  applyTranslations(APP.lang);
  DOM.resultLabel.textContent = t('resultLabelDefault');
  // init lang buttons state
  DOM.langEs.setAttribute('aria-selected', String(APP.lang === 'es'));
  DOM.langEn.setAttribute('aria-selected', String(APP.lang === 'en'));

  setTarget(APP.currentTarget);
  hideResult();
  bindEvents();
  setupInstallPrompt();
  setupiOSInstallBanner();
  registerServiceWorker();
}

init();
