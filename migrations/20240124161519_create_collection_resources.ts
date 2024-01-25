/// <reference path="../types/pocketbase.d.ts" />

migrate((db) => {
    const collection = new Collection({
        name: 'resources',
        type: 'base',
    });

    collection.indexes.push(
        'CREATE UNIQUE INDEX `resources_shorten_unique` ON `resources` (`shorten`)',
    );

    collection.schema.addField(
        new SchemaField({
            name: 'shorten',
            type: 'text',
        }),
    );

    collection.schema.addField(
        new SchemaField({
            name: 'type',
            type: 'select',
            required: true,
            options: {
                maxSelect: 1,
                values: ['FILE', 'LINK'] as ResourceType[],
            },
        }),
    );

    collection.schema.addField(
        new SchemaField({
            name: 'file',
            type: 'file',
            options: {
                maxSelect: 1,
                maxSize: 10485760, // 10MiB
            },
        }),
    );

    collection.schema.addField(
        new SchemaField({
            name: 'link',
            type: 'url',
        }),
    );

    collection.schema.addField(
        new SchemaField({
            name: 'password',
            type: 'text',
        }),
    );

    return new Dao(db).saveCollection(collection);
});
