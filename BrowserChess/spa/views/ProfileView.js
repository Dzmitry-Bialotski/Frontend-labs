import UserService from './../services/UserService.js';

const ProfileView = {
    render: async() => {
        return `
        <div class="profile-container">
            <section class="img-section">
                <img id="avatar-img" class="avatar-img" alt="avatar image">
                <form id="upload-avatar-form">
                    <input type="file" name="avatar" id="avatar-input" class="img-section__choose-btn">
                    <input type="submit" id="avatar-upload" value="Upload Avatar" class="img-section__upload-btn">
                </form>
            </section>
            <section class="user-information" style="color: white">
                <div class="row">
                    <span>Username:</span>
                    <input type="text" name="username" id="username-input" class="username-input">
                    <button id="change_username_btn" class="cnhg_username_btn">change</button>
                </div>
                <div class="row">
                    <span>Rating: </span> <span id="user-rating"></span>
                </div>
            </section>
        </div>`;
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
            let currentUser = await UserService.getUserFromDb(JSON.parse(localStorage.getItem("user")).id);
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
            let file = {};

            function chooseFile(event) {
                file = event.target.files[0];
                console.log(file);
            }

            function uploadImage() {
                console.log(`currentUser.id = ${currentUser.id}`);
                firebase.storage().ref('users/' + currentUser.id + '/profile.jpg').put(file).then(function() {
                    alert('avatar was successfully uploaded');
                    UserService.updateAvatarUrl();
                }).catch(error => {
                    console.log(error.message);
                })
            }
            const avatar_input = document.getElementById('avatar-input');
            const upload_form = document.getElementById('upload-avatar-form');
            avatar_input.addEventListener('change', chooseFile);
            upload_form.addEventListener('submit', async(e) => {
                e.preventDefault();
                uploadImage();
            })
            console.log('currentUser.avatarPath ' + currentUser.avatarPath);
            UserService.getUserAvatar(currentUser.avatarPath).then(imgUrl => {
                console.log(imgUrl);
                document.getElementById('avatar-img').src = imgUrl;
            });
            document.getElementById('username-input').value = currentUser.username;

            document.getElementById('change_username_btn').addEventListener('click', e => {
                e.preventDefault();
                let username = document.getElementById('username-input').value;
                UserService.updateUsername(username);
            })

            document.getElementById('user-rating').innerHTML = currentUser.rating;
        }());
    }
}
export default ProfileView;