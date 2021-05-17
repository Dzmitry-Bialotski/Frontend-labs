import UserService from './UserService.js';

const RoomService = {

    saveRoomToDb: (roomId) => {
        let user = UserService.getUserFromLocalStorage();
        firebase.database().ref("rooms").child(roomId).set({
            firstUser: user.id,
            FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        });
    },

    saveConnectedUserToDb: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                let fUser = snapshot.val().firstUser;
                let fen = snapshot.val().FEN;
                if (fUser !== user.id) {
                    firebase.database().ref("rooms").child(roomId).set({
                        firstUser: fUser,
                        secondUser: user.id,
                        FEN: fen
                    });
                } else {
                    console.log('user is already host');
                }
                window.location.hash = '/play/:id' + roomId;
            } else {
                alert("no such a room: " + roomId);
            }
        }).catch((error) => {
            console.error(error);
        })
    },

    generateRoom: () => {
        let min = 99999;
        let max = 999999;
        return Math.floor(Math.random() * (max - min)) + min;
    },

    deleteRoomFromDb: (roomId) => {
        firebase.database().ref("rooms").child(roomId).remove().catch((error) => {
            console.error(error);
        });
    },

    checkRoom: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().firstUser == user.id || snapshot.val().secondUser == user.id;
            } else {
                return false;
            }
        }).catch((error) => {
            console.error(error);
            return false;
        })
        return result;
    },

    getPlayers: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        let result = firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                if (user.id == snapshot.val().firstUser) {
                    return {
                        me: snapshot.val().firstUser,
                        opponent: snapshot.val().secondUser
                    }
                } else if (user.id == snapshot.val().secondUser) {
                    return {
                        opponent: snapshot.val().firstUser,
                        me: snapshot.val().secondUser
                    }
                }

            }
        }).catch((error) => {
            console.error(error);
        });
        return result;
    },

    updateFen: (roomId, fen) => {
        firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                firebase.database().ref("rooms").child(roomId).set({
                    firstUser: snapshot.val().firstUser,
                    secondUser: snapshot.val().secondUser,
                    FEN: fen
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    },
    getFen: async(roomId) => {
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().FEN;
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log("get Fen from db: " + result)
        return result;
    },

    getColorToTurn: async(roomId) => {
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val().color;
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log("get color from db: " + result)
        return result;
    },

    updateColorToTurn: (roomId, color) => {
        firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                firebase.database().ref("rooms").child(roomId).set({
                    firstUser: snapshot.val().firstUser,
                    secondUser: snapshot.val().secondUser,
                    FEN: snapshot.val().FEN
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    },
    getOrientation: async(roomId) => {
        let user = UserService.getUserFromLocalStorage();
        let result = await firebase.database().ref("rooms").child(roomId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return (user.id == snapshot.val().firstUser) ? 'white' : 'black';
            }
        }).catch((error) => {
            console.error(error);
        });
        return result;
    }
}

export default RoomService;