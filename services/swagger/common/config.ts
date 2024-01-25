/// <reference path="../../../types/bun.d.ts" />

import { PocketBase } from '@/common/pocketbase';

export const configService = {
    server: {
        port: Bun.env.SWAGGER_PORT || 8080,
    },
};

export const pocketBase = new PocketBase(
    Bun.env.PB_SERVICE || 'http://localhost:8090',
);
