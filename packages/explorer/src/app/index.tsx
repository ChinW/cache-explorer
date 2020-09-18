import React from 'react';
import { Route, Switch } from 'react-router';
import { Explorer } from 'app/components/explorer/explorer';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <div  className="w-screen h-screen">
     <Switch>
      <Route path="/" component={Explorer} />
    </Switch>
  </div>
));
