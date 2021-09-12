import databaseSchema from './data/in/database-schema.json'

import { writeTables, getInitializeDatabase } from './utils'

export type Table = typeof databaseSchema[0]

/* App execution */
console.time('getInitializeDatabase')
const createdTables = getInitializeDatabase(databaseSchema)
console.timeEnd('getInitializeDatabase')

const sortedTableNames = createdTables.map(({ name }) => name)

console.log('sortedTableNames', sortedTableNames)

writeTables(sortedTableNames, './src/data/out/created-tables.json')
