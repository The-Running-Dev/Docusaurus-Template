#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Quick development server launcher for Docusaurus Template.

.DESCRIPTION
    This script provides a quick way to start the Docusaurus development server
    with the following modes:
    - Default: Standard development server
    - Watch: File watching mode with automatic config reload
    - Docker: Development server configured for Docker container

.PARAMETER Mode
    The development mode to use:
    - 'standard' (default): Basic development server
    - 'watch': Development server with config file watching
    - 'docker': Development server for Docker environment

.EXAMPLE
    .\dev.ps1
    Starts standard development server

.EXAMPLE
    .\dev.ps1 -Mode watch
    Starts development server with config file watching

.EXAMPLE
    .\dev.ps1 -Mode docker
    Starts development server for Docker environment
#>

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet('standard', 'watch', 'docker')]
    [string]$Mode = 'watch'
)

Clear-Host

Write-Host "🚀 Starting Development Server" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow

switch ($Mode) {
    'standard' {
        Write-Host "Starting Development Server..." -ForegroundColor Green
        
        & pnpm start
    }
    'watch' {
        Write-Host "Starting Development Server with Config Watching..." -ForegroundColor Green
        
        & pnpm run dev:with-api
    }
    'docker' {
        Write-Host "Starting Development Server for Docker..." -ForegroundColor Green
        
        & pnpm run start:docker
    }
}
