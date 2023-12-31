import Board from './board.js';

function addEventHandlers(board) {
    if (board.players[board.turn] === 'robot') {
        return;
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

    function handleMove(event) {
        const square = event.target;
        const squares = document.querySelectorAll('.chess-board td.selected');
        const selected = squares[0];
        board.move(selected.id, square.id);
        board.save();
        selected.classList.remove('selected');
        highlightMoves(selected.id, true);
        board.logMove();
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
        if (alreadySelected === false) {
            square.classList.add('selected');
            highlightMoves(square.id);
        }
    }

    const origins = document.querySelectorAll('.chess-board td.can-move');
    for (const origin of origins) {
        origin.addEventListener('click', event => selectPiece(event.target));
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

    document.getElementById('rotate').addEventListener('click', () => {
        board.rotate = !board.rotate;
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
    html += '<div id="controls">';
    html += '<button type="button" id="rotate">Rotate</button>';
    html += '</div>';
    html += '<div id="taken-black"></div>';
    html += '<div id="taken-white"></div>';
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
    html += '<h1 id="tempo"></h1>';
    html += '<aside id="score"></aside>';
    return html;
}

function toggleLevel(players) {
    document.querySelector('.level.menu').style.visibility =
        (players.Black === 'robot' || players.White === 'robot') ?
            'visible' : 'hidden';
}

function updatePage(board) {
    document.getElementById('board').innerHTML = board.render();
    document.getElementById('tempo').innerHTML = board.describe();
    document.getElementById('score').innerHTML = board.renderScore();
    document.getElementById('taken-black').innerHTML = board.renderTaken('Black');
    document.getElementById('taken-white').innerHTML = board.renderTaken('White');
    scrollScore();
    addEventHandlers(board);
    playRobot(board);
}

async function playRobot(board) {
    if (board.players[board.turn] !== 'robot') {
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 0));
    const refresh = board.play();
    board.save();
    if (refresh !== true) {
        return;
    }
    board.logMove();
    updatePage(board);
}

function scrollScore() {
    const score = document.getElementById('score');
    const direction = score.scrollHeight > score.clientHeight ?
        'column-reverse' : 'column';
    score.style = 'flex-direction: ' + direction;
}

const board = new Board();
renderPage(board);
