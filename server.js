
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');


let users = [];
var players = []; 

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

    users.push(socket.id);

    function resetAllPlayers(){ //reset data of all players in room (init)
        for (var i = 0 ; i < io.engine.clientsCount ; i++){
            players.push({
                playerID: users[i],
                rowsCounter: [0, 0, 0, 0],
                colsCounter: [0, 0, 0, 0],
                leftDiagonalCounter: 0,
                rightDiagonalCounter: 0
            });
        }
    }
         

    if (io.engine.clientsCount < 2) {
        io.to(socket.id).emit('hey', 1); //first user connected
    }
    else if (io.engine.clientsCount === 2) {
        io.to(users[0]).emit('hey', 1); //if a user disconnects, the second one becomes the first
        io.emit('play'); //two users in, can start game
        resetAllPlayers();        
        io.to(users[0]).emit('getPlayerId', users[0]);
        io.to(users[1]).emit('getPlayerId', users[1]);
    }

    function checkWin(tempBoard, i, j, playerID){ //function to check if player won

        for (var k = 0 ; k <= 1 ; k++){
            if (players[k].playerID == playerID){
                console.log('blablabla');
                players[k].rowsCounter[i]++;
                players[k].colsCounter[j]++;
                break;                
            }
        }

		if (i == j) { //left diagonal
            players[k].leftDiagonalCounter++;
        }
        else if (i + j == 3) { //right diagonal
            players[k].rightDiagonalCounter++;
        }
        
        //check if player won
		if (players[k].rowsCounter[i] == 4 || players[k].colsCounter[j] == 4 || players[k].leftDiagonalCounter == 4 || players[k].rightDiagonalCounter == 4){
            return true;
            }
        return false;
	}

	function checkDraw(tempBoard){ //check if the match is a draw
		for (let i in tempBoard){
			for (let j in tempBoard[i]){
				if (tempBoard[i][j] == ""){
					return false;
				}
			}
		}
		return true;
	}

	socket.on('move', (board, i, j, playerID) => {// after move check if user won/draw. if not, broadcast board to second player
        if(checkWin(board, i, j, playerID)){
            socket.broadcast.emit('lost', board); // broadcast to second player that he lost
            socket.emit('winner', board) //tell the move maker that he won
            players = [];
            resetAllPlayers();
        }
		else if(checkDraw(board)){
            io.emit('draw', board);
            players = [];
            resetAllPlayers();		
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
        players = [];
        resetAllPlayers();
        socket.broadcast.emit('playAgain', board);


    });
    socket.on('message', (conversation) => { // start another game
        socket.broadcast.emit('message', conversation);


    });

    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.id), 1); // in case of disconnect
        io.emit('disconnected', 'disconnected');
        players = []
        resetAllPlayers();

    });
});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on', http.address().port);
});

