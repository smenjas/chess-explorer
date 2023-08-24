import Board from './board.js';
import Piece from './piece.js';

function addEventHandlers(board) {
    if (board.players[board.turn] === 'robot') {
        return;
    }
    const squares = document.querySelectorAll('.chess-board td.can-move');
    for (const square of squares) {
        square.addEventListener('click', handleSelection);
    }
}

function addFormHandlers(board) {
    document.getElementById('new-game').addEventListener('click', () => {
        board = new Board(Board.fresh);
        for (const color of ['Black', 'White']) {
            document.getElementById(color).value = board.players[color];
        }
        document.getElementById('level').value = board.level;
        toggleLevel(board.players);
        updatePage(board);
    });

    document.getElementById('level').addEventListener('change', () => {
        const menu = event.target;
        board.level = menu[menu.selectedIndex].value;
        updatePage(board);
    });

    function handlePlayer(event) {
        const menu = event.target;
        const color = menu.id;
        const player = menu[menu.selectedIndex].value;
        board.players[color] = player;
        toggleLevel(board.players);
        updatePage(board);
    }

    document.getElementById('Black').addEventListener('change', handlePlayer);
    document.getElementById('White').addEventListener('change', handlePlayer);
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

function renderPage(board) {
    document.title = 'Chess Explorer';
    let html = '<div id="container">';
    html += '<main id="board"></main>';
    html += '<div id="not-board">';
    html += renderUI(board);
    html += '</div>';
    html += '</div>';
    document.body.insertAdjacentHTML('beforeend', html);
    addFormHandlers(board);
    toggleLevel(board.players);
    updatePage(board);
}

function renderOptions(options, selected) {
    let html = '';
    for (const option in options) {
        const selectedAttr = (option === `${selected}`) ? ' selected' : '';
        html += `<option value="${option}"${selectedAttr}>${options[option]}</option>`;
    }
    return html;
}

function renderSelect(id, options, selected) {
    let html = `<select id="${id}">`;
    html += renderOptions(options, selected);
    html += '</select>';
    return html;
}

function renderUI(board) {
    const levels = {
        0: '0',
        1: '1',
    };
    const players = {
        human: 'Human',
        robot: 'Robot',
    };
    let html = '';
    html += '<section id="ui">';
    html += '<form>';
    html += '<fieldset>';
    html += '<div><button type="button" id="new-game">New Game</button></div>';
    html += '<div class="level menu">Level: ' + renderSelect('level', levels, board.level) + '</div>';
    html += '</fieldset>';
    html += '<fieldset>';
    html += '<div class="player menu">Black: ' + renderSelect('Black', players, board.players.Black) + '</div>';
    html += '<div class="player menu">White: ' + renderSelect('White', players, board.players.White) + '</div>';
    html += '</fieldset>';
    html += '</form>';
    html += '</section>';
    if (board.score.length) {
        html += '<h1 id="tempo"></h1>';
        html += '<aside id="score"></aside>';
    }
    return html;
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

function toggleLevel(players) {
    document.querySelector('.level.menu').style.visibility =
        (players.Black === 'robot' || players.White === 'robot') ?
            'visible' : 'hidden';
}

async function updatePage(board) {
    document.getElementById('board').innerHTML = board.render();
    const tempo = document.getElementById('tempo');
    if (tempo) {
        tempo.innerHTML = board.describe();
    }
    const score = document.getElementById('score');
    if (score) {
        score.innerHTML = board.renderScore();
    }
    if (board.players[board.turn] === 'robot') {
        await new Promise(resolve => setTimeout(resolve, 1));
        const refresh = board.play();
        if (refresh === true) {
            updatePage(board);
        }
        return;
    }
    addEventHandlers(board);
}

let board = new Board();
renderPage(board);
