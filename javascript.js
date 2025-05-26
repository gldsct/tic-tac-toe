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
            return true;
        }
    };

    const printGrid = function () {
        let markedGrid = board.map((row) => row.map((gridSpace) => gridSpace.getValue()));
        return(markedGrid);
    };

    const getBoard = function () {
        return board;
    };

    return { markGridSpace, printGrid, getBoard };
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
            marker: "x",
        }, 
        {
            name: playerTwo,
            marker: "o",
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
        let unmarkedGridSpace = board.markGridSpace(getCurrentPlayer().marker, row, column);
        const gridWithValues = board.printGrid();
        console.log(gridWithValues);

        // Check for game winner after each move
        (function () {
            let rowResults = [];
            gridWithValues.forEach((row) => {
                let rowSum = row.reduce((cell, sum) => {
                    return cell + sum;
                });
                rowResults.push(rowSum);
            });
    
            let columnResults = [];
            for (let i = 0; i < 3; i++) {
                let columnSum = "";
                for (let j = 0; j < 3; j++) {
                    columnSum += gridWithValues[j][i]; 
                }
                columnResults.push(columnSum);
            }
    
            let diagonalResults = [];
            let firstDiagonalSum = "";
            for (let i = 0; i < 3; i++) {
                firstDiagonalSum += gridWithValues[i][i];
            }
            diagonalResults.push(firstDiagonalSum);
            let secondDiagonalSum = "";
            for (let i = 2; i >= 0; i--) {
                secondDiagonalSum += gridWithValues[i][2-i];
            }
            diagonalResults.push(secondDiagonalSum);
    
            if (rowResults.filter((cell) => cell === "xxx").length || columnResults.filter((cell) => cell === "xxx").length || diagonalResults.filter((cell) => cell === "xxx").length) {
                console.log("Player 1 wins!");
                game = GameLogic();
                return;
            }
            if (rowResults.filter((cell) => cell === "ooo").length || columnResults.filter((cell) => cell === "ooo").length || diagonalResults.filter((cell) => cell === "ooo").length) {
                console.log("Player 2 wins!");
                game = GameLogic();
                return;
            }
            let anyZeros = 0;
            gridWithValues.forEach((row) => row.forEach((cell) => {
                if (cell === 0) {
                    anyZeros++;
                }
            }));
            if (anyZeros === 0) {
                console.log("It was a tie.");
                game = GameLogic();
                return;
            }
        })();

        if (unmarkedGridSpace) {
            switchPlayer();
        }
    };
    
    
    console.log(board.printGrid());
    
    return { getCurrentPlayer, playRound, getBoard: board.getBoard };
}

function DisplayBoard() {
    let game = GameLogic();
    const gamePlayer = document.querySelector(".game-player");
    const gameGrid = document.querySelector(".game-grid");

    const updateBoard = function () {
        gameGrid.textContent = "";
        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        gamePlayer.textContent = `${currentPlayer.name}'s`;
        board.forEach((row, rowIndex) => {
            const gameGridRow = document.createElement("div");
            gameGridRow.classList.add("game-grid-row");
            row.forEach((cell, cellIndex) => {
                const gameGridCell = document.createElement("button");
                gameGridCell.classList.add("game-grid-cell");
                gameGridCell.dataset.gameGridRow = rowIndex;
                gameGridCell.dataset.gameGridColumn = cellIndex;
                gameGridCell.textContent = cell.getValue();
                gameGridRow.appendChild(gameGridCell);
            });
            gameGrid.appendChild(gameGridRow);
        });
    };

    function buttonClickHandler(event) {
        const selectedRow = event.target.dataset.gameGridRow;
        const selectedColumn = event.target.dataset.gameGridColumn;

        if (!selectedRow || !selectedColumn) {
            return;
        }
        game.playRound(selectedRow, selectedColumn);
        updateBoard();
    }

    gameGrid.addEventListener("click", buttonClickHandler);

    updateBoard();
}

DisplayBoard();