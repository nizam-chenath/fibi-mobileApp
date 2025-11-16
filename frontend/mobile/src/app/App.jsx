// app/App.jsx
import React from 'react';
import { Text, TextInput } from 'react-native';
import { Provider } from 'react-redux';
import store from '../store/store.jsx';
import ThemeProvider from '../theme/ThemeProvider.jsx';
import RootNavigator from './RootNavigator.jsx';
import NotificationManager from '../utils/NotificationHandler.js';
import { NotificationSocketProvider } from '../context/NotificationSocketContext.jsx';

const DEFAULT_FONT_STACK =
  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif';

const applyGlobalFont = () => {
  const apply = (Component) => {
    if (!Component?.defaultProps) {
      Component.defaultProps = {};
    }

    if (Component.defaultProps.__hasDefaultFont) {
      return;
    }

    const existingStyle = Component.defaultProps.style;
    Component.defaultProps.style = Array.isArray(existingStyle)
      ? [...existingStyle, { fontFamily: DEFAULT_FONT_STACK }]
      : [existingStyle, { fontFamily: DEFAULT_FONT_STACK }];

    Component.defaultProps.__hasDefaultFont = true;
  };

  apply(Text);
  apply(TextInput);
};

applyGlobalFont();

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NotificationSocketProvider>
          <RootNavigator />
          <NotificationManager />
        </NotificationSocketProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

