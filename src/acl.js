import assert from 'assert'
import isObject from 'lodash/isObject'
import has from 'lodash/has'
import get from 'lodash/get'
import pull from 'lodash/pull'

export const PRIV_CREATE = 'C'
export const PRIV_READ = 'R'
export const PRIV_UPDATE = 'U'
export const PRIV_DELETE = 'D'

export const ALLOW = 'ALLOW'
export const DENY = 'DENY'

export const WILDCARD = '*'

/**
 * Normalize ACL structure
 *
 * ```
 * acl = {
   *   asserts: {},
   *   transforms: {},
   *   resource: {},
   *   attributes: {},
   *   relationships: {}
   * }
 * ```
 *
 * @param {object} acl
 * @returns {object}
 */
function normalize(acl) {
  if (!isObject(acl.asserts)) {
    acl.asserts = {}
  }

  if (!isObject(acl.transforms)) {
    acl.transforms = {}
  }

  if (!isObject(acl.resource)) {
    acl.resource = {}
  }

  if (!isObject(acl.attributes)) {
    acl.attributes = {}
  }

  if (!isObject(acl.relationships)) {
    acl.relationships = {}
  }

  return acl
}

/**
 * Creates a flat list of the full role hierarchy
 *
 * Example:
 *
 * ```
 * user
 *  |- editor
 *   |- manager
 * ```
 *
 * equals
 *
 * ```js
 * ['user', 'editor', 'manager']
 * ```
 *
 * @param {Object} role You request this roles hierarchy (`role.parent.parent`)
 * @param {Object|null} role.parent
 * @return {Array} Flat list of roles, order is granularity:descending
 */
function hierarchy(role) {
  if (!isObject(role)) {
    return []
  }
  const roles = [role]
  if (role.parent) {
    const parents = hierarchy(role.parent)
    roles.push(...parents)
  }
  return roles
}

/**
 * Check if role has access on resource w/ given privilege. If the role has
 * parents, the allow check will continue until an explicit ALLOW/DENY is
 * found or the end of the hierarchy has been reached.
 *
 * @param {Object} resource
 * @param {Object} role
 * @param {string} privilege
 * @returns {boolean}
 */
function isAllowed(resource, role, privilege) {
  assert.ok(resource)
  assert.ok(role)
  assert.ok(privilege)

  const roles = hierarchy(role)

  while (roles.length > 0) {
    role = roles.pop()

    // DENY
    if (has(resource, `${DENY}.${role.name}`)) {
      const privileges = get(resource, `${DENY}.${role.name}`)
      if (privileges.includes(privilege)) {
        return false
      }
    }

    // ALLOW
    if (has(resource, `${ALLOW}.${role.name}`)) {
      const privileges = get(resource, `${ALLOW}.${role.name}`)
      if (privileges.includes(privilege)) {
        return true
      }
    }
  }

  return false
}

/**
 * Convenience method. Inverts `acl.isAllowed`.
 *
 * @see isAllowed
 * @param {Object} resource
 * @param {Object} role
 * @param {string} privilege
 * @returns {boolean}
 */
function isDenied(resource, role, privilege) {
  return !isAllowed(resource, role, privilege)
}

/**
 * Whether a property of a specific object is of type ALLOW, DENY or undefined
 *
 * Precedence is as follows:
 * 1. direct DENY lookup for property returns DENY
 * 2. direct ALLOW lookup for property returns ALLOW
 * 3. wildcard DENY lookup for property returns DENY
 * 4. wildcard ALLOW lookup for property returns ALLOW
 * 5. otherwise undefined
 *
 * @param {Object} o The object that contains the property
 * @param {string} name The name of the property
 * @param {Object} role The role to check the privilege against
 * @param {string} privilege The privilege
 * @returns {'ALLOW'|'DENY'|undefined} Returns undefined if no rule is found
 */
function propertyType(o, name, role, privilege) {
  assert.ok(o)
  assert.ok(name)
  assert.ok(role)
  assert.ok(privilege)

  // DENY
  if (has(o, `${name}.${DENY}.${role.name}`)) {
    const privileges = get(o, `${name}.${DENY}.${role.name}`)
    if (privileges.includes(privilege)) {
      return DENY
    }
  }

  // ALLOW
  if (has(o, `${name}.${ALLOW}.${role.name}`)) {
    const privileges = get(o, `${name}.${ALLOW}.${role.name}`)
    if (privileges.includes(privilege)) {
      return ALLOW
    }
  }

  // WILDCARD DENY
  if (has(o, `${WILDCARD}.${DENY}.${role.name}`)) {
    const privileges = get(o, `${WILDCARD}.${DENY}.${role.name}`)
    if (privileges.includes(privilege)) {
      return DENY
    }
  }

  // WILDCARD ALLOW
  if (has(o, `${WILDCARD}.${ALLOW}.${role.name}`)) {
    const privileges = get(o, `${WILDCARD}.${ALLOW}.${role.name}`)
    if (privileges.includes(privilege)) {
      return ALLOW
    }
  }

  // do nothing
  return undefined
}

/**
 * Returns a list of allowed properties for a set of given properties
 *
 * @param {Object} o
 * @param {Array.<string>} properties List of property names, e.g. ['name', 'email', …]
 * @param {Object} role
 * @param {String} privilege One of C, R, U and D
 * @returns {Array.<string>} The filtered list, e.g. ['name']
 */
function filter(o, properties, role, privilege) {
  const roles = hierarchy(role)
  const keys = []
  while (roles.length > 0) {
    role = roles.pop()

    const allowed = []
    const denied = []
    properties.forEach(key => {
      const type = propertyType(o, key, role, privilege)
      if (type === DENY) {
        denied.push(key)
      } else if (type === ALLOW) {
        allowed.push(key)
      }
    })
    keys.push(...allowed)
    pull(keys, ...denied)
  }
  return keys
}

export default Object.freeze({
  filter,
  isAllowed,
  isDenied,
  normalize
})

// Ember, suck this!
module.exports.filter = filter
module.exports.isAllowed = isAllowed
module.exports.isDenied = isDenied
module.exports.normalize = normalize
