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
            marker: "X",
        }, 
        {
            name: playerTwo,
            marker: "O",
        }
    ];

    let currentPlayer = players[0];
    
    const getCurrentPlayer = function () {
        return currentPlayer;
    };
    
    const switchPlayer = function () {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    
    let gameState = true;
    const getGameState = function () {
        return gameState;
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
    
            if (rowResults.filter((cell) => cell === "XXX").length || columnResults.filter((cell) => cell === "XXX").length || diagonalResults.filter((cell) => cell === "XXX").length) {
                console.log("Player 1 wins!");
                return gameState = false;
            }
            if (rowResults.filter((cell) => cell === "OOO").length || columnResults.filter((cell) => cell === "OOO").length || diagonalResults.filter((cell) => cell === "OOO").length) {
                console.log("Player 2 wins!");
                return gameState = false;
            }
            let anyZeros = 0;
            gridWithValues.forEach((row) => row.forEach((cell) => {
                if (cell === 0) {
                    anyZeros++;
                }
            }));
            if (anyZeros === 0) {
                console.log("It was a tie.");
                return gameState = false;
            }
        })();

        if (unmarkedGridSpace) {
            switchPlayer();
        }
    };
    
    
    console.log(board.printGrid());
    
    return { getCurrentPlayer, playRound, getBoard: board.getBoard, getGameState };
}

function DisplayBoard(playerOne, playerTwo) {
    let game = GameLogic(playerOne, playerTwo);
    const gamePlayer = document.querySelector(".game-player");
    const gameGrid = document.querySelector(".game-grid");
    const restartButton = document.querySelector(".restart-button");

    const updateBoard = function () {
        gameGrid.textContent = "";
        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();

        gamePlayer.textContent = `${currentPlayer.name}`;
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
        if (game.getGameState()) {
            let gameWinner = game.getCurrentPlayer();
            game.playRound(selectedRow, selectedColumn);
            updateBoard();
            if (!game.getGameState()) {
                gameOver(gameWinner);
            }
        }
        else {
            alert("The game is already over. What are you trying to do?");
        }
    }

    const gameOver = function (gameWinner) {
        let winnerModal = document.querySelector(".winner-modal");
        let modalOverlay = document.querySelector(".overlay");
        let showGameWinner = document.querySelector(".game-winner");

        winnerModal.classList.remove("hidden");
        modalOverlay.classList.remove("hidden");
        showGameWinner.textContent = gameWinner.name;
    };

    gameGrid.addEventListener("click", buttonClickHandler);
    
    restartButton.addEventListener("click", () => {
        gameGrid.removeEventListener("click", buttonClickHandler);
        DisplayBoard();
    });

    updateBoard();
}

function ModalDisplay() {
    let inputModal = document.querySelector(".input-modal");
    let modalOverlay = document.querySelector(".overlay");
    let modalSubmitButton = document.querySelector(".modal-submit-button");

    modalSubmitButton.addEventListener("click", (event) => {
        event.preventDefault();
        let playerOneName = document.querySelector("#player-one-name").value;
        let playerTwoName = document.querySelector("#player-two-name").value;
        DisplayBoard(playerOneName, playerTwoName);

        inputModal.classList.add("hidden");
        modalOverlay.classList.add("hidden");
});
}

ModalDisplay();