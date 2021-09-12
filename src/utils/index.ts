const fs = require('fs')

import { TableToCreate, CreatedTable } from '../'

/* Tables  */
export const createTables = async (
  tablesToCreate: TableToCreate[],
  createdTables: CreatedTable & { order: number }[],
): Promise<void> => {
  for (const table of tablesToCreate) {
    const hasForeignKey = table.columns.some((column) => column.foreign_key)

    /* Tables WITHOUT foreign keys */
    if (!hasForeignKey) {
      createdTables.push({ ...table, order: createdTables.length + 1 })

      console.info(`Table ${table.name} was created.`)
      continue
    }

    /* Tables WITH foreign keys */
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
      continue
    }
  }

  const shouldRunAgain = tablesToCreate.length > createdTables.length

  tablesToCreate = tablesToCreate.filter((itemToCreate) => {
    const condition = !createdTables.some(
      (createdItem) => createdItem.name === itemToCreate.name,
    )

    return condition
  })

  if (shouldRunAgain) {
    createTables(tablesToCreate, createdTables)
  }
}

/* File structure handling */
export const writeTables = async <T>(
  data: T[],
  path: string,
): Promise<void> => {
  await fs.writeFile(path, JSON.stringify(data), function (error: string) {
    if (error) throw error
  })
}
