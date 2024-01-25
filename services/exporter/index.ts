/// <reference path="../../types/bun.d.ts" />

/**
 * Executes a read-only query to the `pb_data/data.db` database.
 *
 * @param query the query.
 * @returns an object that contains the output of the query execution in CSV format.
 */
function exportAsCsv(query: string) {
    const { success, stdout, stderr } = Bun.spawnSync({
        cmd: [
            'sqlite3',
            '-readonly',
            '-header',
            '-csv',
            'pb_data/data.db',
            query,
        ],
    });
    return {
        success,
        output: (success ? stdout : stderr).toString(),
    };
}

Bun.serve({
    port: process.env.EXPORTER_PORT || 8080,
    async fetch(request: Request) {
        const { query } = await request.json();
        const response = new Response(JSON.stringify(exportAsCsv(query)));
        response.headers.set('Content-Type', 'application/json');
        return response;
    },
});
