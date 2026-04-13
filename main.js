const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    frame: false,
    transparent: false,
    backgroundColor: '#0d0d1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── Gestion de l'Historique des Projets ───────────────────────────────────────
const historyPath = path.join(app.getPath('userData'), 'history.json');

function getHistory() {
  if (!fs.existsSync(historyPath)) return [];
  try {
    const data = fs.readFileSync(historyPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erreur lecture historique:', err);
    return [];
  }
}

function saveToHistory(project) {
  try {
    const history = getHistory();
    // On cherche si le projet existe déjà par son chemin
    const index = history.findIndex(p => p.path === project.path);
    
    if (index !== -1) {
      // Mise à jour de l'existant
      history[index] = { ...history[index], ...project, lastUpdated: Date.now() };
    } else {
      // Nouvel ajout en haut de liste
      history.unshift({ ...project, date: Date.now(), lastUpdated: Date.now() });
    }
    
    // On garde les 50 derniers projets
    const limitedHistory = history.slice(0, 50);
    fs.writeFileSync(historyPath, JSON.stringify(limitedHistory, null, 2), 'utf8');
  } catch (err) {
    console.error('Erreur sauvegarde historique:', err);
  }
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

// Contrôles fenêtre
ipcMain.handle('window-minimize', () => mainWindow.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.handle('window-close', () => mainWindow.close());

// Historique
ipcMain.handle('app-open-path', (event, p) => {
  if (fs.existsSync(p)) {
    shell.openPath(p);
    return true;
  }
  return false;
});
ipcMain.handle('get-history', () => getHistory());
ipcMain.handle('delete-history-item', (event, projectPath) => {
  try {
    const history = getHistory().filter(p => p.path !== projectPath);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
    return true;
  } catch (err) {
    return false;
  }
});


// Sélectionner des fichiers HTML/CSS/JS
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Sélectionnez vos fichiers web',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Fichiers Web', extensions: ['html', 'htm', 'css', 'js', 'json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ]
  });
  if (result.canceled) return null;
  return result.filePaths.map(p => ({
    path: p,
    name: path.basename(p),
    ext: path.extname(p).toLowerCase(),
    size: fs.statSync(p).size
  }));
});

// Sélectionner un dossier entier
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Sélectionnez votre dossier de projet',
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  const folderPath = result.filePaths[0];
  return readFolderRecursive(folderPath, folderPath);
});

function readFolderRecursive(basePath, currentPath) {
  const files = [];
  const items = fs.readdirSync(currentPath);
  const allowedExts = ['.html', '.htm', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  const excludedDirs = ['node_modules', '.git', 'dist', 'build', '.next', '__pycache__'];

  for (const item of items) {
    const fullPath = path.join(currentPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!excludedDirs.includes(item)) {
        files.push(...readFolderRecursive(basePath, fullPath));
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      if (allowedExts.includes(ext)) {
        files.push({
          path: fullPath,
          name: path.relative(basePath, fullPath),
          ext: ext,
          size: stat.size
        });
      }
    }
  }
  return files;
}

// Sélectionner une icône
ipcMain.handle('select-icon', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choisissez une icône pour votre application',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'ico', 'jpg', 'jpeg'] }
    ]
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

// Sélectionner le dossier de sortie
ipcMain.handle('select-output-dir', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choisissez où sauvegarder votre application',
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

// Lire le contenu d'un fichier (pour la prévisualisation)
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
});

