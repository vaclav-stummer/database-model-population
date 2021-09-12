import { Table } from '../../'
import { getUnCreateableTables, getTableNameFromForeignKey } from '../'

export const validateCreateability = <T extends Table>(
  tablesToCreate: T[],
  createdTables: T[],
): void => {
  if (
    tablesToCreate.length > 0 &&
    tablesToCreate.length !== createdTables.length
  ) {
    const unCreateableTables = getUnCreateableTables(
      tablesToCreate,
      createdTables,
    )

    throw new Error(
      `Tables <${unCreateableTables.join(
        ', ',
      )}> are not createable, because they are depending each on other.`,
    )
  }
}

export const validateTableName = <T extends Table>(
  createdTables: T[],
  tableName: string,
): void => {
  const isDuplicate = createdTables.some(({ name }) => tableName === name)

  if (isDuplicate) {
    throw new Error(`Table with name <${tableName}> already exists.`)
  }
}

export const validateSelfDependency = <T extends Table>(
  foreignKeys: string[],
  table: T,
): void => {
  foreignKeys.forEach((key) => {
    const isSelfDepending = getTableNameFromForeignKey(key) === table.name

    if (isSelfDepending) {
      throw new Error(
        `Foreign key <${key}> in <${table.name}> is pointing for the table itself.`,
      )
    }
  })
}
