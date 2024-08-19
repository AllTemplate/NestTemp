import { SetMetadata } from '@nestjs/common';

export const NO_AUTH_KEY = 'isPublic';

export const IsPublic = () => SetMetadata(NO_AUTH_KEY, true);
