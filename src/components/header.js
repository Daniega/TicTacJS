import React, {Component} from 'react';
import logo from '../logos/hlogo.png';
import '../style/style.css';



class Header extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="Head-logo" alt="logo"/>
                    <h1>TicTacToe Game</h1>
                </div>
            </div>
        );
    }
}

export default Header;