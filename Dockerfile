FROM node:18-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages ./packages
COPY scripts ./scripts
# Copying .git might be needed for some scripts or git-based operations
COPY .git ./.git

# Install dependencies
RUN yarn install --ignore-scripts --frozen-lockfile

COPY solution.patch .
COPY test.patch .

# Apply patches
RUN git apply solution.patch
RUN git apply test.patch

# Run the specific test
CMD ["node", "./scripts/jest/jest-cli.js", "packages/react-dom/src/__tests__/ReactDOMTitleActivity-test.js"]
