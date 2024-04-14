import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import libsql from "@libsql/knex-libsql"

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: libsql,
      connection: {
        filename: `${env.get("DATABASE_URL")}?authToken=${env.get("DATABASE_TOKEN")}`,
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
