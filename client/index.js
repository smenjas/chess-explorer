import Board from './board.js';
import Piece from './piece.js';

function addEventHandlers() {
    const squares = document.querySelectorAll('.chess-board td.can-move');
    for (const square of squares) {
        square.addEventListener('click', handleSelection);
    }
}

function drawPage(board) {
    document.title = 'Chess Explorer';
    let html = '<header>';
    html += `<h1>${document.title}</h1>`;
    html += '</header>';
    html += '<main id="board"></main>';
    html += '<section id="description"></section>';
    document.body.insertAdjacentHTML('beforeend', html);
    updatePage(board);
}

function handleSelection(event) {
    const square = event.target;
    let piece = '';
    for (const className of event.target.classList) {
        if (Piece.exists(className)) {
            selectPiece(square);
            break;
        }
    }
}

function highlightMoves(square, remove = false) {
    const squares = document.querySelectorAll(`.chess-board td.from-${square}`);
    for (const s of squares) {
        if (remove) {
            s.classList.remove('possible');
            s.removeEventListener('click', handleMove);
        }
        else {
            s.classList.add('possible');
            s.addEventListener('click', handleMove);
        }
    }
}

function handleMove(event) {
    const square = event.target;
    const squares = document.querySelectorAll('.chess-board td.selected');
    const selected = squares[0];
    board.move(selected.id, square.id);
    selected.classList.remove('selected');
    highlightMoves(selected.id, true);
    updatePage(board);
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

const board = new Board();
drawPage(board);
