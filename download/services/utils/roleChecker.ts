import { importantRoles, minorRoles } from '@/services/types/Roles';

// Función para verificar si el usuario tiene un rol importante
export const hasImportantRole = (userRoles: string[]): { hasRole: boolean, role?: string } => {
  const role = importantRoles.find(role => userRoles.includes(role.id));
  if (role) {
    return { hasRole: true, role: role.name };
  }
  return { hasRole: false };
};

// Función para verificar si el usuario tiene un rol menor
export const hasMinorRole = (userRoles: string[]): { hasRole: boolean, role?: string } => {
  const role = minorRoles.find(role => userRoles.includes(role.id));
  if (role) {
    return { hasRole: true, role: role.name };
  }
  return { hasRole: false };
};

// Función que verifica los roles y devuelve el tipo de rol
export const checkUserRole = (userRoles: string[]): { status: string, roleType: 'important' | 'minor' | null, roleName?: string } => {
  const importantRoleCheck = hasImportantRole(userRoles);
  if (importantRoleCheck.hasRole) {
    return { status: 'access granted', roleType: 'important', roleName: importantRoleCheck.role };
  }

  const minorRoleCheck = hasMinorRole(userRoles);
  if (minorRoleCheck.hasRole) {
    return { status: 'limited access', roleType: 'minor', roleName: minorRoleCheck.role };
  }

  return { status: 'access denied', roleType: null };
};
