/* ═══════════════════════════════════════════════════════
   LayeForge — Renderer / Logique Frontend
   ═══════════════════════════════════════════════════════ */

'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  currentStep: 1,
  maxStep: 1,
  files: [],
  entryFile: '',
  iconPath: null,
  outputDir: '',
  generatedPath: null,
  config: {
    appName: '',
    appDescription: '',
    width: 1200,
    height: 800,
    resizable: true,
    fullscreen: false,
    frameless: false,
    showMenu: false,
    obfuscate: false,
    disableDevTools: true,
    blockContextMenu: true,
    splashScreen: true,
    notifications: false,
    nativeDialogs: false,
    apis: {
      printers: false, os: false, power: false, screen: false, theme: false, syspref: false, desktop: false, clipboard: false,
      tray: false, menu: false, progressbar: false, badge: false, flash: false, alwaysontop: false, transparent: false, zoom: false,
      shell: false, autolaunch: false, shortcuts: false, recent: false, msgbox: false, errorbox: false, safestorage: false, protocol: false,
      net: false, webrequest: false, cookies: false, clearcache: false, proxy: false, download: false, insertcss: false, executejs: false,
      webrtc: false, spellchecker: false, nativeimage: false, crashreporter: false, process: false, appmetrics: false, haptic: false, touchbar: false
    },
    db: {
      enabled: false,
      name: 'data'
    },
    fileAssociation: {
      ext: '',
      name: ''
    },
    exportFormat: 'portable',
    customBar: {
      enabled: true,
      backgroundColor: '#111128',
      textColor: '#f0f0ff',
      style: 'solid',
      buttonPosition: 'right',
      showLogo: true
    }
  }
};

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initWindowControls();
  initDragDrop();
  initStep1();
  initStep2();
  initStep3();
  initStep4();
  initHistoryTab();
});

let savedStepBeforeHistory = 1;

function initHistoryTab() {
  const historyBtn = $('sidebar-btn-history');
  historyBtn.onclick = () => {
    if (state.currentStep !== 5) {
      savedStepBeforeHistory = state.currentStep;
      goToStep(5);
    } else {
      goToStep(savedStepBeforeHistory);
    }
  };
}

// ─── Window Controls ─────────────────────────────────────────────────────────
function initWindowControls() {
  $('btn-minimize').addEventListener('click', () => window.electronAPI.minimize());
  $('btn-maximize').addEventListener('click', () => window.electronAPI.maximize());
  $('btn-close').addEventListener('click', () => window.electronAPI.close());
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function goToStep(step) {
  // 1. Panels - Afficher le bon écran
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const targetPanel = $(`panel-step-${step}`);
  if (targetPanel) targetPanel.classList.add('active');

  // 2. Navigation
  if (step === 5) {
    loadHistory();
    $('sidebar-btn-history').classList.add('active');
  } else {
    $('sidebar-btn-history').classList.remove('active');
    state.currentStep = step;
    if (step > state.maxStep) state.maxStep = step;
  }

  const navItems = document.querySelectorAll('.step-item');
  navItems.forEach((item, idx) => {
    const s = idx + 1;
    item.classList.remove('active', 'done', 'clickable');

    if (step === 5) {
      // Dans l'historique : on garde le visuel de la progression mais tout est clickable
      if (s === state.currentStep) {
        item.classList.add('active', 'clickable');
        item.onclick = () => goToStep(s);
      } else if (s < state.currentStep) {
        item.classList.add('done', 'clickable');
        item.onclick = () => goToStep(s);
      } else if (s <= state.maxStep) {
        item.classList.add('clickable');
        item.onclick = () => goToStep(s);
      }
    } else {
      // Dans la création : gestion normale et verrouillage
      if (s === step) {
        item.classList.add('active');
        item.onclick = null;
      } else if (s < step) {
        item.classList.add('done', 'clickable');
        item.onclick = () => goToStep(s);
      } else if (s <= state.maxStep) {
        item.classList.add('clickable');
        item.onclick = () => goToStep(s);
      }
    }
  });

  // 3. Actions spéciales
  if (step === 3) loadPreview();
  if (step === 4) fillSummary();
}

// ─── Drag & Drop Global ───────────────────────────────────────────────────────
function initDragDrop() {
  const overlay = $('drag-overlay');

  document.addEventListener('dragenter', (e) => {
    if (e.dataTransfer.types.includes('Files') && state.currentStep === 1) {
      overlay.classList.add('active');
    }
  });
  document.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
      overlay.classList.remove('active');
    }
  });
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    overlay.classList.remove('active');
    if (state.currentStep !== 1) return;

    const items = [...e.dataTransfer.files].map(f => ({
      path: f.path,
      name: f.name,
      ext: '.' + f.name.split('.').pop().toLowerCase(),
      size: f.size
    }));

    if (items.length > 0) {
      addFiles(items);
    }
  });

  // Dropzone
  const dropzone = $('dropzone');
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
  });
}