// Générer le projet Electron
ipcMain.handle('generate-project', async (event, config) => {
  try {
    const { files, appName, appDescription, width, height, resizable, fullscreen, frameless, showMenu, obfuscate, disableDevTools, blockContextMenu, splashScreen, notifications, nativeDialogs, apis, db, fileAssociation, icon, outputDir, entryFile, exportFormat, customBar } = config;

    // Créer le dossier du projet
    const safeName = appName.replace(/[^a-z0-9\-_]/gi, '-').toLowerCase();
    const projectPath = path.join(outputDir, safeName);

    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true });
    }
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'app'), { recursive: true });

    // Copier les fichiers de l'utilisateur dans /app
    for (const file of files) {
      const destPath = path.join(projectPath, 'app', file.name);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(file.path, destPath);
    }

    // Déterminer le fichier d'entrée
    const entry = entryFile || files.find(f => f.ext === '.html' || f.ext === '.htm')?.name || 'index.html';
    const entryPath = path.join(projectPath, 'app', entry);

    // Injection de la barre de titre si activée
    if (customBar && customBar.enabled) {
      injectTitleBar(entryPath, appName, customBar, icon);
      // Créer les fichiers supports
      generateTitleBarAssets(projectPath, customBar);
    }

    // Copier l'icône si fournie
    let iconRelPath = null;
    if (icon) {
      const iconExt = path.extname(icon).toLowerCase();
      // Copie pour le renderer (assets)
      const iconDest = path.join(projectPath, 'assets', `icon${iconExt}`);
      fs.mkdirSync(path.join(projectPath, 'assets'), { recursive: true });
      fs.copyFileSync(icon, iconDest);
      iconRelPath = `./assets/icon${iconExt}`;
      
      // Copie pour electron-builder (racine)
      // On le nomme 'icon.ico' si c'est un ico, ou 'icon.png' pour la détection auto
      const builderIconDest = path.join(projectPath, `icon${iconExt}`);
      fs.copyFileSync(icon, builderIconDest);
    }

    // Générer main.js
    const forceFrameless = customBar && customBar.enabled ? true : frameless;
    const mainContent = generateMainJs({ appName, width, height, resizable, fullscreen, frameless: forceFrameless, showMenu, disableDevTools, blockContextMenu, splashScreen, notifications, nativeDialogs, apis, db, iconRelPath, entry });
    fs.writeFileSync(path.join(projectPath, 'main.js'), mainContent, 'utf8');

    // Générer splash.html si activé
    if (splashScreen) {
      const splashContent = generateSplashHtml({ appName, customBar });
      fs.writeFileSync(path.join(projectPath, 'splash.html'), splashContent, 'utf8');
    }

    // Générer preload.js (spécifique au projet généré)
    const preloadContent = generatePreload({ db, notifications, nativeDialogs, apis });
    fs.writeFileSync(path.join(projectPath, 'preload.js'), preloadContent, 'utf8');

    const iconExt = icon ? path.extname(icon).toLowerCase() : null;
    const pkgContent = generatePackageJson({ appName, appDescription, safeName, exportFormat, fileAssociation, db, iconExt });
    fs.writeFileSync(path.join(projectPath, 'package.json'), pkgContent, 'utf8');

    // Obfusquer les fichiers JS si demandé
    if (obfuscate) {
      obfuscateProjectFiles(path.join(projectPath, 'app'));
    }

    // Générer README.md
    const readmeContent = generateReadme({ appName, appDescription });
    fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent, 'utf8');

    // Générer install.bat (Windows)
    const batContent = `@echo off\necho Installation de ${appName}...\nnpm install\necho Lancement de ${appName}...\nnpm start\npause`;
    fs.writeFileSync(path.join(projectPath, 'LANCER.bat'), batContent, 'utf8');

    generateDocumentation({ db, notifications, nativeDialogs, apis, projectPath });

    saveToHistory({
      name: appName,
      path: projectPath,
      status: 'generated',
      icon: icon
    });

    return { success: true, projectPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Compiler le projet en .exe
ipcMain.handle('build-project', async (event, projectPath) => {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';

    mainWindow.webContents.send('build-log', 'Lancement de npm install (cela peut prendre du temps)...');

    // 1. Installation des dépendances
    const install = spawn(npmCmd, ['install'], { cwd: projectPath, shell: true });

    install.stdout.on('data', (data) => {
      mainWindow.webContents.send('build-log', data.toString());
    });

    install.stderr.on('data', (data) => {
      mainWindow.webContents.send('build-log', data.toString());
    });

    install.on('close', (code) => {
      if (code !== 0) {
        return resolve({ success: false, error: `Erreur npm install (code ${code}). Vérifiez votre connexion.` });
      }

      mainWindow.webContents.send('build-log', 'Installation réussie. Lancement de la compilation .exe...');

      // 2. Compilation
      const build = spawn(npmCmd, ['run', 'build'], { cwd: projectPath, shell: true });

      build.stdout.on('data', (data) => {
        mainWindow.webContents.send('build-log', data.toString());
      });

      build.stderr.on('data', (data) => {
        mainWindow.webContents.send('build-log', data.toString());
      });

      build.on('close', (code) => {
        if (code === 0) {
          saveToHistory({
            path: projectPath,
            status: 'built'
          });
          resolve({ success: true, distPath: path.join(projectPath, 'dist') });
        } else {
          resolve({ success: false, error: `Erreur compilation (code ${code}).` });
        }
      });
    });
  });
});

