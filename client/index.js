import Board from './board.js';
import Piece from './piece.js';

function addEventHandlers() {
    const squares = document.querySelectorAll('.chess-board td.can-move');
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

function highlightMoves(square, remove = false) {
    const squares = document.querySelectorAll(`.chess-board td.from-${square}`);
    for (const s of squares) {
        if (remove) {
            s.classList.remove('possible');
        }
        else {
            s.classList.add('possible');
        }
    }
}

function selectSquare(square) {
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

const board = new Board();

document.title = 'Chess Explorer';
let html = '<header>';
html += `<h1>${document.title}</h1>`;
html += '</header>';
html += '<main>';
html += board.draw();
html += '</main>';
html += '<section>';
html += board.describe();
html += '</section>';
document.body.insertAdjacentHTML('beforeend', html);
addEventHandlers();
