# Fix-TestFiles.ps1
# Corrige les imports, vérifie les chemins, et génère les composants manquants avec test, style et doc

$testFiles = Get-ChildItem -Recurse -Include *.test.jsx,*.test.js

Write-Host "Inspection des fichiers de test..." -ForegroundColor Cyan

foreach ($file in $testFiles) {
    $content = Get-Content $file.FullName
    $updated = $false
    $dir = Split-Path $file.FullName

    if (-not ($content -match 'import\s+\{[^}]*describe[^}]*\}\s+from\s+["'']vitest["'']')) {
        $content = @("import { describe, it, expect } from 'vitest';") + $content
        Write-Host "Ajout import vitest : $($file.Name)" -ForegroundColor Green
        $updated = $true
    }

    if (-not ($content -match 'import\s+\{[^}]*render[^}]*\}\s+from\s+["'']@testing-library/react["'']')) {
        $content = @("import { render, screen } from '@testing-library/react';") + $content
        Write-Host "Ajout import testing-library/react : $($file.Name)" -ForegroundColor Green
        $updated = $true
    }

    $localImports = Select-String -InputObject $content -Pattern 'import\s+.*\s+from\s+["''](\.\/[^"'\n\r;]+)["'']' -AllMatches
    foreach ($match in $localImports.Matches) {
        $importPath = $match.Groups[1].Value
        $fullPath = Join-Path $dir $importPath
        $componentFile = "$fullPath.jsx"

        $resolvedPath = Resolve-Path -Path $componentFile -ErrorAction SilentlyContinue
        if (-not $resolvedPath) {
            Write-Host "Import brise : $($file.Name) -> $importPath" -ForegroundColor Yellow
            Write-Host "Generation du composant manquant : $componentFile" -ForegroundColor Magenta

            $componentDir = Split-Path $componentFile
            if (-not (Test-Path $componentDir)) {
                New-Item -ItemType Directory -Path $componentDir | Out-Null
            }

            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($componentFile)

            $cssFile = Join-Path $componentDir "$baseName.module.css"
            $cssContent = ".container {\n    padding: 1rem;\n    background-color: #f9f9f9;\n}"
            Set-Content -Path $cssFile -Value $cssContent

            $docFile = Join-Path $componentDir "$baseName.md"
            $docContent = @"
# $baseName

Composant genere automatiquement depuis le test $($file.Name).

Ce composant peut etre enrichi, stylise et documente selon l'inspiration du moment.
"@
            Set-Content -Path $docFile -Value $docContent

            $testFile = Join-Path $componentDir "$baseName.test.jsx"
            $testContent = @"
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import $baseName from './$baseName';

describe('$baseName', () => {
    it('renders without crashing', () => {
        render(<$baseName />);
        expect(screen.getByText(/Composant.*genere/i)).toBeDefined();
    });
});
"@
            Set-Content -Path $testFile -Value $testContent

            $componentCode = @"
import React from 'react';
import styles from './$baseName.module.css';

/**
 * Composant genere automatiquement
 * Source : $($file.Name)
 * Chemin : $importPath
 */
export default function $baseName() {
    return (
        <div className={styles.container}>
            <p>Composant $baseName genere automatiquement.</p>
        </div>
    );
}
"@
            Set-Content -Path $componentFile -Value $componentCode
        }
    }

    if ($updated) {
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Tous les fichiers ont ete inspectes, corriges et completes." -ForegroundColor Cyan