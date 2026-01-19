import { SetMetadata } from '@nestjs/common';

// Permet de rendre publique une route même si le contrôleur a un @UseGuards() global
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
