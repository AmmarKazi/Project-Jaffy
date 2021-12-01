import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import DinerButtonContainer from './components/DinerButtonContainer/DinerButtonContainer';
import React from 'react';

function App() {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/customer" exact render={props => <DinerButtonContainer {...props} restaurantName={'Kara Mia'} />} />
        </Switch>
    );
}

export default App;
