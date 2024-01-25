FROM oven/bun:1
WORKDIR /pb
COPY services/swagger/tsconfig.json ./
COPY services/swagger/package.json ./
COPY services/swagger/bun.lockb ./
RUN bun install --production
COPY services/swagger/index.ts ./
COPY services/swagger/common common
COPY services/swagger/hooks hooks
ENTRYPOINT bun run index.ts