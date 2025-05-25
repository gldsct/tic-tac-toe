function GameBoard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(GridSpace());
        }
    }

    const markGridSpace = function(playerMarker, row, column) {
        if (board[row][column].getValue() === 0) {
            board[row][column].markSpace(playerMarker);
            console.log(`Row: ${row} / Column: ${column}, marked with "${playerMarker}" marker.`);
        }
    };

    const printGrid = function () {
        let markedGrid = board.map((row) => row.map((gridSpace) => gridSpace.getValue()));
        console.log(markedGrid);
    };

    return { markGridSpace, printGrid };
}

function GridSpace() {
    let gridValue = 0;

    const getValue = function () {
        return gridValue;
    };

    const markSpace = function (playerMarker) {
        gridValue = playerMarker;
    };

    return { getValue, markSpace };
}

function GameLogic(playerOne = "Player One", playerTwo = "Player Two") {
    const board = GameBoard();
    const players = [
        {
            name: playerOne,
            marker: 1,
        }, 
        {
            name: playerTwo,
            marker: 2,
        }
    ];

    let currentPlayer = players[0];

    const getCurrentPlayer = function () {
        return currentPlayer;
    };

    const switchPlayer = function () {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const playRound = function (row, column) {
        board.markGridSpace(getCurrentPlayer().marker, row, column);
        board.printGrid();
        switchPlayer();
    };

    board.printGrind();

    return { getCurrentPlayer, playRound };
}

game = GameLogic();