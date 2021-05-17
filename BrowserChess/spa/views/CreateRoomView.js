import RoomService from './../services/RoomService.js';

const CreateRoomView = {
    render: async() => {
        return `
        <section class="room-section">
            <div class="room-section__information"> Create new room and send room id to your friend or write your friends room id</div>
            <div class="row"><button class="room-section__btn" id="create-room-btn">Create room</button>
                <span>Generated room id: </span> <span id="generated-room-id"> none</span>
            </div>

            <div class="row">
                <input class="room-section__input-room" type="number" id="room-input"> </input>
                <button class="room-section__btn" id="enter-btn">Enter the room</button>
            </div>
        </section>`;
    },
    afterRender: async() => {
        (function() {
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
            const createRoomBtn = document.getElementById('create-room-btn');
            createRoomBtn.addEventListener('click', e => {
                let roomId = RoomService.generateRoom();
                RoomService.saveRoomToDb(roomId);
                document.getElementById('generated-room-id').innerHTML = roomId;
            });
            const enterBtn = document.getElementById('enter-btn');
            enterBtn.addEventListener('click', async(e) => {
                let roomId = document.getElementById('room-input').value;
                console.log('roomId: ' + roomId);
                await RoomService.saveConnectedUserToDb(roomId);
            });
        }());
    }
}
export default CreateRoomView;