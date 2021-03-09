import React, { Component } from 'react';
import Faclose from 'react-icons/lib/fa/close';
import TiMessage from 'react-icons/lib/ti/message';

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			box: false,
			btn: true,
			text: '',
			conversation: [],
			messageAlert: 'Click to chat',
			notification: false,
		};
		this.user = props.user;
		this.socket = props.socket;
	}

	componentDidMount() {
		this.socket.on('message', (conversation) => {
			//user gets new message
			this.setState({
				conversation: conversation,
				messageAlert: 'New message',
				notification: true,
			});
		});
	}

	openBox = () => {
		//open chat box
		this.setState({ box: true, btn: false, notification: false });
	};
	closeBox = () => {
		//close chat tbox
		this.setState({ box: false, btn: true, messageAlert: 'Click to chat' });
	};
	sendMessage = (event) => {
		//send message function
		event.preventDefault();
		let message = this.state.text;
		this.setState({ text: '' });
		let tempArray = this.state.conversation;
		tempArray.push({ user: this.user, message: message });
		this.setState({ convarsation: tempArray });
		this.socket.emit('message', this.state.conversation);
	};

	onInputChange = (event) => {
		this.setState({ text: event.target.value });
	};

	render() {
		let placeHolder = 'Type message';
		let box = null;
		let conversation = this.state.conversation.map((message, index) => {
			if (message.user == this.user) {
				return (
					<div key={index}>
						<p className='yourMessage'>{message.message}</p>
					</div>
				);
			} else {
				return (
					<div style={{ textAlign: 'right' }}>
						<p className='opponentMessage' key={index}>
							{message.message}
						</p>
					</div>
				);
			}
		});
		if (this.state.box) {
			box = (
				<div className='chatBox'>
					<div className='chatHead'>
						Chat
						<Faclose className='close' onClick={this.closeBox} />
					</div>
					<div className='conversation'>{conversation}</div>
					<form onSubmit={this.sendMessage}>
						<input
							type='text'
							className='input'
							placeholder={placeHolder}
							onChange={this.onInputChange}
							value={this.state.text}
						/>
					</form>
				</div>
			);
		}
		let notification = null;
		if (this.state.notification) {
			notification = <TiMessage className='alertSign' />;
		}
		let btn = null;
		if (this.state.btn) {
			btn = (
				<button className='btn btn-info' onClick={this.openBox}>
					{this.state.messageAlert}
					{notification}
				</button>
			);
		}
		return (
			<div>
				{box}
				{btn}
			</div>
		);
	}
}
