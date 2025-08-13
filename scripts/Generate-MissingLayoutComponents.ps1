# Mise à jour du registre src/components/index.js avec tri et commentaire
$indexPath = "src/components/index.js"
$exportLine = "export { default as $baseName } from './$baseName/$baseName';"

if (-not (Test-Path $indexPath)) {
    New-Item -ItemType File -Path $indexPath -Force | Out-Null
}

# Récupère les lignes existantes (hors commentaires)
$existingLines = Get-Content $indexPath | Where-Object { $_ -match '^export\s+\{.*\}\s+from\s+.*;$' }

# Ajoute la nouvelle ligne si absente
if (-not ($existingLines -contains $exportLine)) {
    $existingLines += $exportLine
    $sortedLines = $existingLines | Sort-Object

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $header = @(
        "// Index des composants générés automatiquement"
        "// Mis à jour le $timestamp"
        ""
    )

    $finalContent = $header + $sortedLines
    Set-Content -Path $indexPath -Value $finalContent

    Write-Host "Registre mis à jour : $baseName" -ForegroundColor Cyan
}