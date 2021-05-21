import UserService from './../services/UserService.js';

const LoginView = {
    render: async() => {
        return `
        <form class="login-form" method="get" id="login-form">
            <h1>Login</h1>
            <input type="text" name="email" id="email-input" placeholder="Email" autocomplete="email">
            <input type="password" name="password" id="password-input" autocomplete="current-password">
            <input type="submit" value="Login" id="login-btn">
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
            const loginForm = document.querySelector('#login-form');
            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                const email = loginForm['email-input'].value;
                const password = loginForm['password-input'].value;
                UserService.login(email, password).then(() => {
                    window.location.hash = '/';
                });
            });
        }());
    }
}
export default LoginView;