
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');


let users = [];

if(process.env.NODE_ENV !== 'production') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpack = require('webpack');
    const config = require('./webpack.config');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});




io.on('connection', (socket) => {
    
	this.rowsCounter = [0, 0, 0, 0];
	this.colsCounter = [0, 0, 0, 0];
	this.leftDiagonalCounter = 0;
	this.rightDiagonalCounter = 0;

    users.push(socket.id);

    if (io.engine.clientsCount < 2) {
        io.to(socket.id).emit('hey', 1); //first user connected

    }
    else if (io.engine.clientsCount === 2) {
        io.to(users[0]).emit('hey', 1); //if a user disconnects, the second one becomes the first
        io.emit('play'); //two users in, can start game
    }

    function checkWin(i, j, tempBoard){ //function to check if player won
		this.rowsCounter[i]++;
		this.colsCounter[j]++;

		if (i == j) {
            //left diagonal
            this.leftDiagonalCounter++;
        }
        else if (i + j == 3) {
            //right diagonal
            this.rightDiagonalCounter++;
		}
		
		if (this.rowsCounter[i] == 4 || this.colsCounter[j] == 4 || this.leftDiagonalCounter == 4 || this.rightDiagonalCounter == 4){
			
			socket.broadcast.emit('lost', board); // broadcast to second player that he lost
			socket.emit('win', board); //tell the move maker that he won
			}
	}

	function checkDraw(tempBoard){
		for (let i in tempBoard){
			for (let j in tempBoard[i]){
				if (tempBoard[i][j] == ""){
					return false;
				}
			}
		}
		return true;
	}

	socket.on('move', (board, i, j) => {// after move check if user won/draw. if not, broadcast board to second player
		checkWin(i, j, board)
		if(checkDraw(board)){
			io.emit('draw', board);			
		}
		else{
			socket.broadcast.emit('getBoard', board);			
		}

    });
    
    socket.on('win', (board) => { // broadcast to second player that he lost
        socket.emit('winner', board); //tell move maker that he won
        socket.emit('changeTurn', board);
        socket.broadcast.emit('lost', board); // broadcast to second player that he lost

    });

    socket.on('draw', (board) => { //draw message to players + change turn
        socket.emit('changeTurn', board);        
        socket.broadcast.emit('draw', board);
    });

    socket.on('playAgain', (board) => { // start another game
        socket.broadcast.emit('playAgain', board);


    });
    socket.on('message', (conversation) => { // start another game
        socket.broadcast.emit('message', conversation);


    });

    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.id), 1); // in case of disconnect
        io.emit('disconnected', 'disconnected');

    });
});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on', http.address().port);
});
