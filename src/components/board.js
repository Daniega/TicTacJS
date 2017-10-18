import React, {Component} from 'react';
import '../style/style.css';


class Board extends Component {

	constructor(props) { /*Board init*/
		super(props);
		this.socket = props.socket;
		this.turn = 1;
		this.user = props.user;
		this.board = [["","","",""],["","","",""],["","","",""],["","","",""]];
		this.state = {board: this.board, turnMessage: "Opponent's turn", reMatch: false};
		this.rowsCounter = [0, 0, 0, 0];
        this.colsCounter = [0, 0, 0, 0];
        this.leftDiagonalCounter = 0;
        this.rightDiagonalCounter = 0;

    }
    
    componentDidMount() { //Socket messages

        if (this.user == 1) { //first user to begin
            this.setState({turn: "Your turn"});
        }

        this.socket.on('getBoard', (board) => { // update board after move
            this.setState({board});
            this.turn = this.user;
            this.setState({turn: "Your turn"});

        });

        this.socket.on('lost', (board) => { // you lost
            this.setState({board});
            this.setState({turn: "You lose"});
            this.playAgain();

        });

        this.socket.on('changeTurn', (board) => { //change users turn
            this.turn = !this.user;
        });

        this.socket.on('win', (board) => { //you win
            this.setState({board});
            this.setState({turn: 'You win!'});
            this.playAgain();
        });

        this.socket.on('draw', (board) => { // draw
            this.setState({board});
            this.setState({turn: "draw!"});
            this.playAgain();

        });

        this.socket.on('playAgain', (board) => { // opponent wants rematch
            this.setState({board});
            this.resetCounters();
            this.setState({turn: "Wait for opponents turn"});
            this.setState({playAgain: false});

        });
    }



	resetBoard = () => { /*Reset board if user wants a rematch*/
        this.rowsCounter = [0, 0, 0, 0];
        this.colsCounter = [0, 0, 0, 0];
        this.leftDiagonalCounter = 0;
        this.rightDiagonalCounter = 0;
        this.board = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]];
        this.setState({board: this.board});
        console.log(this.board);
	};
	
	rematchBoard = () => { /*Reset states board if rematch*/
		this.setState({reMatch: false});
		this.turn = this.user;
		this.setState({turnMessage: "It's your turn"});
		this.resetBoard();
		this.socket.emit('rematchState', this.board);
	};

	rematchState = () => { /*Show rematch Button*/
		this.setState({reMatch: true});
    };
    
    checkWin = (i, j, tempBoard) => {
        this.rowsCounter[i]++;
        this.colsCounter[j]++;
        if (i == j) {
            // top left diagonal
            this.leftDiagonalCounter++;
        }
        else if (i + j == 3) {
            // top right diagonal
            this.rightDiagonalCounter++;
        }

        if (this.rowsCounter[i] == 4 || this.colsCounter[j] == 4 || this.leftDiagonalCounter == 4
            || this.rightDiagonalCounter == 4) { // if any of counters is 4 then bingo
            this.socket.emit('win', tempBoard);
            this.turn = !this.user; // switch turns
            this.setState({turn: "You win"});
            this.playAgain(); // show button
            return true;
        }
        if (this.checkDraw(tempBoard)) {
            return true
        }
        return false;

    };

	handleClick = (i,j) => {
		if (this.state.board[i][j] === "" && this.turn === this.user) {
            let tempBoard = this.state.board; // lets define temp to manipulate our board
            if (!this.user === 1) {
                tempBoard[i][j] = "x";
            }
            else {
                tempBoard[i][j] = "o";
            }
            this.setState({board: tempBoard});
            this.socket.emit('move', tempBoard, i, j); // emit updated board to server which will send it to other user
            this.setState({turn: "Opponent's turn"});
            

        }
	};







	render() {
        // build table
        let tableBoard = this.state.board.map((row, index) => {
            let cols = row.map((col, colIndex) => {
                return (<td key={[index, colIndex]} onClick={this.handleClick.bind(null, index, colIndex)}>{this.state.board[index][colIndex]}</td>);
            });
            return (<tr key={index}>{cols}</tr>);
		});
		
        let btn = null;
        if (this.state.reMatch) {
            btn = <button className="btn btn-success" onClick={this.rematchBoard.bind(null)}>Rematch</button>
        }
        else {
            btn = null;
        }

        return (
            <div className="App">
                <div className="container">
                    <h2>{this.state.turn}</h2>
                    <table className=" card table-bordered table-responsive">
                        <tbody>
                        {tableBoard}
                        </tbody>
                    </table>
					{btn}
                </div>
            </div>
        );
    }


}

export default Board;
