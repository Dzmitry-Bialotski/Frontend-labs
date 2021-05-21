import User from '../models/User.js';
import RoomService from './../services/RoomService.js';
import UserService from './../services/UserService.js';
const PlayView = {
    render: async() => {
        return `
        <section class="game-section">
            <div class="opponent-info row">
                <img class="avatar-small" id="opponent-avatar">
                <div class="play-username" id="opponent-username">(<span id="opponent-rating"></span>)</div>
            </div>
            <div id="myBoard" style="width: 300px"></div>
            <div class="my-info row">
                <img class="avatar-small" id="my-avatar">
                <span class="play-username" id="my-username">(<span id="my-rating"></span>)</span>
                <button class="give-up-btn" id="give-up-btn">give up</button>
            </div>
            <div> Cell from: <span id = "cell-from"></span></div>
            <div> Current cell: <span id = "cur-cell"></span></div>
        </section>`;
    },
    afterRender: async() => {
        (async function() {
            const logout_link = document.getElementById('logout_link');
            const login_link = document.getElementById('login_link');
            const register_link = document.getElementById('register_link');
            logout_link.addEventListener('click', e => {
                firebase.auth().signOut();
                localStorage.setItem("user", null);
            });
            let currentUser = JSON.parse(localStorage.getItem("user"));
            console.log(currentUser);
            if (currentUser == null) {
                logout_link.classList.add('hidden');
                login_link.classList.remove('hidden');
                register_link.classList.remove('hidden');
            } else {
                logout_link.classList.remove('hidden');
                login_link.classList.add('hidden');
                register_link.classList.add('hidden');
            }
            let hash = location.hash;
            let index = hash.indexOf(':id') + 3;
            let roomId = hash.substring(index);
            let hasRules = await RoomService.checkRoom(roomId);
            if (!hasRules) {
                window.location.hash = '/create-room'
            }
            let opponentAvatar = document.getElementById('opponent-avatar');
            let opponentUsername = document.getElementById('opponent-username');
            let myAvatar = document.getElementById('my-avatar');
            let myUsername = document.getElementById('my-username');

            let players = await RoomService.getPlayers(roomId); // return players.opponent/me
            if (!players.opponent) {
                alert('your friend did not entered the room');
                location.hash = '/create-room';
            }
            let opponent = await UserService.getUserFromDb(players.opponent);
            let me = await UserService.getUserFromDb(players.me);
            UserService.getUserAvatar(opponent.avatarPath, players.opponent).then(imgUrl => {
                opponentAvatar.src = imgUrl;
            });
            opponentUsername.innerHTML = opponent.username + opponentUsername.innerHTML;
            document.getElementById('opponent-rating').innerHTML = opponent.rating;

            UserService.getUserAvatar(me.avatarPath, players.me).then(imgUrl => {
                myAvatar.src = imgUrl;
            });
            myUsername.innerHTML = me.username + myUsername.innerHTML;
            document.getElementById('my-rating').innerHTML = me.rating;

            async function giveUp() {
                alert("You lose :(");
                UserService.increaseRating(players.opponent);
                UserService.decreaseRating(players.me);
                RoomService.deleteRoomFromDb(roomId);
                location.hash = '/create-room';
            }

            document.getElementById('give-up-btn').addEventListener('click', async(e) => {
                giveUp();
            })

            let board = null
            let game = new Chess()

            function onDragStart(source, piece, position, orientation) {
                if (game.game_over()) return false;
                if ((game.turn() === 'w' && board.orientation() === 'black') ||
                    (game.turn() === 'b' && board.orientation() === 'white')) {
                    return false;
                }
                if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                    return false
                }
            }

            function onDrop(source, target) {
                let move = game.move({
                    from: source,
                    to: target,
                    promotion: 'q'
                })

                if (move === null) return 'snapback'
                RoomService.updateFen(roomId, game.fen());
                updateStatus()
            }

            function onSnapEnd() {
                board.position(game.fen())
            }

            function updateStatus() {
                let status = ''

                let moveColor = 'White'
                if (game.turn() === 'b') {
                    moveColor = 'Black'
                }

                if (game.in_checkmate()) {
                    alert('Game over, ' + moveColor + ' is in checkmate.');
                    let color = RoomService.getOrientation(roomId);
                    if ((game.turn() == 'b' && color == 'white') || (game.turn() == 'w' && color == 'black')) {
                        //alert("You won :)");
                        UserService.increaseRating(players.me);
                        UserService.decreaseRating(players.opponent);
                    } else {
                        //alert("You lose :(");
                        UserService.increaseRating(players.opponent);
                        UserService.decreaseRating(players.me);
                    }
                    RoomService.deleteRoomFromDb(roomId);
                    location.hash = '/create-room';
                } else if (game.in_draw()) {
                    alert(status = 'Game over, drawn position');
                    RoomService.deleteRoomFromDb(roomId);
                    location.hash = '/create-room';
                } else {
                    status = moveColor + ' to move'
                    if (game.in_check()) {
                        alert(status += ', ' + moveColor + ' is in check');
                    }
                }
            }
            let fen = await RoomService.getFen(roomId);
            let orientation = await RoomService.getOrientation(roomId);
            let config = {
                draggable: true,
                orientation: orientation,
                position: fen,
                onDragStart: onDragStart,
                onDrop: onDrop,
                onSnapEnd: onSnapEnd
            }

            board = Chessboard('myBoard', config);
            game.load(fen);
            updateStatus();
            firebase.database().ref("rooms").child(roomId).on('child_changed', (data) => {
                if (data.key === "FEN") {
                    let fen = data.val();
                    game.load(fen);
                    board.position(game.fen());
                    updateStatus();
                }
            })
            firebase.database().ref("rooms").on('child_removed', (data) => {
                    if (data.key == roomId) {
                        if (game.in_checkmate()) {
                            if ((game.turn() == 'b' && players.me == data.val().firstUser) || (game.turn() == 'w' && players.me == data.val().secondUser)) {
                                alert('You won!');
                            } else {
                                alert('You lose!');
                            }
                        }
                        location.hash = '/create-room';
                    }
                })
                //additional task
            let curCell = 'a1';
            let cellFrom = '';
            document.getElementById('cur-cell').innerHTML = curCell;
            document.addEventListener('keydown', function(event) {
                if (event.code == 'ArrowRight') {
                    switch (curCell.substring(0, 1)) {
                        case "a":
                            curCell = "b" + curCell.substring(1);
                            break;
                        case "b":
                            curCell = "c" + curCell.substring(1);
                            break;
                        case "c":
                            curCell = "d" + curCell.substring(1);
                            break;
                        case "d":
                            curCell = "e" + curCell.substring(1);
                            break;
                        case "e":
                            curCell = "f" + curCell.substring(1);
                            break;
                        case "f":
                            curCell = "g" + curCell.substring(1);
                            break;
                        case "g":
                            curCell = "h" + curCell.substring(1);
                            break;
                        case "h":
                            break;
                    }
                    document.getElementById('cur-cell').innerHTML = curCell;
                } else if (event.code == 'ArrowLeft') {
                    switch (curCell.substring(0, 1)) {
                        case "a":
                            break;
                        case "b":
                            curCell = "a" + curCell.substring(1);
                            break;
                        case "c":
                            curCell = "b" + curCell.substring(1);
                            break;
                        case "d":
                            curCell = "c" + curCell.substring(1);
                            break;
                        case "e":
                            curCell = "d" + curCell.substring(1);
                            break;
                        case "f":
                            curCell = "e" + curCell.substring(1);
                            break;
                        case "g":
                            curCell = "f" + curCell.substring(1);
                            break;
                        case "h":
                            curCell = "g" + curCell.substring(1);
                            break;
                    }
                    document.getElementById('cur-cell').innerHTML = curCell;
                } else if (event.code == 'ArrowUp') {
                    switch (parseInt(curCell.substring(1))) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            curCell = curCell.substring(0, 1) + (parseInt(curCell.substring(1)) + 1);
                            break;
                        case 8:
                            break;
                    }
                    document.getElementById('cur-cell').innerHTML = curCell;
                } else if (event.code == 'ArrowDown') {
                    switch (parseInt(curCell.substring(1))) {
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            curCell = curCell.substring(0, 1) + (parseInt(curCell.substring(1)) - 1);
                            break;
                        case 1:
                            break;
                    }
                    document.getElementById('cur-cell').innerHTML = curCell;
                } else if (event.code == 'Enter') {
                    if (cellFrom == '') {
                        cellFrom = curCell;
                    } else {
                        let move = game.move({
                            from: cellFrom,
                            to: curCell,
                            promotion: 'q'
                        })
                        if (move === null) return 'snapback'
                        RoomService.updateFen(roomId, game.fen());
                        updateStatus()
                        cellFrom = '';
                    }
                    document.getElementById('cur-cell').innerHTML = curCell;
                    document.getElementById('cell-from').innerHTML = cellFrom;
                } else if (event.code == 'Escape') {
                    cellFrom = '';
                    document.getElementById('cell-from').innerHTML = cellFrom;
                }
            });
        }());
    }
}
export default PlayView;