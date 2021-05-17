import UserService from './../services/UserService.js';

const RegisterView = {
    render: async() => {
        return ` 
            <form class="login-form register-box" id="register-form">
                <h1>Register</h1>
                <input type="text" name="email" placeholder="Email" id="email-input" autocomplete="email">
                <input type="password" name="password" placeholder="Password" id="password-input" autocomplete="new-password">
                <input type="password" name="password_confirm" placeholder="Confirm password" id="password-confirm-input" autocomplete="new-password">
                <input type="submit" value="Register" id="register-btn">
            </form>`;
    },
    afterRender: async() => {
        (function() {
            const logout_link = document.getElementById('logout_link');
            const login_link = document.getElementById('login_link');
            const register_link = document.getElementById('register_link');
            logout_link.addEventListener('click', e => {
                firebase.auth().signOut();
                localStorage.setItem("user", null);
                window.location.hash = '/login';
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
            const regForm = document.querySelector('#register-form');

            regForm.addEventListener('submit', e => {
                e.preventDefault();
                const email = regForm['email-input'].value;
                const password = regForm['password-input'].value;
                const confirm = regForm['password-confirm-input'].value;
                let isSuccessful = UserService.register(email, password, confirm);
                if (isSuccessful) {
                    window.location.hash = '/login';
                }
            });
        }());
    }
}
export default RegisterView;