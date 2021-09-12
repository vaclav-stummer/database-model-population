const fs = require('fs')

import { Table } from '../'

/* Tables  */
const createTable = <T extends Table>(originTable: T, createdTables: T[]) => {
  const newCreatedTable = [...createdTables, { ...originTable }]

  console.info(`Table ${originTable.name} was created.`)

  return newCreatedTable
}

const getIsCreateable = <T extends Table>(
  originTable: T,
  createdTables: T[],
) => {
  const foreignKeys = originTable.columns.reduce(
    (acc, { foreign_key }) => (foreign_key ? [...acc, foreign_key] : acc),
    [] as string[],
  )
  const createdTablesNames = createdTables.map(({ name }) => name)
  const isCreatable = foreignKeys.every((key) => {
    const relatedTableName = key.split('.')[0]

    return createdTablesNames.includes(relatedTableName)
  })

  return isCreatable
}

const getRestTablesToCreate = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[],
) =>
  tablesToCreate.filter((itemToCreate) => {
    const wasCreated = !createdTables.some(
      (createdItem) => createdItem.name === itemToCreate.name,
    )

    return wasCreated
  })

const getUnCreateableTables = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[],
) =>
  tablesToCreate
    .filter(
      (tableItemToCreate) =>
        !createdTables.some(
          (createdItem) => createdItem.name === tableItemToCreate.name,
        ),
    )
    .map(({ name }) => name)

const validateCreateability = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[],
) => {
  if (
    tablesToCreate.length > 0 &&
    tablesToCreate.length !== createdTables.length
  ) {
    const unCreateableTables = getUnCreateableTables(
      tablesToCreate,
      createdTables,
    )

    throw new Error(
      `Tables ${unCreateableTables.join(
        ', ',
      )} are not createable, because they are depending each on other.`,
    )
  }
}

export const getCreatedTables = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[] = [],
): T[] => {
  let innerCreatedTables = createdTables

  for (const table of tablesToCreate) {
    const hasForeignKey = table.columns.some((column) => column.foreign_key)

    /* Tables WITHOUT foreign keys */
    if (!hasForeignKey) {
      innerCreatedTables = createTable(table, innerCreatedTables)

      continue
    }

    /* Tables WITH foreign keys */
    const isCreatable = getIsCreateable(table, innerCreatedTables)

    if (isCreatable) {
      innerCreatedTables = createTable(table, innerCreatedTables)

      continue
    }
  }

  const shouldRunAgain = tablesToCreate.length > createdTables.length
  const restOfTablesToCreate = getRestTablesToCreate(
    tablesToCreate,
    innerCreatedTables,
  )

  if (shouldRunAgain) {
    return getCreatedTables(restOfTablesToCreate, innerCreatedTables)
  }

  return innerCreatedTables
}

export const getInitializeDatabase = <T extends Table>(
  tablesOriginal: T[],
): T[] => {
  const tablesToCreate = [...tablesOriginal]
  const createdTables = getCreatedTables(tablesToCreate)

  validateCreateability(tablesToCreate, createdTables)

  return createdTables
}

/* File structure handling */
export const writeTables = async <T>(
  data: T[],
  path: string,
): Promise<void> => {
  await fs.writeFile(path, JSON.stringify(data), (error: string) => {
    if (error) throw error
  })
}