// Ouvrir le dossier dans l'explorateur


// ─── Générateurs de templates ─────────────────────────────────────────────────

function generateMainJs({ appName, width, height, resizable, fullscreen, frameless, showMenu, disableDevTools, blockContextMenu, splashScreen, notifications, nativeDialogs, apis, db, iconRelPath, entry }) {
  const a = apis || {};
  let eImports = ['app', 'BrowserWindow', 'ipcMain', 'globalShortcut', 'shell'];
  if (notifications) eImports.push('Notification');
  if (nativeDialogs || a.msgbox || a.errorbox) eImports.push('dialog');
  if (a.power) eImports.push('powerMonitor');
  if (a.screen) eImports.push('screen');
  if (a.theme || a.syspref) eImports.push('nativeTheme', 'systemPreferences');
  if (a.desktop) eImports.push('desktopCapturer');
  if (a.clipboard) eImports.push('clipboard');
  if (a.tray || a.menu) eImports.push('Menu', 'Tray');
  if (a.safestorage) eImports.push('safeStorage');
  if (a.net) eImports.push('net');
  if (a.crashreporter) eImports.push('crashReporter');
  if (a.nativeimage) eImports.push('nativeImage');
  if (a.webrequest || a.cookies || a.clearcache || a.proxy || a.download || a.usb || a.bluetooth) eImports.push('session');
  if (a.inapp) eImports.push('inAppPurchase');
  if (a.contenttracing) eImports.push('contentTracing');
  if (a.messagechannel) eImports.push('MessageChannelMain');

  const eImportsStr = 'const { ' + [...new Set(eImports)].join(', ') + ' } = require(\'electron\');';

  return `${eImportsStr}
const path = require('path');
${nativeDialogs || a.recent ? "const fs = require('fs');" : ""}
${a.os ? "const os = require('os');" : ""}
${db && db.enabled ? "const Datastore = require('nedb-promises');" : ""}

app.name = '${appName.replace(/'/g, "\'")}'

${a.crashreporter ? `
crashReporter.start({ submitURL: '', uploadToServer: false });
` : ''}

${db && db.enabled ? `
// Initialisation de la base de données
const db = Datastore.create({
  filename: path.join(app.getPath('userData'), '${db.name || 'data'}.db'),
  autoload: true
});

// Handlers IPC pour la base de données
ipcMain.handle('db-action', async (event, { action, args }) => {
  try {
    return await db[action](...args);
  } catch (err) {
    console.error('Erreur DB:', err);
    throw err;
  }
});
` : ''}

${notifications ? `
// Handler IPC pour les notifications natives
ipcMain.on('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});
` : ''}

${nativeDialogs ? `
// Handlers IPC pour Dialogues & Fichiers
ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
  const result = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), options);
  return result.filePaths;
});

ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
  const result = await dialog.showSaveDialog(BrowserWindow.fromWebContents(event.sender), options);
  return result.filePath;
});

