import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('playlist_id').unsigned().notNullable().references('playlists.id').onDelete('CASCADE')
      table.integer('order').unsigned().notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
