FROM oven/bun:1
RUN apt update && \
    apt install sqlite3 -y && \
    apt clean
WORKDIR /pb
COPY services/exporter/index.ts ./
ENTRYPOINT bun run index.ts