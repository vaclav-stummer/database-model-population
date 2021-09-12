import databaseSchema from '../data/in/database-schema.json'
import databaseSchemaUnCreatable from '../data/in/database-schema-un-creatable.json'

import { getCreatedTables } from '../utils'

describe('Table', () => {
  describe('getCreatedTables function', () => {
    const scenarios = [
      {
        name: 'should create all tables',
        origin: databaseSchema,
        result: [
          {
            name: 'users',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'fullname', foreign_key: null },
            ],
          },
          {
            name: 'clients',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'company_name', foreign_key: null },
            ],
          },
          {
            name: 'audit_log',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'logitem', foreign_key: null },
            ],
          },
          {
            name: 'invoices',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'amount', foreign_key: null },
              { name: 'created_by_user', foreign_key: 'users.id' },
              { name: 'receiving_client', foreign_key: 'clients.id' },
            ],
          },
          {
            name: 'payment_request',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'due_date', foreign_key: null },
              { name: 'created_by_user', foreign_key: 'users.id' },
            ],
          },
          {
            name: 'line_items',
            columns: [
              { name: 'id', foreign_key: null },
              { name: 'desciption', foreign_key: null },
              { name: 'belongs_to_invoice', foreign_key: 'invoices.id' },
            ],
          },
        ],
      },
      {
        name: "shouldn't create all tables, because of dependency",
        origin: databaseSchemaUnCreatable,
        result: [
          {
            columns: [
              {
                foreign_key: null,
                name: 'id',
              },
              {
                foreign_key: null,
                name: 'fullname',
              },
            ],
            name: 'users',
          },
          {
            columns: [
              {
                foreign_key: null,
                name: 'id',
              },
              {
                foreign_key: null,
                name: 'company_name',
              },
            ],
            name: 'clients',
          },
          {
            columns: [
              {
                foreign_key: null,
                name: 'id',
              },
              {
                foreign_key: null,
                name: 'logitem',
              },
            ],
            name: 'audit_log',
          },
          {
            columns: [
              {
                foreign_key: null,
                name: 'id',
              },
              {
                foreign_key: null,
                name: 'due_date',
              },
              {
                foreign_key: 'users.id',
                name: 'created_by_user',
              },
            ],
            name: 'payment_request',
          },
        ],
      },
    ]

    scenarios.forEach(({ name, origin, result }) => {
      it(name, () => {
        const createdTables = getCreatedTables([...origin])

        expect(createdTables).toEqual(result)
      })
    })
  })
})
