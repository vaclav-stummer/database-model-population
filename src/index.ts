import databaseSchema from './data/in/database-schema.json'

import { writeTables, createTables } from './utils'

const tablesToCreate = [...databaseSchema]

export type TableToCreate = typeof tablesToCreate[0]
export type CreatedTable = typeof tablesToCreate & { order: number }[]

const createdTables: CreatedTable = []

/* App execution */
console.time('createTables')
createTables(tablesToCreate, createdTables)
console.timeEnd('createTables')

writeTables(createdTables, './src/data/out/created-tables.json')
