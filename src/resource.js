import {
  PRIV_READ,
  WILDCARD,
  ALLOW,
  DENY
} from './constants'

export default function(acl, role, privilege = PRIV_READ) {
  const {resource} = acl

  if (!resource) {
    return false
  }

  if (!resource[ALLOW]) {
    return false
  }

  let isAllowed = false

  // wildcard allow
  if (resource[ALLOW] && resource[ALLOW][WILDCARD]) {
    if (resource[ALLOW][WILDCARD].includes(privilege)) {
      isAllowed = true
    }
  }

  // allow
  if (resource[ALLOW] && resource[ALLOW][role.name]) {
    if (resource[ALLOW][role.name].includes(privilege)) {
      isAllowed = true
    }
  }

  // wildcard deny
  if (resource[DENY] && resource[DENY][WILDCARD]) {
    if (resource[DENY][WILDCARD].includes(privilege)) {
      isAllowed = false
    }
  }

  // deny
  if (resource[DENY] && resource[DENY][role.name]) {
    if (resource[DENY][role.name].includes(privilege)) {
      isAllowed = false
    }
  }

  return isAllowed
}
