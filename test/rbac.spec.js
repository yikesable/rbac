/// <reference path="./rbac-fixture-types.d.ts" />

import chai from 'chai';

import { addRolePermission } from '../lib/rbac.js';

const should = chai.should();

describe('rbac', () => {
  describe('basic', () => {
    it('should be able to add a role', () => {
      const result = addRolePermission('admin:foo');

      should.exist(result);

      result.should.have.keys('addRolePermission', 'done');
      result.addRolePermission.should.be.a('function');
      result.done.should.be.a('function');
    });

    it('should be able to add multiple roles', () => {
      const result = addRolePermission('admin:foo', '*');

      should.exist(result);

      result.should.have.keys('addRolePermission', 'done');
      result.addRolePermission.should.be.a('function');
      result.done.should.be.a('function');
    });

    it('should be possible to complete', () => {
      const result =
        addRolePermission('admin:foo', 'create')
          .addRolePermission('admin:bar', 'wow', 'yay')
          .addRolePermission('editor:bar', '*')
          .addRolePermission('editor:foo', 'delete')
          .done();

      should.exist(result);
      result.should.have.keys('hasPermission');
      result.hasPermission.should.be.a('function');
    });

    it('should be possible to use', () => {
      const {
        hasPermission,
      } =
        addRolePermission('admin:foo', 'create')
          .addRolePermission('admin:bar', 'wow', 'yay')
          .addRolePermission('editor:bar', '*')
          .done();

      hasPermission('admin', 'foo', 'create').should.be.true;
      hasPermission('editor', 'bar', 'wow').should.be.true;
      hasPermission('admin', 'bar', 'wow').should.be.true;
      hasPermission('admin', 'bar', 'yay').should.be.true;

      hasPermission('admin', 'foo', 'delete').should.be.false;
      hasPermission('editor', 'foo', 'create').should.be.false;
    });

    it('should be possible be immutable', () => {
      const incomplete =
        addRolePermission('admin:foo', 'create');

      const { hasPermission } = incomplete.done();

      hasPermission('admin', 'foo', 'create').should.be.true;
      hasPermission('editor', 'bar', 'wow').should.be.false;

      const incomplete2 = incomplete.addRolePermission('editor:bar', 'wow');

      hasPermission('editor', 'bar', 'wow').should.be.false;

      const hasPermission2 = incomplete2.done().hasPermission;

      hasPermission('editor', 'bar', 'wow').should.be.false;
      hasPermission2('editor', 'bar', 'wow').should.be.true;
    });
  });
});
