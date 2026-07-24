---
id: deployment
title: Deployment
sidebar_position: 3
---

## Release Workflow

The repository release workflow combines two outputs in a single run:

1. Build the Docusaurus site and deploy it to GitHub Pages.
2. Build and publish the `docs-template` container image to GitHub Container Registry.

The workflow lives in `.github/workflows/release.yml` and runs on pull requests to `main`, `push` to `main`, and `workflow_dispatch`.

### GitHub Pages

1. Update `static/CNAME` with your domain if needed.
2. Configure GitHub Pages in repository settings.
3. Open a pull request to `main`, push to `main`, or run the Release workflow manually.

The `build` job:

- runs inside `ghcr.io/the-running-dev/build-agent:latest`
- installs dependencies
- runs `pnpm run quality-ci`
- runs `pnpm run build:prod`
- runs `build docker` inside the build-agent environment
- uploads the Pages artifact from `artifacts/`

The `deploy` job then publishes the built site to GitHub Pages on push or manual runs.

## Container Registry

The same release workflow publishes the template container image to GitHub Container Registry.

- Image: `ghcr.io/the-running-dev/docs-template`
- Publication is handled internally by the build-agent's `build docker` command on push or manual runs.
- The workflow grants `packages: write` so the build job can push the image.

### Other Platforms

Build the site with `pnpm run build:prod` and deploy the `artifacts/` directory to your hosting provider.
