param(
  [string]$Root = ".",
  [switch]$DryRun,
  [switch]$NoBackup
)

$ErrorActionPreference = "Stop"

# --- Helpers ---
function Read-Text($path) {
  if (-not (Test-Path $path)) { return "" }
  $content = Get-Content -LiteralPath $path -Raw -ErrorAction SilentlyContinue
  if ($null -eq $content) { return "" }
  return $content
}

function Write-Text($path, $text) {
  if (-not $NoBackup) {
    $bak = "$path.bak"
    if (-not (Test-Path $bak)) { Copy-Item -LiteralPath $path -Destination $bak -Force }
  }
  Set-Content -LiteralPath $path -Value $text -Encoding UTF8
}

function Print-Change($file, $msg) {
  Write-Host ("→ " + $file + " : " + $msg)
}

$rootPath = (Resolve-Path $Root).Path
$srcPath  = Join-Path $rootPath "src"
$mainPath = Join-Path $srcPath  "main.jsx"

if (-not (Test-Path $srcPath)) {
  Write-Error "Dossier src introuvable: $srcPath"
  exit 1
}

# Tags de Router à retirer
$routerTags     = @("BrowserRouter","HashRouter","MemoryRouter","Router","RouterProvider")
$openTagPattern = "<\s*({0})\b[^>]*>" -f ($routerTags -join "|")
$closeTagPattern= "</\s*({0})\s*>" -f ($routerTags -join "|")

# --- Étape 1: nettoyage dans tous les fichiers sauf main.jsx ---
$files = Get-ChildItem -Path $srcPath -Recurse -File -Include *.jsx,*.tsx,*.js |
         Where-Object { $_.FullName -ne $mainPath }

foreach ($f in $files) {
  $text = Read-Text $f.FullName
  if ([string]::IsNullOrEmpty($text)) { continue }
  $changed = $false

  # 1) Supprimer balises <Router>
  $new = [regex]::Replace($text, $openTagPattern, "", "IgnoreCase")
  $new = [regex]::Replace($new,  $closeTagPattern, "", "IgnoreCase")
  if ($new -ne $text) {
    $text    = $new
    $changed = $true
  }

  # 2) Nettoyer les imports de react-router-dom
  $lines         = $text -split "`r?`n"
  $reactRouters  = @("BrowserRouter","HashRouter","MemoryRouter","Router","RouterProvider")
  $updatedLines  = @()
  $importChanged = $false

  foreach ($line in $lines) {
    if ($line -match '^\s*import\s*\{([^}]+)\}\s*from\s*["'']react-router-dom["'']\s*;?\s*$') {
      $spec   = $matches[1]
      $names  = $spec.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
      $kept   = @()
      foreach ($n in $names) {
        $base = ($n -replace '\s+as\s+\w+$','')
        if ($reactRouters -notcontains $base) { $kept += $n }
      }
      if ($kept.Count -gt 0) {
        # Interpolation plutôt que -f
        $importList = $kept -join ", "
        $newline    = "import { $importList } from 'react-router-dom';"
        if ($newline -ne $line) { $importChanged = $true }
        $updatedLines += $newline
      } else {
        # Plus rien à importer → ligne supprimée
        $importChanged = $true
      }
    } else {
      $updatedLines += $line
    }
  }

  if ($importChanged) {
    $text    = $updatedLines -join "`n"
    $changed = $true
  }

  if ($changed) {
    if ($DryRun) {
      Print-Change $f.FullName "nettoyage routers + imports (simulation)"
    } else {
      Write-Text $f.FullName $text
      Print-Change $f.FullName "nettoyage routers + imports"
    }
  }
}

# --- Étape 2: garantir un seul Router dans main.jsx ---
if (-not (Test-Path $mainPath)) {
  Write-Warning "main.jsx introuvable."
  exit 0
}

$main = Read-Text $mainPath
if ([string]::IsNullOrEmpty($main)) {
  Write-Warning "main.jsx vide."
  exit 0
}

$hasRouterProvider = $main -match "<\s*RouterProvider\b"
$hasAnyRouter      = $main -match "<\s*(BrowserRouter|HashRouter|MemoryRouter|Router)\b"

if (-not $hasRouterProvider -and -not $hasAnyRouter) {
  # 1) Import BrowserRouter si absent
  if ($main -notmatch 'from\s*["'']react-router-dom["'']') {
    $main = "import { BrowserRouter } from 'react-router-dom';`n$main"
  } elseif ($main -match '^\s*import\s*\{([^}]+)\}\s*from\s*["'']react-router-dom["'']') {
    $specs = $matches[1].Split(",") | ForEach-Object { $_.Trim() }
    if ($specs -notcontains "BrowserRouter") {
      $specs = @("BrowserRouter") + $specs
      $main  = [regex]::Replace(
        $main,
        '^\s*import\s*\{([^}]+)\}\s*from\s*["'']react-router-dom["'']',
        "import { $($specs -join ', ') } from 'react-router-dom';",
        'IgnoreCase,Multiline'
      )
    }
  }

  # 2) Wrap <App /> dans <BrowserRouter>
  if ($main -match "<App\b([^>]*)/>") {
    $main = [regex]::Replace(
      $main,
      "<App\b([^>]*)/>",
      "<BrowserRouter><App`$1/></BrowserRouter>",
      "IgnoreCase"
    )
  } elseif ($main -match "<App\b([^>]*)>[\s\S]*?</App>") {
    $main = [regex]::Replace(
      $main,
      "<App\b([^>]*)>",
      "<BrowserRouter><App`$1>",
      "IgnoreCase"
    )
    $main = [regex]::Replace(
      $main,
      "</App>",
      "</App></BrowserRouter>",
      "IgnoreCase"
    )
  }
}

if ($DryRun) {
  Print-Change $mainPath "mise à jour main.jsx (simulation)"
} else {
  Write-Text $mainPath $main
  Print-Change $mainPath "mise à jour main.jsx"
}

Write-Host "✅ Terminé."