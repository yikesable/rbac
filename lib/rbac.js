import { isStringArray } from '@voxpelli/typed-utils';

/** @import { AddRolePermission, AddRoleResult, PermissionContextOperations, PermissionContexts, PermissionRoles, RawAddRole, RoleContextPermissions } from './rbac-types.d.ts' */

/**
 * @template {RoleContextPermissions} RoleMap
 * @template {PermissionRoles} Role
 * @template {PermissionContexts} Context
 * @param {RoleMap} roleMap
 * @param {Role} role
 * @param {Context} context
 * @param {PermissionContextOperations[Context] | '*'} operation
 * @returns {boolean}
 */
const roleHasPermission = (roleMap, role, context, operation) => {
  /** @type {RoleContextPermissions[keyof RoleContextPermissions] extends ReadonlySet<infer U> | undefined ? ReadonlySet<U> | undefined : never} */
  const contextOperations = roleMap[`${role}:${context}`];

  if (!contextOperations) return false;

  return contextOperations.has(operation) || contextOperations.has('*');
};

/**
 * @template {RoleContextPermissions} RoleMap
 * @template {PermissionRoles} Role
 * @template {PermissionContexts} Context
 * @param {RoleMap} roleMap
 * @param {Role[]} roles
 * @param {Context} context
 * @param {PermissionContextOperations[Context] | '*'} operation
 * @returns {boolean}
 */
const anyRoleHasPermission = (roleMap, roles, context, operation) =>
  roles.some(role => roleHasPermission(roleMap, role, context, operation));

/**
 * @template {RoleContextPermissions} T
 * @type {RawAddRole<T>}
 */
function rawAddRole (roleMap, roleWithContext, ...operations) {
  const rolePermissions = roleMap[roleWithContext];

  if (rolePermissions) {
    throw new Error(`Role / context combination "${roleWithContext}" has already been set`);
  }

  if (!isStringArray(operations)) {
    throw new Error('Invalid operations');
  }

  /** @typedef {typeof operations} OperationsList */
  /** @typedef {OperationsList extends Array<infer U> ? U : never} Operations */

  /** @type {Array<Operations | '*'>} */
  const value = operations.length ? operations : ['*'];
  const foo = /** @type {Record<typeof roleWithContext, Set<Operations | '*'>>} */ ({
    [roleWithContext]: new Set(value),
  });

  const newRoleMap = {
    ...roleMap,
    ...foo,
  };

  /** @type {AddRolePermission<typeof newRoleMap>} */
  const addRolePermission = (...values) => {
    return rawAddRole(newRoleMap, ...values);
  };

  return {
    addRolePermission,
    done () {
      return {
        hasPermission: (role, context, operation = '*') =>
          Array.isArray(role)
            ? anyRoleHasPermission(newRoleMap, role, context, operation)
            : roleHasPermission(newRoleMap, role, context, operation),
      };
    },
  };
}

/**
 * @template {keyof RoleContextPermissions} Target
 * @template {(RoleContextPermissions[Target] extends ReadonlySet<infer U> | undefined ? U : never)} Operations
 * @param {Target} roleWithContext
 * @param {Operations[]} operations
 * @returns {AddRoleResult<Record<Target, ReadonlySet<Operations>>>}
 */
export function addRolePermission (roleWithContext, ...operations) {
  return (/** @type {RawAddRole<{}>} */ (rawAddRole))({}, roleWithContext, ...operations);
}
