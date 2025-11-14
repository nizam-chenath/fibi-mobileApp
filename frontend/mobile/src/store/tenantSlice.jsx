// store/tenantSlice.jsx
import { createSlice } from '@reduxjs/toolkit';
import { getTenantById } from '../config/tenants/index.jsx';
import { DEFAULT_TENANT_ID } from '../config/constants.jsx';

const initialState = {
  currentTenantId: DEFAULT_TENANT_ID,
  tenantConfig: getTenantById(DEFAULT_TENANT_ID),
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action) => {
      state.currentTenantId = action.payload.tenantId;
      state.tenantConfig = action.payload.config;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentTenant, setLoading, setError } = tenantSlice.actions;
export default tenantSlice.reducer;

