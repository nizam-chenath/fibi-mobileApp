// store/tenantSlice.jsx
import { createSlice } from '@reduxjs/toolkit';
import { getTenantById } from '../config/tenants/index.jsx';
import { DEFAULT_TENANT_ID } from '../config/constants.jsx';

const initialState = {
  currentTenantId: DEFAULT_TENANT_ID,
  tenantConfig: getTenantById(DEFAULT_TENANT_ID),
  currentUniversityUid: null,
  selectedUniversityName: null,
  selectedUniversityThemeColor: null,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action) => {
      const {
        tenantId,
        config,
        universityUid,
        universityName,
        universityThemeColor,
        resetSelection = false,
      } = action.payload;

      state.currentTenantId = tenantId;
      state.tenantConfig = config;
      state.currentUniversityUid = resetSelection ? null : universityUid ?? state.currentUniversityUid;
      state.selectedUniversityName = resetSelection
        ? null
        : universityName ?? state.selectedUniversityName;
      state.selectedUniversityThemeColor = resetSelection
        ? null
        : universityThemeColor ?? state.selectedUniversityThemeColor;
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

