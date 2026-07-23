<#[
.SYNOPSIS
    Runs the docs-template image with local Documentation overrides using a temp workspace.
.DESCRIPTION
    This script prepares a temporary workspace under $env:TEMP, seeds it with the image's
    /template content, then overlays local Documentation files. The container is run with a
    single bind mount to the temp workspace to avoid polluting the local repo while still
    allowing quick local testing.

    The script also maps port 3000 for local access and creates an anonymous volume for
    'node_modules' to prevent local dependencies from overwriting the container's own modules.
.EXAMPLE
    ./docs-image.ps1
    # This command copies the image template into a temp folder, overlays local
    # Documentation, and starts the Docusaurus development server at http://localhost:3000.
#>
[CmdletBinding()]
param()

Clear-Host

# --- Configuration ---
$imageName = "ghcr.io/the-running-dev/docs-template:latest"
$imageTemplatePath = "/template"
$localPath = $PSScriptRoot
$localDocsPath = Join-Path $localPath "documentation"

# --- Function Definition ---

function Copy-ImageTemplateToTemp {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$imageName,
        [Parameter(Mandatory)][string]$pathTemplate,
        [Parameter(Mandatory)][string]$destinationPath
    )

    Write-Host "[INFO] Seeding Temp Workspace from $imageName..." -ForegroundColor Cyan
    Write-Host "[DEBUG] Creating container from image..." -ForegroundColor Gray

    $containerId = ""
    try {
        $containerId = (docker create $imageName)
        Write-Host "[DEBUG] Container created: $containerId" -ForegroundColor Gray

        if (-not $containerId) {
            throw "Failed to Create Container from $imageName"
        }

        if (-not (Test-Path $destinationPath)) {
            Write-Host "[DEBUG] Creating destination directory: $destinationPath" -ForegroundColor Gray
            New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
        }

        Write-Host "[DEBUG] Copying from container ${containerId}:${pathTemplate} to $destinationPath (this may take a while)..." -ForegroundColor Gray
        docker cp "${containerId}:${pathTemplate}/." "$destinationPath"
        Write-Host "[DEBUG] Docker cp completed" -ForegroundColor Gray
        Write-Host "[OK] Template Copied to Temp Workspace." -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to Seed Temp Workspace from $imageName. Ensure Docker is Running and the Image is Available."

        throw
    }
    finally {
        if ($containerId) {
            Write-Host "[DEBUG] Removing temporary container: $containerId" -ForegroundColor Gray
            docker rm -f $containerId | Out-Null
        }
    }
}

function Copy-LocalOverrides {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$sourcePath,
        [Parameter(Mandatory)][string]$destinationPath
    )

    if (-not (Test-Path $sourcePath)) {
        Write-Warning "[WARN] Local Documentation Path not Found: $sourcePath"
        
        return
    }

    Write-Host "[INFO] Overlaying Local Documentation into Temp Workspace..." -ForegroundColor Cyan
    Write-Host "[DEBUG] Copying from $sourcePath to $destinationPath" -ForegroundColor Gray
    
    try {
        Copy-Item -Path (Join-Path $sourcePath "*") -Destination $destinationPath -Recurse -Force -ErrorAction Stop
        Write-Host "[DEBUG] Copy completed successfully" -ForegroundColor Gray
    }
    catch {
        throw "Failed to copy local documentation: $_"
    }

    Write-Host "[OK] Local Documentation Overlay Complete." -ForegroundColor Green
}

# --- Main Script Logic ---

# 1. Prepare temp workspace
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("docs-image-" + [Guid]::NewGuid().ToString("N"))
$tempTemplatePath = Join-Path $tempRoot "template"

Write-Host "[INFO] Creating Temp Workspace at: $tempRoot" -ForegroundColor Cyan
Write-Host "[DEBUG] Template path: $tempTemplatePath" -ForegroundColor Gray
New-Item -ItemType Directory -Path $tempTemplatePath -Force | Out-Null
Write-Host "[DEBUG] Temp directories created" -ForegroundColor Gray

try {
    Copy-ImageTemplateToTemp -imageName $imageName -pathTemplate $imageTemplatePath -destinationPath $tempTemplatePath
    Copy-LocalOverrides -sourcePath $localDocsPath -destinationPath $tempTemplatePath
}
catch {
    Write-Error $_
    exit 1
}

# 2. Construct the final Docker command.
$dockerArgs = @(
    "run",
    "--rm",
    "-p", "3000:3000", # Separate the flag from the value
    "-it"
)
$dockerArgs += "--mount", ("type=bind,source={0},target={1}" -f $tempTemplatePath, $imageTemplatePath)
$dockerArgs += "--mount", "type=volume,target=/template/node_modules" # Anonymous volume to protect node_modules
$dockerArgs += $imageName
$dockerArgs += "pnpm", "exec", "docusaurus", "start", "--host", "0.0.0.0", "--port", "3000"

# 3. Execute the command.
Write-Host "[INFO] Starting Container with Temp Workspace Mount..." -ForegroundColor Cyan
Write-Host ""
Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host "[CONTAINER LOG] Docusaurus Development Server Starting..." -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Cyan
Write-Host ""

try {
    $url = "http://localhost:3000"
    $browserJob = Start-Job -ScriptBlock {
        param($targetUrl)
        $maxAttempts = 120
        for ($i = 0; $i -lt $maxAttempts; $i++) {
            try {
                $response = Invoke-WebRequest -Uri $targetUrl -UseBasicParsing -Method Get -TimeoutSec 2
                if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                    Start-Process $targetUrl
                    return
                }
            }
            catch {
                Start-Sleep -Seconds 2
            }
        }
    } -ArgumentList $url

    & docker @dockerArgs

    if ($LASTEXITCODE -ne 0) {
        throw "Docker Exited with Code $LASTEXITCODE"
    }
}
catch {
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor Red
    Write-Host "[ERROR] Container Failed to Start or Exited Unexpectedly" -ForegroundColor Red
    Write-Host ("=" * 80) -ForegroundColor Red
    throw
}
finally {
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor Yellow
    Write-Host "[INFO] Container Stopped. Cleaning Up Temp Workspace..." -ForegroundColor Yellow
    Write-Host ("=" * 80) -ForegroundColor Yellow
    
    if (Test-Path $tempRoot) {
        Write-Host "[DEBUG] Temp Workspace: $tempRoot" -ForegroundColor Gray
        Remove-Item $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "[OK] Temp Workspace Cleaned Up" -ForegroundColor Green
    }

    if ($browserJob) {
        Stop-Job -Job $browserJob -ErrorAction SilentlyContinue
        Remove-Job -Job $browserJob -ErrorAction SilentlyContinue
    }

    if ($browserJob) {
        Stop-Job -Job $browserJob -ErrorAction SilentlyContinue
        Remove-Job -Job $browserJob -ErrorAction SilentlyContinue
    }

}