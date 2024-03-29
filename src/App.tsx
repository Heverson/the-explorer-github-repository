import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/index';
import GlobalStyles from './styles/global';

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    <GlobalStyles/>
  </>
);

export default App;
