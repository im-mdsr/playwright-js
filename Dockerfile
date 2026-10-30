# Reproducible test run using the official Playwright image (browsers + OS deps preinstalled).
# Keep the image tag in sync with the @playwright/test version in package.json.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV CI=true

# Override the command to run a subset, e.g.: docker run --rm toolshop-tests npx playwright test --grep @smoke
CMD ["npm", "test"]
