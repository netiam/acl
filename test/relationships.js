import acl, {
  PRIV_CREATE,
  PRIV_READ,
  PRIV_UPDATE,
  PRIV_DELETE
} from '../src/acl'
import privileges from './fixtures/relationships.acl.json'

describe('netiam-contrib', () => {
  describe('ACL - relationships', () => {

    const guest = {name: 'GUEST'}
    const user = {name: 'USER'}
    const owner = {
      name: 'OWNER',
      parent: user
    }
    const admin = {name: 'ADMIN'}

    const relationships = [
      'name',
      'email',
      'pwd'
    ]

    it('allowed relationships for guest:create', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, guest, PRIV_CREATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed relationships for guest:read', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, guest, PRIV_READ)
      allowedKeys.should.be.eql(['name'])
    })

    it('allowed relationships for guest:update', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, guest, PRIV_UPDATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for guest:delete', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, guest, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for user:create', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, user, PRIV_CREATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for user:read', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, user, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email'])
    })

    it('allowed relationships for user:update', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, user, PRIV_UPDATE)
      allowedKeys.should.be.eql(['email'])
    })

    it('allowed relationships for user:delete', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, user, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for owner:create', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, owner, PRIV_CREATE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for owner:read', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, owner, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed relationships for owner:update', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, owner, PRIV_UPDATE)
      allowedKeys.should.be.eql(['email', 'pwd'])
    })

    it('allowed relationships for owner:delete', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, owner, PRIV_DELETE)
      allowedKeys.should.be.eql([])
    })

    it('allowed relationships for admin:create', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, admin, PRIV_CREATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed relationships for admin:read', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, admin, PRIV_READ)
      allowedKeys.should.be.eql(['name', 'email'])
    })

    it('allowed relationships for admin:update', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, admin, PRIV_UPDATE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

    it('allowed relationships for admin:delete', () => {
      const allowedKeys = acl.filter(privileges.relationships, relationships, admin, PRIV_DELETE)
      allowedKeys.should.be.eql(['name', 'email', 'pwd'])
    })

  })
})
