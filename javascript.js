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