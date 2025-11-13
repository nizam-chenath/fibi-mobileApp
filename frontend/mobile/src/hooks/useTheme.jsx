// hooks/useTheme.jsx
import { useAppTheme } from '../theme/useAppTheme.jsx';

export const useTheme = () => {
  const theme = useAppTheme();
  return theme;
};

export default useTheme;

