import React, { useState, useEffect } from 'react';

import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter
} from 'framework7-react';


import routes from '../js/routes';
import store from '../js/store';

const MyApp = () => {
  // Framework7 Parameters
  const f7params = {
    name: 'Contract Read-Write', // App name
      theme: 'auto', // Automatic theme detection

      darkMode: true,


      // App store
      store: store,
      // App routes
      routes: routes,
  };
  f7ready(() => {


    // Call F7 APIs here
  });

  return (
    <App { ...f7params }>
        <View main className="safe-areas" url="/" />
    </App>
  )
}
export default MyApp;