// ─── ÉTAPE 1 — Fichiers ───────────────────────────────────────────────────────
function initStep1() {
  $('btn-select-files').addEventListener('click', async () => {
    const files = await window.electronAPI.selectFiles();
    if (files && files.length > 0) addFiles(files);
  });

  $('btn-select-folder').addEventListener('click', async () => {
    const files = await window.electronAPI.selectFolder();
    if (files && files.length > 0) {
      state.files = [];
      addFiles(files);
      showToast('Dossier importé avec succès !', 'success');
    }
  });

  $('btn-clear-files').addEventListener('click', () => {
    state.files = [];
    state.entryFile = '';
    renderFilesList();
    updateStep1Next();
  });

  $('entry-file-select').addEventListener('change', (e) => {
    state.entryFile = e.target.value;
  });

  $('btn-next-1').addEventListener('click', () => {
    state.entryFile = $('entry-file-select').value;
    if (!state.entryFile) {
      showToast('Veuillez sélectionner votre fichier HTML principal.', 'error');
      return;
    }
    state.maxStep = Math.max(state.maxStep, 2);
    goToStep(2);
  });
}

function addFiles(files) {
  const allowedExts = ['.html', '.htm', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

  for (const file of files) {
    if (!allowedExts.includes(file.ext)) continue;
    const exists = state.files.find(f => f.path === file.path);
    if (!exists) state.files.push(file);
  }

  renderFilesList();
  updateStep1Next();

  if (state.files.length > 0) {
    showToast(`${files.length} fichier(s) importé(s)`, 'success');
  }
}

function renderFilesList() {
  const list = $('files-list');
  const section = $('files-section');
  const countEl = $('files-count');
  const entrySelect = $('entry-file-select');

  if (state.files.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  countEl.textContent = state.files.length;
  list.innerHTML = '';

  // Remplir la liste
  for (const file of state.files) {
    const extClean = file.ext.replace('.', '');
    const badgeClass = ['html', 'htm'].includes(extClean) ? 'html'
      : extClean === 'css' ? 'css'
      : extClean === 'js' ? 'js'
      : extClean === 'json' ? 'json'
      : ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(extClean) ? 'img'
      : 'other';

    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span class="file-ext-badge ${badgeClass}">${extClean}</span>
      <span class="file-name" title="${file.path}">${file.name}</span>
      <span class="file-size">${formatSize(file.size)}</span>
      <button class="file-remove" data-path="${file.path}" title="Supprimer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    list.appendChild(item);
  }

  // Listeners suppression
  list.querySelectorAll('.file-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.files = state.files.filter(f => f.path !== btn.dataset.path);
      renderFilesList();
      updateStep1Next();
    });
  });

  // Remplir le select de l'entrée
  const htmlFiles = state.files.filter(f => ['.html', '.htm'].includes(f.ext));
  const prevEntry = state.entryFile;

  entrySelect.innerHTML = '<option value="">— Choisir le fichier HTML principal —</option>';
  htmlFiles.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.name;
    opt.textContent = f.name;
    if (f.name === prevEntry) opt.selected = true;
    entrySelect.appendChild(opt);
  });

  // Auto-sélection si index.html trouvé
  if (!state.entryFile) {
    const auto = htmlFiles.find(f => f.name === 'index.html' || f.name === 'index.htm');
    if (auto) {
      entrySelect.value = auto.name;
      state.entryFile = auto.name;
    } else if (htmlFiles.length === 1) {
      entrySelect.value = htmlFiles[0].name;
      state.entryFile = htmlFiles[0].name;
    }
  }
}

