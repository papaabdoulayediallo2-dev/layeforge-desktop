const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Contrôles fenêtre
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),

  // Fichiers
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectIcon: () => ipcRenderer.invoke('select-icon'),
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

  // Génération
  generateProject: (config) => ipcRenderer.invoke('generate-project', config),
  buildProject: (projectPath) => ipcRenderer.invoke('build-project', projectPath),

  // Événements
  onBuildLog: (callback) => ipcRenderer.on('build-log', (event, data) => callback(data)),

  // Historique & Utilitaires
  getHistory: () => ipcRenderer.invoke('get-history'),
  deleteHistoryItem: (projectPath) => ipcRenderer.invoke('delete-history-item', projectPath),
  openFolder: (path) => ipcRenderer.invoke('app-open-path', path)
});
