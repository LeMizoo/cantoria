param (
    [Parameter(Mandatory=$true)]
    [string]$PageName
)

$baseDir = "src/pages/$PageName"
$componentFile = "$baseDir/$PageName.jsx"
$testFile = "$baseDir/$PageName.test.jsx"
$styleFile = "$baseDir/$PageName.module.css"
$docFile = "$baseDir/$PageName.md"
$indexPath = "src/pages/index.js"

# Crée le dossier
if (-not (Test-Path $baseDir)) {
    New-Item -ItemType Directory -Path $baseDir | Out-Null
}

# Composant
$componentCode = @"
import React from 'react';
import styles from './$PageName.module.css';

export default function $PageName() {
    return (
        <div className={styles.container}>
            <h1>$PageName</h1>
            <p>Cette page est une strophe dans le sanctuaire de Cantoria.</p>
        </div>
    );
}
"@
Set-Content -Path $componentFile -Value $componentCode

# Style
$styleCode = ".container {\n    padding: 2rem;\n    font-family: 'Cantoria';\n}"
Set-Content -Path $styleFile -Value $styleCode

# Test
$testCode = @"
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import $PageName from './$PageName';

describe('$PageName', () => {
    it('renders the page title', () => {
        render(<$PageName />);
        expect(screen.getByText('$PageName')).toBeDefined();
    });
});
"@
Set-Content -Path $testFile -Value $testCode

# Documentation
$docCode = @"
# $PageName

Cette page représente une strophe dans le sanctuaire de Cantoria-Vite.

Elle peut accueillir des vers, des icônes, des prières ou des composants inspirés.
"@
Set-Content -Path $docFile -Value $docCode

# Index
$exportLine = "export { default as $PageName } from './$PageName/$PageName';"
if (-not (Test-Path $indexPath)) {
    New-Item -ItemType File -Path $indexPath -Force | Out-Null
}
$indexContent = Get-Content $indexPath
if (-not ($indexContent -contains $exportLine)) {
    $indexContent += $exportLine
    $sorted = $indexContent | Sort-Object
    Set-Content -Path $indexPath -Value $sorted
    Write-Host "Page ajoutée au registre : $PageName" -ForegroundColor Cyan
}

Write-Host "`nPage '$PageName' générée avec succès." -ForegroundColor Green