ipcMain.handle('fs:writeFile', async (event, { filePath, data }) => {
  try {
    fs.writeFileSync(filePath, data, 'utf-8');
    return true;
  } catch (err) {
    console.error("Erreur écriture fichier:", err);
    return false;
  }
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error("Erreur lecture fichier:", err);
    return null;
  }
});
` : ''}

// --- APIS DYNAMIQUES ---
${a.printers ? `
ipcMain.handle('api:printers:get', async (event) => {
  return await event.sender.getPrintersAsync();
});
ipcMain.on('api:printers:print', (event, options) => {
  event.sender.print(options || { silent: true, printBackground: true });
});
` : ''}

${a.os ? `
ipcMain.handle('api:os:info', () => {
  return { 
    platform: os.platform(), cpus: os.cpus(), totalmem: os.totalmem(), freemem: os.freemem(), 
    userInfo: os.userInfo(), version: os.version() 
  };
});
` : ''}

${a.clipboard ? `
ipcMain.handle('api:clipboard:read', () => clipboard.readText());
ipcMain.on('api:clipboard:write', (event, text) => clipboard.writeText(text));
` : ''}

${a.shell ? `
ipcMain.on('api:shell:openExternal', (event, url) => shell.openExternal(url));
ipcMain.on('api:shell:openPath', (event, p) => shell.openPath(p));
` : ''}

${a.desktop ? `
ipcMain.handle('api:desktop:get', async () => {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  return sources.map(s => ({ id: s.id, name: s.name }));
});
` : ''}

${a.safestorage ? `
ipcMain.handle('api:safestorage:encrypt', (event, text) => {
  if (safeStorage.isEncryptionAvailable()) return safeStorage.encryptString(text).toString('base64');
  return null;
});
ipcMain.handle('api:safestorage:decrypt', (event, bufferStr) => {
  if (safeStorage.isEncryptionAvailable()) return safeStorage.decryptString(Buffer.from(bufferStr, 'base64')).toString();
  return null;
});
` : ''}

${a.usb ? `
session.defaultSession.setDevicePermissionHandler((details) => {
  return details.deviceType === 'usb' || details.deviceType === 'serial';
});
` : ''}

${a.bluetooth ? `
session.defaultSession.setBluetoothPairingHandler((details, callback) => {
  callback({ pin: '0000', accept: true });
});
` : ''}

${a.inapp ? `
ipcMain.handle('api:inapp:canMakePayments', () => inAppPurchase.canMakePayments());
ipcMain.handle('api:inapp:getProducts', async (event, productIds) => await inAppPurchase.getProducts(productIds));
` : ''}

${a.contenttracing ? `
ipcMain.handle('api:tracing:start', async (event, cfg) => {
  await contentTracing.startRecording(cfg || { included_categories: ['*'] });
  return true;
});
ipcMain.handle('api:tracing:stop', async () => await contentTracing.stopRecording(''));
` : ''}

function createWindow() {
  const win = new BrowserWindow({
    width: ${width || 1200},
    height: ${height || 800},
    resizable: ${resizable !== false ? 'true' : 'false'},
    fullscreen: ${fullscreen === true ? 'true' : 'false'},
    frame: ${frameless === true ? 'false' : 'true'},
    title: '${appName.replace(/'/g, "\'")}',
    show: ${splashScreen ? 'false' : 'true'},
    ${iconRelPath ? `icon: path.join(__dirname, '${iconRelPath}'),` : ''}
    ${a.alwaysontop ? 'alwaysOnTop: true,' : ''}
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: ${disableDevTools === true ? 'false' : 'true'},
      ${a.spellchecker ? 'spellcheck: true,' : ''}
    }
  });

  ${a.transparent ? 'win.setIgnoreMouseEvents(true, { forward: true });' : ''}
  
  // Forcer le titre de la fenêtre
  win.setTitle('${appName.replace(/'/g, "\'")}');
  win.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });

  ${showMenu === true ? `win.setMenuBarVisibility(true);` : `win.setMenu(null);`}

  win.loadFile(path.join(__dirname, 'app', '${entry}'));
  ${fullscreen === true ? "win.setFullScreen(true);" : ""}

  ${blockContextMenu === true ? `
  // Bloquer le menu contextuel
  win.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });
  ` : ''}

  ${disableDevTools === true ? `
  // Protection radicale contre l'ouverture des DevTools
  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools();
  });

  // Bloquer physiquement les touches F12 et Ctrl+Maj+I
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') event.preventDefault();
    if ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault();
    }
  });
  ` : ''}

  ${a.zoom ? `
  ipcMain.on('api:zoom', (event, val) => win.webContents.setZoomFactor(val));
  ` : ''}

  ${a.progressbar ? `
  ipcMain.on('api:progressbar', (event, val) => win.setProgressBar(val));
  ` : ''}

  ${a.flash ? `
  ipcMain.on('api:flash', (event, val) => win.flashFrame(val));
  ` : ''}

  return win;
}

// Contrôles de fenêtre (IPC)
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

app.whenReady().then(() => {
  ${disableDevTools === true ? `
  // Bloquer les raccourcis système pour DevTools
  globalShortcut.register('CommandOrControl+Shift+I', () => { return false; });
  globalShortcut.register('F12', () => { return false; });
  ` : ''}

  ${splashScreen ? `
  const splash = new BrowserWindow({
    width: 500, height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    ${iconRelPath ? `icon: path.join(__dirname, '${iconRelPath}'),` : ''}
    webPreferences: { contextIsolation: true }
  });
  splash.loadFile('splash.html');
  
  const win = createWindow();
  
  win.once('ready-to-show', () => {
    setTimeout(() => {
      splash.close();
      win.show();
    }, 1500); // Temps minimum de SplashScreen
  });
  ` : `createWindow();`}
  
  ${a.tray ? `
  const trayObj = new Tray(path.join(__dirname, '${iconRelPath || 'icon.png'}'));
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Afficher App', click: () => { const wins = BrowserWindow.getAllWindows(); if(wins[0]) wins[0].show(); } },
    { label: 'Quitter', click: () => app.quit() }
  ]);
  trayObj.setContextMenu(trayMenu);
  trayObj.setToolTip('${appName.replace(/'/g, "\\'")}');
  ` : ''}
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;
}

function generatePackageJson({ appName, appDescription, safeName, exportFormat, fileAssociation, db, iconExt }) {
  const pkg = {
    name: safeName,
    version: "1.0.0",
    description: appDescription || "Une superbe application générée avec LayeForge",
    main: "main.js",
    scripts: {
      start: "electron .",
      build: "electron-builder --win --x64"
    },
    author: "Papa Abdoulaye Diallo (Laye)",
    dependencies: {},
    devDependencies: {
      electron: "^26.0.0",
      "electron-builder": "^24.6.4"
    },
    build: {
      appId: `com.layeforge.${safeName}`,
      productName: appName,
      win: {
        target: exportFormat === 'nsis' ? "nsis" : "portable",
        icon: iconExt ? `icon${iconExt}` : undefined
      }
    }
  };

  if (db && db.enabled) {
    pkg.dependencies["nedb-promises"] = "^6.2.1";
  }

  if (fileAssociation && fileAssociation.extension) {
    pkg.build.win.target = "nsis";
    pkg.build.fileAssociations = [
      {
        ext: fileAssociation.extension.replace('.', ''),
        name: fileAssociation.name || "Fichier Application",
        description: fileAssociation.name || "Fichier Application",
        role: "Editor"
      }
    ];
  }

  if (exportFormat === 'nsis') {
    pkg.build.nsis = {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      perMachine: true
    };
  }

  return JSON.stringify(pkg, null, 2);
}

function generatePreload({ db, notifications, nativeDialogs, apis }) {
  const a = apis || {};
  return `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')${notifications ? `,
  notify: (title, body) => ipcRenderer.send('show-notification', { title, body })` : ''}${nativeDialogs ? `,
  dialogs: {
    showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options),
    showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options)
  },
  fs: {
    writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', { filePath, data }),
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath)
  }` : ''}${a.printers ? `,
  printers: {
    get: () => ipcRenderer.invoke('api:printers:get'),
    print: (options) => ipcRenderer.send('api:printers:print', options)
  }` : ''}${a.os ? `,
  os: {
    info: () => ipcRenderer.invoke('api:os:info')
  }` : ''}${a.clipboard ? `,
  clipboard: {
    read: () => ipcRenderer.invoke('api:clipboard:read'),
    write: (text) => ipcRenderer.send('api:clipboard:write', text)
  }` : ''}${a.shell ? `,
  shell: {
    openExternal: (url) => ipcRenderer.send('api:shell:openExternal', url),
    openPath: (path) => ipcRenderer.send('api:shell:openPath', path)
  }` : ''}${a.desktop ? `,
  desktop: {
    getSources: () => ipcRenderer.invoke('api:desktop:get')
  }` : ''}${a.safestorage ? `,
  safeStorage: {
    encrypt: (text) => ipcRenderer.invoke('api:safestorage:encrypt', text),
    decrypt: (bufferStr) => ipcRenderer.invoke('api:safestorage:decrypt', bufferStr)
  }` : ''}${a.zoom ? `,
  setZoom: (val) => ipcRenderer.send('api:zoom', val)` : ''}${a.progressbar ? `,
  setProgressBar: (val) => ipcRenderer.send('api:progressbar', val)` : ''}${a.flash ? `,
  flashFrame: (val) => ipcRenderer.send('api:flash', val)` : ''}${a.inapp ? `,
  inapp: {
    canMakePayments: () => ipcRenderer.invoke('api:inapp:canMakePayments'),
    getProducts: (products) => ipcRenderer.invoke('api:inapp:getProducts', products)
  }` : ''}${a.contenttracing ? `,
  tracing: {
    start: (cfg) => ipcRenderer.invoke('api:tracing:start', cfg),
    stop: () => ipcRenderer.invoke('api:tracing:stop')
  }` : ''}
});

${db && db.enabled ? `
const methods = ['insert', 'find', 'findOne', 'update', 'remove', 'count'];
const dbProxy = {};
methods.forEach(method => {
  dbProxy[method] = (...args) => ipcRenderer.invoke('db-action', { action: method, args });
});
contextBridge.exposeInMainWorld('db', dbProxy);
` : ''}
`;
}


