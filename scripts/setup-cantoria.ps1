# Définition des composants
$structure = @{
  "spiritual" = @("SanctuaryMap", "SpiritualReflection", "SacredQuote", "PoeticCalculator")
  "media"     = @("AudioPlayer", "ImageGallery", "VideoFrame", "MediaUploader")
}

# Création des dossiers principaux
$basePath = "src/components"
$testPath = "tests"

New-Item -Path $basePath -ItemType Directory -Force | Out-Null
New-Item -Path $testPath -ItemType Directory -Force | Out-Null

foreach ($category in $structure.Keys) {
  $folderPath = "$basePath/$category"
  New-Item -Path $folderPath -ItemType Directory -Force | Out-Null

  foreach ($component in $structure[$category]) {
    $componentPath = "$folderPath/$component"

    # Créer le dossier du composant
    New-Item -Path $componentPath -ItemType Directory -Force | Out-Null

    # Fichiers JSX, CSS
    New-Item -Path "$componentPath/$component.jsx" -ItemType File -Force | Out-Null
    New-Item -Path "$componentPath/$component.css" -ItemType File -Force | Out-Null

    # Fichier de documentation
    $docPath = "$componentPath/$component.md"
    $docContent = @"
# $component

## 📛 Description
Composant **$component** situé dans `components/$category/`.  
Il participe à l’expérience ${category -eq "spiritual" ? "spirituelle" : "médiatique"} du projet Cantoria.

## ⚙️ Props
À définir selon les besoins du composant.

## 🧪 Tests suggérés
- Vérifier le rendu visuel
- Tester les interactions utilisateur
- Simuler les données entrantes

## ✨ Enrichissements possibles
- Ajouter des animations ou effets visuels
- Connecter à Firestore pour du contenu dynamique
- Intégrer des éléments poétiques ou sacrés

## 📁 Fichiers sources
- `$component.jsx`
- `$component.css`
"@
    Set-Content -Path $docPath -Value $docContent

    # Fichier de test
    $testFile = "$testPath/test_$component.test.js"
    $testContent = @"
// Test de base pour le composant $component
describe('$component', () => {
  it('devrait s’afficher correctement', () => {
    // TODO: Implémenter le test
  });
});
"@
    Set-Content -Path $testFile -Value $testContent
  }
}

# Message final
Write-Host "`n✅ Projet Cantoria initialisé avec succès !"
Write-Host "🕊️ Que ton code soit clair, ton esprit inspiré, et ton interface lumineuse."