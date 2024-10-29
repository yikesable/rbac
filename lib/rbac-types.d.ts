export interface PermissionRoleList {}

export type PermissionRoles = keyof PermissionRoleList;

export type PermissionCrudOperation = 'create' | 'read' | 'edit' | 'delete';

export interface PermissionContextOperations {}

export type PermissionContexts = keyof PermissionContextOperations;

export type RoleContextPermissions = {
  readonly [C in PermissionContexts as `${PermissionRoles}:${C}`]?: ReadonlySet<PermissionContextOperations[C] | '*'>
};

// --- Function types ---

export type RawAddRole<RoleMap extends RoleContextPermissions> = <
  Target extends Exclude<keyof RoleContextPermissions, keyof RoleMap>,
  Operations extends (RoleContextPermissions[Target] extends ReadonlySet<infer U> | undefined ? U : never)
>(
  roleMap: RoleMap,
  target: Target,
  ...operations: Operations[]
) => AddRoleResult<RoleMap & Record<Target, ReadonlySet<Operations | '*'>>>;

export type AddRolePermission<RoleMap extends RoleContextPermissions> =
  <
    Target extends Exclude<keyof RoleContextPermissions, keyof RoleMap>,
    Operations extends (RoleContextPermissions[Target] extends ReadonlySet<infer U> | undefined ? U : never)
  >(
    target: Target,
    ...operations: Operations[]
  ) => AddRoleResult<RoleMap & Record<Target, ReadonlySet<Operations>>>;

export type HasPermission = <
  Role extends PermissionRoles,
  Context extends PermissionContexts,
  Operation extends PermissionContextOperations[Context]
>(
  role: Role[] | Role,
  context: Context,
  operation?: Operation | '*'
) => boolean;

export type RoleSetupDone = {
  hasPermission: HasPermission
};

export type AddRoleResult<RoleMap extends RoleContextPermissions> = {
  addRolePermission: AddRolePermission<RoleMap>;
  done(): RoleSetupDone;
};