function updateStep1Next() {
  const hasHtml = state.files.some(f => ['.html', '.htm'].includes(f.ext));
  $('btn-next-1').disabled = !hasHtml;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── ÉTAPE 2 — Configuration ─────────────────────────────────────────────────
function initStep2() {
  $('btn-prev-2').addEventListener('click', () => goToStep(1));

  $('btn-select-icon').addEventListener('click', async () => {
    const iconPath = await window.electronAPI.selectIcon();
    if (iconPath) {
      state.iconPath = iconPath;
      const name = iconPath.split(/[\\/]/).pop();
      $('icon-filename').textContent = name;
      const preview = $('icon-preview');
      preview.innerHTML = `<img src="file://${iconPath}" alt="Icône" />`;
    }
  });

  $('btn-next-2').addEventListener('click', () => {
    const name = $('app-name').value.trim();
    if (!name) {
      showToast('Veuillez saisir un nom pour votre application.', 'error');
      $('app-name').focus();
      return;
    }
    state.config.appName = name;
    state.config.appDescription = $('app-description').value.trim();
    state.config.width = parseInt($('win-width').value) || 1200;
    state.config.height = parseInt($('win-height').value) || 800;
    state.config.resizable = $('opt-resizable').checked;
    state.config.fullscreen = $('opt-fullscreen').checked;
    state.config.frameless = $('opt-frameless').checked;
    state.config.showMenu = $('opt-show-menu').checked;
    state.config.obfuscate = $('opt-obfuscate').checked;
    state.config.disableDevTools = $('opt-disable-devtools').checked;
    state.config.blockContextMenu = $('opt-block-context-menu').checked;
    state.config.splashScreen = $('opt-splash-screen').checked;
    state.config.notifications = $('opt-notifications').checked;
    state.config.nativeDialogs = $('opt-native-dialogs').checked;
    
    // Capture des 40 APIs
    const apiKeys = [
      'printers', 'os', 'power', 'screen', 'theme', 'syspref', 'desktop', 'clipboard',
      'tray', 'menu', 'progressbar', 'badge', 'flash', 'alwaysontop', 'transparent', 'zoom',
      'shell', 'autolaunch', 'shortcuts', 'recent', 'msgbox', 'errorbox', 'safestorage', 'protocol',
      'net', 'webrequest', 'cookies', 'clearcache', 'proxy', 'download', 'insertcss', 'executejs',
      'webrtc', 'spellchecker', 'nativeimage', 'crashreporter', 'process', 'appmetrics', 'haptic', 'touchbar'
    ];
    apiKeys.forEach(k => {
      const el = $(`api-${k}`);
      if(el) state.config.apis[k] = el.checked;
    });

    state.config.db = {
      enabled: $('opt-db-enabled').checked,
      name: $('db-name').value.trim() || 'data'
    };
    state.config.fileAssociation = {
      ext: $('file-ext').value.trim().replace(/^\./, ''),
      name: $('file-name').value.trim()
    };
    state.config.exportFormat = document.querySelector('input[name="export-format"]:checked').value;
    
    // Design configuration
    state.config.customBar.enabled = $('opt-custom-bar').checked;
    state.config.customBar.backgroundColor = $('bar-bg-color').value;
    state.config.customBar.textColor = $('bar-text-color').value;
    state.config.customBar.style = $('bar-style').value;
    state.config.customBar.buttonPosition = $('bar-btn-pos').value;
    state.config.customBar.showLogo = $('opt-show-logo').checked;

    state.maxStep = Math.max(state.maxStep, 3);
    goToStep(3);
  });

  // Color sync
  const syncColor = (colorId, textId) => {
    $(colorId).addEventListener('input', (e) => {
      $(textId).value = e.target.value.toUpperCase();
    });
    $(textId).addEventListener('input', (e) => {
      let val = e.target.value;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        $(colorId).value = val;
      }
    });
  };

  syncColor('bar-bg-color', 'bar-bg-text');
  syncColor('bar-text-color', 'bar-text-text');

  // Toggle design settings visibility
  $('opt-custom-bar').addEventListener('change', (e) => {
    $('design-settings').style.opacity = e.target.checked ? '1' : '0.4';
    $('design-settings').style.pointerEvents = e.target.checked ? 'auto' : 'none';
  });
}

