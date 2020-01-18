import React, { Component } from 'react';
import {message} from 'antd';
import {HashRouter,Switch,Route} from 'react-router-dom'; 

import Admin from './pages/admin/admin.jsx';
import Login from './pages/login/login';
class App extends Component {
    handleClick = () => {
        message.success('lll');
    }
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route  path = '/login' component = {Login}/>
                    <Route  path = '/' component = {Admin}/>

                </Switch>
            
            </HashRouter>
        );
    }
}

export default App;