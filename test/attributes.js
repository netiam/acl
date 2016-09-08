import acl, {
  PRIV_CREATE,
  PRIV_READ,
  PRIV_UPDATE,
  PRIV_DELETE
} from '../src/acl'
import privileges from './fixtures/attributes.acl.json'

describe('netiam-contrib', () => {
  describe('ACL - attributes', () => {

    const guest = {name: 'GUEST'}
    const user = {name: 'USER'}
    const owner = {
      name: 'OWNER',
      parent: user
    }
    const admin = {name: 'ADMIN'}

    const attributes = [
      'name',
      'email',
      'pwd'
    ]

    it('allowed attributes for guest:create', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, guest, PRIV_CREATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed attributes for guest:read', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, guest, PRIV_READ)
      allowedKeys.should.be.eql(['name'])
    })

    it('allowed attributes for guest:update', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, guest, PRIV_UPDATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for guest:delete', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, guest, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for user:create', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, user, PRIV_CREATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for user:read', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, user, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email'])
    })

    it('allowed attributes for user:update', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, user, PRIV_UPDATE)
      allowedKeys.should.be.eql(['email'])
    })

    it('allowed attributes for user:delete', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, user, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for owner:create', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, owner, PRIV_CREATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for owner:read', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, owner, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed attributes for owner:update', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, owner, PRIV_UPDATE)
      allowedKeys.should.be.eql(['email', 'pwd'])
    })

    it('allowed attributes for owner:delete', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, owner, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed attributes for admin:create', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, admin, PRIV_CREATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed attributes for admin:read', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, admin, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email'])
    })

    it('allowed attributes for admin:update', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, admin, PRIV_UPDATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed attributes for admin:delete', () => {
      const allowedKeys = acl.allowedProperties(privileges.attributes, attributes, admin, PRIV_DELETE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

  })
})
