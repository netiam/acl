# ACL

[![Build Status](https://travis-ci.org/netiam/acl.svg)](https://travis-ci.org/netiam/acl)
[![Dependencies](https://david-dm.org/netiam/acl.svg)](https://david-dm.org/netiam/acl)
[![Test Coverage](https://codeclimate.com/github/netiam/acl/badges/coverage.svg)](https://codeclimate.com/github/netiam/acl/coverage)

> An ACL library w/ basic tests

## Get it

```bash
npm i netiam-acl
```

## How it works

With this library you can do classical resource/role/privilege checks.

> Is user with role *EDITOR* allowed to *READ* resource *DASHBOARD*

The lib supports inheritance for roles but you must provide the hierarchy in
this format.

```js
const user = {name: 'USER'}
const editor = {name: 'EDITOR', parent: user}
const admin = {name: 'ADMIN'}
```

The library do also support property filtering. You can define attributes and/or
relationships that should be filtered by privileges.

## Usage

#### `acl.isAllowed(rules, role, privilege)`
Check if access is allowed for role with privilege.

*Arguments*
* `rules`: A set of CRUD rules
* `role`: A role object, e.g. `{name: 'USER'}`
* `privilege`: One of `C`, `R`, `U`, `D`,

*Example*
```js
import acl from 'netiam-acl'
import rules from './acl.json'

acl.isAllowed(rules.resource, user, 'R') // true
acl.isDenied(rules.resource, user, 'R') // false
```

*******

#### `acl.filter(rules, properties, role, privilege)`
Use this to filter properties by role and privilege. Be careful with the first
parameter. It takes a hash of rules and not a complete ACL structure.

The second parameter is a list of all possible property names. You can use
something like `Object.keys(rules)` but this is not sufficient in all cases.
If you use wildcards extensively, the `filter` method might never know the full
list of property names and will therefore return just the names of the defined
ACL attributes.

If you use ACLs to filter a database result(-set) you might use your model
definition to get all property names.

*Example*
```json
// rules.json
{
  "*": {
    "ALLOW": {
      "ADMIN": "CRUD"
    },
    "DENY": {
      "GUEST": "CRUD"
    }
  },
  "name": {
    "ALLOW": {
      "GUEST": "CR",
      "USER": "R"
    }
  }
}
```

```js
import acl from 'netiam-acl'
import rules from './rules.json'

acl.filter(rules, ['email', 'password'], user, 'R') // ['email']
```

*******

#### `acl.normalize(ruleset)`
Utility function to normalize ACL rules.

*Example*
```js
import acl from 'netiam-acl'

acl.normalize({}) // {assets: {}, transforms: {}, resource: {}, attributes: {}, relationships: {}}
```

## Constants

```js
import {
  PRIV_CREATE,
  PRIV_READ,
  PRIV_UPDATE,
  PRIV_DELETE,
  
  ALLOW,
  DENY,
  
  WILDCARD
} from 'netiam-acl'
```

## ACL Full Example (acl.json)

```json
{
  "asserts": {},
  "transforms": {},
  "resource": {
    "ALLOW": {
      "ADMIN": "CRUD",
      "GUEST": "CR",
      "USER": "CRU"
    }
  },
  "attributes": {
    "*": {
      "ALLOW": {
        "ADMIN": "CRUD"
      },
      "DENY": {
        "GUEST": "CRUD"
      }
    },
    "email": {
      "ALLOW": {
        "USER": "R"
      }
    },
    "username": {
      "ALLOW": {
        "OWNER": "RU",
        "USER": "R"
      },
      "DENY": {
        "ADMIN": "U"
      }
    }
  },
  "relationships": {
    "profile": {
      "ALLOW": {
        "OWNER": "RU"
      }
    },
    "projects": {
      "ALLOW": {
        "OWNER": "RU",
        "USER": "R"
      }
    },
    "campaigns": {
      "ALLOW": {
        "OWNER": "RU"
      }
    }
  }
}
```
