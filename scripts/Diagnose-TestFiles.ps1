# Diagnose-TestFiles.ps1
# Analyse les fichiers de test pour détecter les erreurs courantes

$testFiles = Get-ChildItem -Recurse -Include *.test.jsx,*.test.js

Write-Host "🔍 Analyse des fichiers de test..." -ForegroundColor Cyan

foreach ($file in $testFiles) {
    $content = Get-Content $file.FullName -Raw
    $missing = @()

    # Vérifie les imports essentiels
    if ($content -notmatch 'import\s+\{\s*describe\s*,\s*it\s*,\s*expect\s*\}\s+from\s+[\'"]vitest[\'"]') {
        $missing += "❌ Import vitest manquant"
    }

    if ($content -notmatch 'import\s+\{\s*render\s*,\s*screen\s*\}\s+from\s+[\'"]@testing-library/react[\'"]') {
        $missing += "❌ Import testing-library/react manquant"
    }

    # Vérifie le nom du composant importé
    if ($content -match 'import\s+([^\s]+)\s+from\s+[\'"](.+)[\'"]') {
        $componentName = $matches[1]
        $componentPath = Resolve-Path -Path (Join-Path $file.DirectoryName $matches[2]) -ErrorAction SilentlyContinue
        if (-not $componentPath) {
            $missing += "❌ Composant '$componentName' introuvable à '$($matches[2])'"
        }
    } else {
        $missing += "❌ Import de composant invalide"
    }

    # Vérifie que le composant est utilisé dans JSX
    if ($componentName -and $content -notmatch "<$componentName\s*/?>") {
        $missing += "⚠️ Composant '$componentName' non utilisé dans JSX"
    }

    # Affiche le rapport
    if ($missing.Count -gt 0) {
        Write-Host "`n📄 $($file.Name)" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    } else {
        Write-Host "`n✅ $($file.Name) semble correct." -ForegroundColor Green
    }
}

Write-Host "`n🎯 Analyse terminée." -ForegroundColor Cyan