function generateDocumentation({ db, notifications, nativeDialogs, apis, projectPath }) {
  const path = require('path');
  const a = apis || {};
  let doc = 'DOCUMENTATION DES APIS ET MODULES ACTIVES\n';
  doc += '============================================\n\n';
  doc += 'Félicitations, votre projet a été généré avec succès !\n';
  doc += 'Ce document référence le code JavaScript à utiliser pour les APIs que vous avez activées.\n\n';

  if (db && db.enabled) {
    doc += '--- BASE DE DONNÉES LOCALE ---\n';
    doc += '=> Utilisable via : window.db\n';
    doc += 'Exemple : window.db.insert({ prod: \'Pomme\', q: 10 });\n\n';
  }

  if (notifications) {
    doc += '--- NOTIFICATIONS WINDOWS ---\n';
    doc += 'Exemple : window.electronAPI.notify(\'Test\', \'Super message\');\n\n';
  }

  if (nativeDialogs) {
    doc += '--- DIALOGUES & FICHIERS ---\n';
    doc += 'Exemple Export :\n';
    doc += 'const path = await window.electronAPI.dialogs.showSaveDialog({ title: \'Save.\' });\n';
    doc += 'await window.electronAPI.fs.writeFile(path, \'Contenu texte\');\n\n';
  }

  if (a.printers) {
    doc += '--- IMPRESSION SILENCIEUSE ---\n';
    doc += 'const printers = await window.electronAPI.printers.get();\n';
    doc += 'window.electronAPI.printers.print({ silent: true });\n\n';
  }

  if (a.os) {
    doc += '--- INFOS SYSTÈME OS ---\n';
    doc += 'const hw = await window.electronAPI.os.info();\n';
    doc += 'console.log(hw.cpus, hw.platform);\n\n';
  }

  if (a.clipboard) {
    doc += '--- PRESSE PAPIERS ---\n';
    doc += 'await window.electronAPI.clipboard.write(\'Coucou\');\n';
    doc += 'const d = await window.electronAPI.clipboard.read();\n\n';
  }

  if(a.desktop) {
    doc += '--- CAPTURE D\'ÉCRAN ---\n';
    doc += 'const windows = await window.electronAPI.desktop.getSources();\\n';
    doc += 'console.log(\'Fenêtres ouvertes:\', windows);\n\n';
  }

  if(a.usb) {
    doc += '--- ACCÈS USB LIGNE SÉRIE ---\\n';
    doc += '=> Accès WebUSB et balises Navigator maintenant autorisé par défaut.\\n\\n';
  }

  if(a.inapp) {
    doc += '--- ACHATS MAC/WINDOWS ---\\n';
    doc += 'const canPay = await window.electronAPI.inapp.canMakePayments();\\n\\n';
  }

  if(a.contenttracing) {
    doc += '--- ANALYSE PERFORMANCE ---\\n';
    doc += 'await window.electronAPI.tracing.start();\\n\\n';
  }

  fs.writeFileSync(path.join(projectPath, 'DOCUMENTATION_APIS.txt'), doc, 'utf8');
}



