import Board from './board.js';
import Piece from './piece.js';

function addEventHandlers() {
    const squares = document.querySelectorAll('.chess-board td.can-move');
    for (const square of squares) {
        square.addEventListener('click', handleSelection);
    }
}

function addMoves(squares) {
    for (const square of squares) {
        square.classList.add('possible');
        square.addEventListener('click', handleMove);
    }
}

function cancelMoves(squares) {
    for (const square of squares) {
        square.classList.remove('possible');
        square.removeEventListener('click', handleMove);
    }
}

function drawPage(board) {
    document.title = 'Chess Explorer';
    let html = '<header>';
    html += `<h1>${document.title}</h1>`;
    html += '</header>';
    html += '<main id="board"></main>';
    html += '<section id="description"></section>';
    html += '<button type="button" id="new-game">New Game</button>';
    document.body.insertAdjacentHTML('beforeend', html);
    const newGameButton = document.getElementById('new-game');
    if (newGameButton) {
        newGameButton.addEventListener('click', handleNewGame);
    }
    updatePage(board);
}

function handleNewGame() {
    board = new Board(Board.fresh);
    updatePage(board);
}

function handleSelection(event) {
    const square = event.target;
    for (const className of event.target.classList) {
        if (Piece.exists(className)) {
            selectPiece(square);
            break;
        }
    }
}

function handleMove(event) {
    const square = event.target;
    const squares = document.querySelectorAll('.chess-board td.selected');
    const selected = squares[0];
    board.move(selected.id, square.id);
    board.save();
    selected.classList.remove('selected');
    highlightMoves(selected.id, true);
    updatePage(board);
}

function highlightMoves(square, cancel = false) {
    const squares = document.querySelectorAll(`.chess-board td.from-${square}`);
    const toggleMoves = cancel ? cancelMoves : addMoves;
    toggleMoves(squares);
}

function selectPiece(square) {
    const alreadySelected = square.classList.contains('selected');
    const squares = document.querySelectorAll('.chess-board td.selected');
    for (const s of squares) {
        s.classList.remove('selected');
        highlightMoves(s.id, true);
    }
    if (!alreadySelected) {
        square.classList.add('selected');
        highlightMoves(square.id);
    }
}

function updatePage(board) {
    document.getElementById('board').innerHTML = board.draw();
    document.getElementById('description').innerHTML = board.describe();
    addEventHandlers();
}

let board = new Board();
drawPage(board);
