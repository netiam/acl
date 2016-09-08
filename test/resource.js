import acl, {
  PRIV_CREATE,
  PRIV_READ,
  PRIV_UPDATE,
  PRIV_DELETE
} from '../src/acl'
import privileges from './fixtures/resource.acl.json'

describe('netiam-contrib', () => {
  describe('ACL - resource', () => {

    const guest = {name: 'GUEST'}
    const user = {name: 'USER'}
    const owner = {
      name: 'OWNER',
      parent: user
    }
    const admin = {name: 'ADMIN'}

    it('isAllowed for guest:create', () => {
      acl
        .isAllowed(privileges.resource, guest, PRIV_CREATE)
        .should.eql(false)
    })

    it('isAllowed for guest:read', () => {
      acl
        .isAllowed(privileges.resource, guest, PRIV_READ)
        .should.eql(false)
    })

    it('isAllowed for guest:update', () => {
      acl
        .isAllowed(privileges.resource, guest, PRIV_UPDATE)
        .should.eql(false)
    })

    it('isAllowed for guest:delete', () => {
      acl
        .isAllowed(privileges.resource, guest, PRIV_DELETE)
        .should.eql(false)
    })

    it('isAllowed for user:create', () => {
      acl
        .isAllowed(privileges.resource, user, PRIV_CREATE)
        .should.eql(true)
    })

    it('isAllowed for user:read', () => {
      acl
        .isAllowed(privileges.resource, user, PRIV_READ)
        .should.eql(true)
    })

    it('isAllowed for user:update', () => {
      acl
        .isAllowed(privileges.resource, user, PRIV_UPDATE)
        .should.eql(false)
    })

    it('isAllowed for user:delete', () => {
      acl
        .isAllowed(privileges.resource, user, PRIV_DELETE)
        .should.eql(false)
    })

    it('isAllowed for owner:create', () => {
      acl
        .isAllowed(privileges.resource, owner, PRIV_CREATE)
        .should.eql(true)
    })

    it('isAllowed for owner:read', () => {
      acl
        .isAllowed(privileges.resource, owner, PRIV_READ)
        .should.eql(true)
    })

    it('isAllowed for owner:update', () => {
      acl
        .isAllowed(privileges.resource, owner, PRIV_UPDATE)
        .should.eql(true)
    })

    it('isAllowed for owner:delete', () => {
      acl
        .isAllowed(privileges.resource, owner, PRIV_DELETE)
        .should.eql(true)
    })

    it('isAllowed for admin:create', () => {
      acl
        .isAllowed(privileges.resource, admin, PRIV_CREATE)
        .should.eql(true)
    })

    it('isAllowed for admin:read', () => {
      acl
        .isAllowed(privileges.resource, admin, PRIV_READ)
        .should.eql(true)
    })

    it('isAllowed for admin:update', () => {
      acl
        .isAllowed(privileges.resource, admin, PRIV_UPDATE)
        .should.eql(true)
    })

    it('isAllowed for admin:delete', () => {
      acl
        .isAllowed(privileges.resource, admin, PRIV_DELETE)
        .should.eql(true)
    })

  })
})
