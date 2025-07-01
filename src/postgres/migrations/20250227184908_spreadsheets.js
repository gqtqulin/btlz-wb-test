/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {

    // для периодов
    await knex.schema.createTable('wb_tariff_periods', (table) => {
        table.increments('id').primary()
        table.date('dt_next_box').nullable()
        table.date('dt_till_max').nullable()
        table.timestamps(true, false); // created_at + updated_at
    });

    // склады
    await knex.schema.createTable('wb_warehouse_tariffs', (table) => {
        table.increments('id').primary();
        table.integer('period_id')
            .unsigned()
            .references('id')
            .inTable('wb_tariff_periods')
            .onDelete('CASCADE')
            .notNullable();

        table.text('warehouse_name').nullable();
        table.text('box_delivery_and_storage_expr').nullable();
        table.text('box_delivery_base').nullable();
        table.text('box_delivery_liter').nullable();
        table.text('box_storage_base').nullable();
        table.text('box_storage_liter').nullable();

        table.unique(['period_id', 'warehouse_name'], { useConstraint: true });
    });

    // await knex.schema.createTableIfNotExists('spreadsheets', (table) => {
    //     table.string('spreadsheet_id').primary();
    // )
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('wb_warehouse_tariffs');
    await knex.schema.dropTableIfExists('wb_tariff_periods');

    //await knex.schema.dropTableIfExists('spreadsheets');
}
