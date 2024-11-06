import { SetMetadata } from '@nestjs/common';

export const CLIENT_NO_AUTH_KEY = 'isClientPublic';

export const isClientPublic = () => SetMetadata(CLIENT_NO_AUTH_KEY, true);
