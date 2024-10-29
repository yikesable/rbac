import type { PermissionCrudOperation } from '../index.js';

declare module '../index.js' {
  interface PermissionRoleList {
    admin: true;
    editor: true;
  }
  interface PermissionContextOperations {
    foo: PermissionCrudOperation;
    bar: 'wow' | 'yay';
  }
}
