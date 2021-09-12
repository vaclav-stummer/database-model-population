import databaseSchema from '../data/in/database-schema.json'

import { CreatedTable } from '..'
import { createTables } from '../utils'

describe('Table', () => {
  it('createTables function', () => {
    const expectedResult = [
      {
        name: 'users',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'fullname', foreign_key: null },
        ],
        order: 1,
      },
      {
        name: 'clients',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'company_name', foreign_key: null },
        ],
        order: 2,
      },
      {
        name: 'audit_log',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'logitem', foreign_key: null },
        ],
        order: 3,
      },
      {
        name: 'invoices',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'amount', foreign_key: null },
          { name: 'created_by_user', foreign_key: 'users.id' },
          { name: 'receiving_client', foreign_key: 'clients.id' },
        ],
        order: 4,
      },
      {
        name: 'payment_request',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'due_date', foreign_key: null },
          { name: 'created_by_user', foreign_key: 'users.id' },
        ],
        order: 5,
      },
      {
        name: 'line_items',
        columns: [
          { name: 'id', foreign_key: null },
          { name: 'desciption', foreign_key: null },
          { name: 'belongs_to_invoice', foreign_key: 'invoices.id' },
        ],
        order: 6,
      },
    ]

    const createdTables: CreatedTable & { order: number }[] = []

    createTables([...databaseSchema], createdTables)

    expect(createdTables).toEqual(expectedResult)
  })
})
