# Database Model Population

# Description

This program (library):
1.Takes database schema (_.json_) as:

```json
[

...

{
    "name": "payment_request",
    "columns": [
      {
        "name": "id",
        "foreign_key": null
      },
      {
        "name": "due_date",
        "foreign_key": null
      },
      {
        "name": "created_by_user",
        "foreign_key": "users.id"
      }
    ]
  },

...

]
```

2. Validate it, according the foreign keys. For each foreign key in given table, related table needs to be created first. If table can't be created:<br />

- because of mutual dependency
- table with the same name already exists
- foreign is referring to table itself

  Throws an error
  <br />

3. If schema is creatable result is generated in _src/data/out/created-tables.json_ as array of table names in which schema can be created.

## Requirements

- [Node JS 14.x.x](https://nodejs.org/en/)
- [npm 6.x.x](https://docs.npmjs.com/cli/v6)

## Scripts

- `dev` - starts local development server with hot reloading
- `start` - starts server
- `type-check` - type check
- `prettier` - helper config command for `prettier:format`
- `prettier:format` - formats code
- `lint` - linter check
- `lint:fix` - fixes fixable linter issues
- `test:unit` - runs all unit tests and displays tests coverage
- `test:unit:watch` - runs all unit tests in watch mode and displays tests coverage
- `node-engine-check` - checks the _node_ & _npm_ versions
