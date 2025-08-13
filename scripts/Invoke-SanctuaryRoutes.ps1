param (
    [string]$PagesDir = "src/pages",
    [string]$RouterFile = "src/MainRouter.jsx"
)

# 📦 Récupère tous les composants
$components = Get-ChildItem -Path $PagesDir -Directory | Where-Object {
    Test-Path "$($_.FullName)/$($_.Name).jsx"
}

# 🧭 Génère les routes
$importLines = @()
$routeEntries = @()
$docLines = @()

foreach ($comp in $components) {
    $name = $comp.Name
    $importLines += "import { $name } from './pages';"
    $routeEntries += "  { path: '/$($name.ToLower())', element: <$name /> },"
    $docLines += "// 🛤️ Route '/$($name.ToLower())' mène à la strophe '$name'"
}

# 🧬 Assemble le fichier
$routerCode = @"
import { useRoutes } from 'react-router-dom';
$($importLines -join "`n")

export default function MainRouter() {
  const routes = useRoutes([
$routeEntries
  ]);

  return routes;
}

// 🌌 Routes générées automatiquement
$($docLines -join "`n")
"@

# 💾 Sauvegarde avec UTF-8 BOM
$routerCode | Out-File -FilePath $RouterFile -Encoding utf8
Write-Host "`n✅ Routes générées dans '$RouterFile'" -ForegroundColor Green