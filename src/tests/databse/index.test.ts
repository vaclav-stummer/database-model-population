/* Data in */
import databaseSchema from '../../data/in/original.json'
import databaseSchemaWithMutualDependency from '../../data/in/mutual-dependency.json'
import databaseSchemaWithSameName from '../../data/in/same-name.json'
import databaseSchemaReferringToItself from '../../data/in/referring-to-itself.json'

/* Test results */
import correctlySorted from './correctly-sorted.json'

import { getInitializeDatabase } from '../../lib'

describe('Database', () => {
  describe('getInitializeDatabase function', () => {
    test.each([
      {
        name: 'should create all tables',
        origin: databaseSchema,
        result: correctlySorted,
      },
      {
        name: "shouldn't create 4 of 6 tables, because of mutual dependency of two tables",
        origin: databaseSchemaWithMutualDependency,
        result:
          'Tables <line_items, invoices> are not createable, because they are depending each on other.',
      },
      {
        name: 'should return empty array',
        origin: [],
        result: [],
      },
      {
        name: "shouldn't have multiple tables with same name",
        origin: databaseSchemaWithSameName,
        result: 'Table with name <users> already exists.',
      },
      {
        name: "shouldn't be referring to itself",
        origin: databaseSchemaReferringToItself,
        result:
          'Foreign key <audit_log.id> in <audit_log> is pointing for the table itself.',
      },
    ])('$name', ({ origin, result }) => {
      try {
        const createdTables = getInitializeDatabase(origin)

        expect(createdTables).toEqual(result)
      } catch (error) {
        const expectedError = () => {
          throw new Error(`${error.message}`)
        }

        expect(expectedError).toThrow(`${result}`)
      }
    })
  })
})
