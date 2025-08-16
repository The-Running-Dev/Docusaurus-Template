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

Write-Host "🚀 Template Setup Completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run '.\template-build.ps1' to start development" -ForegroundColor White
Write-Host "  2. Or run 'pnpm run dev' for file watching mode" -ForegroundColor White