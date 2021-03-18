import React from 'react';
import { Route, Switch } from 'react-router';
import { Explorer } from 'app/components/explorer/explorer';
import { hot } from 'react-hot-loader';
import { Benchmark } from './components/benchmark/benchmark';
import { Landing } from './components/landing/landing';

export const App = hot(module)(() => (
  <div  className="w-screen h-screen">
     <Switch>
      <Route exact path="/" component={Explorer} />
      <Route path="/benchmark" component={Benchmark} />
      <Route path="/landing" component={Landing} />
    </Switch>
  </div>
));
