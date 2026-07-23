& docker run `
    -it `
    -e DOCKER_HOST=tcp://host.docker.internal:2375 `
    -v .:/workspace `
    ghcr.io/the-running-dev/build-agent:latest `
    build docker