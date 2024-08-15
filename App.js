import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ProductList from './src/screens/ProductList';

const App = () => (
  <Provider store={store}>
    <ProductList />
  </Provider>
);

export default App;
