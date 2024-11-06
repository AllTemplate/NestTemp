import { SetMetadata } from '@nestjs/common';

export const ADMIN_NO_AUTH_KEY = 'isAdminPublic';
export const ADMIN_SUPER_KEY = 'IsSuperAdmin';

export const IsAdminPublic = (state = true) => SetMetadata(ADMIN_NO_AUTH_KEY, state);

export const IsSuperAdmin = (state = true) => SetMetadata(ADMIN_SUPER_KEY, state);
