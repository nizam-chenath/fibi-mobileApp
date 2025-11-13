// theme/useAppTheme.jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider.jsx';

export const useAppTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return theme;
};

export default useAppTheme;

