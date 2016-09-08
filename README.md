# ACL

[![Build Status](https://travis-ci.org/netiam/acl.svg)](https://travis-ci.org/netiam/acl)
[![Dependencies](https://david-dm.org/netiam/acl.svg)](https://david-dm.org/netiam/acl)
[![Code Climate](https://codeclimate.com/github/netiam/acl/badges/gpa.svg)](https://codeclimate.com/github/netiam/acl)

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

## Methods

Check if access is allowed for role with privilege.

```js
import acl from 'netiam-acl'
import rules from './acl.json'

acl.isAllowed(rules.resource, 'USER', 'R') // true
acl.isDenied(rules.resource, 'USER', 'R') // false
```

Filter given properties by role and privilege.

```js
import acl from 'netiam-acl'
import rules from './acl.json'

acl.filter(rules.attributes, ['email', 'password'], 'USER', 'R') // ['email']
```

Utility function to normalize ACL rules.

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
