import { createRef } from 'react';

export const navigationRef = createRef();

export function navigate(screenName) {
  if (navigationRef.current) {
    // Navigate without params
    navigationRef.current.navigate(screenName);
  }
}