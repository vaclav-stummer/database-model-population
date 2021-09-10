const fs = require('fs')

import databaseSchema from './database-schema.json'

const sortedTables = [...databaseSchema].sort((a, b) => {
  const aForeignKeysCount = a.columns.reduce((count, column) => {
    if (column.foreign_key) count++

    return count
  }, 0)
  const bForeignKeysCount = b.columns.reduce((count, column) => {
    if (column.foreign_key) count++

    return count
  }, 0)

  return aForeignKeysCount - bForeignKeysCount
})

let tablesToCreate = [...sortedTables]
const createdTables: typeof tablesToCreate & { order: number }[] = []

const createTables = async () => {
  for (const table of tablesToCreate) {
    const hasForeignKey = table.columns.some((column) => column.foreign_key)

    if (!hasForeignKey) {
      createdTables.push({ ...table, order: createdTables.length + 1 })

      console.info(`Table ${table.name} was created.`)
    } else {
      const foreignKeys = table.columns.reduce(
        (acc, { foreign_key }) => (foreign_key ? [...acc, foreign_key] : acc),
        [] as string[],
      )
      const createdTablesNames = createdTables.map(({ name }) => name)
      const isCreatable = foreignKeys.every((key) => {
        const relatedTableName = key.split('.')[0]

        return createdTablesNames.includes(relatedTableName)
      })

      if (isCreatable) {
        createdTables.push({ ...table, order: createdTables.length + 1 })

        console.info(`Table ${table.name} was created.`)
      }
    }
  }

  const shouldRunAgain = sortedTables.length > createdTables.length

  tablesToCreate = tablesToCreate.filter((itemToCreate) => {
    const condition = !createdTables.some(
      (createdItem) => createdItem.name === itemToCreate.name,
    )

    return condition
  })

  if (shouldRunAgain) {
    createTables()
  }
}

console.time('createTables')
createTables()
console.timeEnd('createTables')

const writeTables = async () => {
  await fs.writeFile(
    './src/created-tables.json',
    JSON.stringify(createdTables),
    function (error: string) {
      if (error) throw error
    },
  )
}

writeTables()
