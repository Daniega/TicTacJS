import React, {Component} from 'react';
import '../../public/styles.css';

class Board extends Component {

    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.turn = 1;
        this.user = props.user;
        this.board = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]];
        this.state = {board: this.board, turn: "Waiting for opponent's turn", resetGame: false};
        this.rowsCounter = [0, 0, 0, 0];
        this.colsCounter = [0, 0, 0, 0];
        this.leftDiagonalCounter = 0;
        this.rightDiagonalCounter = 0;

    }

    componentDidMount() {
        if (this.user == 1) { //first user to begin
            this.setState({turn: "It's Your turn"});
        }

        this.socket.on('getBoard', (board) => { // update board after move
            this.setState({board});
            this.turn = this.user;
            this.setState({turn: "it's Your turn"});

        });

        this.socket.on('changeTurn', (board) => {
            this.setState(this.turn = !this.user)
        });

        this.socket.on('lost', (board) => { // you lost
            this.setState({board});
            this.setState({turn: "You lose"});
            this.playAgain();

        });

        this.socket.on('winner', (board) => {
            this.setState({turn: "You win"});
            this.playAgain();            
        });

        this.socket.on('draw', (board) => { // you lost
            this.setState({board});
            this.setState({turn: "draw"});
            this.playAgain();

        });

        this.socket.on('playAgain', (board) => { // opponent wants rematch
            this.setState({board});
            this.resetCounters();
            this.setState({turn: "Wait for opponents turn"});
            this.setState({playAgain: false});

        });
    }

    handleClick = (i, j) => {
        if (this.state.board[i][j] == "" && this.turn == this.user) {
            let tempBoard = this.state.board; // lets define temp to manipulate our board
            if (!this.user == 1) {
                tempBoard[i][j] = "X";
            }
            else {
                tempBoard[i][j] = "O";
            }
            this.setState({board: tempBoard});
            this.socket.emit('move', tempBoard); // send updated board to server which will send it to other user
            this.turn = !this.user; // switch turns
            this.setState({turn: "Wait for opponents turn"});
        }
    };

    playAgain = () => {
        this.setState({playAgain: true}); // show button
    };

    startAnotherGame = () => {
        this.setState({playAgain: false});
        this.turn = this.user;
        this.setState({turn: "Your turn"});
        this.resetCounters();
        this.socket.emit('playAgain', this.board);

    };

    resetCounters = () => {
        this.rowsCounter = [0, 0, 0, 0];
        this.colsCounter = [0, 0, 0, 0];
        this.leftDiagonalCounter = 0;
        this.rightDiagonalCounter = 0;
        this.board = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]];
        this.setState({board: this.board});
        console.log(this.board);

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

        if (this.state.resetGame) {
            btn = <button className="btn btn-success" onClick={this.startAnotherGame.bind(null)}>Rematch</button>
        }
        else {
            btn = null;
        }

        return (
            <div className="App">
                <div className="boardhead">
                        <h3>{this.state.turn}</h3>
                </div>
                <div className="container">
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
