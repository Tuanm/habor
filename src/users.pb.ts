/// <reference path="../types/pocketbase.d.ts" />

interface UserMail {
    subject: string;
    type: MailTemplate;
}

routerAdd('POST', '/api/v2/users/request-mail', (c) => {
    const { email, template } = $apis.requestInfo(c).data as {
        email: string;
        template: string;
    };
    const mail = (
        {
            'verify-email': {
                subject: 'Verify your email',
                type: 'VERIFY_EMAIL',
            },
            'reset-password': {
                subject: 'Reset your password',
                type: 'RESET_PASSWORD',
            },
        } as {
            [template: string]: UserMail;
        }
    )[template];
    try {
        if (!mail) throw new Error();
        $app.dao().findAuthRecordByEmail('users', email);
        const { subject, type } = mail;
        const code = $security.randomStringWithAlphabet(6, '0123456789');
        $app.dao().saveRecord(
            new Record($app.dao().findCollectionByNameOrId('codes'), {
                email: email,
                code,
                type,
            }),
        );
        $http.send({
            method: 'POST',
            url: 'http://localhost:8090/api/v2/internal/mail/send',
            body: JSON.stringify({
                email,
                subject,
                template,
                data: {
                    code,
                },
            }),
        });
        return c.json(200, {
            code: 'succeeded',
            message: 'Mail has been sent successfully.',
        });
    } catch {
        return c.json(400, {
            code: 'mail_request_failed',
            message: 'Mail request could not be processed.',
        });
    }
});

routerAdd('POST', '/api/v2/users/register', (c) => {
    const data = {
        ...$apis.requestInfo(c).data,
        group: 'USER',
    } as User;
    const user = new Record($app.dao().findCollectionByNameOrId('users'));
    const form = new RecordUpsertForm($app, user);
    form.loadData({
        ...data,
        name: `${data.firstName} ${data.lastName}`,
    });
    form.submit();
    const saved = $app.dao().findAuthRecordByEmail('users', form.email);
    try {
        return c.json(201, {
            code: 'succeeded',
            message: 'Registered successfully.',
            data: {
                email: form.email,
                username: saved.username(),
            },
        });
    } finally {
        $http.send({
            method: 'POST',
            url: 'http://localhost:8090/api/v2/users/request-mail', // internal call
            body: JSON.stringify({
                email: form.email,
                template: 'verify-email',
            }),
        });
    }
});

routerAdd('POST', '/api/v2/users/verify-email', (c) => {
    const { email, code } = $apis.requestInfo(c).data as {
        email: string;
        code: string;
    };
    let verified = false;
    try {
        const user = $app.dao().findAuthRecordByEmail('users', email);
        if (user.verified()) {
            return c.json(400, {
                code: 'email_already_verified',
                message: 'Email has been already verified.',
            });
        }
        const record = new Record();
        $app.dao()
            .recordQuery('codes')
            .andWhere(
                $dbx.hashExp({
                    email,
                    code,
                    type: 'VERIFY_EMAIL',
                }),
            )
            .orderBy('created DESC')
            .one(record);
        const expiration = record.created.time().unix() + 10 * 60; // after 10 minutes
        const now = new DateTime().time().unix();
        if (expiration < now) throw new Error();
        user.setVerified(true);
        $app.dao().saveRecord(user);
        verified = true;
        return c.json(200, {
            code: 'succeeded',
            message: 'Verified successfully.',
            data: {
                user,
                token: $tokens.recordAuthToken($app, user),
            },
        });
    } catch {
        return c.json(400, {
            code: 'verification_failed',
            message: 'Provided email or code is invalid.',
        });
    } finally {
        if (verified) {
            $http.send({
                method: 'POST',
                url: 'http://localhost:8090/api/v2/internal/mail/send',
                body: JSON.stringify({
                    email,
                    template: 'verify-email-successfully',
                    subject: 'Your have verified your email',
                }),
            });
        }
    }
});

routerAdd('POST', '/api/v2/users/reset-password', (c) => {
    const { email, code, password, passwordConfirm } = $apis.requestInfo(c)
        .data as {
        email: string;
        code: string;
        password: string;
        passwordConfirm: string;
    };
    let passwordReset = false;
    try {
        const user = $app.dao().findAuthRecordByEmail('users', email);
        const record = new Record();
        $app.dao()
            .recordQuery('codes')
            .andWhere(
                $dbx.hashExp({
                    email,
                    code,
                    type: 'RESET_PASSWORD',
                }),
            )
            .orderBy('created DESC')
            .one(record);
        const expiration = record.created.time().unix() + 10 * 60; // after 10 minutes
        const now = new DateTime().time().unix();
        if (expiration < now) throw new Error();
        user.setPassword(password);
        $app.dao().saveRecord(user);
        passwordReset = true;
        return c.json(200, {
            code: 'succeeded',
            message: 'Password reset successfully.',
            data: {
                user,
                token: $tokens.recordAuthToken($app, user),
            },
        });
    } catch {
        return c.json(400, {
            code: 'password_reset_failed',
            message: 'Provided email or code is invalid.',
        });
    } finally {
        if (passwordReset) {
            $http.send({
                method: 'POST',
                url: 'http://localhost:8090/api/v2/internal/mail/send',
                body: JSON.stringify({
                    email,
                    template: 'reset-password-successfully',
                    subject: 'Your have reset your password',
                }),
            });
        }
    }
});

routerAdd('POST', '/api/v2/users/authenticate', (c) => {
    try {
        const { email, password } = $apis.requestInfo(c).data as {
            email: string;
            password: string;
        };
        const user = $app.dao().findAuthRecordByEmail('users', email);
        if (user.validatePassword(password)) {
            return c.json(200, {
                code: 'succeeded',
                message: 'Authenticated successfully.',
                data: {
                    user,
                    token: $tokens.recordAuthToken($app, user),
                },
            });
        }
    } catch {}
    return c.json(401, {
        code: 'authentication_failed',
        message: 'Provided email or password is incorrect.',
    });
});
