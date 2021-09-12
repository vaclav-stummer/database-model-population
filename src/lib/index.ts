const fs = require('fs')

import { Table } from '..'

import {
  validateTableName,
  validateSelfDependency,
  validateCreateability,
} from './validation'

/* Tables  */
export const getTableNameFromForeignKey = (key: string): string =>
  key.split('.')[0]

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
    const relatedTableName = getTableNameFromForeignKey(key)

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

export const getUnCreateableTables = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[],
): string[] =>
  tablesToCreate
    .filter(
      (tableItemToCreate) =>
        !createdTables.some(
          (createdItem) => createdItem.name === tableItemToCreate.name,
        ),
    )
    .map(({ name }) => name)

const getCreatedTables = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[] = [],
): T[] => {
  let innerCreatedTables = [...createdTables]

  for (const table of tablesToCreate) {
    validateTableName(innerCreatedTables, table.name)

    const foreignKeys = table.columns.reduce(
      (collectedForeignKeys, { foreign_key }) =>
        foreign_key
          ? [...collectedForeignKeys, foreign_key]
          : collectedForeignKeys,
      [] as string[],
    )
    const hasForeignKey = foreignKeys.length

    validateSelfDependency(foreignKeys, table)

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
