import _ from 'lodash'
import resource from './resource'
import {
  WILDCARD,
  ALLOW,
  DENY,
  PRIV_READ
} from './constants'
import {
  hierarchy
} from './role'

export default function acl(spec) {
  const {settings} = spec
  const {roles} = spec
  let o = {}

  if (!settings) {
    throw new Error('You must provide ACL "settings"')
  }

  if (!roles) {
    throw new Error('You must provide a "roles" option')
  }

  /**
   * Get all keys from resource and settings
   * @returns {[String]}
   */
  function keys(resource) {
    let fields = []

    if (settings.fields && _.isObject(settings.fields)) {
      fields = fields.concat(Object.keys(settings.fields))
    }

    return Object
      .keys(resource)
      .concat(fields)
      .sort()
  }

  /**
   * Get all keys which a possible population
   * @returns {Object}
   */
  function refs() {
    const paths = {}

    if (settings.fields) {
      _.forEach(settings.fields, function(field, key) {
        if (field.ref) {
          paths[key] = field.ref
        }
      })
    }

    return paths
  }

  /**
   * Check path for allowed keys, can also handle wildcard entries
   * @param {[String]} allKeys
   * @param {String} modelPath
   * @param {String} type
   * @param {Object} role
   * @param {String} role.name
   * @param {String} privilege
   * @returns {[String]}
   */
  function path(allKeys, modelPath, type, role, privilege) {
    if (settings.fields.hasOwnProperty(modelPath)) {
      if (settings.fields[modelPath].hasOwnProperty(type)) {
        if (settings.fields[modelPath][type][role.name] &&
          settings.fields[modelPath][type][role.name].indexOf(privilege) !== -1
        ) {
          if (modelPath === WILDCARD) {
            return allKeys
          }
          return [modelPath]
        }
      }
    }

    return []
  }

  /**
   * Get allowed keys for a specific role
   * @param {Document} user
   * @param {Object} resource
   * @param {Object} role
   * @param {Boolean} role.superuser
   * @param {String} [privilege='R']
   * @param {Array} [asserts=[]]
   * @returns {[String]} A list of allowed keys for given collection
   */
  function allowedForRole(user, resource, role, privilege, asserts) {
    role = roles.get(role)
    const allKeys = keys(resource)

    let allowedKeys = []
    let deniedKeys = []

    // return all keys for superuser
    if (role.superuser === true) {
      return allKeys
    }

    // ALLOW wildcard
    allowedKeys = allowedKeys.concat(
      path(allKeys, WILDCARD, ALLOW, role, privilege)
    )

    // ALLOW statements
    allKeys.forEach(function(key) {
      allowedKeys = allowedKeys.concat(
        path(allKeys, key, ALLOW, role, privilege)
      )
    })

    // asserts
    asserts.forEach(function(assert) {
      allowedKeys = allowedKeys.concat(
        assert(user, o, resource, role, privilege)
      )
    })

    // ALLOW wildcard
    deniedKeys = deniedKeys.concat(
      path(allKeys, WILDCARD, DENY, role, privilege)
    )

    // DENY statements
    allKeys.forEach(function(key) {
      deniedKeys = deniedKeys.concat(
        path(allKeys, key, DENY, role, privilege)
      )
    })

    return _.uniq(
      _.difference(allowedKeys, deniedKeys)
    )
  }

  /**
   * Get allowed keys for given resource
   * @param {Document} user
   * @param {Document} resource
   * @param {String|Object} role
   * @param {String} [privilege='R']
   * @param {Array} [asserts=[]]
   * @returns {[String]} A list of allowed keys for given collection
   */
  function allowed(user, resource, role, privilege = PRIV_READ, asserts = []) {
    role = roles.get(role)
    const roleHierarchy = hierarchy(roles, role).reverse()
    let allowedKeys = []

    if (!_.isArray(asserts)) {
      asserts = [asserts]
    }

    asserts.forEach(function(assert) {
      allowedKeys = allowedKeys.concat(
        assert(user, o, resource, role, privilege))
    })

    roleHierarchy.forEach(function(r) {
      allowedKeys = allowedKeys.concat(
        allowedForRole(user, resource, r, privilege, asserts))
    })

    return allowedKeys
  }

  /**
   * Test whether a given parameter is of type object and has a constructor
   * of ObjectID
   * @param {*} obj
   * @returns {Boolean}
   */
  function isObjectID(obj) {
    return _.isObject(obj) && obj.constructor.name === 'ObjectID'
  }

  /**
   * Filters a resource object by ACL
   * @param {Document} user
   * @param {Document} resource
   * @param {Document} role
   * @param {String} [privilege='R']
   * @param {Array} [asserts=[]]
   * @returns {Object}
   */
  function filter(user, resource, role, privilege = PRIV_READ, asserts = []) {
    const data = _.pick(
      resource,
      allowed(
        user,
        resource,
        role,
        privilege,
        asserts
      )
    )

    // filter in populated paths
    const allRefs = refs()
    _.forEach(allRefs, function(ref, path) {
      const subacl = acl({settings: ref})

      if (_.isArray(data[path]) && data[path].length > 0) {
        data[path] = data[path].map(function(nestedResource) {
          // HACK Check for ObjectID objects -> lean does not convert them to String
          if (isObjectID(nestedResource)) {
            return nestedResource.toHexString()
          }

          if (_.isObject(nestedResource)) {
            return subacl.filter(user, nestedResource, role, privilege, asserts)
          }

          return nestedResource
        })
        return
      }

      // HACK Check for ObjectID objects -> lean does not convert them to String
      if (isObjectID(data[path])) {
        data[path] = data[path].toHexString()
        return
      }

      if (_.isObject(data[path])) {
        data[path] = subacl.filter(user, data[path], role, privilege, asserts)
      }
    })

    return data
  }

  o.settings = settings
  o.allowed = allowed
  o.filter = filter
  o.resource = resource

  return Object.freeze(o)
}