function generateReadme({ appName, appDescription }) {
  return `# ${appName}

${appDescription || 'Application générée avec ElectronForge'}

## Comment lancer l'application

### Option 1 — Méthode simple (Windows)
Double-cliquez sur \`LANCER.bat\`

### Option 2 — Ligne de commande
\`\`\`bash
npm install
npm start
\`\`\`

---
*Généré avec ❤️ par ElectronForge*
`;
}

// ─── Fonctions d'Injection de Design (Barre de Titre) ────────────────────────

function injectTitleBar(htmlPath, appName, config, iconPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // 0. Injecter/Forcer le titre dans le <head>
  const titleTag = `  <title>${appName}</title>\n`;
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/i, titleTag);
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', titleTag + '</head>');
  }

  // 1. Injecter le CSS dans le <head>
  const cssLink = '  <link rel="stylesheet" href="../titlebar.css">\n';
  if (!html.includes('titlebar.css')) {
    html = html.replace('</head>', cssLink + '</head>');
  }

  // 2. Injecter le script du titre
  const jsLink = '  <script src="../titlebar.js"></script>\n</body>';
  if (!html.includes('titlebar.js')) {
    html = html.replace('</body>', jsLink);
  }

  // 3. Injecter l'HTML de la barre de titre au tout début du <body>
  const iconHtml = iconPath ? `<img src="../${iconPath}" class="tb-icon" alt="icon">` : '';
  const titleBarHtml = `
  <div class="custom-titlebar">
    <div class="tb-left">
      ${iconHtml}
      <span class="tb-title">${appName}</span>
    </div>
    <div class="tb-right">
      <button id="tb-min" class="tb-btn">&#xE921;</button>
      <button id="tb-max" class="tb-btn">&#xE922;</button>
      <button id="tb-close" class="tb-btn tb-btn-close">&#xE8BB;</button>
    </div>
  </div>\n`;

  if (!html.includes('custom-titlebar')) {
    html = html.replace(/<body[^>]*>/i, `$&${titleBarHtml}`);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
}

