/// <reference path="../types/pocketbase.d.ts" />

routerAdd('GET', '/api/v2/resources/:id', (c) => {
    const id = c.pathParam('id');
    const record = new Record();
    $app.dao()
        .recordQuery('resources')
        .andWhere(
            $dbx.hashExp({
                id,
            }),
        )
        .orWhere(
            $dbx.hashExp({
                shorten: id,
            }),
        )
        .orderBy('created DESC')
        .one(record);
    const password = record.get('password');
    if (password && password !== c.queryParam('token')) {
        throw new UnauthorizedError();
    }
    const type: ResourceType = record.get('type');
    if (type === 'FILE' && record.get('file')) {
        const fileName = record.get('file');
        const { statusCode, headers, raw } = $http.send({
            method: 'GET',
            url: `http://localhost:8090/api/files/resources/${record.getId()}/${fileName}`, // internal call
        });
        return c.blob(statusCode, headers['Content-Type'].join(';'), raw);
    }
    if (type === 'LINK' && record.get('link')) {
        return c.redirect(301, record.get('link'));
    }
    throw new NotFoundError();
});
