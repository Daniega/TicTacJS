import React, {Component} from 'react';
import '../../public/styles.css';
import logo from '../../public/gifs/hlogo.png';
class Header extends Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>TicTacToe Game</h1>
                </div>
            </div>
        );
    }
}

export default Header;