// ─── ÉTAPE 3 — Prévisualisation ───────────────────────────────────────────────
function initStep3() {
  $('btn-prev-3').addEventListener('click', () => goToStep(2));
  $('btn-next-3').addEventListener('click', () => {
    state.maxStep = Math.max(state.maxStep, 4);
    goToStep(4);
  });
}

function loadPreview() {
  const webview = $('preview-webview');
  const placeholder = $('preview-placeholder');
  const titleEl = $('preview-window-title');
  const entryNameEl = $('preview-entry-name');
  const sizeInfoEl = $('preview-size-info');

  // Appliquer le style de la barre personnalisée à la preview
  const previewBar = $('preview-window').querySelector('.preview-titlebar');
  if (state.config.customBar.enabled) {
    previewBar.style.backgroundColor = state.config.customBar.backgroundColor;
    previewBar.style.color = state.config.customBar.textColor;
    previewBar.style.borderBottom = 'none';
    
    if (state.config.customBar.style === 'glass') {
      previewBar.style.backdropFilter = 'blur(10px)';
      previewBar.style.backgroundColor = state.config.customBar.backgroundColor + 'AA'; // Semi-transparent
    } else if (state.config.customBar.style === 'gradient') {
      previewBar.style.background = `linear-gradient(90deg, ${state.config.customBar.backgroundColor}, #3b82f6)`;
    }

    // Gérer l'ordre (Logo et Boutons)
    const dots = previewBar.querySelector('.preview-dots');
    if (state.config.customBar.buttonPosition === 'left') {
      previewBar.style.flexDirection = 'row-reverse';
    } else {
      previewBar.style.flexDirection = 'row';
    }
  } else {
    previewBar.style = ''; // Reset standard
  }

  // Trouver le fichier d'entrée
  const entryFileObj = state.files.find(f => f.name === state.entryFile);
  if (!entryFileObj) {
    placeholder.innerHTML = '<p style="color:var(--text-muted)">Aucun fichier HTML trouvé.</p>';
    return;
  }

  placeholder.style.display = 'flex';
  webview.style.display = 'none';

  // Charger dans l'iframe
  const fileUrl = 'file:///' + entryFileObj.path.replace(/\\/g, '/');
  webview.src = fileUrl;

  webview.onload = () => {
    placeholder.style.display = 'none';
    webview.style.display = 'block';
  };

  webview.onerror = () => {
    placeholder.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <p>Impossible de charger la prévisualisation</p>
    `;
  };
}

// ─── ÉTAPE 4 — Génération ─────────────────────────────────────────────────────
function initStep4() {
  $('btn-prev-4').addEventListener('click', () => goToStep(3));

  $('btn-select-output').addEventListener('click', async () => {
    const dir = await window.electronAPI.selectOutputDir();
    if (dir) {
      state.outputDir = dir;
      $('output-path').value = dir;
      updateGenerateBtn();
    }
  });

  $('btn-generate').addEventListener('click', generateProject);

  $('btn-build-exe').addEventListener('click', buildExe);

  $('btn-open-folder').addEventListener('click', () => {
    if (state.generatedPath) {
      window.electronAPI.openFolder(state.generatedPath);
    }
  });

  $('btn-new-project').addEventListener('click', () => {
    if (confirm('Voulez-vous créer un nouveau projet ? Toutes les données actuelles seront effacées.')) {
      resetAll();
    }
  });

  // Écouter les logs de compilation
  window.electronAPI.onBuildLog((data) => {
    const consoleEl = $('build-console');
    consoleEl.textContent += data;
    consoleEl.scrollTop = consoleEl.scrollHeight;
  });
}

function fillSummary() {
  $('sum-name').textContent = state.config.appName || '—';
  $('sum-size').textContent = `${state.config.width} × ${state.config.height}px`;
  $('sum-files').textContent = `${state.files.length} fichier(s)`;
  $('sum-entry').textContent = state.entryFile || '—';

  const opts = [];
  if (state.config.resizable) opts.push('Redimensionnable');
  if (state.config.fullscreen) opts.push('Plein écran');
  if (state.config.frameless) opts.push('Sans barre de titre');
  $('sum-options').textContent = opts.length > 0 ? opts.join(', ') : 'Standard';

  $('sum-icon').textContent = state.iconPath
    ? state.iconPath.split(/[\\/]/).pop()
    : 'Icône par défaut';

  updateGenerateBtn();
}

function updateGenerateBtn() {
  $('btn-generate').disabled = !state.outputDir || !state.config.appName;
}

async function generateProject() {
  const progressSection = $('progress-section');
  const generateZone = $('generate-zone');
  const successSection = $('success-section');
  const progressBar = $('progress-bar');
  const progressText = $('progress-text');

  generateZone.style.display = 'none';
  progressSection.style.display = 'block';
  successSection.style.display = 'none';

  // Simulation progression
  const steps = [
    { pct: 15, text: 'Préparation du projet...' },
    { pct: 35, text: 'Copie de vos fichiers...' },
    { pct: 60, text: 'Génération du main.js...' },
    { pct: 80, text: 'Configuration du package.json...' },
    { pct: 95, text: 'Finalisation...' }
  ];

  for (const step of steps) {
    progressBar.style.width = step.pct + '%';
    progressText.textContent = step.text;
    await sleep(300);
  }

  const result = await window.electronAPI.generateProject({
    files: state.files,
    appName: state.config.appName,
    appDescription: state.config.appDescription,
    width: state.config.width,
    height: state.config.height,
    resizable: state.config.resizable,
    fullscreen: state.config.fullscreen,
    frameless: state.config.frameless,
    exportFormat: state.config.exportFormat,
    icon: state.iconPath,
    outputDir: state.outputDir,
    entryFile: state.entryFile
  });

  progressBar.style.width = '100%';

  await sleep(300);
  progressSection.style.display = 'none';

  if (result.success) {
    state.generatedPath = result.projectPath;
    $('success-path').textContent = result.projectPath;
    successSection.style.display = 'block';
    $('step4-footer').style.display = 'none';
    showToast('Application générée avec succès !', 'success');
  } else {
    generateZone.style.display = 'flex';
    showToast(`Erreur : ${result.error}`, 'error');
  }
}

async function buildExe() {
  if (!state.generatedPath) return;

  const btn = $('btn-build-exe');
  const consoleContainer = $('build-console-container');
  const consoleEl = $('build-console');
  const statusDot = $('build-status-dot');

  btn.disabled = true;
  consoleContainer.style.display = 'block';
  consoleEl.textContent = 'Initialisation de la compilation...\n';
  statusDot.style.background = '#7c3aed';
  statusDot.style.boxShadow = '0 0 10px #7c3aed';

  showToast('Compilation lancée. Cela peut prendre plusieurs minutes...', 'info');

  const result = await window.electronAPI.buildProject(state.generatedPath);

  if (result.success) {
    statusDot.style.background = '#10b981';
    statusDot.style.boxShadow = '0 0 10px #10b981';
    showToast('Compilation terminée ! Votre .exe est dans le dossier dist.', 'success');
    consoleEl.textContent += '\n\n✅ COMPILATION TERMINÉE AVEC SUCCÈS !';
  } else {
    statusDot.style.background = '#ef4444';
    statusDot.style.boxShadow = '0 0 10px #ef4444';
    btn.disabled = false;
    showToast(`Erreur de compilation : ${result.error}`, 'error');
    consoleEl.textContent += `\n\n❌ ERREUR : ${result.error}`;
  }
}

function resetAll() {
  state.currentStep = 1;
  state.files = [];
  state.entryFile = '';
  state.iconPath = null;
  state.outputDir = '';
  state.generatedPath = null;
  state.config = { appName: '', appDescription: '', width: 1200, height: 800, resizable: true, fullscreen: false, frameless: false, exportFormat: 'portable' };

  // Reset UI
  $('files-section').style.display = 'none';
  $('files-list').innerHTML = '';
  $('entry-file-select').innerHTML = '<option value="">— Choisir le fichier HTML principal —</option>';
  $('app-name').value = '';
  $('app-description').value = '';
  $('win-width').value = 1200;
  $('win-height').value = 800;
  $('opt-resizable').checked = true;
  $('opt-fullscreen').checked = false;
  $('opt-frameless').checked = false;
  $('icon-preview').innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  $('icon-filename').textContent = '';
  $('output-path').value = '';
  $('success-section').style.display = 'none';
  $('generate-zone').style.display = 'flex';
  $('step4-footer').style.display = 'flex';
  $('btn-next-1').disabled = true;

  // Reset webview
  const webview = $('preview-webview');
  if (webview) webview.src = 'about:blank';

  goToStep(1);
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-dot"></span>${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


function initStep5() {
  $('btn-prev-5').onclick = () => goToStep(savedStepBeforeHistory);
  $('btn-history-refresh').onclick = () => loadHistory();
}

async function loadHistory() {
  const grid = $('history-grid');
  grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';

  const history = await window.electronAPI.getHistory();

  if (!history || history.length === 0) {
    grid.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-folder-open"></i>
        <p>Aucun projet construit pour le moment.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  history.forEach(project => {
    const card = document.createElement('div');
    card.className = 'history-card';
    
    const dateStr = new Date(project.lastUpdated || project.date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const isBuilt = project.status === 'built';

    card.innerHTML = `
      <div class="h-card-icon">
        <i class="fas fa-cube"></i>
      </div>
      <div class="h-card-info">
        <h3>${project.name || 'Projet sans nom'}</h3>
        <p class="h-card-path" title="${project.path}">${project.path}</p>
        <div class="h-card-meta">
          <span class="h-card-date">${dateStr}</span>
          <span class="h-card-status ${project.status}">${isBuilt ? 'Compilé' : 'Généré'}</span>
        </div>
      </div>
      <div class="h-card-actions">
        <button class="h-btn-open" title="Ouvrir le dossier"><i class="fas fa-external-link-alt"></i></button>
        <button class="h-btn-delete" title="Supprimer de l'historique"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    card.querySelector('.h-btn-open').onclick = () => window.electronAPI.openFolder(project.path);
    card.querySelector('.h-btn-delete').onclick = async () => {
      const ok = await window.electronAPI.deleteHistoryItem(project.path);
      if (ok) loadHistory();
    };

    grid.appendChild(card);
  });
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
