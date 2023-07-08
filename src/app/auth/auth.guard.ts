import { inject } from '@angular/core';

import { TokenService } from '../shared/services/token.service';

export const authGuard = () => {
  const tokenService = inject(TokenService);

  if (tokenService.token) {
    return true;
  }

  return false;
};
