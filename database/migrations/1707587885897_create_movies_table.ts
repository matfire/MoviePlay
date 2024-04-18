import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tmdb_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.integer('playlist_id').unsigned().notNullable().references('playlists.id').onDelete('CASCADE')
      table.integer('order').unsigned().notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
