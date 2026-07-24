# Use the official lightweight Node.js image.
FROM node:alpine

# Install pnpm tsx globally
RUN npm install -g pnpm tsx

# Create and change to the template directory.
WORKDIR /template

# Copy package files first for better Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the source code into the container.
COPY . ./

# Do not ship template docs in the base image so downstream projects can provide
# their own docs without inherited sample content.
RUN rm -rf /template/docs

# Expose port 3000
EXPOSE 3000

# Run the web service on container startup.
# Use start:docker which binds to 0.0.0.0, making it accessible from outside the container
CMD ["sh", "-c", "pnpm run start:docker"]
