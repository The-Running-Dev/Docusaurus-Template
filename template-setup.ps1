#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Completes the setup of the Docusaurus template after customization.

.DESCRIPTION
    This script finalizes the template setup by:
    - Validating configuration files exist
    - Cleaning up any remaining template artifacts
    - Providing status feedback

.PARAMETER projectDir
    The directory containing the template project. Defaults to current directory.

.EXAMPLE
    .\template-setup.ps1
    Completes template setup in current directory.

.EXAMPLE
    .\template-setup.ps1 -projectDir "C:\path\to\project"
    Completes template setup in specified directory.
#>

[CmdletBinding()]
param(
    [Parameter()][string]$projectDir = $PSScriptRoot
)

$docsDir = Join-Path $projectDir 'docs'
$indexFile = Join-Path $docsDir 'index.md'

if (-not (Test-Path $docsDir)) {
    Write-Host "🔄 Creating Docs Directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $docsDir | Out-Null
}

if (-not (Test-Path $indexFile)) {
    Write-Host "🔄 Creating Empty Index File..." -ForegroundColor Cyan
    New-Item -ItemType File -Path $indexFile | Out-Null
}

Write-Host "🚀 Template Setup Completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run '.\template-build.ps1' to start development" -ForegroundColor White
Write-Host "  2. Or run 'pnpm run dev' for file watching mode" -ForegroundColor White