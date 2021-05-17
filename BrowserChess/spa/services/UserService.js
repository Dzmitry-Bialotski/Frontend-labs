import User from '../models/User.js';

const UserService = {
    register: (email, password, confirm) => {
        if (password !== confirm) {
            alert('Passwords are not equal');
            return false;
        } else if (email === '' | password === '' | confirm === '') {
            alert('Fields can\'t be empty');
            return false;
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
                let id = cred.user.uid;
                let userRef = firebase.database().ref('users').child(id);
                userRef.set({
                    username: 'Incognito',
                    rating: 500,
                    avatarPath: ''
                });
                console.log(`User ${ id } registered successfully!`);
                window.location.hash = '/login';
            }).catch(e => {
                alert(e.message);
            });
        }
    },
    login: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    console.log(`User ${firebaseUser.uid } authorized successfully!`);
                    firebase.database().ref().child("users").child(firebaseUser.uid).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());
                            let userSnap = snapshot.val();
                            let user = new User(firebaseUser.uid, firebaseUser.email, userSnap.username, userSnap.avatarPath, userSnap.rating)
                            localStorage.setItem("user", JSON.stringify(user));
                        } else {
                            console.log("No data available");
                        }
                    }).catch((error) => {
                        console.log(error);
                    }).then(() => { window.location.hash = '/' });
                }
            });
        }).catch(e => {
            alert(e.message);
        });
    },
    saveUserToLocalStorage: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
    },
    deleteUserFromLocalStorage: () => {
        localStorage.setItem("user", null);
    },
    getUserFromLocalStorage: () => {
        var savedUser = JSON.parse(localStorage.getItem("user"));
        return savedUser;
    },
    updateUsername(username) {
        let user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        firebase.database().ref('users').child(user.id).set({
            username: username,
            avatarPath: user.avatar_path || "",
            rating: user.rating,
        });
        user.username = username;
        localStorage.setItem("user", JSON.stringify(user));
        alert(`username changed to '${username}'`);
    },
    updateAvatarUrl: () => {
        let user = JSON.parse(localStorage.getItem("user"));
        firebase.database().ref('users').child(user.id).set({
            username: user.username,
            avatarPath: "profile.jpg",
            rating: user.rating,
        });
        user.avatarPath = "profile.jpg";
        localStorage.setItem("user", JSON.stringify(user));
    },
    getUserAvatar: (avatarUrl, userId) => {
        if (avatarUrl) {
            return firebase.storage().ref('users/' + (userId == undefined ? JSON.parse(localStorage.getItem("user")).id : userId) + '/' + avatarUrl).getDownloadURL();
        } else {
            return firebase.storage().ref('users/default.png').getDownloadURL();
        }
    },
    uploadImage: (file) => {
        currentUser = getUserFromLocalStorage();
        firebase.storage().ref('users/' + currentUser.id + '/profile.jpg').put(file).then(function() {
            alert('avatar was successfully uploaded');
            let user = JSON.parse(localStorage.getItem("user"));
            firebase.database().ref('users').child(user.id).set({
                username: user.username,
                avatarPath: "profile.jpg",
                rating: user.rating,
            });
            user.avatarPath = "profile.jpg";
            localStorage.setItem("user", JSON.stringify(user));
        }).catch(error => {
            console.log(error.message);
        })
    },
    getUserFromDb: async(userId) => {
        let result = firebase.database().ref('users').child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            }
        }).catch((error) => {
            console.error(error);
        });
        return result;
    },

    increaseRating: (userId) => {
        firebase.database().ref("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
                firebase.database().ref('users').child(userId).set({
                    username: snapshot.val().username,
                    avatarPath: snapshot.val().avatarPath,
                    rating: parseInt(snapshot.val().rating) + 25,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    },

    decreaseRating: (userId) => {
        firebase.database().ref("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
                firebase.database().ref('users').child(userId).set({
                    username: snapshot.val().username,
                    avatarPath: snapshot.val().avatarPath,
                    rating: parseInt(snapshot.val().rating) - 25,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
export default UserService;