/// <reference path="../../../types/bun.d.ts" />

import { InputSchema, LocalHook, t } from 'elysia';

type Hook = LocalHook<InputSchema<never>>;

export const register: Hook = {
    body: t.Object({
        email: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        phoneNumber: t.String(),
        password: t.String(),
        passwordConfirm: t.String(),
    }),
    response: {
        200: t.Object({
            code: t.Optional(t.String()),
            message: t.String(),
            data: t.Object({
                email: t.String(),
            }),
        }),
        400: t.Object({
            code: t.Optional(t.Number()),
            message: t.String(),
            data: t.Object({}),
        }),
    },
};

export const authenticate: Hook = {
    body: t.Object({
        email: t.String(),
        password: t.String(),
    }),
    response: {
        200: t.Object({
            code: t.String(),
            message: t.String(),
            data: t.Object({
                user: t.Object({
                    email: t.String(),
                    firstName: t.String(),
                    lastName: t.String(),
                    phoneNumber: t.String(),
                    group: t.String(),
                    verified: t.Boolean(),
                    activated: t.Boolean(),
                }),
                token: t.String(),
            }),
        }),
        401: t.Object({
            code: t.String(),
            message: t.String(),
            data: t.Optional(t.Any()),
        }),
    },
};

export const verifyEmail: Hook = {
    body: t.Object({
        email: t.String(),
        code: t.String(),
    }),
    response: {
        200: t.Object({
            code: t.String(),
            message: t.String(),
            data: t.Object({
                user: t.Object({
                    email: t.String(),
                    firstName: t.String(),
                    lastName: t.String(),
                    phoneNumber: t.String(),
                    group: t.String(),
                    verified: t.Boolean(),
                    activated: t.Boolean(),
                }),
                token: t.String(),
            }),
        }),
        400: t.Object({
            code: t.String(),
            message: t.String(),
        }),
    },
};

export const resetPassword: Hook = {
    body: t.Object({
        email: t.String(),
        code: t.String(),
        password: t.String(),
        passwordConfirm: t.String(),
    }),
    response: {
        200: t.Object({
            code: t.String(),
            message: t.String(),
            data: t.Object({
                user: t.Object({
                    email: t.String(),
                    firstName: t.String(),
                    lastName: t.String(),
                    phoneNumber: t.String(),
                    group: t.String(),
                    verified: t.Boolean(),
                    activated: t.Boolean(),
                }),
                token: t.String(),
            }),
        }),
        400: t.Object({
            code: t.String(),
            message: t.String(),
        }),
    },
};

export const requestMail: Hook = {
    body: t.Object({
        email: t.String(),
        template: t.String(),
    }),
    response: {
        200: t.Object({
            code: t.String(),
            message: t.String(),
        }),
        400: t.Object({
            code: t.String(),
            message: t.String(),
        }),
    },
};
