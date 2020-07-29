import React from 'react';
import { Route, Switch } from 'react-router';
import { Viewer } from 'app/components/viewer/viewer';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <div  className="w-screen h-screen">
     <Switch>
      <Route path="/" component={Viewer} />
    </Switch>
  </div>
));