function generateTitleBarAssets(projectPath, customBar) {
  const cssPath = path.join(projectPath, 'titlebar.css');
  const jsPath = path.join(projectPath, 'titlebar.js');

  const css = `
.custom-titlebar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 30px;
  background: ${customBar.color || '#1e1e1e'};
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  z-index: 9999;
  font-family: "Segoe UI", sans-serif;
  user-select: none;
}
.tb-left {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.tb-icon {
  width: 16px; height: 16px; margin-right: 8px;
}
.tb-title {
  font-size: 12px;
}
.tb-right {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag;
}
.tb-btn {
  background: transparent;
  border: none;
  color: #fff;
  width: 46px;
  height: 100%;
  font-family: "Segoe MDL2 Assets";
  font-size: 10px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tb-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.tb-btn-close:hover {
  background: #e81123;
  color: #fff;
}
body {
  margin-top: 30px; /* Espace pour la barre */
}
`;

  const js = `
document.getElementById('tb-min').addEventListener('click', () => {
  window.electronAPI.minimize();
});
document.getElementById('tb-max').addEventListener('click', () => {
  window.electronAPI.maximize();
});
document.getElementById('tb-close').addEventListener('click', () => {
  window.electronAPI.close();
});
`;

  fs.writeFileSync(cssPath, css, 'utf8');
  fs.writeFileSync(jsPath, js, 'utf8');
}

function obfuscateProjectFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      obfuscateProjectFiles(fullPath);
    } else if (fullPath.endsWith('.js')) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
      });
      fs.writeFileSync(fullPath, obfuscationResult.getObfuscatedCode(), 'utf8');
    }
  }
}
