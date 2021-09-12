import databaseSchema from './data/in/original.json'

import { writeTables, getInitializeDatabase } from './lib'

export type Table = typeof databaseSchema[0]

/* App execution */
console.time('getInitializeDatabase')
const createdTables = getInitializeDatabase(databaseSchema)
console.timeEnd('getInitializeDatabase')

const sortedTableNames = createdTables.map(({ name }) => name)

console.info('sortedTableNames', sortedTableNames)

writeTables(sortedTableNames, './src/data/out/created-tables.json')
