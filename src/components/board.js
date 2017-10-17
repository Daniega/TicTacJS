import React, {Component} from 'react';
import '../style/style.css';


class Board extends Component {

	constructor(props) {
		super(props);
		this.socket = props.socket;
		this.turn = 1;
		this.user = props.user;
		this.board = [["","","",""],["","","",""],["","","",""],["","","",""]];
		this.state = {board: this.board, turn: "Wait for opponents turn", playAgain: false};
        this.rowsCounter = [0, 0, 0, 0];
        this.colsCounter = [0, 0, 0, 0];
        this.leftDiagonalCounter = 0;
        this.rightDiagonalCounter = 0;

	}
}