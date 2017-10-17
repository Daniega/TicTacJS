import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style/style.css';
import io from 'socket.io-client';
import Header from './components/header';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {play: false , user:0};
	}

	render() {
		return (
		<div>
			<Header  />
		</div>);
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
