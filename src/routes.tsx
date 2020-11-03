import React from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/MapCasas';
import Orphanage from './pages/Orphanage';
import CriarOrfphanage from './pages/CreateOrphanage';

function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Landing}/>
                <Route path="/app" component={OrphanagesMap}/>
 
                <Route path="/orphanages/create" component={CriarOrfphanage}/>
                <Route path="/orphanages/:id" component={Orphanage}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;