import React, { Component } from 'react';
import {Button,message} from 'antd';

class App extends Component {
    handleClick = () => {
        message.success('lll');
    }
    render() {
        return (
            <div>
                <Button onClick = {this.handleClick} type =  "primary">dianji</Button>
            </div>
        );
    }
}

export default App;