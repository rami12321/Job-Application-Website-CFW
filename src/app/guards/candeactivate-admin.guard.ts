import { CanDeactivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { MainAdminComponent } from '../Admin/Main-Admin/Main-Admin.component';


export const candeactivateAdminGuard: CanDeactivateFn<MainAdminComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
): boolean => {
  // Clear the 'role' from localStorage when navigating away from Admin page
  localStorage.removeItem('role');
  console.log('Cleared role from localStorage before navigating away from Admin.');

  // Return true to allow the navigation
  return true;
};
