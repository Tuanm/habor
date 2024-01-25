/// <reference path="../../../types/bun.d.ts" />

import { Context } from 'elysia';

export class PocketBase {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async handle(c: Context) {
        const url = this.baseUrl + new URL(c.request.url).pathname;
        const res = await fetch(url, {
            ...c.request,
            body: JSON.stringify(c.body),
            headers: c.headers,
            method: c.request.method,
        });
        c.set.status = res.status;
        return res.json();
    }
}
