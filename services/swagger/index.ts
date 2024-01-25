/// <reference path="../../types/bun.d.ts" />

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

import { configService, pocketBase } from '@/common/config';
import hooks from '@/hooks';

new Elysia()
    .use(
        swagger({
            path: '/v2/swagger',
            documentation: {
                info: {
                    title: 'Documentation',
                    version: '2.0',
                },
            },
        }),
    )
    .group('/api/v2/users', (app) =>
        app
            .post('register', pocketBase.handle, hooks.users.register)
            .post('authenticate', pocketBase.handle, hooks.users.authenticate)
            .post('verify-email', pocketBase.handle, hooks.users.verifyEmail)
            .post(
                'reset-password',
                pocketBase.handle,
                hooks.users.resetPassword,
            )
            .post('request-mail', pocketBase.handle, hooks.users.requestMail),
    )
    .listen(configService.server.port);
