import Board from './board.js';
import Piece from './piece.js';

function addEventHandlers() {
    const squares = document.querySelectorAll('.chess-board td');
    for (const square of squares) {
        square.addEventListener('click', handleSelection);
    }
}

function handleSelection(event) {
    const square = event.target;
    let piece = '';
    for (const className of event.target.classList) {
        if (Piece.exists(className)) {
            selectSquare(square);
            break;
        }
    }
}

function selectSquare(square) {
    const alreadySelected = square.classList.contains('selected');
    const squares = document.querySelectorAll('.chess-board td.selected');
    for (const square of squares) {
        square.classList.remove('selected');
    }
    if (alreadySelected) {
        square.classList.remove('selected');
    }
    else {
        square.classList.add('selected');
    }
}

const board = new Board();

document.title = 'Chess Explorer';
let html = `<h1>${document.title}</h1>`;
html += board.draw();
document.body.insertAdjacentHTML('beforeend', html);
addEventHandlers();
