import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@fbe/types';

export const RoleAllowed = (...role: UserRoles[]) => SetMetadata('roles', role);
