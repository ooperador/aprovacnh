import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for session check to complete (fixes refresh bug)
  await auth.ensureInitialized();

  if (auth.isAuthenticated()) {
    // Check onboarding: If user has no UF and isn't already on onboarding page
    const user = auth.currentUser();
    if ((!user?.uf || user.uf === '') && !state.url.includes('onboarding')) {
      return router.createUrlTree(['/app/onboarding']);
    }
    return true;
  }
  
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureInitialized();

  if (auth.isAuthenticated() && auth.currentUser()?.role === 'admin') {
    return true;
  }
  return router.createUrlTree(['/login']);
};
