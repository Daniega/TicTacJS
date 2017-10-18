import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style/style.css';
import io from 'socket.io-client';
import Header from './components/header';
import Board from './components/board'
import waitGif from './logos/wait.gif';


class App extends Component {
    constructor(props) {
        super(props);
		this.state = {play: false , user:0};
		this.socket = io('https://tictacdani.herokuapp.com/', {secure: true});
	}

	componentDidMount() {
        this.socket.on('play', () => { // two users in
            this.setState({play: true});
        });

        this.socket.on('hey', (msg) => { //send id to first user
            this.setState({user: msg});
        });

        this.socket.on('disconnected', (msg) => { //stop game if user disconnected
            this.setState({play: false});
        });
    }

	render() {
        if (!this.state.play) {
            return (<div className="App">
                <Header />
                <div className="container">
                    <img  className="img" src={waitGif} alt="Waiting for opponent to join"/>
                    <h2>Waiting for opponent to join</h2>
                </div>
            </div>);
        }
        else {
            return (<div>
                <Header  />
                <Board user = {this.state.user} socket = {this.socket}/>
            </div>);
        }

    }
}

ReactDOM.render(<App />, document.getElementById('app'));
