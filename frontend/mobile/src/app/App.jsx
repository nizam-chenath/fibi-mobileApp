// app/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/store.jsx';
import ThemeProvider from '../theme/ThemeProvider.jsx';
import RootNavigator from './RootNavigator.jsx';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

