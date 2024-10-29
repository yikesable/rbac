# @yikesable/rbac

Vanilla role-base access control library

[![npm version](https://img.shields.io/npm/v/@yikesable/rbac.svg?style=flat)](https://www.npmjs.com/package/@yikesable/rbac)
[![npm downloads](https://img.shields.io/npm/dm/@yikesable/rbac.svg?style=flat)](https://www.npmjs.com/package/@yikesable/rbac)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

## Usage

```javascript
import { addRolePermission } from '@yikesable/rbac';

const { hasPermission } =
  addRolePermission('admin:foo', '*')
    .addRolePermission('editor:bar', 'wow')
    .done();

if (hasPermission('admin', 'foo', 'create') === true) {
  // "create" operation allowed for "foo" for role "admin"
}
```

## API

### addRolePermission()

Adds operations that a role is allowed to do on a role.

Each role / context combination can only be set once.

#### Syntax

```ts
addRolePermission('role:context', 'create', 'update', 'delete') => { addRolePermission, done }
```

#### Arguments

* `roleWithContext` – _`string`_ – a role / context combination
* `...operations` – _`string`_ – the options to be permitted for the combination. If `'*'` is set then all operations will be permitted.

#### Returns

An object with these properties:

* [`addRolePermission()`](#addrolepermission) – chaining that adds operations for another role / context combination
* `done()` – completes the creation chain and returns an object with a [`hasPermission()`](#haspermission) property

### hasPermission()

#### Syntax

```ts
hasPermission('role', 'context', 'operation') => boolean
```

#### Arguments

* `role` – _`string[] | string`_ – the role to check permission for. If an array is given then as long as one of the roles has permission `true` will be returned
* `context` – _`string`_ – the context to check permission for, eg `blogpost`
* `operation` – _`string | '*'`_ – the operation that should be permitted by the `role` in the `context` – eg. `create`, `update`, `update-own` or similar

#### Returns

A `boolean` that indicates whether the role has permission or not.

## Types

```ts
import type { PermissionCrudOperation } from '@yikesable/rbac';

declare module '@yikesable/rbac' {
  interface PermissionRoleList {
    admin: true;
    editor: true;
  }

  interface PermissionContextOperations {
    foo: PermissionCrudOperation; // 'create' | 'read' | 'update' | 'delete'
    bar: 'wow' | 'yay';
  }
}
```

* `PermissionRoleList` – extendable interface where keys represent `role` names and should be `string`, value can be whatever but `true` is recommended
* `PermissionContextOperations` – extendable interface where represent `context` names and should be `string`, value represents possible `operations` for that `context` and should be a union of `string` values

`role` and `context` in [`addRolePermission()`](#addrolepermission) and [`hasPermission`](#haspermission) are limited to the values derived from above interfaces and `operations` gets limited to the `operations` defined in `PermissionContextOperations` for the `context` used in those functions.

<!-- ## Used by

* [`example`](https://example.com/) – used by this one to do X and Y

## Similar modules

* [`example`](https://example.com/) – is similar in this way

## See also

* [Announcement blog post](#)
* [Announcement tweet](#) -->
