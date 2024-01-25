/// <reference path="../types/pocketbase.d.ts" />

routerAdd('GET', '/v2/swagger', (c) => {
    return c.html(
        200,
        $http.send({
            url:
                (process.env.SWAGGER_SERVICE || 'http://localhost:8080') +
                '/v2/swagger',
        }).raw,
    );
});

routerAdd('GET', '/v2/swagger/json', (c) => {
    return c.json(
        200,
        $http.send({
            url:
                (process.env.SWAGGER_SERVICE || 'http://localhost:8080') +
                '/v2/swagger/json',
        }).json,
    );
});
