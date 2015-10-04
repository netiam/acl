export function hierarchy(roles, role) {
  if (!role) {
    return []
  }

  if (!role.parent) {
    return [role]
  }

  return [role].concat(hierarchy(role.parent))
}
