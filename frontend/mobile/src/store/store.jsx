// store/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from './tenantSlice.jsx';
import authReducer from './authSlice.jsx';

export const store = configureStore({
  reducer: {
    tenant: tenantReducer,
    auth: authReducer,
  },
});

export default store;

