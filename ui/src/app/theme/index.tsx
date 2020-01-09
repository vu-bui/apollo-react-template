import React, { createContext, useContext, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import { ThemeProvider } from '@material-ui/core/styles';

import dark from './dark';
import light from './light';

const supportedThemes = { dark, light };

export interface SwitchThemeProps {
  currentTheme: keyof typeof supportedThemes;
  switchTheme: (theme: SwitchThemeProps['currentTheme']) => void;
}

const KEY = 'ar.theme';
const SwitchThemeContext = createContext<SwitchThemeProps>({} as any);

export const SwitchThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const savedTheme = localStorage.getItem(KEY);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [currentTheme, setTheme] = useState<SwitchThemeProps['currentTheme']>(
    savedTheme && savedTheme in supportedThemes
      ? savedTheme as SwitchThemeProps['currentTheme']
      : prefersDarkMode ? 'dark' : 'light',
  );
  const switchTheme: SwitchThemeProps['switchTheme'] = theme => {
    setTheme(theme);
    localStorage.setItem(KEY, theme);
  };

  return (
    <SwitchThemeContext.Provider value={{ currentTheme, switchTheme }}>
      <ThemeProvider theme={responsiveFontSizes(createMuiTheme(supportedThemes[currentTheme]))}>
        {children}
      </ThemeProvider>
    </SwitchThemeContext.Provider>
  );
};

export const useSwitchTheme = () => useContext(SwitchThemeContext);
