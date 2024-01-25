/// <reference path="../types/pocketbase.d.ts" />

routerAdd('POST', '/api/v2/admin/export-csv', (c) => {
    const { success, output } = JSON.parse(
        $http.send({
            method: 'POST',
            url: process.env.EXPORTER_SERVICE || 'http://localhost:8080',
            body: JSON.stringify($apis.requestInfo(c).data),
        }).raw,
    );
    if (!success) {
        return c.json(500, {
            code: 'export_operation_failed',
            message: 'Export operation failed.',
            detail: output,
        });
    }
    return c.blob(200, 'text/csv', output);
});
