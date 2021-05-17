const HomeView = {
    render: async() => {
        return `
        <div class="main-container">
            <section class="info-section">
                <h1 class="welcome-text"> Welcome to</h1>
                <h1 class="welcome-text"> browser chess!</h1>
                <span class="rules"></span>
            </section>
        </div>`;
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
            if (firebase.auth().currentUser == null) {
                logout_link.classList.add('hidden');
                login_link.classList.remove('hidden');
                register_link.classList.remove('hidden');
            } else {
                logout_link.classList.remove('hidden');
                login_link.classList.add('hidden');
                register_link.classList.add('hidden');
            }
        }());
    }
}
export default HomeView;