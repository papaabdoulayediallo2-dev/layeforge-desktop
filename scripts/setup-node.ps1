# Script d'installation de Node.js Portable pour LayeForge
$nodeVersion = "v20.11.1"
$url = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"
$destZip = "node.zip"
$parentDir = "bin"

if (-not (Test-Path $parentDir)) { 
    New-Item -ItemType Directory -Path $parentDir 
}

# Vérifier si déjà installé
if (Test-Path "$parentDir\node\node.exe") {
    Write-Host "Node.js portable est déjà installé dans $parentDir\node"
    exit
}

Write-Host ">>> Téléchargement de Node.js $nodeVersion (env. 30Mo)..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile "$parentDir\$destZip"

Write-Host ">>> Extraction des fichiers..." -ForegroundColor Cyan
Expand-Archive -Path "$parentDir\$destZip" -DestinationPath $parentDir -Force

Write-Host ">>> Configuration de l'environnement..." -ForegroundColor Green
# Trouver le dossier extrait (node-v20.11.1-win-x64)
$extractedDir = Get-ChildItem -Path $parentDir -Filter "node-v20.11.1-*" | Where-Object { $_.PSIsContainer } | Select-Object -First 1
if ($extractedDir) {
    Rename-Item -Path $extractedDir.FullName -NewName "node"
}

# Nettoyage
if (Test-Path "$parentDir\$destZip") { Remove-Item "$parentDir\$destZip" }

Write-Host "OK: Node.js portable est prêt dans $parentDir\node" -ForegroundColor Green
